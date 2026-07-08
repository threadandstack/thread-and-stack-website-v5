import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getRedirectUri } from "../_shared/xero.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["br@brendanrodgers.uk", "br@threadandstack.com"];
const SCOPES = "offline_access accounting.contacts accounting.transactions accounting.settings.read";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const returnTo = typeof body.returnTo === "string" ? body.returnTo : "https://threadandstack.com/admin";

    const clientId = Deno.env.get("XERO_CLIENT_ID");
    if (!clientId) throw new Error("XERO_CLIENT_ID is not configured");

    // Encode returnTo in state so callback can bounce back to the right admin origin.
    const nonce = crypto.randomUUID();
    const state = btoa(JSON.stringify({ nonce, returnTo }));

    const authorizeUrl = new URL("https://login.xero.com/identity/connect/authorize");
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", getRedirectUri());
    authorizeUrl.searchParams.set("scope", SCOPES);
    authorizeUrl.searchParams.set("state", state);

    return new Response(JSON.stringify({ url: authorizeUrl.toString() }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("xero-oauth-start error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
