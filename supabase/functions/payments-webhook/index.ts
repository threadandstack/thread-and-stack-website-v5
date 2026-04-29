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
      "id, status, name, email, role_org, focus, source, utm_source, utm_medium, utm_campaign, coupon_code",
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

    if (buyerEmail) {
      jobs.push(
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "power-hour-buyer-confirmation",
            recipientEmail: buyerEmail,
            idempotencyKey: `ph-buyer-${sessionId}`,
            templateData: {
              name: buyerName,
              amountPaid: amountPaid ?? undefined,
              couponCode: (existing as any).coupon_code || couponCode || undefined,
            },
          },
        }),
      );
    }

    jobs.push(
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "power-hour-admin-notification",
          recipientEmail: "br@brendanrodgers.uk",
          idempotencyKey: `ph-admin-${sessionId}`,
          templateData: {
            name: (existing as any).name,
            email: buyerEmail,
            roleOrg: (existing as any).role_org,
            focus: (existing as any).focus,
            amountPaid: amountPaid ?? undefined,
            couponCode: (existing as any).coupon_code || couponCode || undefined,
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

    const results = await Promise.allSettled(jobs);
    results.forEach((r, i) => {
      if (r.status === "rejected") console.error(`Webhook email job ${i} failed`, r.reason);
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
