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
    
    // Group consecutive list items
    const blocks = blocksData.results
    const htmlBlocks: string[] = []
    let inBulletList = false
    let inNumberedList = false
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      
      console.log(`Block ${i}: type=${block.type}`)
      
      switch (block.type) {
        case 'paragraph':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
          const text = richTextToHtml(block.paragraph.rich_text)
          if (text) htmlBlocks.push(`<p>${text}</p>`)
          break
          
        case 'heading_1':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
          const h1Text = richTextToHtml(block.heading_1.rich_text)
          htmlBlocks.push(`<h1>${h1Text}</h1>`)
          break
          
        case 'heading_2':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
          const h2Text = richTextToHtml(block.heading_2.rich_text)
          htmlBlocks.push(`<h2>${h2Text}</h2>`)
          break
          
        case 'heading_3':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
          const h3Text = richTextToHtml(block.heading_3.rich_text)
          htmlBlocks.push(`<h3>${h3Text}</h3>`)
          break
          
        case 'bulleted_list_item':
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
          if (!inBulletList) {
            htmlBlocks.push('<ul>')
            inBulletList = true
          }
          const liText = richTextToHtml(block.bulleted_list_item.rich_text)
          htmlBlocks.push(`<li>${liText}</li>`)
          break
          
        case 'numbered_list_item':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (!inNumberedList) {
            htmlBlocks.push('<ol>')
            inNumberedList = true
          }
          const numText = richTextToHtml(block.numbered_list_item.rich_text)
          htmlBlocks.push(`<li>${numText}</li>`)
          break
          
        case 'quote':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
          const quoteText = richTextToHtml(block.quote.rich_text)
          htmlBlocks.push(`<blockquote>${quoteText}</blockquote>`)
          break
          
        case 'code':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
          const codeText = block.code.rich_text.map((t: any) => t.plain_text).join('')
          const language = block.code.language || ''
          htmlBlocks.push(`<pre><code class="language-${language}">${codeText}</code></pre>`)
          break
          
        case 'callout':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
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
          htmlBlocks.push(`<div class="callout callout-${calloutColor}">${iconHtml}<div class="callout-content">${calloutText}</div></div>`)
          break
          
        case 'divider':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
          htmlBlocks.push('<hr />')
          break
          
        case 'image':
          if (inBulletList) {
            htmlBlocks.push('</ul>')
            inBulletList = false
          }
          if (inNumberedList) {
            htmlBlocks.push('</ol>')
            inNumberedList = false
          }
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
      theme: properties['Theme']?.select?.name || null
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
