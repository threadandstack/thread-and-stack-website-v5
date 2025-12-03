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
    const properties = page.properties
    
    // Extract title from properties
    const title = properties['Name']?.title?.[0]?.plain_text || pageTitle
    
    // Extract featured image if it exists
    const featuredImageFiles = properties['Featured IMG']?.files || []
    const headerImage = featuredImageFiles.length > 0 
      ? featuredImageFiles[0].file?.url || featuredImageFiles[0].external?.url 
      : null

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

    // Helper function to fetch table rows
    const fetchTableRows = async (tableBlockId: string) => {
      const tableRowsResponse = await fetch(
        `https://api.notion.com/v1/blocks/${tableBlockId}/children`,
        {
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
          }
        }
      )
      if (!tableRowsResponse.ok) {
        console.error('Failed to fetch table rows')
        return []
      }
      const tableRowsData = await tableRowsResponse.json()
      return tableRowsData.results || []
    }

    // Helper function to fetch block children (for callouts, etc.)
    const fetchBlockChildren = async (blockId: string): Promise<any[]> => {
      const childResponse = await fetch(
        `https://api.notion.com/v1/blocks/${blockId}/children`,
        {
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
          }
        }
      )
      if (!childResponse.ok) {
        console.error('Failed to fetch block children')
        return []
      }
      const childData = await childResponse.json()
      return childData.results || []
    }

    // Helper function to convert a single block to HTML (for nested content)
    const blockToHtml = async (block: any): Promise<string> => {
      switch (block.type) {
        case 'paragraph':
          const text = richTextToHtml(block.paragraph.rich_text)
          return text ? `<p>${text}</p>` : '<p>&nbsp;</p>'
          
        case 'heading_1':
          return `<h1>${richTextToHtml(block.heading_1.rich_text)}</h1>`
          
        case 'heading_2':
          return `<h2>${richTextToHtml(block.heading_2.rich_text)}</h2>`
          
        case 'heading_3':
          return `<h3>${richTextToHtml(block.heading_3.rich_text)}</h3>`
          
        case 'bulleted_list_item':
          return `<li>${richTextToHtml(block.bulleted_list_item.rich_text)}</li>`
          
        case 'numbered_list_item':
          return `<li>${richTextToHtml(block.numbered_list_item.rich_text)}</li>`
          
        case 'quote':
          return `<blockquote>${richTextToHtml(block.quote.rich_text)}</blockquote>`
          
        case 'code':
          const codeText = block.code.rich_text.map((t: any) => t.plain_text).join('')
          const language = block.code.language || ''
          return `<pre><code class="language-${language}">${codeText}</code></pre>`
          
        case 'equation':
          const expression = block.equation.expression || ''
          return `<div class="equation-block" data-equation="${expression}">$$${expression}$$</div>`
          
        case 'divider':
          return '<hr />'
          
        case 'image':
          const imageUrl = block.image.file?.url || block.image.external?.url
          const caption = block.image.caption ? richTextToHtml(block.image.caption) : ''
          if (imageUrl) {
            return `<figure><img src="${imageUrl}" alt="${caption}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
          }
          return ''
          
        default:
          console.log(`Unsupported nested block type: ${block.type}`)
          return ''
      }
    }
    
    // Convert blocks to HTML
    const htmlBlocks: string[] = []
    let inBulletList = false
    let inNumberedList = false
    
    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i]
      
      // Close lists when switching to non-list blocks
      if (block.type !== 'bulleted_list_item' && inBulletList) {
        htmlBlocks.push('</ul>')
        inBulletList = false
      }
      if (block.type !== 'numbered_list_item' && inNumberedList) {
        htmlBlocks.push('</ol>')
        inNumberedList = false
      }
      
      switch (block.type) {
        case 'paragraph':
          const text = richTextToHtml(block.paragraph.rich_text)
          // Include empty paragraphs for spacing
          htmlBlocks.push(`<p>${text || '&nbsp;'}</p>`)
          break
          
        case 'heading_1':
          const h1Text = richTextToHtml(block.heading_1.rich_text)
          htmlBlocks.push(`<h1>${h1Text}</h1>`)
          break
          
        case 'heading_2':
          const h2Text = richTextToHtml(block.heading_2.rich_text)
          htmlBlocks.push(`<h2>${h2Text}</h2>`)
          break
          
        case 'heading_3':
          const h3Text = richTextToHtml(block.heading_3.rich_text)
          htmlBlocks.push(`<h3>${h3Text}</h3>`)
          break
          
        case 'bulleted_list_item':
          if (!inBulletList) { htmlBlocks.push('<ul>'); inBulletList = true }
          const liText = richTextToHtml(block.bulleted_list_item.rich_text)
          htmlBlocks.push(`<li>${liText}</li>`)
          break
          
        case 'numbered_list_item':
          if (!inNumberedList) { htmlBlocks.push('<ol>'); inNumberedList = true }
          const numText = richTextToHtml(block.numbered_list_item.rich_text)
          htmlBlocks.push(`<li>${numText}</li>`)
          break
          
        case 'quote':
          const quoteText = richTextToHtml(block.quote.rich_text)
          htmlBlocks.push(`<blockquote>${quoteText}</blockquote>`)
          break
          
        case 'code':
          const codeText = block.code.rich_text.map((t: any) => t.plain_text).join('')
          const language = block.code.language || ''
          htmlBlocks.push(`<pre><code class="language-${language}">${codeText}</code></pre>`)
          break
          
        case 'equation':
          // Block-level equation (formula block)
          const expression = block.equation.expression || ''
          htmlBlocks.push(`<div class="equation-block" data-equation="${expression}">$$${expression}$$</div>`)
          break
          
        case 'callout':
          const calloutText = richTextToHtml(block.callout.rich_text)
          // Get icon - could be emoji, external image, or null
          const calloutIcon = block.callout.icon
          let iconHtml = ''
          if (calloutIcon?.type === 'emoji' && calloutIcon.emoji) {
            iconHtml = `<span class="callout-icon">${calloutIcon.emoji}</span>`
          } else if (calloutIcon?.type === 'external' && calloutIcon.external?.url) {
            iconHtml = `<img class="callout-icon-img" src="${calloutIcon.external.url}" alt="" />`
          }
          // Get background color from Notion (defaults to gray_background if not set)
          const calloutColor = block.callout.color || 'default'
          
          // Fetch children if the callout has them
          let childrenHtml = ''
          if (block.has_children) {
            const children = await fetchBlockChildren(block.id)
            const childHtmlParts: string[] = []
            for (const child of children) {
              const childHtml = await blockToHtml(child)
              if (childHtml) childHtmlParts.push(childHtml)
            }
            childrenHtml = childHtmlParts.join('\n')
          }
          
          // Include both the main callout text and any children
          const calloutContent = calloutText + (childrenHtml ? `\n${childrenHtml}` : '')
          htmlBlocks.push(`<div class="callout callout-${calloutColor}">${iconHtml}<div class="callout-content">${calloutContent}</div></div>`)
          break
          
        case 'divider':
          htmlBlocks.push('<hr />')
          break
          
        case 'image':
          const imageUrl = block.image.file?.url || block.image.external?.url
          const caption = block.image.caption ? richTextToHtml(block.image.caption) : ''
          if (imageUrl) {
            htmlBlocks.push(`<figure><img src="${imageUrl}" alt="${caption}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`)
          }
          break
          
        case 'toggle':
          const toggleText = richTextToHtml(block.toggle.rich_text)
          htmlBlocks.push(`<details><summary>${toggleText}</summary></details>`)
          break

        case 'table':
          // Fetch table rows
          const tableRows = await fetchTableRows(block.id)
          const hasColumnHeader = block.table.has_column_header
          const hasRowHeader = block.table.has_row_header
          
          let tableHtml = '<table>'
          tableRows.forEach((row: any, rowIndex: number) => {
            const isHeaderRow = hasColumnHeader && rowIndex === 0
            tableHtml += '<tr>'
            row.table_row.cells.forEach((cell: any, cellIndex: number) => {
              const isHeaderCell = isHeaderRow || (hasRowHeader && cellIndex === 0)
              const cellTag = isHeaderCell ? 'th' : 'td'
              const cellContent = richTextToHtml(cell)
              tableHtml += `<${cellTag}>${cellContent}</${cellTag}>`
            })
            tableHtml += '</tr>'
          })
          tableHtml += '</table>'
          htmlBlocks.push(tableHtml)
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
        lastEdited,
        headerImage
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
