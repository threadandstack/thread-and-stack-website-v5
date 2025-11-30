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
    
    // Convert Notion blocks to HTML
    const content = blocksData.results.map((block: any) => {
      switch (block.type) {
        case 'paragraph':
          const text = block.paragraph.rich_text.map((t: any) => t.plain_text).join('')
          return `<p>${text}</p>`
        case 'heading_1':
          const h1Text = block.heading_1.rich_text.map((t: any) => t.plain_text).join('')
          return `<h1>${h1Text}</h1>`
        case 'heading_2':
          const h2Text = block.heading_2.rich_text.map((t: any) => t.plain_text).join('')
          return `<h2>${h2Text}</h2>`
        case 'heading_3':
          const h3Text = block.heading_3.rich_text.map((t: any) => t.plain_text).join('')
          return `<h3>${h3Text}</h3>`
        case 'bulleted_list_item':
          const liText = block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join('')
          return `<li>${liText}</li>`
        case 'numbered_list_item':
          const numText = block.numbered_list_item.rich_text.map((t: any) => t.plain_text).join('')
          return `<li>${numText}</li>`
        default:
          return ''
      }
    }).join('\n')

    const post = {
      title: properties['Task name']?.title?.[0]?.plain_text || 'Untitled',
      description: properties['Description']?.rich_text?.[0]?.plain_text || '',
      contentType: properties['Content type']?.select?.name || '',
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
