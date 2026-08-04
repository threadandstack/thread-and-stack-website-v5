import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { Footer } from "@/components/Footer";
import WhiteLogo from "@/assets/logos/White_TS_Stacked.svg";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { CalEmbed } from "@/components/booking/CalEmbed";

export default function CoDesignThankYouPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<"loading" | "paid" | "pending" | "error">("loading");
  const [name, setName] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [variant, setVariant] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          `confirm-co-design-checkout?sessionId=${encodeURIComponent(sessionId)}&environment=${getStripeEnvironment()}`,
          { method: "GET" },
        );
        if (error) throw error;
        if (data?.status === "paid") {
          setState("paid");
          setName((data.name as string) ?? null);
          setAmount((data.amountPaid as number) ?? null);
          setVariant((data.variant as string) ?? null);
          setEmail((data.customerEmail as string) ?? null);
          if (typeof window !== "undefined" && (window as any).dataLayer) {
            (window as any).dataLayer.push({
              event: "co_design_purchase",
              value: data.amountPaid ? data.amountPaid / 100 : null,
              currency: "GBP",
              variant: data.variant ?? null,
              session_id: sessionId,
            });
          }
        } else {
          setState("pending");
        }
      } catch {
        setState("error");
      }
    })();
  }, [sessionId]);

  const isSix = variant === "co-design-six";
  const packLabel = isSix ? "six-session Co-Design series" : "Co-Design Session";

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:py-20 space-y-8">
        <img src={WhiteLogo} alt="Thread & Stack" className="h-12 sm:h-14 opacity-80" />

        {state === "loading" && (
          <div className="rounded-xl border bg-card p-6 flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Confirming your booking…
          </div>
        )}

        {state === "paid" && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] px-3 py-1 text-xs font-sans uppercase tracking-widest">
              <CheckCircle2 className="w-3.5 h-3.5" /> Payment received
            </div>
            <h1 className="font-serif-pro text-3xl sm:text-4xl md:text-5xl font-semibold italic leading-tight">
              {name ? `Thank you, ${name.split(" ")[0]}.` : "Thank you."}
            </h1>
            <p className="font-sans text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              Your {packLabel} is paid
              {amount !== null ? ` — £${(amount / 100).toLocaleString()} confirmed` : ""}.
              {isSix
                ? " Pick your first 90-minute slot below and I'll email a suggested cadence for the rest."
                : " Pick a 90-minute slot below and you'll get a calendar invite straight away."}{" "}
              A receipt and short prep prompt are on their way from{" "}
              <span className="text-foreground font-medium">br@brendanrodgers.uk</span>.
            </p>

            <CalEmbed
              calLink="thread-and-stack/stack-diagnostic-session"
              namespace="stack-diagnostic-session"
              title={isSix ? "Book your first Co-Design session" : "Book your Co-Design session"}
              meta="90 minutes • paid in full"
              name={name}
              email={email}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <PillButton variant="outline" icon={Mail} asChild>
                <a href="mailto:br@brendanrodgers.uk">Email Brendan</a>
              </PillButton>
              <PillButton asChild>
                <Link to="/">Back to home</Link>
              </PillButton>
            </div>
          </div>
        )}

        {state === "pending" && (
          <div className="rounded-xl border bg-card p-6 space-y-3">
            <h1 className="font-serif-pro text-2xl font-semibold italic">Hang tight…</h1>
            <p className="text-sm text-muted-foreground">
              Your payment is being processed. You'll get an email confirmation shortly. If anything
              looks off, drop me a line at br@brendanrodgers.uk.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="rounded-xl border bg-card p-6 space-y-3">
            <h1 className="font-serif-pro text-2xl font-semibold italic">Something went sideways</h1>
            <p className="text-sm text-muted-foreground">
              I couldn't confirm the session. If you were charged, please email
              br@brendanrodgers.uk and I'll sort it straight away.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
