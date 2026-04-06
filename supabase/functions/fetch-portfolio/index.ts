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
    const { database_id, tags } = await req.json()

    if (!database_id) {
      return new Response(
        JSON.stringify({ error: 'database_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured')
    }

    // Build filter: Show in Portfolio = true
    const filter: any = {
      property: 'Show in Portfolio',
      checkbox: { equals: true }
    }

    // Query the database
    const queryResponse = await fetch(
      `https://api.notion.com/v1/databases/${database_id}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter,
          sorts: [{ property: 'Date', direction: 'descending' }]
        })
      }
    )

    if (!queryResponse.ok) {
      const errText = await queryResponse.text()
      console.error('Notion query error:', errText)
      throw new Error(`Failed to query database: ${queryResponse.status}`)
    }

    const queryData = await queryResponse.json()

    // Transform results
    const items = (queryData.results || []).map((page: any) => {
      const props = page.properties

      // Extract cover image
      let coverImage: string | null = null
      if (page.cover?.file?.url) {
        coverImage = page.cover.file.url
      } else if (page.cover?.external?.url) {
        coverImage = page.cover.external.url
      }

      // Extract tags
      const pageTags = (props['Tags']?.multi_select || []).map((t: any) => t.name)
      const proposalFeatures = (props['Proposal feature']?.multi_select || []).map((t: any) => t.name)
      const allPageTags = [...pageTags, ...proposalFeatures.filter((f: string) => f === 'Featured' || f === 'Featured-Hero')]

      return {
        id: page.id,
        name: props['Name']?.title?.[0]?.plain_text || 'Untitled',
        tags: allPageTags,
        text: props['Text']?.rich_text?.[0]?.plain_text || '',
        monthYear: props['Month & Year']?.rich_text?.[0]?.plain_text || '',
        date: props['Date']?.date?.start || null,
        coverImage,
        hasNda: allPageTags.includes('NDA'),
      }
    })

    // Filter by tags if provided (client can request specific tags)
    let filtered = items
    if (tags && Array.isArray(tags) && tags.length > 0) {
      filtered = items.filter((item: any) =>
        item.tags.some((t: string) => tags.includes(t))
      )
    }

    // Exclude items tagged "Not Ready"
    filtered = filtered.filter((item: any) => !item.tags.includes('Not Ready'))

    return new Response(
      JSON.stringify({ items: filtered }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        items: []
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
