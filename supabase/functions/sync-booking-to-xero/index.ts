// Push a paid diagnostic booking to Xero: find-or-create contact, create an
// AUTHORISED invoice (with a discount line if a coupon was used), and mark it
// paid against the Stripe clearing account. Idempotent per booking.
import { corsHeaders } from "jsr:@supabase/supabase-js/cors";
import { z } from "https://esm.sh/zod@3.23.8";
import { getServiceClient, xeroFetch } from "../_shared/xero.ts";

const BodySchema = z.object({ bookingId: z.string().uuid() });

const REVENUE_ACCOUNT = Deno.env.get("XERO_REVENUE_ACCOUNT_CODE") || "200";
const CLEARING_ACCOUNT = Deno.env.get("XERO_STRIPE_CLEARING_ACCOUNT_CODE") || "";

const DIAGNOSTIC_DESCRIPTION = "AI Diagnostic — 1:1 with Brendan";
const DIAGNOSTIC_UNIT_AMOUNT_GBP = 395.00;

function describeBooking(booking: { variant: string | null; amount_paid: number | null }): {
  description: string;
  unitAmount: number;
} {
  const v = booking.variant ?? "";
  if (v === "co-design-six") {
    return {
      description: "Co-Design Session — 6-session series with Brendan",
      unitAmount: (booking.amount_paid ?? 250000) / 100,
    };
  }
  if (v === "co-design-single") {
    return {
      description: "Co-Design Session — 1 session with Brendan",
      unitAmount: (booking.amount_paid ?? 39500) / 100,
    };
  }
  // Default: diagnostic (legacy bookings with null variant)
  return { description: DIAGNOSTIC_DESCRIPTION, unitAmount: DIAGNOSTIC_UNIT_AMOUNT_GBP };
}

function q(v: string) {
  return v.replace(/"/g, '\\"');
}

async function findOrCreateContact(opts: { email: string; name: string; company?: string | null }) {
  // 1. Try email match
  if (opts.email) {
    const where = `EmailAddress=="${q(opts.email)}"`;
    const found = await xeroFetch(`/Contacts?where=${encodeURIComponent(where)}`);
    if (found.Contacts?.length) return found.Contacts[0];
  }
  // 2. Try exact name match
  if (opts.name) {
    const where = `Name=="${q(opts.name)}"`;
    const found = await xeroFetch(`/Contacts?where=${encodeURIComponent(where)}`);
    if (found.Contacts?.length) return found.Contacts[0];
  }
  // 3. Create
  const payload = {
    Contacts: [{
      Name: opts.name || opts.email,
      FirstName: opts.name?.split(" ")[0] ?? undefined,
      LastName: opts.name?.split(" ").slice(1).join(" ") || undefined,
      EmailAddress: opts.email || undefined,
      ...(opts.company ? { CompanyNumber: undefined, ContactPersons: [] } : {}),
    }],
  };
  const created = await xeroFetch(`/Contacts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return created.Contacts[0];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { bookingId } = parsed.data;
    const supabase = getServiceClient();

    const { data: booking, error: fetchErr } = await supabase
      .from("power_hour_bookings")
      .select("id, name, email, role_org, source, variant, coupon_code, amount_paid, discount_amount, stripe_session_id, status, xero_invoice_id")
      .eq("id", bookingId)
      .maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "paid") throw new Error("Booking is not paid");

    // Idempotent: already synced
    if (booking.xero_invoice_id) {
      return new Response(JSON.stringify({ ok: true, alreadySynced: true, invoiceId: booking.xero_invoice_id }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Contact
    const contact = await findOrCreateContact({
      email: booking.email,
      name: booking.name,
      company: booking.role_org,
    });

    const { description, unitAmount } = describeBooking({
      variant: (booking.variant as string | null) ?? null,
      amount_paid: (booking.amount_paid as number | null) ?? null,
    });

    // Invoice lines
    const lines: any[] = [{
      Description: description,
      Quantity: 1,
      UnitAmount: unitAmount,
      AccountCode: REVENUE_ACCOUNT,
      TaxType: "NONE",
    }];
    const discountPence = booking.discount_amount ?? null;
    if (booking.coupon_code && discountPence && discountPence > 0) {
      lines.push({
        Description: `Discount (${booking.coupon_code})`,
        Quantity: 1,
        UnitAmount: -(discountPence / 100),
        AccountCode: REVENUE_ACCOUNT,
        TaxType: "NONE",
      });
    }

    const isCoDesign = ((booking.variant as string | null) ?? "").startsWith("co-design");
    const refLabel = isCoDesign ? "Co-Design" : "Diagnostic";
    const reference = `${refLabel} — ${booking.source ?? "web"}${booking.coupon_code ? ` (${booking.coupon_code})` : ""}`;
    const invoicePayload = {
      Invoices: [{
        Type: "ACCREC",
        Status: "AUTHORISED",
        LineAmountTypes: "NoTax",
        Contact: { ContactID: contact.ContactID },
        Date: new Date().toISOString().slice(0, 10),
        DueDate: new Date().toISOString().slice(0, 10),
        Reference: reference,
        CurrencyCode: "GBP",
        LineItems: lines,
      }],
    };
    const invRes = await xeroFetch(`/Invoices`, {
      method: "POST",
      body: JSON.stringify(invoicePayload),
    });
    const invoice = invRes.Invoices[0];

    // Payment against clearing account
    let paymentWarning: string | null = null;
    if (CLEARING_ACCOUNT && booking.amount_paid && booking.amount_paid > 0) {
      const paymentPayload = {
        Payments: [{
          Invoice: { InvoiceID: invoice.InvoiceID },
          Account: { Code: CLEARING_ACCOUNT },
          Date: new Date().toISOString().slice(0, 10),
          Amount: booking.amount_paid / 100,
          Reference: booking.stripe_session_id ?? undefined,
        }],
      };
      try {
        await xeroFetch(`/Payments`, { method: "POST", body: JSON.stringify(paymentPayload) });
      } catch (payErr) {
        paymentWarning = payErr instanceof Error ? payErr.message : "payment failed";
        console.error("Xero payment apply failed", payErr);
      }
    } else if (!CLEARING_ACCOUNT) {
      paymentWarning = "XERO_STRIPE_CLEARING_ACCOUNT_CODE not set; invoice created without payment applied";
    }

    await supabase
      .from("power_hour_bookings")
      .update({
        xero_contact_id: contact.ContactID,
        xero_invoice_id: invoice.InvoiceID,
        xero_invoice_number: invoice.InvoiceNumber,
        xero_synced_at: new Date().toISOString(),
        xero_sync_error: paymentWarning,
      })
      .eq("id", bookingId);

    return new Response(JSON.stringify({
      ok: true,
      invoiceId: invoice.InvoiceID,
      invoiceNumber: invoice.InvoiceNumber,
      contactId: contact.ContactID,
      warning: paymentWarning,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("sync-booking-to-xero error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    // Best-effort: write error onto booking if we have its id
    try {
      const body = await req.clone().json().catch(() => ({}));
      if (body?.bookingId) {
        await getServiceClient()
          .from("power_hour_bookings")
          .update({ xero_sync_error: msg.slice(0, 500) })
          .eq("id", body.bookingId);
      }
    } catch { /* ignore */ }
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
