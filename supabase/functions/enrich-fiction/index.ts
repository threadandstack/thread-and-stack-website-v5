import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answer, id, metadata } = await req.json();
    
    if (!answer || !id) {
      return new Response(
        JSON.stringify({ error: "Answer and ID are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get IP address from request headers for geolocation
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || req.headers.get("x-real-ip") 
      || req.headers.get("cf-connecting-ip")
      || null;

    let geoData: { country?: string; city?: string } = {};
    
    // Try to get geolocation from IP using ip-api.com (free, no API key needed)
    if (clientIP && clientIP !== "127.0.0.1" && !clientIP.startsWith("192.168.")) {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,country,city`);
        if (geoResponse.ok) {
          const geoJson = await geoResponse.json();
          if (geoJson.status === "success") {
            geoData = {
              country: geoJson.country,
              city: geoJson.city
            };
          }
        }
      } catch (geoError) {
        console.error("Geolocation lookup failed:", geoError);
      }
    }

    // Call AI to enrich the answer with emojis and generate a cluster key
    // Retry logic for transient errors
    let response: Response | null = null;
    let lastError = "";
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
            content: `You enrich fiction book/story titles with emojis and generate cluster keys.

CRITICAL RULES:
1. emojis: Return EXACTLY 2 emojis (no more, no less). Pick the 2 most iconic emojis representing the story's genre, themes, setting, or characters.
2. cluster_key: A normalized, lowercase key for grouping similar works (e.g., "the great gatsby", "harry potter", "lord of the rings").

Examples:
- "1984" → emojis: "👁️📺", cluster_key: "1984"
- "The Great Gatsby" → emojis: "🥂💚", cluster_key: "the great gatsby"
- "Harry Potter" → emojis: "⚡🧙", cluster_key: "harry potter"`
              },
              {
                role: "user",
                content: `Enrich this fiction title: "${answer}"`
              }
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "enrich_fiction",
                  description: "Enrich a fiction title with emojis and clustering info",
                  parameters: {
                    type: "object",
                    properties: {
                      emojis: {
                        type: "string",
                        description: "Exactly 2 emojis (e.g. '📚🔮'). Must be precisely 2 emoji characters, no spaces."
                      },
                      cluster_key: {
                        type: "string",
                        description: "Normalized lowercase key for grouping similar works"
                      }
                    },
                    required: ["emojis", "cluster_key"],
                    additionalProperties: false
                  }
                }
              }
            ],
            tool_choice: { type: "function", function: { name: "enrich_fiction" } }
          }),
        });

        if (response.ok) break;
        
        const errorText = await response.text();
        lastError = errorText;
        console.error(`AI gateway error (attempt ${attempt + 1}):`, response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limited, please try again later" }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "Payment required" }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // For 503 or other transient errors, wait and retry
        if (response.status >= 500 && attempt < 2) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
      } catch (fetchError) {
        console.error(`Fetch error (attempt ${attempt + 1}):`, fetchError);
        lastError = fetchError instanceof Error ? fetchError.message : "Fetch failed";
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
      }
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare metadata update
    const metadataUpdate: Record<string, unknown> = {};
    if (metadata?.device_type) metadataUpdate.device_type = metadata.device_type;
    if (metadata?.timezone) metadataUpdate.timezone = metadata.timezone;
    if (metadata?.is_repeat_visitor !== undefined) metadataUpdate.is_repeat_visitor = metadata.is_repeat_visitor;
    if (metadata?.user_agent) metadataUpdate.user_agent = metadata.user_agent;
    if (geoData.country) metadataUpdate.country = geoData.country;
    if (geoData.city) metadataUpdate.city = geoData.city;

    // If all retries failed, use fallback values instead of erroring
    if (!response || !response.ok) {
      console.log("AI enrichment failed after retries, using fallback values");
      
      const fallbackEmojis = "📚✨";
      const fallbackClusterKey = answer.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').slice(0, 50);

      await supabase
        .from("fiction_favorites")
        .update({
          emojis: fallbackEmojis,
          cluster_key: fallbackClusterKey,
          enriched_answer: `${fallbackEmojis} ${answer}`,
          ...metadataUpdate
        })
        .eq("id", id);

      return new Response(
        JSON.stringify({ success: true, emojis: fallbackEmojis, cluster_key: fallbackClusterKey, fallback: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let emojis = "📚";
    let cluster_key = answer.toLowerCase().trim();
    
    if (toolCall?.function?.arguments) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        emojis = args.emojis || emojis;
        cluster_key = args.cluster_key || cluster_key;
        
        // Ensure EXACTLY 2 emojis by extracting emoji characters and taking first 2
        const emojiRegex = /\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
        const emojiMatches = emojis.match(emojiRegex) || [];
        if (emojiMatches.length >= 2) {
          emojis = emojiMatches.slice(0, 2).join('');
        } else if (emojiMatches.length === 1) {
          emojis = emojiMatches[0] + "📖"; // Pad with book emoji if only 1
        } else {
          emojis = "📚✨"; // Fallback if no emojis extracted
        }
      } catch (e) {
        console.error("Failed to parse tool call:", e);
      }
    }

    const { error: updateError } = await supabase
      .from("fiction_favorites")
      .update({
        emojis,
        cluster_key,
        enriched_answer: `${emojis} ${answer}`,
        ...metadataUpdate
      })
      .eq("id", id);

    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, emojis, cluster_key, geo: geoData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("enrich-fiction error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
