import { createClient } from "jsr:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient, verifyWebhook } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const sessionId: string = session.id;
  const supabase = getSupabase();

  // Re-retrieve through the gateway to ensure full session data
  const stripe = createStripeClient(env);
  const fullSession = await stripe.checkout.sessions.retrieve(sessionId);

  const status = fullSession.payment_status === "paid"
    ? "paid"
    : (fullSession.status ?? "pending");
  const amountPaid = typeof fullSession.amount_total === "number"
    ? fullSession.amount_total
    : null;
  const couponCode = (fullSession.metadata?.coupon_code ?? "").toString();

  const { data: existing } = await supabase
    .from("power_hour_bookings")
    .select(
      "id, status, name, email, role_org, focus, source, variant, utm_source, utm_medium, utm_campaign, coupon_code",
    )
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (!existing) {
    console.warn("Webhook: no booking found for session", sessionId);
    return;
  }

  const justPaid = status === "paid" && (existing as any).status !== "paid";

  await supabase
    .from("power_hour_bookings")
    .update({ status, amount_paid: amountPaid })
    .eq("id", (existing as any).id);

  if (justPaid && couponCode) {
    await supabase.from("coupon_redemptions").insert({
      code: couponCode,
      stripe_session_id: sessionId,
      email: fullSession.customer_details?.email ?? null,
    });
  }

  if (justPaid) {
    const buyerEmail = (existing as any).email
      || fullSession.customer_details?.email
      || null;
    const buyerName = (existing as any).name
      || (fullSession.metadata?.name as string | undefined)
      || undefined;

    const jobs: Promise<unknown>[] = [];

    const variant = ((existing as any).variant as string | null) ?? null;
    const isCoDesign = variant?.startsWith("co-design") ?? false;
    const buyerTemplate = isCoDesign ? "co-design-buyer-confirmation" : "power-hour-buyer-confirmation";
    const adminTemplate = isCoDesign ? "co-design-admin-notification" : "power-hour-admin-notification";
    const buyerKey = isCoDesign ? `cd-buyer-${sessionId}` : `ph-buyer-${sessionId}`;
    const adminKey = isCoDesign ? `cd-admin-${sessionId}` : `ph-admin-${sessionId}`;

    if (buyerEmail) {
      jobs.push(
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: buyerTemplate,
            recipientEmail: buyerEmail,
            idempotencyKey: buyerKey,
            templateData: {
              name: buyerName,
              amountPaid: amountPaid ?? undefined,
              couponCode: (existing as any).coupon_code || couponCode || undefined,
              variant: variant ?? undefined,
            },
          },
        }),
      );
    }

    jobs.push(
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: adminTemplate,
          recipientEmail: "br@brendanrodgers.uk",
          idempotencyKey: adminKey,
          templateData: {
            name: (existing as any).name,
            email: buyerEmail,
            roleOrg: (existing as any).role_org,
            focus: (existing as any).focus,
            amountPaid: amountPaid ?? undefined,
            couponCode: (existing as any).coupon_code || couponCode || undefined,
            variant: variant ?? undefined,
            source: (existing as any).source,
            utmSource: (existing as any).utm_source,
            utmMedium: (existing as any).utm_medium,
            utmCampaign: (existing as any).utm_campaign,
            environment: env,
            stripeSessionId: sessionId,
          },
        },
      }),
    );

    jobs.push(
      supabase.functions.invoke("sync-booking-to-xero", {
        body: { bookingId: (existing as any).id },
      }),
    );

    const results = await Promise.allSettled(jobs);
    results.forEach((r, i) => {
      if (r.status === "rejected") console.error(`Webhook job ${i} failed`, r.reason);
    });
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Webhook: invalid or missing env query parameter:", rawEnv);
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      default:
        console.log("Unhandled webhook event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Webhook error", { status: 400 });
  }
});
