import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Fiction Favourites has been retired. This endpoint is intentionally disabled
// to stop any further Lovable AI calls. Returns 410 Gone.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return new Response(
    JSON.stringify({ error: "Fiction Favourites is no longer available." }),
    { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
