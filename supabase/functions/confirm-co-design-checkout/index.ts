import { corsHeaders } from "jsr:@supabase/supabase-js/cors";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const QuerySchema = z.object({
  sessionId: z.string().min(1).max(255),
  environment: z.enum(["sandbox", "live"]),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const parsed = QuerySchema.safeParse({
      sessionId: url.searchParams.get("sessionId") ?? "",
      environment: url.searchParams.get("environment") ?? "",
    });
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { sessionId, environment } = parsed.data;
    const env: StripeEnv = environment;

    const stripe = createStripeClient(env);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const status = session.payment_status === "paid" ? "paid" : (session.status ?? "pending");
    const amountPaid = typeof session.amount_total === "number" ? session.amount_total : null;

    const { data: existing } = await supabase
      .from("power_hour_bookings")
      .select("id, status, name, email, role_org, focus, source, variant, utm_source, utm_medium, utm_campaign")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    const justPaid = !!(existing && status === "paid" && existing.status !== "paid");

    if (existing) {
      await supabase
        .from("power_hour_bookings")
        .update({ status, amount_paid: amountPaid })
        .eq("id", existing.id);
    }

    if (justPaid && existing) {
      const buyerEmail = existing.email || session.customer_details?.email || null;
      const buyerName = existing.name || (session.metadata?.name as string | undefined) || undefined;
      const variant = (existing.variant as string | null) || "co-design-single";

      const jobs: Promise<unknown>[] = [];

      if (buyerEmail) {
        jobs.push(
          supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "co-design-buyer-confirmation",
              recipientEmail: buyerEmail,
              idempotencyKey: `cd-buyer-${sessionId}`,
              templateData: {
                name: buyerName,
                amountPaid: amountPaid ?? undefined,
                variant,
              },
            },
          }),
        );
      }

      jobs.push(
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "co-design-admin-notification",
            recipientEmail: "br@brendanrodgers.uk",
            idempotencyKey: `cd-admin-${sessionId}`,
            templateData: {
              name: existing.name,
              email: buyerEmail,
              roleOrg: existing.role_org,
              focus: existing.focus,
              amountPaid: amountPaid ?? undefined,
              variant,
              source: existing.source,
              utmSource: existing.utm_source,
              utmMedium: existing.utm_medium,
              utmCampaign: existing.utm_campaign,
              environment,
              stripeSessionId: sessionId,
            },
          },
        }),
      );

      jobs.push(
        supabase.functions.invoke("sync-booking-to-xero", {
          body: { bookingId: existing.id },
        }),
      );

      const results = await Promise.allSettled(jobs);
      results.forEach((r, i) => {
        if (r.status === "rejected") console.error(`Co-design job ${i} failed`, r.reason);
      });
    }

    return new Response(
      JSON.stringify({
        status,
        amountPaid,
        customerEmail: session.customer_details?.email ?? null,
        name: session.metadata?.name ?? null,
        variant: existing?.variant ?? null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("confirm-co-design-checkout error", err);
    return new Response(JSON.stringify({ error: "Failed to confirm" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
