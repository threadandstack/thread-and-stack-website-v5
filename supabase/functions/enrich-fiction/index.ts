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
    const { answer, id } = await req.json();
    
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

    // Call AI to enrich the answer with emojis and generate a cluster key
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `You are enriching fiction book/story titles with emojis and generating cluster keys.
            
Given a fiction title or description, return:
1. emojis: 2-4 relevant emojis that represent the story's themes, genre, or mood
2. cluster_key: A normalized, lowercase key for grouping similar works (e.g., "sherlock holmes", "harry potter", "lord of the rings")

Be creative with emojis - consider the genre, setting, themes, characters.
For cluster_key, extract the core work/series name to group variations together.`
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
                    description: "2-4 emojis representing the story"
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
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
      throw new Error("AI gateway error");
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
      } catch (e) {
        console.error("Failed to parse tool call:", e);
      }
    }

    // Update the record in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from("fiction_favorites")
      .update({
        emojis,
        cluster_key,
        enriched_answer: `${emojis} ${answer}`
      })
      .eq("id", id);

    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, emojis, cluster_key }),
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
