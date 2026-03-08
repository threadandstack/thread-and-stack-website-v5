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

    // Call AI to enrich the answer with emojis and genre classification
    // cluster_key is already set on insert - we don't want AI to override it
    // Retry logic for transient errors
    let response: Response | null = null;
    let lastError = "";
    
    // Genre categories for constellation groupings
    const GENRE_OPTIONS = [
      "Epic Fantasy",
      "Science Fiction", 
      "Literary Classics",
      "Dystopian Tales",
      "Mystery & Thriller",
      "Romance & Drama",
      "Horror & Gothic",
      "Children's Adventures",
      "Historical Fiction",
      "Contemporary Fiction"
    ];
    
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
            content: `You enrich fiction book/story titles with emojis and classify their genre.

CRITICAL RULES:
1. Return EXACTLY 2 emojis (no more, no less)
2. Pick the 2 most iconic emojis representing the story's themes, setting, or characters
3. Classify the book into ONE of these genres: ${GENRE_OPTIONS.join(", ")}

Examples:
- "1984" → emojis: "👁️📺", genre: "Dystopian Tales"
- "The Great Gatsby" → emojis: "🥂💚", genre: "Literary Classics"
- "Harry Potter" → emojis: "⚡🧙", genre: "Epic Fantasy"
- "Pride and Prejudice" → emojis: "💕📜", genre: "Romance & Drama"
- "The Hunger Games" → emojis: "🔥🏹", genre: "Dystopian Tales"
- "Lord of the Rings" → emojis: "💍🧙", genre: "Epic Fantasy"
- "Dune" → emojis: "🏜️🪱", genre: "Science Fiction"`
              },
              {
                role: "user",
                content: `Classify this fiction title: "${answer}"`
              }
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "enrich_fiction",
                  description: "Return 2 emojis and genre for a fiction title",
                  parameters: {
                    type: "object",
                    properties: {
                      emojis: {
                        type: "string",
                        description: "Exactly 2 emojis (e.g. '📚🔮'). Must be precisely 2 emoji characters, no spaces."
                      },
                      genre: {
                        type: "string",
                        enum: GENRE_OPTIONS,
                        description: "The primary genre category for this book"
                      }
                    },
                    required: ["emojis", "genre"],
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

    // Validate record exists and was recently created (within 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: record } = await supabase
      .from("fiction_favorites")
      .select("id, created_at")
      .eq("id", id)
      .gt("created_at", fiveMinutesAgo)
      .single();

    if (!record) {
      return new Response(
        JSON.stringify({ error: "Record not found or too old to enrich" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
      const fallbackGenre = "Contemporary Fiction";

      await supabase
        .from("fiction_favorites")
        .update({
          emojis: fallbackEmojis,
          enriched_answer: `${fallbackEmojis} ${answer}`,
          genre: fallbackGenre,
          ...metadataUpdate
        })
        .eq("id", id);

      return new Response(
        JSON.stringify({ success: true, emojis: fallbackEmojis, genre: fallbackGenre, fallback: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let emojis = "📚✨";
    let genre = "Contemporary Fiction";
    
    if (toolCall?.function?.arguments) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        emojis = args.emojis || emojis;
        genre = args.genre || genre;
        
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

    // Update emojis, enriched_answer, and genre - DO NOT update cluster_key
    // cluster_key is set on insert and should not be overwritten by AI
    const { error: updateError } = await supabase
      .from("fiction_favorites")
      .update({
        emojis,
        enriched_answer: `${emojis} ${answer}`,
        genre,
        ...metadataUpdate
      })
      .eq("id", id);

    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, emojis, genre, geo: geoData }),
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
