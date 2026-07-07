import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId")!;
  const env = (url.searchParams.get("env") ?? "sandbox") as StripeEnv;
  const stripe = createStripeClient(env);
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["customer", "payment_intent"],
  });
  const customer = typeof session.customer === "string"
    ? await stripe.customers.retrieve(session.customer)
    : session.customer;
  return new Response(
    JSON.stringify(
      {
        session: {
          id: session.id,
          mode: session.mode,
          amount_total: session.amount_total,
          currency: session.currency,
          status: session.status,
          payment_status: session.payment_status,
          customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
          customer_email: session.customer_email,
          metadata: session.metadata,
          invoice_creation: session.invoice_creation,
        },
        customer: customer && !("deleted" in customer && customer.deleted)
          ? {
            id: (customer as any).id,
            name: (customer as any).name,
            email: (customer as any).email,
            metadata: (customer as any).metadata,
          }
          : null,
        payment_intent: session.payment_intent && typeof session.payment_intent !== "string"
          ? {
            id: session.payment_intent.id,
            description: session.payment_intent.description,
            metadata: session.payment_intent.metadata,
          }
          : null,
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/json" } },
  );
});
