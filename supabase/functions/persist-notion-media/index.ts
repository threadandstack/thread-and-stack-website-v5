import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Matches Notion-hosted S3 file URLs (images, videos, etc.)
const NOTION_S3_REGEX = /https:\/\/(?:prod-files-secure|s3)\.s3[.\w-]*\.amazonaws\.com\/[^\s"'<>]+/g

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const sb = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json().catch(() => ({}))
    const { tables, page_ids } = body as { tables?: string[]; page_ids?: string[] }

    // If no specific pages given, scan all cached content for S3 URLs
    const tablesToProcess = tables || ['portfolio_content_cache', 'portfolio_listing_cache', 'blog_content_cache', 'blog_posts_cache']

    let totalPersisted = 0
    let totalProcessed = 0

    // Process content tables (html_content field)
    for (const table of tablesToProcess) {
      if (table === 'portfolio_content_cache') {
        let query = sb.from('portfolio_content_cache').select('notion_page_id, html_content, cover_image')
        if (page_ids?.length) query = query.in('notion_page_id', page_ids)

        const { data: rows } = await query
        if (!rows) continue

        for (const row of rows) {
          let changed = false

          // Process HTML content
          if (row.html_content && NOTION_S3_REGEX.test(row.html_content)) {
            NOTION_S3_REGEX.lastIndex = 0
            const result = await persistMediaInHtml(sb, supabaseUrl, row.html_content, row.notion_page_id)
            if (result.count > 0) {
              await sb.from('portfolio_content_cache')
                .update({ html_content: result.html })
                .eq('notion_page_id', row.notion_page_id)
              totalPersisted += result.count
              changed = true
            }
          }

          // Process cover image
          if (row.cover_image && NOTION_S3_REGEX.test(row.cover_image)) {
            NOTION_S3_REGEX.lastIndex = 0
            const permanentUrl = await persistSingleFile(sb, supabaseUrl, row.cover_image, `covers/${row.notion_page_id}`)
            if (permanentUrl) {
              await sb.from('portfolio_content_cache')
                .update({ cover_image: permanentUrl })
                .eq('notion_page_id', row.notion_page_id)
              totalPersisted++
              changed = true
            }
          }

          totalProcessed++
          if (changed) console.log(`Persisted media for portfolio content: ${row.notion_page_id}`)
        }
      }

      if (table === 'portfolio_listing_cache') {
        let query = sb.from('portfolio_listing_cache').select('notion_page_id, cover_image')
        if (page_ids?.length) query = query.in('notion_page_id', page_ids)

        const { data: rows } = await query
        if (!rows) continue

        for (const row of rows) {
          if (row.cover_image && NOTION_S3_REGEX.test(row.cover_image)) {
            NOTION_S3_REGEX.lastIndex = 0
            const permanentUrl = await persistSingleFile(sb, supabaseUrl, row.cover_image, `covers/${row.notion_page_id}`)
            if (permanentUrl) {
              await sb.from('portfolio_listing_cache')
                .update({ cover_image: permanentUrl })
                .eq('notion_page_id', row.notion_page_id)
              totalPersisted++
              console.log(`Persisted cover for portfolio listing: ${row.notion_page_id}`)
            }
          }
          totalProcessed++
        }
      }

      if (table === 'blog_content_cache') {
        let query = sb.from('blog_content_cache').select('notion_id, html_content, header_image_url')
        if (page_ids?.length) query = query.in('notion_id', page_ids)

        const { data: rows } = await query
        if (!rows) continue

        for (const row of rows) {
          let changed = false

          if (row.html_content && NOTION_S3_REGEX.test(row.html_content)) {
            NOTION_S3_REGEX.lastIndex = 0
            const result = await persistMediaInHtml(sb, supabaseUrl, row.html_content, row.notion_id)
            if (result.count > 0) {
              await sb.from('blog_content_cache')
                .update({ html_content: result.html })
                .eq('notion_id', row.notion_id)
              totalPersisted += result.count
              changed = true
            }
          }

          if (row.header_image_url && NOTION_S3_REGEX.test(row.header_image_url)) {
            NOTION_S3_REGEX.lastIndex = 0
            const permanentUrl = await persistSingleFile(sb, supabaseUrl, row.header_image_url, `blog-covers/${row.notion_id}`)
            if (permanentUrl) {
              await sb.from('blog_content_cache')
                .update({ header_image_url: permanentUrl })
                .eq('notion_id', row.notion_id)
              totalPersisted++
              changed = true
            }
          }

          totalProcessed++
          if (changed) console.log(`Persisted media for blog content: ${row.notion_id}`)
        }
      }

      if (table === 'blog_posts_cache') {
        let query = sb.from('blog_posts_cache').select('notion_id, header_image_url')
        if (page_ids?.length) query = query.in('notion_id', page_ids)

        const { data: rows } = await query
        if (!rows) continue

        for (const row of rows) {
          if (row.header_image_url && NOTION_S3_REGEX.test(row.header_image_url)) {
            NOTION_S3_REGEX.lastIndex = 0
            const permanentUrl = await persistSingleFile(sb, supabaseUrl, row.header_image_url, `blog-covers/${row.notion_id}`)
            if (permanentUrl) {
              await sb.from('blog_posts_cache')
                .update({ header_image_url: permanentUrl })
                .eq('notion_id', row.notion_id)
              totalPersisted++
              console.log(`Persisted cover for blog listing: ${row.notion_id}`)
            }
          }
          totalProcessed++
        }
      }
    }

    console.log(`Media persistence complete: ${totalPersisted} files persisted, ${totalProcessed} rows processed`)

    return new Response(
      JSON.stringify({ success: true, persisted: totalPersisted, processed: totalProcessed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Media persistence error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// ─── Media helpers ───

function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const lastSegment = pathname.split('/').pop() || ''
    const ext = lastSegment.split('.').pop()?.toLowerCase() || ''
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'mov', 'webm', 'pdf'].includes(ext)) return ext
  } catch {}
  return 'bin'
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', mov: 'video/quicktime',
    webm: 'video/webm', pdf: 'application/pdf', bin: 'application/octet-stream',
  }
  return map[ext] || 'application/octet-stream'
}

