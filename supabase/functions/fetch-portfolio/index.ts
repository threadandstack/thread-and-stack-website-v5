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
    const { database_id, tags } = await req.json()

    if (!database_id) {
      return new Response(
        JSON.stringify({ error: 'database_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const sb = createClient(supabaseUrl, supabaseKey)

    // Read from portfolio_listing_cache
    let query = sb
      .from('portfolio_listing_cache')
      .select('*')
      .eq('database_id', database_id)
      .order('date', { ascending: false, nullsFirst: false })

    const { data: items, error } = await query

    if (error) {
      console.error('Database query error:', error)
      throw new Error(`Failed to query cache: ${error.message}`)
    }

    let filtered = (items || []).map((item: any) => ({
      id: item.notion_page_id,
      name: item.name,
      tags: item.tags || [],
      text: item.text || '',
      monthYear: item.month_year || '',
      date: item.date,
      coverImage: item.cover_image,
      hasNda: item.has_nda,
    }))

    // Filter by tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      filtered = filtered.filter((item: any) =>
        item.tags.some((t: string) => tags.includes(t))
      )
    }

    // Exclude "Not Ready" items
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
