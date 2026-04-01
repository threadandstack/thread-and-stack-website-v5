import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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
    if (!NOTION_API_KEY) throw new Error('NOTION_API_KEY not configured')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch all live posts from Notion
    const databaseId = '2bc8863b87d4802fa65dd15c42ffa13b'
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
            property: 'Status',
            status: { equals: 'Live' }
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Notion API error:', errorText)
      throw new Error(`Notion API error: ${response.status}`)
    }

    const data = await response.json()

    const posts = data.results.map((page: any) => {
      const properties = page.properties
      const featuredImageFiles = properties['Featured IMG']?.files || []
      const headerImage = featuredImageFiles.length > 0
        ? featuredImageFiles[0].file?.url || featuredImageFiles[0].external?.url
        : null
      const title = properties['Name']?.title?.[0]?.plain_text || 'Untitled'
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

      return {
        notion_id: page.id,
        slug,
        title,
        description: properties['Description']?.rich_text?.[0]?.plain_text || null,
        intro: properties['Intro']?.rich_text?.[0]?.plain_text || null,
        header_image_url: headerImage,
        reading_time: properties['Reading time']?.rich_text?.[0]?.plain_text || null,
        theme: properties['Theme']?.select?.name || null,
        published_date: properties['Published']?.date?.start || null,
        featured: properties['Featured']?.checkbox || false,
        synced_at: new Date().toISOString(),
      }
    })

    // Delete old cache and insert fresh data
    const { error: deleteError } = await supabase
      .from('blog_posts_cache')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // delete all rows

    if (deleteError) {
      console.error('Delete error:', deleteError)
      throw new Error(`Failed to clear cache: ${deleteError.message}`)
    }

    if (posts.length > 0) {
      const { error: insertError } = await supabase
        .from('blog_posts_cache')
        .insert(posts)

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(`Failed to insert cache: ${insertError.message}`)
      }
    }

    return new Response(
      JSON.stringify({ success: true, synced: posts.length }),
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
