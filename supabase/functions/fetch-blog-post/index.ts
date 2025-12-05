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
    const { slug } = await req.json()
    
    if (!slug) {
      throw new Error('Slug is required')
    }

    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured')
    }
    
    // First, query the database to find the page by title
    const databaseId = '2bc8863b87d4802fa65dd15c42ffa13b'
    
    // Convert slug back to title format for searching
    const searchTitle = slug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
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
            property: 'Status',
            status: {
              equals: 'Live'
            }
          }
        })
      }
    )
    
    if (!queryResponse.ok) {
      throw new Error(`Failed to query database: ${queryResponse.status}`)
    }
    
    const queryData = await queryResponse.json()
    
    // Find the page that matches the slug
    const matchingPage = queryData.results.find((page: any) => {
      const title = page.properties['Name']?.title?.[0]?.plain_text || ''
      const pageSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      return pageSlug === slug
    })
    
    if (!matchingPage) {
      throw new Error('Post not found')
    }
    
    const postId = matchingPage.id
    const lastEditedTime = matchingPage.last_edited_time

    // Fetch page properties
    const pageResponse = await fetch(
      `https://api.notion.com/v1/pages/${postId}`,
      {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        }
      }
    )

    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch page: ${pageResponse.status}`)
    }

    const pageData = await pageResponse.json()
    const properties = pageData.properties

    // Fetch page content (blocks)
    const blocksResponse = await fetch(
      `https://api.notion.com/v1/blocks/${postId}/children`,
      {
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        }
      }
    )

    if (!blocksResponse.ok) {
      throw new Error(`Failed to fetch blocks: ${blocksResponse.status}`)
    }

    const blocksData = await blocksResponse.json()
    
    console.log('Total blocks fetched:', blocksData.results.length)
    
    // Helper function to convert rich text to HTML with formatting
    const richTextToHtml = (richTextArray: any[]) => {
      if (!richTextArray || richTextArray.length === 0) return ''
      
      return richTextArray.map((text: any) => {
        let content = text.plain_text
        
        // Apply formatting annotations in the correct order
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

    // Helper function to convert a single block to HTML
    const blockToHtml = async (block: any): Promise<string> => {
      switch (block.type) {
        case 'paragraph':
          const text = richTextToHtml(block.paragraph.rich_text)
          return text ? `<p>${text}</p>` : ''
          
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
          // Block-level equation (formula block)
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
          console.log(`Unsupported block type: ${block.type}`)
          return ''
      }
    }
    
    // Group consecutive list items
    const blocks = blocksData.results
    const htmlBlocks: string[] = []
    let inBulletList = false
    let inNumberedList = false
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      
      console.log(`Block ${i}: type=${block.type}`)
      
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
          if (text) htmlBlocks.push(`<p>${text}</p>`)
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
          if (!inBulletList) {
            htmlBlocks.push('<ul>')
            inBulletList = true
          }
          const liText = richTextToHtml(block.bulleted_list_item.rich_text)
          htmlBlocks.push(`<li>${liText}</li>`)
          break
          
        case 'numbered_list_item':
          if (!inNumberedList) {
            htmlBlocks.push('<ol>')
            inNumberedList = true
          }
          const numText = richTextToHtml(block.numbered_list_item.rich_text)
          htmlBlocks.push(`<li>${numText}</li>`)
          break
          
        case 'quote':
          const quoteText = richTextToHtml(block.quote.rich_text)
          // Fetch children if the quote has them (multi-line quotes)
          let quoteChildrenHtml = ''
          if (block.has_children) {
            const quoteChildren = await fetchBlockChildren(block.id)
            const quoteChildParts: string[] = []
            for (const child of quoteChildren) {
              const childHtml = await blockToHtml(child)
              if (childHtml) quoteChildParts.push(childHtml)
            }
            quoteChildrenHtml = quoteChildParts.join('\n')
          }
          const fullQuoteContent = quoteText + (quoteChildrenHtml ? `\n${quoteChildrenHtml}` : '')
          htmlBlocks.push(`<blockquote>${fullQuoteContent}</blockquote>`)
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
          // Get icon - could be emoji, custom_emoji, external image, file, or null
          const calloutIcon = block.callout.icon
          let iconHtml = ''
          if (calloutIcon?.type === 'emoji' && calloutIcon.emoji) {
            iconHtml = `<span class="callout-icon">${calloutIcon.emoji}</span>`
          } else if (calloutIcon?.type === 'custom_emoji' && calloutIcon.custom_emoji?.url) {
            // Custom emoji uploaded to Notion workspace
            iconHtml = `<img class="callout-icon-img" src="${calloutIcon.custom_emoji.url}" alt="${calloutIcon.custom_emoji.name || ''}" />`
          } else if (calloutIcon?.type === 'external' && calloutIcon.external?.url) {
            iconHtml = `<img class="callout-icon-img" src="${calloutIcon.external.url}" alt="" />`
          } else if (calloutIcon?.type === 'file' && calloutIcon.file?.url) {
            iconHtml = `<img class="callout-icon-img" src="${calloutIcon.file.url}" alt="" />`
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
          
        default:
          console.log(`Unsupported block type: ${block.type}`)
      }
    }
    
    // Close any open lists
    if (inBulletList) htmlBlocks.push('</ul>')
    if (inNumberedList) htmlBlocks.push('</ol>')
    
    const content = htmlBlocks.join('\n')
    console.log('Generated HTML length:', content.length)

    // Extract the featured image URL if it exists
    const featuredImageFiles = properties['Featured IMG']?.files || []
    const headerImage = featuredImageFiles.length > 0 ? featuredImageFiles[0].file?.url || featuredImageFiles[0].external?.url : null

    const post = {
      title: properties['Name']?.title?.[0]?.plain_text || 'Untitled',
      description: properties['Description']?.rich_text?.[0]?.plain_text || '',
      headerImage: headerImage,
      content: content,
      readingTime: properties['Reading time']?.rich_text?.[0]?.plain_text || null,
      theme: properties['Theme']?.select?.name || null,
      lastEditedTime: lastEditedTime
    }

    return new Response(
      JSON.stringify({ post }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error fetching blog post:', error)
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
