import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchBookCover(title: string, author: string | null): Promise<string | null> {
  // Try Google Books API first (better coverage and quality)
  try {
    const searchQuery = author ? `${title}+inauthor:${author}` : title;
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=5`;
    
    const response = await fetch(googleBooksUrl);
    if (response.ok) {
      const data = await response.json();
      
      // Find the best match - prefer items with thumbnail and matching title
      for (const item of data.items || []) {
        const imageLinks = item.volumeInfo?.imageLinks;
        if (imageLinks) {
          // Prefer larger images, use HTTPS
          const coverUrl = (imageLinks.thumbnail || imageLinks.smallThumbnail || "")
            .replace("http://", "https://")
            .replace("&edge=curl", "") // Remove curl effect
            .replace("zoom=1", "zoom=2"); // Get larger image
          
          if (coverUrl) {
            return coverUrl;
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed to fetch cover from Google Books:", e);
  }

  // Fallback to Open Library
  try {
    const searchQuery = author ? `${title} ${author}` : title;
    const openLibraryUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=1`;
    
    const response = await fetch(openLibraryUrl);
    if (response.ok) {
      const data = await response.json();
      const book = data.docs?.[0];
      
      if (book?.cover_i) {
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      }
    }
  } catch (e) {
    console.error("Failed to fetch cover from Open Library:", e);
  }
  
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title } = await req.json();
    
    if (!title) {
      return new Response(
        JSON.stringify({ error: "Title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Use AI to generate book summary and audience fact
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
            content: `You provide brief, engaging summaries of fiction books/stories and fascinating audience statistics. Be accurate about author and plot details. If you don't know the work, say so honestly.`
          },
          {
            role: "user",
            content: `Provide details about the fiction: "${title}"`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "book_details",
              description: "Return book/story details with an audience fact",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "A 2-3 sentence engaging summary of the book/story's plot and themes. No spoilers."
                  },
                  author: {
                    type: "string",
                    description: "The author's name, or null if unknown"
                  },
                  audience_fact: {
                    type: "string",
                    description: "A fascinating statistic or fact about the book's AUDIENCE or cultural impact (NOT about the plot). Must include a specific number/statistic. Examples: 'Over 150 million copies sold worldwide', 'Translated into 80 languages', 'The #1 bestseller for 52 consecutive weeks', 'Sparked a 400% increase in visitors to the Scottish Highlands'. Keep it under 25 words."
                  }
                },
                required: ["summary", "audience_fact"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "book_details" } }
      }),
    });

    let summary = "A beloved work of fiction that has captured readers' imaginations.";
    let author: string | null = null;
    let audience_fact = "Beloved by readers around the world.";

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      
      if (toolCall?.function?.arguments) {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          summary = args.summary || summary;
          author = args.author || null;
          audience_fact = args.audience_fact || audience_fact;
        } catch (e) {
          console.error("Failed to parse tool call:", e);
        }
      }
    } else {
      console.error("AI gateway error:", aiResponse.status);
    }

    // Fetch cover art
    const cover_url = await fetchBookCover(title, author);

    return new Response(
      JSON.stringify({ summary, author, cover_url, audience_fact }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fetch-book-details error:", e);
    return new Response(
      JSON.stringify({ 
        summary: "Unable to fetch details at this time.",
        author: null,
        cover_url: null,
        audience_fact: null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
