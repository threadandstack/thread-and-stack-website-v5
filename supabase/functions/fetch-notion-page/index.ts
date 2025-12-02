import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { pageTitle } = await req.json()
    
    if (!pageTitle) {
      throw new Error('Page title is required')
    }

    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured')
    }

    // Query the Published Blog Library database for governance pages
    const databaseId = '2bc8863b87d4802fa65dd15c42ffa13b'
    
    console.log('Querying database for page:', pageTitle)
    
    const queryResponse = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            and: [
              {
                property: 'Status',
                status: {
                  equals: 'Live - Non Blog'
                }
              },
              {
                property: 'Name',
                title: {
                  equals: pageTitle
                }
              }
            ]
          }
        })
      }
    )

    if (!queryResponse.ok) {
      const errorText = await queryResponse.text()
      console.error('Notion database query error:', errorText)
      throw new Error(`Failed to query database: ${queryResponse.status}`)
    }

    const queryData = await queryResponse.json()
    
    if (!queryData.results || queryData.results.length === 0) {
      console.error('Page not found in database:', pageTitle)
      throw new Error('Page not found')
    }

    const page = queryData.results[0]
    const pageId = page.id
    const lastEdited = page.last_edited_time
    
    // Extract title from properties
    const title = page.properties['Name']?.title?.[0]?.plain_text || pageTitle

    console.log('Found page:', pageId, 'Last edited:', lastEdited)

    // Fetch page content (blocks) - handle pagination for long pages
    let allBlocks: any[] = []
    let hasMore = true
    let startCursor: string | null = null

    while (hasMore) {
      const blocksUrl: string = startCursor 
        ? `https://api.notion.com/v1/blocks/${pageId}/children?start_cursor=${startCursor}`
        : `https://api.notion.com/v1/blocks/${pageId}/children`
      
      const blocksResponse: Response = await fetch(blocksUrl, {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        }
      })

      if (!blocksResponse.ok) {
        throw new Error(`Failed to fetch blocks: ${blocksResponse.status}`)
      }

      const blocksData: any = await blocksResponse.json()
      allBlocks = allBlocks.concat(blocksData.results)
      hasMore = blocksData.has_more
      startCursor = blocksData.next_cursor
    }

    console.log('Total blocks fetched:', allBlocks.length)
    
    // Helper function to convert rich text to HTML with formatting
    const richTextToHtml = (richTextArray: any[]) => {
      if (!richTextArray || richTextArray.length === 0) return ''
      
      return richTextArray.map((text: any) => {
        let content = text.plain_text
        
        // Escape HTML entities
        content = content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        
        // Apply formatting annotations
        if (text.annotations.bold) {
          content = `<strong>${content}</strong>`
        }
        if (text.annotations.italic) {
          content = `<em>${content}</em>`
        }
        if (text.annotations.strikethrough) {
          content = `<s>${content}</s>`
        }
        if (text.annotations.underline) {
          content = `<u>${content}</u>`
        }
        if (text.annotations.code) {
          content = `<code>${content}</code>`
        }
        if (text.href) {
          content = `<a href="${text.href}" target="_blank" rel="noopener noreferrer">${content}</a>`
        }
        
        return content
      }).join('')
    }
    
    // Convert blocks to HTML
    const htmlBlocks: string[] = []
    let inBulletList = false
    let inNumberedList = false
    
    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i]
      
      switch (block.type) {
        case 'paragraph':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          const text = richTextToHtml(block.paragraph.rich_text)
          if (text) htmlBlocks.push(`<p>${text}</p>`)
          break
          
        case 'heading_1':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          const h1Text = richTextToHtml(block.heading_1.rich_text)
          htmlBlocks.push(`<h1>${h1Text}</h1>`)
          break
          
        case 'heading_2':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          const h2Text = richTextToHtml(block.heading_2.rich_text)
          htmlBlocks.push(`<h2>${h2Text}</h2>`)
          break
          
        case 'heading_3':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          const h3Text = richTextToHtml(block.heading_3.rich_text)
          htmlBlocks.push(`<h3>${h3Text}</h3>`)
          break
          
        case 'bulleted_list_item':
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          if (!inBulletList) { htmlBlocks.push('<ul>'); inBulletList = true }
          const liText = richTextToHtml(block.bulleted_list_item.rich_text)
          htmlBlocks.push(`<li>${liText}</li>`)
          break
          
        case 'numbered_list_item':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (!inNumberedList) { htmlBlocks.push('<ol>'); inNumberedList = true }
          const numText = richTextToHtml(block.numbered_list_item.rich_text)
          htmlBlocks.push(`<li>${numText}</li>`)
          break
          
        case 'quote':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          const quoteText = richTextToHtml(block.quote.rich_text)
          htmlBlocks.push(`<blockquote>${quoteText}</blockquote>`)
          break
          
        case 'code':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          const codeText = block.code.rich_text.map((t: any) => t.plain_text).join('')
          const language = block.code.language || ''
          htmlBlocks.push(`<pre><code class="language-${language}">${codeText}</code></pre>`)
          break
          
        case 'callout':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          const calloutText = richTextToHtml(block.callout.rich_text)
          const calloutIcon = block.callout.icon
          let iconHtml = ''
          if (calloutIcon?.type === 'emoji' && calloutIcon.emoji) {
            iconHtml = `<span class="callout-icon">${calloutIcon.emoji}</span>`
          }
          const calloutColor = block.callout.color || 'default'
          htmlBlocks.push(`<div class="callout callout-${calloutColor}">${iconHtml}<div class="callout-content">${calloutText}</div></div>`)
          break
          
        case 'divider':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          htmlBlocks.push('<hr />')
          break
          
        case 'image':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          const imageUrl = block.image.file?.url || block.image.external?.url
          const caption = block.image.caption ? richTextToHtml(block.image.caption) : ''
          if (imageUrl) {
            htmlBlocks.push(`<figure><img src="${imageUrl}" alt="${caption}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`)
          }
          break
          
        case 'toggle':
          if (inBulletList) { htmlBlocks.push('</ul>'); inBulletList = false }
          if (inNumberedList) { htmlBlocks.push('</ol>'); inNumberedList = false }
          const toggleText = richTextToHtml(block.toggle.rich_text)
          htmlBlocks.push(`<details><summary>${toggleText}</summary></details>`)
          break
          
        default:
          console.log(`Unsupported block type: ${block.type}`)
      }
    }
    
    // Close any open lists
    if (inBulletList) htmlBlocks.push('</ul>')
    if (inNumberedList) htmlBlocks.push('</ol>')
    
    const content = htmlBlocks.join('\n')
    console.log('Generated HTML length:', content.length)

    return new Response(
      JSON.stringify({ 
        title,
        content,
        lastEdited
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error fetching Notion page:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
