import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { persistMediaUrl, persistMediaInHtml, renderNotionPageHtml } from "../_shared/notion-render.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DATABASE_ID = '41b0defa2fc64ce68b792d9c6da7834c'

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const richText = (prop: any): string | null =>
  (prop?.rich_text || []).map((t: any) => t.plain_text).join('') || null

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) throw new Error('NOTION_API_KEY not configured')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let fullSync = false
    try {
      const body = await req.json()
      fullSync = body?.full === true
    } catch { /* no body */ }

    const { data: syncMeta } = await supabase
      .from('sync_metadata')
      .select('last_synced_at')
      .eq('sync_type', 'events')
      .maybeSingle()

    const lastSyncedAt = syncMeta?.last_synced_at || '2000-01-01T00:00:00Z'
    const syncStartTime = new Date().toISOString()
    const isFirstRun = new Date(lastSyncedAt).getTime() < new Date('2001-01-01').getTime()
    const useIncremental = !isFirstRun && !fullSync

    // Status is a `select` property in the Published Events database
    const baseFilter = { property: 'Status', select: { equals: 'Live' } }
    const queryFilter = useIncremental
      ? {
          and: [
            baseFilter,
            { timestamp: 'last_edited_time', last_edited_time: { after: lastSyncedAt } },
          ],
        }
      : baseFilter

    const queryNotion = async (filter: any) => {
      let results: any[] = []
      let cursor: string | undefined = undefined
      do {
        const body: any = { filter, page_size: 100 }
        if (cursor) body.start_cursor = cursor
        const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const errorText = await res.text()
          console.error('Notion API error:', errorText)
          throw new Error(`Notion API error ${res.status}: ${errorText}`)
        }
        const data = await res.json()
        results = results.concat(data.results || [])
        cursor = data.has_more ? data.next_cursor : undefined
      } while (cursor)
      return results
    }

    const allResults = await queryNotion(queryFilter)
    console.log(`Events sync: found ${allResults.length} events (full=${fullSync}, incremental=${useIncremental})`)

    let totalMediaPersisted = 0

    for (const page of allResults) {
      const p = page.properties
      const title = p['Name']?.title?.map((t: any) => t.plain_text).join('') || 'Untitled'
      const slug = richText(p['Slug']) ? slugify(richText(p['Slug'])!) : slugify(title)

      const coverFiles = p['Cover']?.files || []
      let coverImage = coverFiles.length > 0
        ? coverFiles[0].file?.url || coverFiles[0].external?.url || null
        : (page.cover?.file?.url || page.cover?.external?.url || null)

      if (coverImage) {
        const persisted = await persistMediaUrl(supabase, supabaseUrl, coverImage, `event-${slug}`, 'cover')
        if (persisted) {
          coverImage = persisted
          totalMediaPersisted++
        }
      }

      const ogFiles = p['OG IMG']?.files || p['OG Image']?.files || []
      let ogImage = ogFiles.length > 0
        ? ogFiles[0].file?.url || ogFiles[0].external?.url || null
        : null

      if (ogImage) {
        const persistedOg = await persistMediaUrl(supabase, supabaseUrl, ogImage, `event-${slug}`, 'og')
        if (persistedOg) {
          ogImage = persistedOg
          totalMediaPersisted++
        }
      }

      let htmlContent = ''
      try {
        htmlContent = await renderNotionPageHtml(page.id, NOTION_API_KEY)
        const mediaResult = await persistMediaInHtml(supabase, supabaseUrl, htmlContent, `event-${slug}`)
        htmlContent = mediaResult.html
        totalMediaPersisted += mediaResult.count
      } catch (e) {
        console.error(`Failed to render event "${title}":`, e)
      }

      const row = {
        notion_id: page.id,
        slug,
        title,
        summary: richText(p['Summary']),
        html_content: htmlContent,
        cover_image_url: coverImage,
        og_image_url: ogImage,
        role: p['Role']?.select?.name || null,
        format: p['Format']?.select?.name || null,
        start_date: p['Date']?.date?.start ? String(p['Date'].date.start).slice(0, 10) : null,
        end_date: p['Date']?.date?.end ? String(p['Date'].date.end).slice(0, 10) : null,
        location: richText(p['Location']),
        venue: richText(p['Venue']),
        organiser: richText(p['Organiser']),
        topics: (p['Topics']?.multi_select || []).map((o: any) => o.name),
        event_url: p['Event URL']?.url || null,
        slides_url: p['Slides URL']?.url || null,
        recording_url: p['Recording URL']?.url || null,
        featured: p['Featured']?.checkbox || false,
        last_edited_time: page.last_edited_time || null,
        synced_at: new Date().toISOString(),
      }

      const { error: upsertError } = await supabase
        .from('events_cache')
        .upsert(row, { onConflict: 'notion_id' })
      if (upsertError) console.error(`Upsert failed for "${title}":`, upsertError.message)
    }

    // Prune anything no longer Live in Notion
    let prunedCount = 0
    try {
      const liveIds = new Set((await queryNotion(baseFilter)).map((p: any) => p.id))
      const { data: existing } = await supabase.from('events_cache').select('notion_id')
      const stale = (existing || []).map((r: any) => r.notion_id).filter((id: string) => !liveIds.has(id))
      if (stale.length > 0) {
        await supabase.from('events_cache').delete().in('notion_id', stale)
        prunedCount = stale.length
        console.log(`Pruned ${prunedCount} stale events`)
      }
    } catch (e) {
      console.error('Prune step failed:', e)
    }

    await supabase.from('sync_metadata').upsert(
      { sync_type: 'events', last_synced_at: syncStartTime },
      { onConflict: 'sync_type' }
    )

    console.log(`Events sync complete: ${allResults.length} events, ${totalMediaPersisted} media persisted`)

    return new Response(
      JSON.stringify({ success: true, synced: allResults.length, media_persisted: totalMediaPersisted, pruned: prunedCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Events sync error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
