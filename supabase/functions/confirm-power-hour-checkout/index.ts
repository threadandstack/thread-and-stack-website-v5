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
    const couponCode = (session.metadata?.coupon_code ?? "").toString();

    // Update booking
    const { data: existing } = await supabase
      .from("power_hour_bookings")
      .select("id, status, name, email, role_org, focus, source, utm_source, utm_medium, utm_campaign, coupon_code")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    const justPaid = !!(existing && status === "paid" && existing.status !== "paid");

    if (existing) {
      await supabase
        .from("power_hour_bookings")
        .update({ status, amount_paid: amountPaid })
        .eq("id", existing.id);

      // Record coupon redemption once on first paid confirmation
      if (justPaid && couponCode) {
        await supabase.from("coupon_redemptions").insert({
          code: couponCode,
          stripe_session_id: sessionId,
          email: session.customer_details?.email ?? null,
        });
      }
    }

    // Fire emails on first transition to paid (idempotency keys make double-fires safe)
    if (justPaid && existing) {
      const buyerEmail = existing.email || session.customer_details?.email || null;
      const buyerName = existing.name || (session.metadata?.name as string | undefined) || undefined;

      const emailJobs: Promise<unknown>[] = [];

      if (buyerEmail) {
        emailJobs.push(
          supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "power-hour-buyer-confirmation",
              recipientEmail: buyerEmail,
              idempotencyKey: `ph-buyer-${sessionId}`,
              templateData: {
                name: buyerName,
                amountPaid: amountPaid ?? undefined,
                couponCode: existing.coupon_code || couponCode || undefined,
              },
            },
          }),
        );
      }

      emailJobs.push(
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "power-hour-admin-notification",
            recipientEmail: "br@brendanrodgers.uk",
            idempotencyKey: `ph-admin-${sessionId}`,
            templateData: {
              name: existing.name,
              email: buyerEmail,
              roleOrg: existing.role_org,
              focus: existing.focus,
              amountPaid: amountPaid ?? undefined,
              couponCode: existing.coupon_code || couponCode || undefined,
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

      emailJobs.push(
        supabase.functions.invoke("sync-booking-to-xero", {
          body: { bookingId: existing.id },
        }),
      );

      const results = await Promise.allSettled(emailJobs);
      results.forEach((r, i) => {
        if (r.status === "rejected") console.error(`Email/Xero job ${i} failed`, r.reason);
      });
    }

    return new Response(
      JSON.stringify({
        status,
        amountPaid,
        customerEmail: session.customer_details?.email ?? null,
        name: session.metadata?.name ?? null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("confirm-power-hour-checkout error", err);
    return new Response(JSON.stringify({ error: "Failed to confirm" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
