import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NOTION_PAGE_ID = '2858863b87d4806d9e29d31a671aab87'

const richTextToPlain = (rt: any[]): string =>
  rt?.map((t: any) => t.plain_text).join('') || ''

const richTextToHtml = (rt: any[]): string => {
  if (!rt?.length) return ''
  return rt.map((t: any) => {
    let c = t.plain_text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
    if (t.annotations?.bold) c = `<strong>${c}</strong>`
    if (t.annotations?.italic) c = `<em>${c}</em>`
    if (t.annotations?.code) c = `<code>${c}</code>`
    if (t.href) c = `<a href="${t.href}" target="_blank" rel="noopener noreferrer">${c}</a>`
    return c
  }).join('')
}

async function fetchAllBlocks(pageId: string, apiKey: string): Promise<any[]> {
  const allBlocks: any[] = []
  let hasMore = true
  let cursor: string | null = null

  while (hasMore) {
    const url = cursor
      ? `https://api.notion.com/v1/blocks/${pageId}/children?start_cursor=${cursor}`
      : `https://api.notion.com/v1/blocks/${pageId}/children`

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Notion-Version': '2022-06-28' }
    })
    if (!res.ok) throw new Error(`Notion blocks error: ${res.status}`)

    const data = await res.json()
    allBlocks.push(...data.results)
    hasMore = data.has_more
    cursor = data.next_cursor
  }

  return allBlocks
}

function splitBySections(blocks: any[]): any[][] {
  const sections: any[][] = [[]]
  for (const block of blocks) {
    if (block.type === 'divider') sections.push([])
    else sections[sections.length - 1].push(block)
  }
  return sections
}

function parseHeader(blocks: any[]) {
  let name = ''
  let title = ''
  const contact: { icon: string; text: string; href?: string }[] = []
  let foundName = false

  for (const block of blocks) {
    if (block.type === 'heading_3') {
      const text = richTextToPlain(block.heading_3.rich_text).trim()
      if (text && text !== 'Quick Links') { name = text; foundName = true }
    } else if (block.type === 'paragraph' && foundName) {
      const plain = richTextToPlain(block.paragraph.rich_text).trim()
      if (!title && plain.length > 5 && !plain.includes('📧') && !plain.includes('📱')) {
        title = plain
      } else if (plain.includes('📧') || plain.includes('📱') || plain.includes('📍')) {
        const parts = plain.split(/\s*\|\s*/)
        const richText = block.paragraph.rich_text
        for (const part of parts) {
          const trimmed = part.trim()
          if (!trimmed) continue
          let icon = '', text = trimmed
          for (const emoji of ['📧', '📱', '🌐', '📍']) {
            if (trimmed.startsWith(emoji)) {
              icon = emoji
              text = trimmed.slice(emoji.length).trim()
              break
            }
          }
          let href: string | undefined
          for (const rt of richText) {
            if (rt.href && text.includes(rt.plain_text.trim())) {
              href = rt.href
              break
            }
          }
          if (text) contact.push({ icon, text, href })
        }
      }
    }
  }

  return { name, title, contact }
}

function blocksToHtml(blocks: any[]): string {
  const parts: string[] = []
  let inBulletList = false

  for (const block of blocks) {
    if (block.type !== 'bulleted_list_item' && inBulletList) {
      parts.push('</ul>')
      inBulletList = false
    }

    switch (block.type) {
      case 'heading_3':
        parts.push(`<h3>${richTextToHtml(block.heading_3.rich_text)}</h3>`)
        break
      case 'paragraph': {
        const html = richTextToHtml(block.paragraph.rich_text)
        if (html) parts.push(`<p>${html}</p>`)
        break
      }
      case 'quote': {
        const html = richTextToHtml(block.quote.rich_text)
        const items = html.split('<br>').map((s: string) => s.trim()).filter(Boolean)
        if (items.length > 1) {
          parts.push(`<ul class="cv-bullets">${items.map((item: string) => `<li>${item}</li>`).join('')}</ul>`)
        } else {
          parts.push(`<blockquote>${html}</blockquote>`)
        }
        break
      }
      case 'bulleted_list_item':
        if (!inBulletList) { parts.push('<ul>'); inBulletList = true }
        parts.push(`<li>${richTextToHtml(block.bulleted_list_item.rich_text)}</li>`)
        break
    }
  }

  if (inBulletList) parts.push('</ul>')
  return parts.join('\n')
}

function parseContentSections(rawSections: any[][]) {
  const sections: { id: string; title: string; html: string }[] = []

  for (let i = 1; i < rawSections.length; i++) {
    const blocks = rawSections[i]
    if (!blocks?.length) continue

    // First heading_3 is the section title
    let sectionTitle = ''
    const contentBlocks: any[] = []
    let titleFound = false

    for (const block of blocks) {
      if (!titleFound && block.type === 'heading_3') {
        sectionTitle = richTextToPlain(block.heading_3.rich_text).trim()
        titleFound = true
      } else {
        contentBlocks.push(block)
      }
    }

    // Special handling for Profile: extract core expertise separately
    if (sectionTitle === 'Profile') {
      const profileBlocks: any[] = []
      const expertiseItems: string[] = []

      for (const block of contentBlocks) {
        if (block.type === 'paragraph') {
          const plain = richTextToPlain(block.paragraph.rich_text)
          if (plain.includes('Core Expertise:')) {
            const text = plain.replace(/^.*Core Expertise:\s*/, '')
            expertiseItems.push(...text.split('|').map((s: string) => s.trim()).filter(Boolean))
          } else {
            profileBlocks.push(block)
          }
        } else {
          profileBlocks.push(block)
        }
      }

      sections.push({ id: 'profile', title: sectionTitle, html: blocksToHtml(profileBlocks) })

      if (expertiseItems.length > 0) {
        sections.push({
          id: 'expertise',
          title: 'Expertise',
          html: `<ul>${expertiseItems.map((item: string) => `<li>${item}</li>`).join('')}</ul>`
        })
      }
      continue
    }

    const id = sectionTitle.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    sections.push({ id, title: sectionTitle, html: blocksToHtml(contentBlocks) })
  }

  return sections
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) throw new Error('NOTION_API_KEY not configured')

    // Fetch blocks and page metadata in parallel
    const [allBlocks, pageRes] = await Promise.all([
      fetchAllBlocks(NOTION_PAGE_ID, NOTION_API_KEY),
      fetch(`https://api.notion.com/v1/pages/${NOTION_PAGE_ID}`, {
        headers: { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' }
      })
    ])

    const pageData = await pageRes.json()
    const rawSections = splitBySections(allBlocks)
    const { name, title, contact } = parseHeader(rawSections[0] || [])
    const sections = parseContentSections(rawSections)

    return new Response(JSON.stringify({
      name, title, contact, sections,
      lastEdited: pageData.last_edited_time
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('CV fetch error:', error)
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
