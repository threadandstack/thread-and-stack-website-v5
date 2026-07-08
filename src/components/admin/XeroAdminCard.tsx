import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, ExternalLink, Link2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  name: string | null;
  email: string | null;
  amount_paid: number | null;
  coupon_code: string | null;
  status: string;
  created_at: string;
  xero_invoice_id: string | null;
  xero_invoice_number: string | null;
  xero_synced_at: string | null;
  xero_sync_error: string | null;
}

export function XeroAdminCard() {
  const [connection, setConnection] = useState<{ tenant_name: string | null } | null>(null);
  const [loadingConn, setLoadingConn] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const loadConnection = useCallback(async () => {
    setLoadingConn(true);
    const { data } = await supabase
      .from("xero_connection")
      .select("tenant_name")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setConnection(data ?? null);
    setLoadingConn(false);
  }, []);

  const loadBookings = useCallback(async () => {
    setLoadingBookings(true);
    const { data } = await supabase
      .from("power_hour_bookings")
      .select("id, name, email, amount_paid, coupon_code, status, created_at, xero_invoice_id, xero_invoice_number, xero_synced_at, xero_sync_error")
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(20);
    setBookings((data as Booking[]) ?? []);
    setLoadingBookings(false);
  }, []);

  useEffect(() => {
    loadConnection();
    loadBookings();

    // Handle callback bounce
    const params = new URLSearchParams(window.location.search);
    const xero = params.get("xero");
    if (xero === "connected") {
      toast.success(`Connected to Xero${params.get("org") ? ` (${params.get("org")})` : ""}`);
      params.delete("xero"); params.delete("org");
      window.history.replaceState({}, "", window.location.pathname + (params.toString() ? "?" + params.toString() : ""));
      loadConnection();
    } else if (xero === "error") {
      toast.error(`Xero connection failed: ${params.get("detail") ?? "unknown"}`);
      params.delete("xero"); params.delete("detail");
      window.history.replaceState({}, "", window.location.pathname + (params.toString() ? "?" + params.toString() : ""));
    }
  }, [loadConnection, loadBookings]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("xero-oauth-start", {
        body: { returnTo: `${window.location.origin}/admin` },
      });
      if (error) throw error;
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      toast.error(`Failed to start Xero connect: ${e instanceof Error ? e.message : "unknown"}`);
      setConnecting(false);
    }
  };

  const handleRetry = async (bookingId: string) => {
    setRetryingId(bookingId);
    try {
      const { data, error } = await supabase.functions.invoke("sync-booking-to-xero", {
        body: { bookingId },
      });
      if (error) throw error;
      if (data?.warning) toast.warning(`Synced with warning: ${data.warning}`);
      else toast.success(`Invoice ${data?.invoiceNumber ?? ""} created in Xero`);
      await loadBookings();
    } catch (e) {
      toast.error(`Xero sync failed: ${e instanceof Error ? e.message : "unknown"}`);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Xero
                  {loadingConn ? null : connection ? (
                    <Badge variant="secondary">Connected{connection.tenant_name ? ` — ${connection.tenant_name}` : ""}</Badge>
                  ) : (
                    <Badge variant="destructive">Not connected</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Paid diagnostics automatically create a contact and invoice in Xero.
                </CardDescription>
              </div>
            </div>
            <Button onClick={handleConnect} disabled={connecting} variant={connection ? "outline" : "default"}>
              {connecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {connection ? "Reconnect" : "Connect Xero"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Diagnostic bookings</CardTitle>
          <CardDescription>Latest paid bookings and their Xero sync status.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingBookings ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No paid bookings yet.</p>
          ) : (
            <div className="divide-y">
              {bookings.map((b) => (
                <div key={b.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {b.name || b.email || "Unknown"} {b.coupon_code ? <span className="text-muted-foreground">· {b.coupon_code}</span> : null}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {b.email} · £{((b.amount_paid ?? 0) / 100).toFixed(2)} · {new Date(b.created_at).toLocaleDateString()}
                    </div>
                    {b.xero_sync_error ? (
                      <div className="text-xs text-destructive mt-1 break-words">Xero: {b.xero_sync_error}</div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {b.xero_invoice_id ? (
                      <a
                        href={`https://go.xero.com/AccountsReceivable/View.aspx?InvoiceID=${b.xero_invoice_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs inline-flex items-center gap-1 underline"
                      >
                        {b.xero_invoice_number ?? "Invoice"} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <Badge variant="outline" className="text-xs">Not synced</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRetry(b.id)}
                      disabled={retryingId === b.id}
                    >
                      {retryingId === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                      <span className="ml-1">{b.xero_invoice_id ? "Resync" : "Sync"}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
