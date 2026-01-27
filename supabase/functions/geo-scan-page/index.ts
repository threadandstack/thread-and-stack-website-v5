import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["br@brendanrodgers.uk", "br@threadandstack.com"];

// SSRF protection: block private network ranges
const PRIVATE_RANGES = ["127.", "10.", "172.16.", "172.17.", "172.18.", "172.19.", "172.20.", "172.21.", "172.22.", "172.23.", "172.24.", "172.25.", "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31.", "192.168.", "localhost", "169.254.", "0.0.0.0", "[::]", "[::1]"];

function isPrivateUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    const hostname = parsed.hostname.toLowerCase();
    return PRIVATE_RANGES.some(range => hostname.includes(range) || hostname === range.replace(".", ""));
  } catch {
    return true; // Invalid URLs are blocked
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!ADMIN_EMAILS.includes(user.email ?? "")) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // SSRF protection
    if (isPrivateUrl(url)) {
      return new Response(
        JSON.stringify({ error: "Cannot scan private or internal networks" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Scanning page for GEO factors:", url);

    // Fetch the page content
    let html = "";
    try {
      const pageResponse = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; GEOScanner/1.0)",
        },
      });
      if (pageResponse.ok) {
        html = await pageResponse.text();
      } else {
        console.log("Failed to fetch page:", pageResponse.status);
      }
    } catch (e) {
      console.log("Could not fetch page content:", e);
      return new Response(
        JSON.stringify({ error: "Could not fetch page" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const htmlLower = html.toLowerCase();

    // Analyze GEO factors
    const checks: Record<string, boolean> = {};

    // Structured Data checks
    checks.hasJsonLd = html.includes('type="application/ld+json"') || html.includes("type='application/ld+json'");
    checks.hasOrgSchema = html.includes('"@type":"Organization"') || html.includes('"@type": "Organization"') || 
                          html.includes("'@type':'Organization'") || htmlLower.includes('"organization"');
    checks.hasArticleSchema = html.includes('"@type":"Article"') || html.includes('"@type":"BlogPosting"') ||
                              html.includes('"@type": "Article"') || html.includes('"@type": "BlogPosting"');
    checks.hasFaqSchema = html.includes('"@type":"FAQPage"') || html.includes('"@type": "FAQPage"') ||
                          html.includes('"@type":"Question"') || html.includes('"@type": "Question"');
    checks.hasBreadcrumbs = html.includes('"@type":"BreadcrumbList"') || html.includes('"@type": "BreadcrumbList"') ||
                            html.includes('itemtype="https://schema.org/BreadcrumbList"');

    // Content Clarity checks
    const h1Matches = html.match(/<h1[^>]*>/gi) || [];
    checks.hasH1 = h1Matches.length === 1;
    checks.hasMetaDesc = html.includes('name="description"') || html.includes("name='description'");
    
    // Check for summary/intro - look for first paragraph after main or article, or specific summary elements
    checks.hasSummary = html.includes('<summary') || html.includes('class="summary"') || 
                        html.includes('class="intro"') || html.includes('class="lead"') ||
                        (html.includes('<main') && html.includes('<p'));
    
    // Check for logical heading hierarchy (h2s after h1, h3s after h2s)
    const hasH2 = /<h2[^>]*>/i.test(html);
    const hasH3 = /<h3[^>]*>/i.test(html);
    checks.hasSubheadings = hasH2 || hasH3;
    
    // FAQ section detection
    checks.hasFaq = htmlLower.includes('faq') || htmlLower.includes('frequently asked') ||
                    htmlLower.includes('questions') || checks.hasFaqSchema ||
                    (html.includes('<details') && html.includes('<summary'));
    
    // Lists detection
    checks.hasLists = /<ul[^>]*>/i.test(html) || /<ol[^>]*>/i.test(html);

    // Citations & Sources checks
    checks.hasAuthor = html.includes('rel="author"') || html.includes('"author"') ||
                       htmlLower.includes('written by') || htmlLower.includes('by brendan') ||
                       html.includes('itemprop="author"');
    
    checks.hasDatePublished = html.includes('"datePublished"') || html.includes('"dateModified"') ||
                              html.includes('itemprop="datePublished"') || 
                              html.includes('datetime=') || htmlLower.includes('published');
    
    // External links (href starting with http but not same origin)
    const externalLinkPattern = /href=["'](https?:\/\/(?!localhost|127\.0\.0\.1)[^"']+)["']/gi;
    const externalLinks = html.match(externalLinkPattern) || [];
    checks.hasExternalLinks = externalLinks.length > 0;
    
    // Internal links
    const internalLinkPattern = /href=["'](\/[^"']*|#[^"']*)["']/gi;
    const internalLinks = html.match(internalLinkPattern) || [];
    checks.hasInternalLinks = internalLinks.length >= 3;

    // AI Accessibility checks
    // Check robots meta tag
    const robotsMeta = html.match(/<meta[^>]*name=["']robots["'][^>]*>/i);
    const noIndex = robotsMeta && robotsMeta[0].toLowerCase().includes('noindex');
    checks.robotsAllowAi = !noIndex; // Assume allowed unless noindex is set
    
    checks.hasCanonical = html.includes('rel="canonical"') || html.includes("rel='canonical'");
    
    // Fast load time - we can't really measure this, but check for performance hints
    checks.fastLoadTime = html.includes('loading="lazy"') || html.includes("loading='lazy'") ||
                          html.includes('rel="preload"') || html.includes('rel="prefetch"') ||
                          !html.includes('<script src=') || html.length < 500000; // Under 500KB is reasonably light
    
    // Mobile optimization
    checks.mobileOptimized = html.includes('name="viewport"') || html.includes("name='viewport'");

    // Calculate score
    const weights: Record<string, number> = {
      hasJsonLd: 3, hasOrgSchema: 2, hasArticleSchema: 2, hasFaqSchema: 2, hasBreadcrumbs: 1,
      hasH1: 3, hasMetaDesc: 2, hasSummary: 2, hasSubheadings: 2, hasFaq: 2, hasLists: 1,
      hasAuthor: 2, hasDatePublished: 2, hasExternalLinks: 2, hasInternalLinks: 1,
      robotsAllowAi: 3, hasCanonical: 2, fastLoadTime: 1, mobileOptimized: 1,
    };

    let score = 0;
    let maxScore = 0;
    for (const [key, weight] of Object.entries(weights)) {
      maxScore += weight;
      if (checks[key]) {
        score += weight;
      }
    }

    console.log("GEO scan complete for:", url, "Score:", score, "/", maxScore);

    return new Response(
      JSON.stringify({ 
        success: true, 
        checks, 
        score, 
        maxScore,
        percentage: Math.round((score / maxScore) * 100)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GEO scan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
