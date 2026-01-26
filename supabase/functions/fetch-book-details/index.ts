import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchBookCover(title: string, author: string | null): Promise<string | null> {
  try {
    // Try Open Library first (no API key needed)
    const searchQuery = author ? `${title} ${author}` : title;
    const openLibraryUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=1`;
    
    const response = await fetch(openLibraryUrl);
    if (response.ok) {
      const data = await response.json();
      const book = data.docs?.[0];
      
      if (book?.cover_i) {
        // Medium size cover (M), also available: S, L
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      }
      
      // Fallback to ISBN-based cover if available
      if (book?.isbn?.[0]) {
        return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
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

    // Use AI to generate a book summary
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
            content: `You provide brief, engaging summaries of fiction books/stories. Be accurate about author and plot details. If you don't know the work, say so honestly.`
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
              description: "Return book/story details",
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
                  goodreads_search: {
                    type: "string",
                    description: "Search term for Goodreads URL (e.g. 'lord-of-rings-tolkien')"
                  }
                },
                required: ["summary"],
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
    let goodreadsSearch = title;

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      
      if (toolCall?.function?.arguments) {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          summary = args.summary || summary;
          author = args.author || null;
          goodreadsSearch = args.goodreads_search || title;
        } catch (e) {
          console.error("Failed to parse tool call:", e);
        }
      }
    } else {
      console.error("AI gateway error:", aiResponse.status);
    }

    // Fetch cover art in parallel with returning the response
    const cover_url = await fetchBookCover(title, author);
    const goodreads_url = `https://www.goodreads.com/search?q=${encodeURIComponent(goodreadsSearch)}`;

    return new Response(
      JSON.stringify({ summary, author, goodreads_url, cover_url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fetch-book-details error:", e);
    return new Response(
      JSON.stringify({ 
        summary: "Unable to fetch details at this time.",
        author: null,
        goodreads_url: null,
        cover_url: null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
