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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: cachedPosts, error } = await supabase
      .from('blog_posts_cache')
      .select('*')
      .order('published_date', { ascending: false })

    if (error) {
      console.error('Cache read error:', error)
      throw new Error(`Cache read error: ${error.message}`)
    }

    // Transform to match existing frontend contract
    const posts = (cachedPosts || []).map((row: any) => ({
      id: row.notion_id,
      slug: row.slug,
      title: row.title,
      description: row.description || '',
      intro: row.intro,
      headerImage: row.header_image_url,
      ogImage: row.og_image_url,
      readingTime: row.reading_time,
      theme: row.theme,
      publishedDate: row.published_date,
      featured: row.featured,
    }))

    return new Response(
      JSON.stringify({ posts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        posts: []
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
