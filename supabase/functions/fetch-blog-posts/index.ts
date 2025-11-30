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
    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured')
    }

    // Query the Content Library database
    const databaseId = '2758863b87d480508ca9d5363b7bd842'
    
    const response = await fetch(
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
                  equals: 'Done'
                }
              },
              {
                or: [
                  {
                    property: 'Content type',
                    select: {
                      equals: 'Substack Article'
                    }
                  },
                  {
                    property: 'Content type',
                    select: {
                      equals: 'LinkedIn Post'
                    }
                  }
                ]
              }
            ]
          },
          sorts: [
            {
              property: 'Due date',
              direction: 'descending'
            }
          ]
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Notion API error:', errorText)
      throw new Error(`Notion API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform Notion results to blog posts
    const posts = data.results.map((page: any) => {
      const properties = page.properties
      
      return {
        id: page.id,
        title: properties['Task name']?.title?.[0]?.plain_text || 'Untitled',
        description: properties['Description']?.rich_text?.[0]?.plain_text || '',
        contentType: properties['Content type']?.select?.name || '',
        status: properties['Status']?.status?.name || '',
        url: page.url,
        channels: properties['Channels']?.multi_select?.map((c: any) => c.name) || []
      }
    })

    return new Response(
      JSON.stringify({ posts }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        posts: []
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
