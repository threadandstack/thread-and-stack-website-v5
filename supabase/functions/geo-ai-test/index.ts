const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, pageTitle } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing page for GEO:", url);

    // Fetch the page content
    let pageContent = "";
    try {
      const pageResponse = await fetch(url);
      if (pageResponse.ok) {
        pageContent = await pageResponse.text();
        // Extract just the body content, strip scripts/styles
        pageContent = pageContent
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 5000); // Limit content length
      }
    } catch (e) {
      console.log("Could not fetch page content:", e);
    }

    const systemPrompt = `You are a GEO (Generative Engine Optimization) expert. Analyze web pages for their optimization for AI/LLM-based search engines like Perplexity, ChatGPT, Claude, and Google AI Overviews.

Evaluate the page based on:
1. **Structured Data**: JSON-LD schemas, organization info, article/FAQ schemas
2. **Content Clarity**: Clear headings, summaries, logical structure, FAQ sections
3. **Citations & Sources**: Author attribution, dates, external/internal links
4. **AI Accessibility**: robots.txt, canonical URLs, load time, mobile optimization

Provide:
- Overall GEO score (0-100)
- Specific strengths
- Critical issues to fix
- Quick wins for improvement
- How an AI would likely summarize this page`;

    const userPrompt = `Analyze this page for AI/LLM search optimization:

Page: ${pageTitle}
URL: ${url}

Page Content Preview:
${pageContent || "(Could not fetch page content - analyze based on URL and title)"}

Provide a structured GEO analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "No analysis generated";

    console.log("GEO analysis complete for:", url);

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GEO test error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
