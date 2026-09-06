import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DATABASE_ID = '2bc8863b87d4802fa65dd15c42ffa13b'

const NOTION_S3_PATTERN = /https:\/\/(?:prod-files-secure|s3\.us-west-2\.amazonaws\.com\/secure\.notion-static\.com)[^\s"'<>)]+/g
const MAX_FILE_SIZE = 200 * 1024 * 1024

// Simple in-process cache for URL titles during a single sync run
const titleCache = new Map<string, string>()
async function fetchPageTitle(url: string): Promise<string> {
  if (titleCache.has(url)) return titleCache.get(url)!
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ThreadAndStackBot/1.0)' },
      signal: controller.signal,
      redirect: 'follow',
    })
    clearTimeout(timeout)
    if (!res.ok) { titleCache.set(url, ''); return '' }
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('text/html')) { titleCache.set(url, ''); return '' }
    const text = (await res.text()).slice(0, 200_000)
    const og = text.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    const tw = text.match(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i)
    const tt = text.match(/<title[^>]*>([^<]+)<\/title>/i)
    const raw = (og?.[1] || tw?.[1] || tt?.[1] || '').trim()
    const title = raw.replace(/\s+/g, ' ').slice(0, 200)
    titleCache.set(url, title)
    return title
  } catch {
    titleCache.set(url, '')
    return ''
  }
}

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

    // Check for full=true / forceMedia=true parameters
    let fullSync = false
    let forceMedia = false
    try {
      const body = await req.json()
      fullSync = body?.full === true
      forceMedia = body?.forceMedia === true
    } catch { /* no body */ }
    if (forceMedia) fullSync = true


    // Get last sync timestamp for incremental mode
    const { data: syncMeta } = await supabase
      .from('sync_metadata')
      .select('last_synced_at')
      .eq('sync_type', 'blog')
      .single()

    const lastSyncedAt = syncMeta?.last_synced_at || '2000-01-01T00:00:00Z'
    const syncStartTime = new Date().toISOString()
    const isFirstRun = new Date(lastSyncedAt).getTime() < new Date('2001-01-01').getTime()

    const useIncremental = !isFirstRun && !fullSync
    const baseFilter = { property: 'Status', status: { equals: 'Live' } }
    const queryFilter = useIncremental
      ? {
          and: [
            baseFilter,
            { timestamp: 'last_edited_time', last_edited_time: { after: lastSyncedAt } },
          ]
        }
      : baseFilter

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

    console.log(`Blog sync: found ${allResults.length} posts (full=${fullSync}, incremental=${useIncremental})`)

    // Note: even if allResults is empty (incremental, nothing changed),
    // we still run the prune step below to remove unpublished posts.



    let totalMediaPersisted = 0

    // Process listing metadata + content one page at a time
    for (const page of allResults) {
      const properties = page.properties
      const title = properties['Name']?.title?.[0]?.plain_text || 'Untitled'
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

      const featuredImageFiles = properties['Featured IMG']?.files || []
      let headerImage = featuredImageFiles.length > 0
        ? featuredImageFiles[0].file?.url || featuredImageFiles[0].external?.url
        : null

      const ogImageFiles = properties['OG IMG']?.files || properties['OG Image']?.files || []
      let ogImage = ogImageFiles.length > 0
        ? ogImageFiles[0].file?.url || ogImageFiles[0].external?.url
        : null

      if (ogImage) {
        const persistedOg = await persistMediaUrl(supabase, supabaseUrl, ogImage, `blog-${slug}`, 'og')
        if (persistedOg) {
          ogImage = persistedOg
          totalMediaPersisted++
        }
      }

      // Persist header image inline
      if (headerImage) {
        const persistedHeader = await persistMediaUrl(supabase, supabaseUrl, headerImage, `blog-${slug}`, 'header')
        if (persistedHeader) {
          headerImage = persistedHeader
          totalMediaPersisted++
        }
      }

      const listingRow = {
        notion_id: page.id,
        slug,
        title,
        description: properties['Description']?.rich_text?.[0]?.plain_text || null,
        intro: properties['Intro']?.rich_text?.[0]?.plain_text || null,
        header_image_url: headerImage,
        og_image_url: ogImage,
        reading_time: properties['Reading time']?.rich_text?.[0]?.plain_text || null,
        theme: properties['Theme']?.select?.name || null,
        published_date: properties['Published']?.date?.start || null,
        featured: properties['Featured']?.checkbox || false,
        synced_at: new Date().toISOString(),
      }

      await supabase.from('blog_posts_cache').upsert(listingRow, { onConflict: 'notion_id' })

      // Render and persist content
      try {
        let htmlContent = await renderBlogContent(page.id, NOTION_API_KEY)

        // Persist all media in HTML inline
        const mediaResult = await persistMediaInHtml(supabase, supabaseUrl, htmlContent, `blog-${slug}`)
        htmlContent = mediaResult.html
        totalMediaPersisted += mediaResult.count

        await supabase.from('blog_content_cache').upsert({
          notion_id: page.id,
          slug,
          title,
          html_content: htmlContent,
          header_image_url: headerImage,
          og_image_url: ogImage,
          description: properties['Description']?.rich_text?.[0]?.plain_text || null,
          reading_time: properties['Reading time']?.rich_text?.[0]?.plain_text || null,
          theme: properties['Theme']?.select?.name || null,
          synced_at: new Date().toISOString(),
        }, { onConflict: 'notion_id' })
      } catch (e) {
        console.error(`Failed to render blog post "${title}":`, e)
      }
    }

    // Prune cache: remove any posts no longer marked Live in Notion
    let prunedCount = 0
    try {
      const liveIds = new Set<string>()
      let pruneCursor: string | undefined = undefined
      do {
        const body: any = { filter: baseFilter, page_size: 100 }
        if (pruneCursor) body.start_cursor = pruneCursor
        const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error(`Prune query failed: ${res.status}`)
        const data = await res.json()
        for (const p of (data.results || [])) liveIds.add(p.id)
        pruneCursor = data.has_more ? data.next_cursor : undefined
      } while (pruneCursor)

      const liveIdArr = Array.from(liveIds)
      const { data: existing } = await supabase.from('blog_posts_cache').select('notion_id')
      const stale = (existing || []).map(r => r.notion_id).filter(id => !liveIds.has(id))
      if (stale.length > 0) {
        await supabase.from('blog_posts_cache').delete().in('notion_id', stale)
        await supabase.from('blog_content_cache').delete().in('notion_id', stale)
        prunedCount = stale.length
        console.log(`Pruned ${prunedCount} stale blog posts: ${stale.join(', ')}`)
      }
    } catch (e) {
      console.error('Prune step failed:', e)
    }

    await supabase.from('sync_metadata').upsert(
      { sync_type: 'blog', last_synced_at: syncStartTime },
      { onConflict: 'sync_type' }
    )


    console.log(`Blog sync complete: ${allResults.length} posts, ${totalMediaPersisted} media files persisted`)

    return new Response(
      JSON.stringify({ success: true, synced: allResults.length, content_synced: allResults.length, media_persisted: totalMediaPersisted, pruned: prunedCount }),
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

// ─── Inline media persistence ───

function isNotionS3Url(url: string): boolean {
  return url.includes('prod-files-secure') || url.includes('s3.us-west-2.amazonaws.com/secure.notion-static.com')
}

function getFileExtension(url: string, contentType?: string): string {
  if (contentType) {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg',
      'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
    }
    if (map[contentType]) return map[contentType]
  }
  const pathMatch = url.split('?')[0].match(/\.(\w{2,5})$/)
  return pathMatch ? pathMatch[1] : 'bin'
}

