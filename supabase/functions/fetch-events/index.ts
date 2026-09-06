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

    let slug: string | null = null
    try {
      const body = await req.json()
      if (typeof body?.slug === 'string' && body.slug.length <= 200) slug = body.slug
    } catch { /* no body */ }

    if (slug) {
      const { data, error } = await supabase
        .from('events_cache')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error) throw new Error(error.message)

      return new Response(
        JSON.stringify({ event: data ? mapEvent(data, true) : null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data, error } = await supabase
      .from('events_cache')
      .select('id, notion_id, slug, title, summary, cover_image_url, role, format, start_date, end_date, location, venue, organiser, topics, event_url, slides_url, recording_url, featured')
      .order('start_date', { ascending: false })

    if (error) throw new Error(error.message)

    return new Response(
      JSON.stringify({ events: (data || []).map((r: any) => mapEvent(r, false)) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching events:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        events: [],
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function mapEvent(row: any, withContent: boolean) {
  const base = {
    id: row.notion_id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    coverImage: row.cover_image_url,
    role: row.role,
    format: row.format,
    startDate: row.start_date,
    endDate: row.end_date,
    location: row.location,
    venue: row.venue,
    organiser: row.organiser,
    topics: row.topics || [],
    eventUrl: row.event_url,
    slidesUrl: row.slides_url,
    recordingUrl: row.recording_url,
    featured: row.featured,
  }
  return withContent ? { ...base, htmlContent: row.html_content } : base
}
