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
    const { postId } = await req.json()
    
    if (!postId) {
      throw new Error('Post ID is required')
    }

    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured')
    }

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
    
    // Helper function to convert rich text to HTML with formatting
    const richTextToHtml = (richTextArray: any[]) => {
      return richTextArray.map((text: any) => {
        let content = text.plain_text
        
        // Apply formatting annotations
        if (text.annotations.code) {
          content = `<code>${content}</code>`
        }
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
        if (text.href) {
          content = `<a href="${text.href}" target="_blank" rel="noopener noreferrer">${content}</a>`
        }
        
        return content
      }).join('')
    }
    
    // Convert Notion blocks to HTML
    const content = blocksData.results.map((block: any) => {
      switch (block.type) {
        case 'paragraph':
          const text = richTextToHtml(block.paragraph.rich_text)
          return text ? `<p>${text}</p>` : ''
        case 'heading_1':
          const h1Text = richTextToHtml(block.heading_1.rich_text)
          return `<h1>${h1Text}</h1>`
        case 'heading_2':
          const h2Text = richTextToHtml(block.heading_2.rich_text)
          return `<h2>${h2Text}</h2>`
        case 'heading_3':
          const h3Text = richTextToHtml(block.heading_3.rich_text)
          return `<h3>${h3Text}</h3>`
        case 'bulleted_list_item':
          const liText = richTextToHtml(block.bulleted_list_item.rich_text)
          return `<li>${liText}</li>`
        case 'numbered_list_item':
          const numText = richTextToHtml(block.numbered_list_item.rich_text)
          return `<li>${numText}</li>`
        case 'quote':
          const quoteText = richTextToHtml(block.quote.rich_text)
          return `<blockquote>${quoteText}</blockquote>`
        case 'code':
          const codeText = block.code.rich_text.map((t: any) => t.plain_text).join('')
          const language = block.code.language || ''
          return `<pre><code class="language-${language}">${codeText}</code></pre>`
        case 'callout':
          const calloutText = richTextToHtml(block.callout.rich_text)
          const icon = block.callout.icon?.emoji || '💡'
          return `<div class="callout"><span class="callout-icon">${icon}</span><div>${calloutText}</div></div>`
        case 'divider':
          return '<hr />'
        case 'image':
          const imageUrl = block.image.file?.url || block.image.external?.url
          const caption = block.image.caption ? richTextToHtml(block.image.caption) : ''
          return imageUrl ? `<figure><img src="${imageUrl}" alt="${caption}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>` : ''
        default:
          return ''
      }
    }).join('\n')

    // Extract the header image URL if it exists
    const headerImageFiles = properties['Website blog header image']?.files || []
    const headerImage = headerImageFiles.length > 0 ? headerImageFiles[0].file?.url || headerImageFiles[0].external?.url : null

    const post = {
      title: properties['Task name']?.title?.[0]?.plain_text || 'Untitled',
      description: properties['Description']?.rich_text?.[0]?.plain_text || '',
      contentType: properties['Content type']?.select?.name || '',
      headerImage: headerImage,
      content: content,
      channels: properties['Channels']?.multi_select?.map((c: any) => c.name) || []
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
