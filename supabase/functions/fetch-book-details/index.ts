import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchBookCover(title: string, author: string | null): Promise<string | null> {
  // Try Open Library first - more reliable image availability
  try {
    const searchQuery = author ? `${title} ${author}` : title;
    const openLibraryUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=5`;
    
    const response = await fetch(openLibraryUrl);
    if (response.ok) {
      const data = await response.json();
      
      // Find the first book with a cover
      for (const book of data.docs || []) {
        if (book?.cover_i) {
          // Use larger image size (L instead of M)
          return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
        }
      }
    }
  } catch (e) {
    console.error("Failed to fetch cover from Open Library:", e);
  }

  // Fallback to Google Books API
  try {
    const searchQuery = author ? `${title}+inauthor:${author}` : title;
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=5`;
    
    const response = await fetch(googleBooksUrl);
    if (response.ok) {
      const data = await response.json();
      
      // Find the best match with a thumbnail
      for (const item of data.items || []) {
        const imageLinks = item.volumeInfo?.imageLinks;
        if (imageLinks) {
          // Prefer larger images, use HTTPS
          const coverUrl = (imageLinks.large || imageLinks.medium || imageLinks.thumbnail || imageLinks.smallThumbnail || "")
            .replace("http://", "https://")
            .replace("&edge=curl", "")
            .replace("zoom=1", "zoom=3"); // Request larger zoom
          
          if (coverUrl) {
            return coverUrl;
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed to fetch cover from Google Books:", e);
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

    // Use AI to generate book summary, audience fact, and recommendation
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
            content: `You are a literary expert providing SPECIFIC, FACTUAL details about fiction books. 

CRITICAL RULES:
1. NEVER use generic phrases like "beloved work of fiction", "captured readers' imaginations", "beloved by readers"
2. ALWAYS include REAL numbers and statistics - if you don't know exact figures, give reasonable estimates with "approximately" or "over"
3. For audience_fact: Use REAL sales figures, translation counts, awards, or cultural milestones
4. For recommendation: Name a SPECIFIC book by a SPECIFIC author with REAL ratings or sales data

For Animal Farm, you should know: Over 20 million copies sold, written by George Orwell in 1945, translated into 70+ languages.
For 1984, you should know: Over 50 million copies sold, consistently in top 100 books lists.
For The Great Gatsby: Over 25 million copies sold, mandatory reading in US high schools.

If you truly don't recognize a title, provide your best educated guess with "approximately" qualifiers.`
          },
          {
            role: "user",
            content: `Provide SPECIFIC, FACTUAL details about: "${title}". Include real statistics.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "book_details",
              description: "Return book/story details with SPECIFIC audience facts and recommendation",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "A 2-3 sentence engaging summary mentioning the ACTUAL plot premise, themes, and setting. Example for Animal Farm: 'A satirical allegory where farm animals overthrow their human owner, only to see their pig leaders become as tyrannical as the humans they replaced. Orwell's biting critique of Stalinism and totalitarianism remains devastatingly relevant.'"
                  },
                  author: {
                    type: "string",
                    description: "The author's full name"
                  },
                  audience_fact: {
                    type: "string",
                    description: "A SPECIFIC statistic with REAL numbers. Examples: 'Sold over 20 million copies and translated into 70 languages', 'Won the Hugo Award and sold 12 million copies', 'Spent 88 weeks on the NYT bestseller list'. NEVER say generic things like 'beloved by readers'."
                  },
                  recommendation: {
                    type: "string",
                    description: "Format: 'If you loved [this], try [Book Title] by [Author] — [specific stat like sales figures or ratings]'. Example: 'If you loved Animal Farm, try Brave New World by Aldous Huxley — sold over 15 million copies with a 4.2 rating on Goodreads.'"
                  }
                },
                required: ["summary", "author", "audience_fact", "recommendation"],
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
    let recommendation: string | null = null;

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      
      if (toolCall?.function?.arguments) {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          summary = args.summary || summary;
          author = args.author || null;
          audience_fact = args.audience_fact || audience_fact;
          recommendation = args.recommendation || null;
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
      JSON.stringify({ summary, author, cover_url, audience_fact, recommendation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fetch-book-details error:", e);
    return new Response(
      JSON.stringify({ 
        summary: "Unable to fetch details at this time.",
        author: null,
        cover_url: null,
        audience_fact: null,
        recommendation: null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
