import { getRedirectUri, getServiceClient } from "../_shared/xero.ts";

function getEnv(k: string) {
  const v = Deno.env.get(k);
  if (!v) throw new Error(`${k} is not configured`);
  return v;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateRaw = url.searchParams.get("state") ?? "";
  const err = url.searchParams.get("error");

  let returnTo = "https://threadandstack.com/admin";
  try {
    const decoded = JSON.parse(atob(stateRaw));
    if (typeof decoded.returnTo === "string") returnTo = decoded.returnTo;
  } catch { /* ignore */ }

  const bounce = (params: Record<string, string>) => {
    const u = new URL(returnTo);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    return Response.redirect(u.toString(), 302);
  };

  if (err) return bounce({ xero: "error", detail: err });
  if (!code) return bounce({ xero: "error", detail: "missing_code" });

  try {
    const clientId = getEnv("XERO_CLIENT_ID");
    const clientSecret = getEnv("XERO_CLIENT_SECRET");
    const basic = btoa(`${clientId}:${clientSecret}`);
    const tokenRes = await fetch("https://identity.xero.com/connect/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: getRedirectUri(),
      }),
    });
    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) throw new Error(`token exchange failed: ${tokenRes.status} ${tokenText}`);
    const tokens = JSON.parse(tokenText);

    // Get the tenant
    const connRes = await fetch("https://api.xero.com/connections", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const connText = await connRes.text();
    if (!connRes.ok) throw new Error(`connections fetch failed: ${connRes.status} ${connText}`);
    const connections = JSON.parse(connText);
    if (!Array.isArray(connections) || !connections.length) {
      throw new Error("No Xero organisations authorised");
    }
    const tenant = connections[0];

    const supabase = getServiceClient();
    // Wipe any prior connection rows so there's only ever one active tenant.
    await supabase.from("xero_connection").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const expiresAt = new Date(Date.now() + (tokens.expires_in - 30) * 1000).toISOString();
    const { error: insertErr } = await supabase.from("xero_connection").insert({
      tenant_id: tenant.tenantId,
      tenant_name: tenant.tenantName ?? null,
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      access_token_expires_at: expiresAt,
    });
    if (insertErr) throw insertErr;

    return bounce({ xero: "connected", org: tenant.tenantName ?? "" });
  } catch (e) {
    console.error("xero-oauth-callback error", e);
    return bounce({ xero: "error", detail: e instanceof Error ? e.message : "unknown" });
  }
});
