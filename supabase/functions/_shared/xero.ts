// Xero API helper: token management + authenticated fetch.
// Auto-refreshes access tokens using the stored refresh token and rotates it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TOKEN_URL = "https://identity.xero.com/connect/token";
const API_BASE = "https://api.xero.com/api.xro/2.0";

function getEnv(key: string): string {
  const v = Deno.env.get(key);
  if (!v) throw new Error(`${key} is not configured`);
  return v;
}

export function getServiceClient() {
  return createClient(
    getEnv("SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

export interface XeroConnection {
  id: string;
  tenant_id: string;
  tenant_name: string | null;
  refresh_token: string;
  access_token: string | null;
  access_token_expires_at: string | null;
}

export async function loadConnection(): Promise<XeroConnection | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("xero_connection")
    .select("id, tenant_id, tenant_name, refresh_token, access_token, access_token_expires_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as XeroConnection | null) ?? null;
}

async function refreshTokens(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const clientId = getEnv("XERO_CLIENT_ID");
  const clientSecret = getEnv("XERO_CLIENT_SECRET");
  const basic = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Xero token refresh failed (${res.status}): ${text}`);
  return JSON.parse(text);
}

export async function getAccessToken(): Promise<{ token: string; tenantId: string }> {
  const conn = await loadConnection();
  if (!conn) throw new Error("Xero is not connected. Connect it from the admin dashboard.");

  const now = Date.now();
  const exp = conn.access_token_expires_at ? new Date(conn.access_token_expires_at).getTime() : 0;
  if (conn.access_token && exp - now > 60_000) {
    return { token: conn.access_token, tenantId: conn.tenant_id };
  }

  const fresh = await refreshTokens(conn.refresh_token);
  const expiresAt = new Date(now + (fresh.expires_in - 30) * 1000).toISOString();
  const supabase = getServiceClient();
  await supabase
    .from("xero_connection")
    .update({
      access_token: fresh.access_token,
      refresh_token: fresh.refresh_token,
      access_token_expires_at: expiresAt,
    })
    .eq("id", conn.id);
  return { token: fresh.access_token, tenantId: conn.tenant_id };
}

export async function xeroFetch(path: string, init: RequestInit = {}): Promise<any> {
  const { token, tenantId } = await getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Xero-Tenant-Id": tenantId,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Xero API ${res.status} ${path}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
}

export function getRedirectUri(): string {
  // Must match the URI registered on the Xero app.
  const supaUrl = getEnv("SUPABASE_URL");
  const projectRef = new URL(supaUrl).hostname.split(".")[0];
  return `https://${projectRef}.supabase.co/functions/v1/xero-oauth-callback`;
}
