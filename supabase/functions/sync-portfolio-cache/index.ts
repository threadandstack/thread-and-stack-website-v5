import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PORTFOLIO_DATABASES = [
  { id: '2808863b-87d4-8027-8f0e-fb1f70d684e0', label: 'creative' },
  { id: '2e08863b-87d4-81e2-bea8-f435421a841a', label: 'notion' },
]

// Matches Notion-hosted S3 file URLs (images, videos, etc.)
const NOTION_S3_REGEX = /https:\/\/(?:prod-files-secure|s3)\.s3[.\w-]*\.amazonaws\.com\/[^\s"'<>]+/g

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) throw new Error('NOTION_API_KEY not configured')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const sb = createClient(supabaseUrl, supabaseServiceKey)

    // Get last sync timestamp
    const { data: syncMeta } = await sb
      .from('sync_metadata')
      .select('last_synced_at')
      .eq('sync_type', 'portfolio')
      .single()

    const lastSyncedAt = syncMeta?.last_synced_at || '2000-01-01T00:00:00Z'
    const syncStartTime = new Date().toISOString()

    let totalListingSynced = 0
    let totalContentSynced = 0
    let totalMediaPersisted = 0

    for (const db of PORTFOLIO_DATABASES) {
      console.log(`Syncing portfolio database: ${db.label} (${db.id})`)

      const isFirstRun = new Date(lastSyncedAt).getTime() < new Date('2001-01-01').getTime()
      const queryFilter = isFirstRun
        ? { property: 'Show in Portfolio', checkbox: { equals: true } }
        : {
            and: [
              { property: 'Show in Portfolio', checkbox: { equals: true } },
              { timestamp: 'last_edited_time', last_edited_time: { after: lastSyncedAt } },
            ]
          }

      let allResults: any[] = []
      let startCursor: string | undefined = undefined

      do {
        const body: any = {
          filter: queryFilter,
          sorts: [{ property: 'Date', direction: 'descending' }],
        }
        if (startCursor) body.start_cursor = startCursor

        const res = await fetch(`https://api.notion.com/v1/databases/${db.id}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })

        if (!res.ok) {
          const errText = await res.text()
          console.error(`Notion query error for ${db.label}:`, errText)
          throw new Error(`Failed to query database ${db.label}: ${res.status}`)
        }

        const data = await res.json()
        allResults = allResults.concat(data.results || [])
        startCursor = data.has_more ? data.next_cursor : undefined
      } while (startCursor)

      console.log(`Found ${allResults.length} changed pages in ${db.label}`)

      if (allResults.length === 0) continue

      for (const page of allResults) {
        const props = page.properties

        // Extract cover image
        let coverImage: string | null = null
        if (page.cover?.file?.url) coverImage = page.cover.file.url
        else if (page.cover?.external?.url) coverImage = page.cover.external.url

        // Persist cover image if it's a Notion S3 URL
        if (coverImage && NOTION_S3_REGEX.test(coverImage)) {
          NOTION_S3_REGEX.lastIndex = 0
          const persisted = await persistSingleFile(sb, supabaseUrl, coverImage, `covers/${page.id}`)
          if (persisted) {
            coverImage = persisted
            totalMediaPersisted++
          }
        }

        const pageTags = (props['Tags']?.multi_select || []).map((t: any) => t.name)
        const proposalFeatures = (props['Proposal feature']?.multi_select || []).map((t: any) => t.name)
        const allPageTags = [...pageTags, ...proposalFeatures.filter((f: string) => ['Featured', 'Featured-Hero', 'Masonry-Top'].includes(f))]

        const name = props['Name']?.title?.[0]?.plain_text || 'Untitled'
        const hasNda = allPageTags.includes('NDA')

        const listingRow = {
          database_id: db.id,
          notion_page_id: page.id,
          name,
          tags: allPageTags,
          text: props['Text']?.rich_text?.[0]?.plain_text || '',
          month_year: props['Month & Year']?.rich_text?.[0]?.plain_text || '',
          date: props['Date']?.date?.start || null,
          cover_image: coverImage,
          has_nda: hasNda,
          synced_at: new Date().toISOString(),
        }

        await sb.from('portfolio_listing_cache').upsert(listingRow, { onConflict: 'notion_page_id' })
        totalListingSynced++

        if (hasNda) continue

        try {
          let htmlContent = await renderPageContent(page.id, NOTION_API_KEY)

          // Persist all media in HTML
          const mediaResult = await persistMediaInHtml(sb, supabaseUrl, htmlContent, page.id)
          htmlContent = mediaResult.html
          totalMediaPersisted += mediaResult.count

          const monthYear = props['Month & Year']?.rich_text?.[0]?.plain_text || ''

          await sb.from('portfolio_content_cache').upsert({
            notion_page_id: page.id,
            name,
            html_content: htmlContent,
            cover_image: coverImage,
            tags: allPageTags,
            month_year: monthYear,
            synced_at: new Date().toISOString(),
          }, { onConflict: 'notion_page_id' })
          totalContentSynced++
        } catch (e) {
          console.error(`Failed to render content for ${name}:`, e)
        }
      }
    }

    await sb.from('sync_metadata').upsert(
      { sync_type: 'portfolio', last_synced_at: syncStartTime },
      { onConflict: 'sync_type' }
    )

    console.log(`Portfolio sync complete: ${totalListingSynced} listings, ${totalContentSynced} content, ${totalMediaPersisted} media files persisted`)

    return new Response(
      JSON.stringify({ success: true, listings_synced: totalListingSynced, content_synced: totalContentSynced, media_persisted: totalMediaPersisted }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Portfolio sync error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// ─── Media persistence helpers ───

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

async function persistSingleFile(sb: any, supabaseUrl: string, notionUrl: string, storagePath: string): Promise<string | null> {
  try {
    const ext = getExtensionFromUrl(notionUrl)
    const fullPath = `${storagePath}.${ext}`
    const permanentUrl = `${supabaseUrl}/storage/v1/object/public/notion-media/${fullPath}`

    // Check if file already exists in storage — skip download if so
    const { data: existing } = await sb.storage.from('notion-media').list(
      fullPath.substring(0, fullPath.lastIndexOf('/')),
      { search: fullPath.substring(fullPath.lastIndexOf('/') + 1) }
    )
    if (existing && existing.length > 0) {
      return permanentUrl
    }

    // HEAD request first to check size — skip files > 50MB to avoid memory issues
    const headRes = await fetch(notionUrl, { method: 'HEAD' })
    if (headRes.ok) {
      const contentLength = Number(headRes.headers.get('content-length') || 0)
      if (contentLength > 50 * 1024 * 1024) {
        console.log(`Skipping large file (${(contentLength / 1024 / 1024).toFixed(1)}MB): ${fullPath}`)
        return null
      }
    }

    const res = await fetch(notionUrl)
    if (!res.ok) {
      console.error(`Failed to download media: ${res.status} for ${notionUrl.substring(0, 80)}...`)
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
      console.error(`Storage upload error for ${fullPath}:`, error.message)
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

  // Deduplicate
  const uniqueUrls = [...new Set(matches)]
  let count = 0
  let result = html

  for (let i = 0; i < uniqueUrls.length; i++) {
    const originalUrl = uniqueUrls[i]
    // Strip query params for a clean URL to use as an identifier
    const cleanUrl = originalUrl.split('?')[0]
    // Create a deterministic path from the page ID and a hash of the clean URL
    const hash = await hashString(cleanUrl)
    const storagePath = `pages/${pageId}/${hash}`

    const permanentUrl = await persistSingleFile(sb, supabaseUrl, originalUrl, storagePath)
    if (permanentUrl) {
      // Replace all occurrences (the URL with its query params)
      result = result.split(originalUrl).join(permanentUrl)
      count++
    }
  }

  return { html: result, count }
}

async function hashString(str: string): Promise<string> {
  const data = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
}

// ─── Block-to-HTML rendering (reused from fetch-portfolio-page) ───

async function renderPageContent(pageId: string, notionApiKey: string): Promise<string> {
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
