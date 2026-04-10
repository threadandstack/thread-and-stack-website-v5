import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DATABASE_ID = '2bc8863b87d4802fa65dd15c42ffa13b'

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

    // Get last sync timestamp for incremental mode
    const { data: syncMeta } = await supabase
      .from('sync_metadata')
      .select('last_synced_at')
      .eq('sync_type', 'blog')
      .single()

    const lastSyncedAt = syncMeta?.last_synced_at || '2000-01-01T00:00:00Z'
    const syncStartTime = new Date().toISOString()
    const isFirstRun = new Date(lastSyncedAt).getTime() < new Date('2001-01-01').getTime()

    const baseFilter = { property: 'Status', status: { equals: 'Live' } }
    const queryFilter = isFirstRun
      ? baseFilter
      : {
          and: [
            baseFilter,
            { timestamp: 'last_edited_time', last_edited_time: { after: lastSyncedAt } },
          ]
        }

    let allResults: any[] = []
    let startCursor: string | undefined = undefined
    do {
      const body: any = { filter: queryFilter }
      if (startCursor) body.start_cursor = startCursor

      const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Notion API error:', errorText)
        throw new Error(`Notion API error: ${response.status}`)
      }

      const data = await response.json()
      allResults = allResults.concat(data.results || [])
      startCursor = data.has_more ? data.next_cursor : undefined
    } while (startCursor)

    console.log(`Blog sync: found ${allResults.length} changed posts (incremental: ${!isFirstRun})`)

    if (allResults.length === 0) {
      await supabase.from('sync_metadata').upsert(
        { sync_type: 'blog', last_synced_at: syncStartTime },
        { onConflict: 'sync_type' }
      )
      return new Response(
        JSON.stringify({ success: true, synced: 0, content_synced: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process listing metadata
    const posts = allResults.map((page: any) => {
      const properties = page.properties
      const featuredImageFiles = properties['Featured IMG']?.files || []
      const headerImage = featuredImageFiles.length > 0
        ? featuredImageFiles[0].file?.url || featuredImageFiles[0].external?.url
        : null
      const title = properties['Name']?.title?.[0]?.plain_text || 'Untitled'
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

      return {
        notion_id: page.id,
        slug,
        title,
        description: properties['Description']?.rich_text?.[0]?.plain_text || null,
        intro: properties['Intro']?.rich_text?.[0]?.plain_text || null,
        header_image_url: headerImage,
        reading_time: properties['Reading time']?.rich_text?.[0]?.plain_text || null,
        theme: properties['Theme']?.select?.name || null,
        published_date: properties['Published']?.date?.start || null,
        featured: properties['Featured']?.checkbox || false,
        synced_at: new Date().toISOString(),
      }
    })

    // Upsert listing cache
    if (isFirstRun) {
      await supabase.from('blog_posts_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (posts.length > 0) {
        const { error: insertError } = await supabase.from('blog_posts_cache').insert(posts)
        if (insertError) {
          console.error('Insert error:', insertError)
          throw new Error(`Failed to insert cache: ${insertError.message}`)
        }
      }
    } else {
      for (const post of posts) {
        await supabase.from('blog_posts_cache').upsert(post, { onConflict: 'notion_id' })
      }
    }

    // Pre-render full HTML content for each changed post
    let contentSynced = 0
    const syncedNotionIds: string[] = []

    for (const page of allResults) {
      const properties = page.properties
      const title = properties['Name']?.title?.[0]?.plain_text || 'Untitled'
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

      try {
        const htmlContent = await renderBlogContent(page.id, NOTION_API_KEY)
        const featuredImageFiles = properties['Featured IMG']?.files || []
        const headerImage = featuredImageFiles.length > 0
          ? featuredImageFiles[0].file?.url || featuredImageFiles[0].external?.url
          : null

        await supabase.from('blog_content_cache').upsert({
          notion_id: page.id,
          slug,
          title,
          html_content: htmlContent,
          header_image_url: headerImage,
          description: properties['Description']?.rich_text?.[0]?.plain_text || null,
          reading_time: properties['Reading time']?.rich_text?.[0]?.plain_text || null,
          theme: properties['Theme']?.select?.name || null,
          synced_at: new Date().toISOString(),
        }, { onConflict: 'notion_id' })

        contentSynced++
        syncedNotionIds.push(page.id)
      } catch (e) {
        console.error(`Failed to render blog post "${title}":`, e)
      }
    }

    await supabase.from('sync_metadata').upsert(
      { sync_type: 'blog', last_synced_at: syncStartTime },
      { onConflict: 'sync_type' }
    )

    // Fire-and-forget: trigger media persistence for synced content
    if (syncedNotionIds.length > 0) {
      const persistUrl = `${supabaseUrl}/functions/v1/persist-notion-media`
      fetch(persistUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tables: ['blog_content_cache', 'blog_posts_cache'], page_ids: syncedNotionIds }),
      }).catch(e => console.error('Failed to trigger media persistence:', e))
    }

    return new Response(
      JSON.stringify({ success: true, synced: posts.length, content_synced: contentSynced }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Sync error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// ─── Block-to-HTML rendering ───

async function renderBlogContent(pageId: string, notionApiKey: string): Promise<string> {
  const headers = { 'Authorization': `Bearer ${notionApiKey}`, 'Notion-Version': '2022-06-28' }

  let allBlocks: any[] = []
  let startCursor: string | undefined = undefined
  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${pageId}/children`)
    if (startCursor) url.searchParams.set('start_cursor', startCursor)
    const res = await fetch(url.toString(), { headers })
    if (!res.ok) throw new Error(`Failed to fetch blocks: ${res.status}`)
    const data = await res.json()
    allBlocks = allBlocks.concat(data.results || [])
    startCursor = data.has_more ? data.next_cursor : undefined
  } while (startCursor)

  const richTextToHtml = (richTextArray: any[]) => {
    if (!richTextArray || richTextArray.length === 0) return ''
    return richTextArray.map((text: any) => {
      let content = text.plain_text.replace(/\n/g, '<br>')
      if (text.annotations.bold) content = `<strong>${content}</strong>`
      if (text.annotations.italic) content = `<em>${content}</em>`
      if (text.annotations.strikethrough) content = `<s>${content}</s>`
      if (text.annotations.underline) content = `<u>${content}</u>`
      if (text.annotations.code) content = `<code>${content}</code>`
      if (text.href) content = `<a href="${text.href}" target="_blank" rel="noopener noreferrer">${content}</a>`
      return content
    }).join('')
  }

  const fetchBlockChildren = async (blockId: string): Promise<any[]> => {
    const r = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, { headers })
    if (!r.ok) return []
    const d = await r.json()
    return d.results || []
  }

  const blockToHtml = async (block: any): Promise<string> => {
    switch (block.type) {
      case 'paragraph': {
        const t = richTextToHtml(block.paragraph.rich_text)
        return t ? `<p>${t}</p>` : ''
      }
      case 'heading_1': return `<h1>${richTextToHtml(block.heading_1.rich_text)}</h1>`
      case 'heading_2': return `<h2>${richTextToHtml(block.heading_2.rich_text)}</h2>`
      case 'heading_3': return `<h3>${richTextToHtml(block.heading_3.rich_text)}</h3>`
      case 'bulleted_list_item': {
        const t = richTextToHtml(block.bulleted_list_item.rich_text)
        let nested = ''
        if (block.has_children) {
          const children = await fetchBlockChildren(block.id)
          const items = await Promise.all(children.filter((c: any) => c.type === 'bulleted_list_item').map((c: any) => blockToHtml(c)))
          if (items.length) nested = `<ul>${items.join('')}</ul>`
        }
        return `<li>${t}${nested}</li>`
      }
      case 'numbered_list_item': {
        const t = richTextToHtml(block.numbered_list_item.rich_text)
        let nested = ''
        if (block.has_children) {
          const children = await fetchBlockChildren(block.id)
          const items = await Promise.all(children.filter((c: any) => c.type === 'numbered_list_item').map((c: any) => blockToHtml(c)))
          if (items.length) nested = `<ol>${items.join('')}</ol>`
        }
        return `<li>${t}${nested}</li>`
      }
      case 'quote': {
        const t = richTextToHtml(block.quote.rich_text)
        let childHtml = ''
        if (block.has_children) {
          const children = await fetchBlockChildren(block.id)
          const parts = await Promise.all(children.map((c: any) => blockToHtml(c)))
          childHtml = parts.filter(Boolean).join('\n')
        }
        return `<blockquote>${t}${childHtml ? '\n' + childHtml : ''}</blockquote>`
      }
      case 'callout': {
        const t = richTextToHtml(block.callout.rich_text)
        const icon = block.callout.icon
        let iconHtml = ''
        if (icon?.type === 'emoji') iconHtml = `<span class="callout-icon">${icon.emoji}</span>`
        else if (icon?.type === 'custom_emoji' && icon.custom_emoji?.url) iconHtml = `<img class="callout-icon-img" src="${icon.custom_emoji.url}" alt="${icon.custom_emoji.name || ''}" />`
        else if (icon?.type === 'external' && icon.external?.url) iconHtml = `<img class="callout-icon-img" src="${icon.external.url}" alt="" />`
        else if (icon?.type === 'file' && icon.file?.url) iconHtml = `<img class="callout-icon-img" src="${icon.file.url}" alt="" />`
        const color = block.callout.color || 'default'
        let childHtml = ''
        if (block.has_children) {
          const children = await fetchBlockChildren(block.id)
          const groupedParts: string[] = []
          let inBul = false, inNum = false
          for (const c of children) {
            if (c.type !== 'bulleted_list_item' && inBul) { groupedParts.push('</ul>'); inBul = false }
            if (c.type !== 'numbered_list_item' && inNum) { groupedParts.push('</ol>'); inNum = false }
            if (c.type === 'bulleted_list_item' && !inBul) { groupedParts.push('<ul>'); inBul = true }
            if (c.type === 'numbered_list_item' && !inNum) { groupedParts.push('<ol>'); inNum = true }
            const html = await blockToHtml(c)
            if (html) groupedParts.push(html)
          }
          if (inBul) groupedParts.push('</ul>')
          if (inNum) groupedParts.push('</ol>')
          childHtml = groupedParts.join('\n')
        }
        return `<div class="callout callout-${color}">${iconHtml}<div class="callout-content">${t}${childHtml ? '\n' + childHtml : ''}</div></div>`
      }
      case 'code': {
        const t = block.code.rich_text.map((x: any) => x.plain_text).join('')
        return `<pre><code class="language-${block.code.language || ''}">${t}</code></pre>`
      }
      case 'equation': {
        const expression = block.equation.expression || ''
        return `<div class="equation-block" data-equation="${expression}">$$${expression}$$</div>`
      }
      case 'divider': return '<hr />'
      case 'image': {
        const url = block.image.file?.url || block.image.external?.url
        const cap = block.image.caption ? richTextToHtml(block.image.caption) : ''
        return url ? `<figure><img src="${url}" alt="${cap}" />${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>` : ''
      }
      case 'video': {
        const url = block.video.file?.url || block.video.external?.url
        if (!url) return ''
        if (block.video.type === 'external') {
          const embedUrl = url
            .replace('youtube.com/watch?v=', 'youtube.com/embed/')
            .replace('youtu.be/', 'youtube.com/embed/')
            .replace('vimeo.com/', 'player.vimeo.com/video/')
            .replace('loom.com/share/', 'loom.com/embed/')
          return `<div class="video-embed"><iframe src="${embedUrl}" frameborder="0" allowfullscreen loading="lazy" style="width:100%;aspect-ratio:16/9;border-radius:0.5rem;"></iframe></div>`
        }
        const cap = block.video.caption ? richTextToHtml(block.video.caption) : ''
        return `<figure class="video-figure"><video controls preload="metadata" style="width:100%;border-radius:0.5rem;"><source src="${url}" /></video>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`
      }
      case 'embed': {
        const url = block.embed?.url
        if (!url) return ''
        return `<div class="video-embed"><iframe src="${url}" frameborder="0" allowfullscreen loading="lazy" style="width:100%;aspect-ratio:16/9;border-radius:0.5rem;"></iframe></div>`
      }
      case 'column_list': {
        if (!block.has_children) return ''
        const columns = await fetchBlockChildren(block.id)
        const colCount = columns.length
        const colHtmlParts = await Promise.all(columns.map(async (col: any) => {
          if (col.type !== 'column' || !col.has_children) return '<div class="notion-column"></div>'
          const colChildren = await fetchBlockChildren(col.id)
          const parts: string[] = []
          let ib = false, in2 = false
          for (const c of colChildren) {
            if (c.type !== 'bulleted_list_item' && ib) { parts.push('</ul>'); ib = false }
            if (c.type !== 'numbered_list_item' && in2) { parts.push('</ol>'); in2 = false }
            if (c.type === 'bulleted_list_item' && !ib) { parts.push('<ul>'); ib = true }
            if (c.type === 'numbered_list_item' && !in2) { parts.push('<ol>'); in2 = true }
            const h = await blockToHtml(c)
            if (h) parts.push(h)
          }
          if (ib) parts.push('</ul>')
          if (in2) parts.push('</ol>')
          return `<div class="notion-column">${parts.join('\n')}</div>`
        }))
        return `<div class="notion-column-list notion-columns-${colCount}">${colHtmlParts.join('')}</div>`
      }
      case 'column': return ''
      case 'table': {
        if (!block.has_children) return ''
        const rows = await fetchBlockChildren(block.id)
        const hasHeader = block.table.has_column_header
        let html = '<table>'
        rows.forEach((row: any, idx: number) => {
          if (row.type !== 'table_row') return
          const tag = (hasHeader && idx === 0) ? 'th' : 'td'
          const wrapper = (hasHeader && idx === 0) ? 'thead' : (idx === 1 && hasHeader ? 'tbody' : '')
          if (wrapper === 'thead') html += '<thead>'
          if (wrapper === 'tbody') html += '<tbody>'
          html += '<tr>'
          for (const cell of row.table_row.cells) {
            html += `<${tag}>${richTextToHtml(cell)}</${tag}>`
          }
          html += '</tr>'
          if (wrapper === 'thead') html += '</thead>'
        })
        if (hasHeader && rows.length > 1) html += '</tbody>'
        html += '</table>'
        return html
      }
      default: return ''
    }
  }

  const htmlBlocks: string[] = []
  let inBullet = false, inNum = false

  for (const block of allBlocks) {
    if (block.type !== 'bulleted_list_item' && inBullet) { htmlBlocks.push('</ul>'); inBullet = false }
    if (block.type !== 'numbered_list_item' && inNum) { htmlBlocks.push('</ol>'); inNum = false }
    if (block.type === 'bulleted_list_item' && !inBullet) { htmlBlocks.push('<ul>'); inBullet = true }
    else if (block.type === 'numbered_list_item' && !inNum) { htmlBlocks.push('<ol>'); inNum = true }
    const html = await blockToHtml(block)
    if (html) htmlBlocks.push(html)
  }
  if (inBullet) htmlBlocks.push('</ul>')
  if (inNum) htmlBlocks.push('</ol>')

  return htmlBlocks.join('\n')
}