async function persistMediaUrl(
  sb: ReturnType<typeof createClient>,
  supabaseUrl: string,
  url: string,
  pageId: string,
  label: string,
): Promise<string | null> {
  if (!isNotionS3Url(url)) return null

  try {
    // Check if already persisted (skip re-download)
    const { data: existing } = await sb.storage.from('notion-media').list(pageId, { search: `${label}.` })
    if (existing && existing.some(f => f.name.startsWith(`${label}.`))) {
      const match = existing.find(f => f.name.startsWith(`${label}.`))!
      return `${supabaseUrl}/storage/v1/object/public/notion-media/${pageId}/${match.name}`
    }

    const fileRes = await fetch(url)
    if (!fileRes.ok) {
      console.error(`Download failed for ${label}: ${fileRes.status}`)
      return null
    }

    const contentType = fileRes.headers.get('content-type') || ''
    const ext = getFileExtension(url, contentType)
    const storagePath = `${pageId}/${label}.${ext}`

    const fileData = await fileRes.arrayBuffer()
    if (fileData.byteLength > MAX_FILE_SIZE) {
      console.log(`Skipping ${label}: ${fileData.byteLength} bytes exceeds limit`)
      return null
    }

    const { error } = await sb.storage.from('notion-media').upload(storagePath, fileData, {
      contentType,
      upsert: true,
    })
    if (error) {
      console.error(`Upload failed for ${label}:`, error.message)
      return null
    }

    console.log(`Persisted ${label} -> ${storagePath}`)
    return `${supabaseUrl}/storage/v1/object/public/notion-media/${storagePath}`
  } catch (e) {
    console.error(`Error persisting ${label}:`, e)
    return null
  }
}

