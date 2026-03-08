import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answer } = await req.json();
    
    if (!answer) {
      return new Response(
        JSON.stringify({ error: "Answer is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate tailored celebration message using AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `You celebrate someone's fiction choice with ONE witty sentence referencing something specific (character, quote, iconic moment). Be warm and clever.

For gif_search: Use the MAIN CHARACTER NAME or MOVIE/BOOK TITLE that would have actual GIFs on Tenor. For example:
- "Lord of the Rings" → "gandalf" or "frodo"
- "Pride and Prejudice" → "mr darcy"
- "Harry Potter" → "harry potter"
- "The Office" → "michael scott"
Pick the most iconic, GIF-able character or title.`
          },
          {
            role: "user",
            content: `Favorite fiction: "${answer}". Write ONE celebratory sentence with a specific reference.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "celebrate_choice",
              description: "Generate a celebration message and GIF search term",
              parameters: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "ONE witty sentence celebrating their choice with a specific reference"
                  },
                  gif_search: {
                    type: "string",
                    description: "Main character name or famous title for GIF search (e.g. 'gandalf', 'mr darcy', 'harry potter')"
                  }
                },
                required: ["message", "gif_search"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "celebrate_choice" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      // Return fallback on error
      return new Response(
        JSON.stringify({
          message: "Excellent choice! That's a wonderful piece of fiction.",
          gif_url: null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    let message = "Excellent choice! That's a wonderful piece of fiction.";
    let gifSearch = answer;
    
    if (toolCall?.function?.arguments) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        message = args.message || message;
        gifSearch = args.gif_search || gifSearch;
      } catch (e) {
        console.error("Failed to parse tool call:", e);
      }
    }

    // Search Tenor for a relevant GIF
    const TENOR_API_KEY = Deno.env.get("TENOR_API_KEY");
    if (!TENOR_API_KEY) {
      console.error("TENOR_API_KEY is not configured");
      return new Response(
        JSON.stringify({ message, gif_url: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const tenorUrl = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(gifSearch)}&key=${TENOR_API_KEY}&limit=5&media_filter=gif`;
    
    let gifUrl = null;
    try {
      const tenorResponse = await fetch(tenorUrl);
      if (tenorResponse.ok) {
        const tenorData = await tenorResponse.json();
        if (tenorData.results && tenorData.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(tenorData.results.length, 5));
          gifUrl = tenorData.results[randomIndex]?.media_formats?.gif?.url ||
                   tenorData.results[randomIndex]?.media_formats?.tinygif?.url;
        }
      }
    } catch (tenorError) {
      console.error("Tenor error:", tenorError);
    }

    // Fallback to celebration GIF if none found
    if (!gifUrl) {
      try {
        const fallbackUrl = `https://tenor.googleapis.com/v2/search?q=celebration&key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&limit=5&media_filter=gif`;
        const fallbackResponse = await fetch(fallbackUrl);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.results && fallbackData.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(fallbackData.results.length, 5));
            gifUrl = fallbackData.results[randomIndex]?.media_formats?.gif?.url;
          }
        }
      } catch (e) {
        console.error("Fallback GIF error:", e);
      }
    }

    return new Response(
      JSON.stringify({ message, gif_url: gifUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("celebrate-fiction error:", e);
    return new Response(
      JSON.stringify({ 
        message: "Great choice! Thanks for sharing.",
        gif_url: null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
