import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { page_id } = await req.json()

    if (!page_id) {
      return new Response(
        JSON.stringify({ error: 'page_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check cache first
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const sb = createClient(supabaseUrl, supabaseKey)

    const { data: cached } = await sb
      .from('portfolio_content_cache')
      .select('*')
      .eq('notion_page_id', page_id)
      .single()

    // If cached and less than 1 hour old, return it
    if (cached && (Date.now() - new Date(cached.synced_at).getTime()) < 3600000) {
      return new Response(
        JSON.stringify({ page: { name: cached.name, html: cached.html_content, coverImage: cached.cover_image, tags: cached.tags, monthYear: cached.month_year } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) throw new Error('NOTION_API_KEY not configured')

    // Fetch page properties
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${page_id}`, {
      headers: { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' }
    })
    if (!pageRes.ok) throw new Error(`Failed to fetch page: ${pageRes.status}`)
    const pageData = await pageRes.json()

    const props = pageData.properties
    const name = props['Name']?.title?.[0]?.plain_text || 'Untitled'
    const tags = (props['Tags']?.multi_select || []).map((t: any) => t.name)
    const monthYear = props['Month & Year']?.rich_text?.[0]?.plain_text || ''

    let coverImage: string | null = null
    if (pageData.cover?.file?.url) coverImage = pageData.cover.file.url
    else if (pageData.cover?.external?.url) coverImage = pageData.cover.external.url

    // Fetch all blocks (handle pagination)
    let allBlocks: any[] = []
    let startCursor: string | undefined = undefined
    do {
      const url = new URL(`https://api.notion.com/v1/blocks/${page_id}/children`)
      if (startCursor) url.searchParams.set('start_cursor', startCursor)
      const blocksRes = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' }
      })
      if (!blocksRes.ok) throw new Error(`Failed to fetch blocks: ${blocksRes.status}`)
      const blocksData = await blocksRes.json()
      allBlocks = allBlocks.concat(blocksData.results || [])
      startCursor = blocksData.has_more ? blocksData.next_cursor : undefined
    } while (startCursor)

    // --- Block-to-HTML conversion (matching fetch-blog-post pattern) ---
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
      const r = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, {
        headers: { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' }
      })
      if (!r.ok) return []
      const d = await r.json()
      return d.results || []
    }

    const blockToHtml = async (block: any): Promise<string> => {
      switch (block.type) {
        case 'paragraph': {
          const t = richTextToHtml(block.paragraph.rich_text)
          return t ? `<p>${t}</p>` : '<p class="empty-paragraph"></p>'
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
          const color = block.callout.color || 'default'
          let childHtml = ''
          if (block.has_children) {
            const children = await fetchBlockChildren(block.id)
            // Group consecutive list items into <ul>/<ol>
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
        case 'divider': return '<hr />'
        case 'image': {
          const url = block.image.file?.url || block.image.external?.url
          const cap = block.image.caption ? richTextToHtml(block.image.caption) : ''
          return url ? `<figure><img src="${url}" alt="${cap}" />${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>` : ''
        }
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

    // Group consecutive list items
    const htmlBlocks: string[] = []
    let inBullet = false, inNum = false

    for (const block of allBlocks) {
      if (block.type !== 'bulleted_list_item' && inBullet) { htmlBlocks.push('</ul>'); inBullet = false }
      if (block.type !== 'numbered_list_item' && inNum) { htmlBlocks.push('</ol>'); inNum = false }

      if (block.type === 'bulleted_list_item') {
        if (!inBullet) { htmlBlocks.push('<ul>'); inBullet = true }
      } else if (block.type === 'numbered_list_item') {
        if (!inNum) { htmlBlocks.push('<ol>'); inNum = true }
      }

      const html = await blockToHtml(block)
      if (html) htmlBlocks.push(html)
    }
    if (inBullet) htmlBlocks.push('</ul>')
    if (inNum) htmlBlocks.push('</ol>')

    const htmlContent = htmlBlocks.join('\n')

    // Upsert cache
    await sb.from('portfolio_content_cache').upsert({
      notion_page_id: page_id,
      name,
      html_content: htmlContent,
      cover_image: coverImage,
      tags,
      month_year: monthYear,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'notion_page_id' })

    return new Response(
      JSON.stringify({ page: { name, html: htmlContent, coverImage, tags, monthYear } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching portfolio page:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
