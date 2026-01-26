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
            content: `You are a literary enthusiast celebrating someone's favorite fiction choice. 
            
Generate a brief, enthusiastic celebration message (1-2 sentences max) that:
- References something specific about the book/story they mentioned
- Could reference a character, quote, theme, or iconic moment
- Feels personal and knowledgeable, not generic
- Is warm and celebratory in tone

Also provide a simple search term (2-3 words max) to find a relevant celebratory GIF from the story/book.`
          },
          {
            role: "user",
            content: `Someone just shared that their favorite fiction is: "${answer}". Generate a tailored celebration message and GIF search term.`
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
                    description: "The tailored celebration message (1-2 sentences)"
                  },
                  gif_search: {
                    type: "string",
                    description: "Simple search term for finding a relevant GIF (2-3 words)"
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

    // Search Giphy for a relevant GIF using their public API
    // Using Giphy's public beta key for demo purposes
    const giphyApiKey = "dc6zaTOxFJmzC"; // Giphy's public beta key
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(gifSearch + " celebrate")}&limit=5&rating=g`;
    
    let gifUrl = null;
    try {
      const giphyResponse = await fetch(giphyUrl);
      if (giphyResponse.ok) {
        const giphyData = await giphyResponse.json();
        if (giphyData.data && giphyData.data.length > 0) {
          // Pick a random GIF from the results for variety
          const randomIndex = Math.floor(Math.random() * Math.min(giphyData.data.length, 5));
          gifUrl = giphyData.data[randomIndex]?.images?.downsized_medium?.url || 
                   giphyData.data[randomIndex]?.images?.fixed_height?.url;
        }
      }
    } catch (giphyError) {
      console.error("Giphy error:", giphyError);
      // Continue without GIF
    }

    // If no specific GIF found, try a general celebration GIF
    if (!gifUrl) {
      try {
        const fallbackUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=book+celebration&limit=5&rating=g`;
        const fallbackResponse = await fetch(fallbackUrl);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.data && fallbackData.data.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(fallbackData.data.length, 5));
            gifUrl = fallbackData.data[randomIndex]?.images?.downsized_medium?.url;
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
