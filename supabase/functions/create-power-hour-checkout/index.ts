import { corsHeaders } from "jsr:@supabase/supabase-js/cors";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const COUPON_CODE = "CHARITYMEETUP100";
const COUPON_DISCOUNT_PENCE = 10000; // £100 off
const COUPON_MAX_USES = 10;
const PRICE_LOOKUP_KEY = "ai_power_hour_395_gbp";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  roleOrg: z.string().trim().max(255).optional().default(""),
  focus: z.string().trim().max(2000).optional().default(""),
  couponCode: z.string().trim().max(40).optional().default(""),
  consent: z.boolean(),
  source: z.string().trim().max(120).optional().default("charity-meetup-april26"),
  utmSource: z.string().trim().max(120).optional().default(""),
  utmMedium: z.string().trim().max(120).optional().default(""),
  utmCampaign: z.string().trim().max(120).optional().default(""),
  returnUrl: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
  honeypot: z.string().optional().default(""),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const data = parsed.data;

    if (data.honeypot) {
      // Silent success for bots
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!data.consent) {
      return new Response(JSON.stringify({ error: "Consent is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Validate coupon (if entered)
    let couponValid = false;
    let couponNormalized = "";
    if (data.couponCode) {
      couponNormalized = data.couponCode.trim().toUpperCase();
      if (couponNormalized !== COUPON_CODE) {
        return new Response(JSON.stringify({ error: "That coupon code is not valid." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: countData, error: countErr } = await supabase.rpc("count_coupon_redemptions", {
        _code: couponNormalized,
      });
      if (countErr) throw countErr;
      const used = (countData as number) ?? 0;
      if (used >= COUPON_MAX_USES) {
        return new Response(
          JSON.stringify({ error: "Sorry — this coupon has reached its limit of 10 uses." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      couponValid = true;
    }

    const env: StripeEnv = data.environment;
    const stripe = createStripeClient(env);

    // Resolve price by lookup_key
    const prices = await stripe.prices.list({ lookup_keys: [PRICE_LOOKUP_KEY], limit: 1 });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    // Create or reuse a Stripe coupon for £100 off — Stripe enforces max_redemptions=10
    let discounts: { coupon: string }[] | undefined;
    if (couponValid) {
      const couponId = `charitymeetup100_v2_${env}`;
      try {
        await stripe.coupons.retrieve(couponId);
      } catch {
        try {
          await stripe.coupons.create({
            id: couponId,
            amount_off: COUPON_DISCOUNT_PENCE,
            currency: "gbp",
            duration: "once",
            max_redemptions: COUPON_MAX_USES,
            name: "Charity Meetup — £100 off",
          });
        } catch (createErr) {
          // Stripe will reject with a clean error if max_redemptions is reached
          console.error("Coupon create failed", createErr);
          return new Response(
            JSON.stringify({ error: "Sorry — this coupon has reached its limit of 10 uses." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }
      discounts = [{ coupon: couponId }];
    }

    // Insert pending booking first so we have an ID to attach as metadata
    const { data: booking, error: insertErr } = await supabase
      .from("power_hour_bookings")
      .insert({
        name: data.name,
        email: data.email,
        role_org: data.roleOrg || null,
        focus: data.focus || null,
        source: data.source,
        utm_source: data.utmSource || null,
        utm_medium: data.utmMedium || null,
        utm_campaign: data.utmCampaign || null,
        coupon_code: couponValid ? couponNormalized : null,
        consent_given: data.consent,
        status: "pending",
      })
      .select("id")
      .single();
    if (insertErr) throw insertErr;

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer_email: data.email,
      ...(discounts ? { discounts } : { allow_promotion_codes: false }),
      metadata: {
        booking_id: booking.id,
        coupon_code: couponValid ? couponNormalized : "",
        source: data.source,
        name: data.name,
      },
      payment_intent_data: {
        metadata: {
          booking_id: booking.id,
          coupon_code: couponValid ? couponNormalized : "",
        },
      },
    });

    // Save session id on the booking
    await supabase
      .from("power_hour_bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-power-hour-checkout error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