async function hashString(str: string): Promise<string> {
  const data = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
}

async function persistSingleFile(sb: any, supabaseUrl: string, notionUrl: string, storagePath: string): Promise<string | null> {
  try {
    const ext = getExtensionFromUrl(notionUrl)
    const fullPath = `${storagePath}.${ext}`
    const permanentUrl = `${supabaseUrl}/storage/v1/object/public/notion-media/${fullPath}`

    // HEAD request to check size — skip files > 50MB
    try {
      const headRes = await fetch(notionUrl, { method: 'HEAD' })
      if (headRes.ok) {
        const contentLength = Number(headRes.headers.get('content-length') || 0)
        if (contentLength > 50 * 1024 * 1024) {
          console.log(`Skipping large file (${(contentLength / 1024 / 1024).toFixed(1)}MB): ${fullPath}`)
          return null
        }
      }
    } catch {}

    const res = await fetch(notionUrl)
    if (!res.ok) {
      console.error(`Failed to download: ${res.status} for ${notionUrl.substring(0, 80)}...`)
      return null
    }

    const blob = await res.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const uint8 = new Uint8Array(arrayBuffer)

    const { error } = await sb.storage.from('notion-media').upload(fullPath, uint8, {
      contentType: getMimeType(ext),
      upsert: true,
    })

    if (error) {
      console.error(`Upload error for ${fullPath}:`, error.message)
      return null
    }

    return permanentUrl
  } catch (e) {
    console.error(`persistSingleFile error:`, e)
    return null
  }
}

async function persistMediaInHtml(sb: any, supabaseUrl: string, html: string, pageId: string): Promise<{ html: string; count: number }> {
  const matches = html.match(NOTION_S3_REGEX)
  if (!matches) return { html, count: 0 }

  const uniqueUrls = [...new Set(matches)]
  let count = 0
  let result = html

  for (const originalUrl of uniqueUrls) {
    const cleanUrl = originalUrl.split('?')[0]
    const hash = await hashString(cleanUrl)
    const storagePath = `pages/${pageId}/${hash}`

    const permanentUrl = await persistSingleFile(sb, supabaseUrl, originalUrl, storagePath)
    if (permanentUrl) {
      result = result.split(originalUrl).join(permanentUrl)
      count++
    }
  }

  return { html: result, count }
}
