import { corsHeaders } from "jsr:@supabase/supabase-js/cors";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

type CouponConfig =
  | { kind: "amount"; amountOff: number; maxUses: number; stripeId: string; name: string }
  | { kind: "percent"; percentOff: number; maxUses: number; stripeId: string; name: string };

const COUPONS: Record<string, CouponConfig> = {
  CHARITYMEETUP100: {
    kind: "amount",
    amountOff: 10000, // £100 off
    maxUses: 10,
    stripeId: "charitymeetup100_v2",
    name: "Charity Meetup — £100 off",
  },
  IMPACT15: {
    kind: "percent",
    percentOff: 15,
    maxUses: 100,
    stripeId: "impact15_v1",
    name: "Impact teams — 15% off",
  },
};

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
    let couponConfig: CouponConfig | null = null;
    let couponNormalized = "";
    if (data.couponCode) {
      couponNormalized = data.couponCode.trim().toUpperCase();
      couponConfig = COUPONS[couponNormalized] ?? null;
      if (!couponConfig) {
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
      if (used >= couponConfig.maxUses) {
        return new Response(
          JSON.stringify({ error: `Sorry — this coupon has reached its limit of ${couponConfig.maxUses} uses.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const env: StripeEnv = data.environment;
    const stripe = createStripeClient(env);

    // Resolve price by lookup_key
    const prices = await stripe.prices.list({ lookup_keys: [PRICE_LOOKUP_KEY], limit: 1 });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    // Create or reuse a Stripe coupon for this code — Stripe enforces max_redemptions
    let discounts: { coupon: string }[] | undefined;
    if (couponConfig) {
      const couponId = `${couponConfig.stripeId}_${env}`;
      try {
        await stripe.coupons.retrieve(couponId);
      } catch {
        try {
          await stripe.coupons.create({
            id: couponId,
            ...(couponConfig.kind === "amount"
              ? { amount_off: couponConfig.amountOff, currency: "gbp" }
              : { percent_off: couponConfig.percentOff }),
            duration: "once",
            max_redemptions: couponConfig.maxUses,
            name: couponConfig.name,
          });
        } catch (createErr) {
          console.error("Coupon create failed", createErr);
          return new Response(
            JSON.stringify({ error: `Sorry — this coupon has reached its limit of ${couponConfig.maxUses} uses.` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }
      discounts = [{ coupon: couponId }];
    }

    // Compute discount in pence for later Xero syncing
    let discountPence: number | null = null;
    if (couponConfig) {
      discountPence = couponConfig.kind === "amount"
        ? couponConfig.amountOff
        : Math.round(39500 * couponConfig.percentOff / 100);
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
        coupon_code: couponConfig ? couponNormalized : null,
        discount_amount: discountPence,
        consent_given: data.consent,
        status: "pending",
      })
      .select("id")
      .single();
    if (insertErr) throw insertErr;


    // Resolve or create a Stripe Customer with full name + metadata so the
    // payment isn't orphaned in Stripe / Xero. Passing customer_email alone
    // creates an anonymous Customer with no name and no searchable metadata.
    const customerMetadata: Record<string, string> = {
      booking_id: booking.id,
      source: data.source,
    };
    if (data.roleOrg) customerMetadata.role_org = data.roleOrg;
    if (data.utmSource) customerMetadata.utm_source = data.utmSource;
    if (data.utmMedium) customerMetadata.utm_medium = data.utmMedium;
    if (data.utmCampaign) customerMetadata.utm_campaign = data.utmCampaign;
    if (couponConfig) customerMetadata.coupon_code = couponNormalized;

    let customerId: string;
    const existingCustomers = await stripe.customers.list({ email: data.email, limit: 1 });
    if (existingCustomers.data.length) {
      const existing = existingCustomers.data[0];
      customerId = existing.id;
      await stripe.customers.update(customerId, {
        name: data.name,
        metadata: { ...(existing.metadata ?? {}), ...customerMetadata },
      });
    } else {
      const created = await stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: customerMetadata,
      });
      customerId = created.id;
    }

    // Resolve product name so the Stripe dashboard / receipts show something
    // meaningful instead of the raw price lookup key.
    const productId = typeof stripePrice.product === "string"
      ? stripePrice.product
      : stripePrice.product.id;
    const product = await stripe.products.retrieve(productId);
    const productDescription = product.name;

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer: customerId,
      customer_update: { name: "auto", address: "auto" },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: productDescription,
          metadata: {
            booking_id: booking.id,
            coupon_code: couponConfig ? couponNormalized : "",
            source: data.source,
          },
        },
      },
      ...(discounts ? { discounts } : { allow_promotion_codes: false }),
      metadata: {
        booking_id: booking.id,
        coupon_code: couponConfig ? couponNormalized : "",
        source: data.source,
        name: data.name,
        role_org: data.roleOrg || "",
        utm_source: data.utmSource || "",
        utm_medium: data.utmMedium || "",
        utm_campaign: data.utmCampaign || "",
      },
      payment_intent_data: {
        description: productDescription,
        metadata: {
          booking_id: booking.id,
          coupon_code: couponConfig ? couponNormalized : "",
          source: data.source,
          name: data.name,
          role_org: data.roleOrg || "",
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
