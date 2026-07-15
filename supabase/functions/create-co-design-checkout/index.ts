import { corsHeaders } from "jsr:@supabase/supabase-js/cors";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const VARIANT_LOOKUP: Record<"single" | "six", { lookupKey: string; label: string }> = {
  single: { lookupKey: "co_design_session_single", label: "Co-Design Session — 1 session" },
  six: { lookupKey: "co_design_session_six", label: "Co-Design Session — 6 sessions" },
};

const BodySchema = z.object({
  variant: z.enum(["single", "six"]),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  roleOrg: z.string().trim().max(255).optional().default(""),
  focus: z.string().trim().max(2000).optional().default(""),
  consent: z.boolean(),
  source: z.string().trim().max(120).optional().default("co-design"),
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
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const data = parsed.data;

    if (data.honeypot) {
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

    const env: StripeEnv = data.environment;
    const stripe = createStripeClient(env);

    const variantConfig = VARIANT_LOOKUP[data.variant];
    const prices = await stripe.prices.list({ lookup_keys: [variantConfig.lookupKey], limit: 1 });
    if (!prices.data.length) throw new Error(`Price not found for ${variantConfig.lookupKey}`);
    const stripePrice = prices.data[0];

    // Insert pending booking; reuse power_hour_bookings but tag variant + source.
    const { data: booking, error: insertErr } = await supabase
      .from("power_hour_bookings")
      .insert({
        name: data.name,
        email: data.email,
        role_org: data.roleOrg || null,
        focus: data.focus || null,
        source: data.source,
        variant: `co-design-${data.variant}`,
        utm_source: data.utmSource || null,
        utm_medium: data.utmMedium || null,
        utm_campaign: data.utmCampaign || null,
        consent_given: data.consent,
        status: "pending",
      })
      .select("id")
      .single();
    if (insertErr) throw insertErr;

    const customerMetadata: Record<string, string> = {
      booking_id: booking.id,
      source: data.source,
      variant: `co-design-${data.variant}`,
    };
    if (data.roleOrg) customerMetadata.role_org = data.roleOrg;
    if (data.utmSource) customerMetadata.utm_source = data.utmSource;
    if (data.utmMedium) customerMetadata.utm_medium = data.utmMedium;
    if (data.utmCampaign) customerMetadata.utm_campaign = data.utmCampaign;

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

    const productDescription = variantConfig.label;

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
            source: data.source,
            variant: `co-design-${data.variant}`,
          },
        },
      },
      allow_promotion_codes: false,
      metadata: {
        booking_id: booking.id,
        source: data.source,
        variant: `co-design-${data.variant}`,
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
          source: data.source,
          variant: `co-design-${data.variant}`,
          name: data.name,
          role_org: data.roleOrg || "",
        },
      },
    });

    await supabase
      .from("power_hour_bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-co-design-checkout error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