async function persistMediaInHtml(
  sb: ReturnType<typeof createClient>,
  supabaseUrl: string,
  html: string,
  pageId: string,
): Promise<{ html: string; count: number }> {
  const urls = [...new Set(html.match(NOTION_S3_PATTERN) || [])]
  let count = 0

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const label = `media-${i}`
    const permanentUrl = await persistMediaUrl(sb, supabaseUrl, url, pageId, label)
    if (permanentUrl) {
      html = html.replaceAll(url, permanentUrl)
      count++
    }
  }

  return { html, count }
}

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

  const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const richTextToHtml = (richTextArray: any[]) => {
    if (!richTextArray || richTextArray.length === 0) return ''
    return richTextArray.map((text: any) => {
      // Custom emoji mention -> inline image
      if (text.type === 'mention' && text.mention?.type === 'custom_emoji') {
        const url = text.mention.custom_emoji?.url
        const name = text.mention.custom_emoji?.name || ''
        if (url) return `<img class="notion-inline-emoji" src="${url}" alt="${escapeHtml(name)}" />`
      }
      let content = (text.plain_text || '').replace(/\n/g, '<br>')
      const ann = text.annotations || {}
      if (ann.code) content = `<code>${content}</code>`
      if (ann.bold) content = `<strong>${content}</strong>`
      if (ann.italic) content = `<em>${content}</em>`
      if (ann.strikethrough) content = `<s>${content}</s>`
      if (ann.underline) content = `<u>${content}</u>`
      if (ann.color && ann.color !== 'default') {
        content = `<span class="notion-color-${ann.color}">${content}</span>`
      }
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

  const renderUrlMention = async (url: string): Promise<string> => {
    let host = ''
    try { host = new URL(url).hostname.replace(/^www\./, '') } catch { /* noop */ }
    const favicon = host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : ''
    const title = (await fetchPageTitle(url)) || host || url
    return `<a class="notion-url-mention" href="${url}" target="_blank" rel="noopener noreferrer">${favicon ? `<img class="notion-url-mention-favicon" src="${favicon}" alt="" />` : ''}<span class="notion-url-mention-title">${escapeHtml(title)}</span></a>`
  }

  // Render rich text, but upgrade bare-URL links (where text === href) to URL mention cards.
  const richTextToHtmlAsync = async (rt: any[]): Promise<string> => {
    if (!rt || rt.length === 0) return ''
    const parts: string[] = []
    for (const item of rt) {
      const href = item?.href
      const plain = (item?.plain_text || '').trim()
      const isBareUrl = href && plain && (plain === href || plain === decodeURI(href)) && /^https?:\/\//i.test(href)
      if (isBareUrl) {
        parts.push(await renderUrlMention(href))
      } else {
        parts.push(richTextToHtml([item]))
      }
    }
    return parts.join('')
  }

  const blockToHtml = async (block: any): Promise<string> => {
    switch (block.type) {
      case 'paragraph': {
        const t = await richTextToHtmlAsync(block.paragraph.rich_text)
        return t ? `<p>${t}</p>` : ''
      }
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
      case 'heading_4': {
        const level = block.type === 'heading_4' ? 4 : block.type === 'heading_3' ? 3 : block.type === 'heading_2' ? 2 : 1
        const data = block[block.type]
        const text = richTextToHtml(data.rich_text)
        // Toggle headings: render children inside a <details>
        if (data.is_toggleable && block.has_children) {
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
          const childHtml = groupedParts.join('\n')
          return `<details class="notion-toggle-heading notion-toggle-h${level}"><summary><h${level}>${text}</h${level}></summary><div class="notion-toggle-content">${childHtml}</div></details>`
        }
        return `<h${level}>${text}</h${level}>`
      }
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
        const cls = cap ? 'image-content' : 'image-centered'
        return url ? `<figure class="${cls}"><img src="${url}" alt="${cap}" loading="lazy" />${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>` : ''
      }
      case 'bookmark':
      case 'link_preview': {
        const url = block.bookmark?.url || block.link_preview?.url
        if (!url) return ''
        const cap = block.bookmark?.caption ? richTextToHtml(block.bookmark.caption) : ''
        let host = ''
        try { host = new URL(url).hostname.replace(/^www\./, '') } catch { /* noop */ }
        const favicon = host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : ''
        const title = cap || (await fetchPageTitle(url)) || host || url
        return `<a class="notion-url-mention" href="${url}" target="_blank" rel="noopener noreferrer">${favicon ? `<img class="notion-url-mention-favicon" src="${favicon}" alt="" />` : ''}<span class="notion-url-mention-title">${title}</span></a>`
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
