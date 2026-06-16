import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// User agents for social media crawlers
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Pinterest',
  'Googlebot',
  'bingbot',
]

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false
  return CRAWLER_USER_AGENTS.some(crawler => 
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  )
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')
    const userAgent = req.headers.get('user-agent')
    
    // Log for debugging
    console.log(`OG request for slug: ${slug}, UA: ${userAgent}`)
    
    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Missing slug parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured')
    }

    // Query the Published Blog Library database
    const databaseId = '2bc8863b87d4802fa65dd15c42ffa13b'
    
    // Convert slug back to search term
    const searchTerm = slug.replace(/-/g, ' ')
    
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
            status: {
              equals: 'Live'
            }
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Find the matching post by slug
    const matchingPost = data.results.find((page: any) => {
      const title = page.properties['Name']?.title?.[0]?.plain_text || 'Untitled'
      const pageSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      return pageSlug === slug
    })

    if (!matchingPost) {
      return new Response(
        JSON.stringify({ error: 'Post not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const properties = matchingPost.properties
    const title = properties['Name']?.title?.[0]?.plain_text || 'Untitled'
    const description = properties['Description']?.rich_text?.[0]?.plain_text || ''
    const featuredImageFiles = properties['Featured IMG']?.files || []
    const headerImage = featuredImageFiles.length > 0 
      ? featuredImageFiles[0].file?.url || featuredImageFiles[0].external?.url 
      : null
    const theme = properties['Theme']?.select?.name || null

    // Get the site URL from environment or default
    const siteUrl = Deno.env.get('SITE_URL') || 'https://threadandstack.co.uk'
    const pageUrl = `${siteUrl}/blog/${slug}`
    const ogImage = headerImage || `https://threadandstack.com/__l5e/assets-v1/6bce079b-d3c5-4c8b-a9d7-79c333d9d9ca/OpenGraph_TS2026.png`

    // Generate HTML with OG meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>${escapeHtml(title)} | Thread & Stack</title>
  <meta name="title" content="${escapeHtml(title)} | Thread & Stack">
  <meta name="description" content="${escapeHtml(description)}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Thread & Stack">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${pageUrl}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${ogImage}">
  
  <!-- LinkedIn -->
  <meta property="og:image:secure_url" content="${ogImage}">
  
  ${theme ? `<meta property="article:section" content="${escapeHtml(theme)}">` : ''}
  
  <!-- Canonical -->
  <link rel="canonical" href="${pageUrl}">
  
  <!-- Redirect non-crawlers to the actual page -->
  <script>
    // Only redirect if not a crawler (crawlers don't execute JS)
    window.location.replace("${pageUrl}");
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0;url=${pageUrl}">
  </noscript>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
  <p><a href="${pageUrl}">Read the full article on Thread & Stack</a></p>
</body>
</html>`

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    })

  } catch (error) {
    console.error('Error generating OG page:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}