import { useState, useCallback, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment, resetStripeLoader } from "@/lib/stripe";
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Clock,
  Users,
} from "lucide-react";
import type { Stripe } from "@stripe/stripe-js";

interface CoDesignDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: "dark" | "light";
  source?: string;
  initialVariant?: "single" | "six";
}

type Variant = "single" | "six";

const VARIANTS: Record<Variant, { label: string; price: number; blurb: string }> = {
  single: {
    label: "Single session",
    price: 39500,
    blurb: "One 90-minute co-design session to shape a workflow, product, or narrative together.",
  },
  six: {
    label: "Six-session series",
    price: 250000,
    blurb: "Six sessions over 6–12 weeks. Better value, deeper build. Ideal for iterative work.",
  },
};

export function CoDesignDrawer({
  open,
  onOpenChange,
  theme,
  source = "co-design",
  initialVariant = "single",
}: CoDesignDrawerProps) {
  const { toast } = useToast();
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    roleOrg: "",
    focus: "",
    consent: false,
    honeypot: "",
  });

  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setSubmitting(false);
      setStripeError(null);
    } else {
      setVariant(initialVariant);
    }
  }, [open, initialVariant]);

  useEffect(() => {
    if (!clientSecret) return;
    let cancelled = false;
    setStripeError(null);
    setStripeInstance(null);
    getStripe()
      .then((s) => {
        if (cancelled) return;
        if (!s) setStripeError("Stripe failed to initialise. Please try again.");
        else setStripeInstance(s);
      })
      .catch((err) => {
        if (cancelled) return;
        setStripeError(
          err instanceof Error ? err.message : "Stripe failed to load. Check your connection and try again."
        );
      });
    return () => {
      cancelled = true;
    };
  }, [clientSecret]);

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    if (clientSecret) return clientSecret;
    throw new Error("No client secret yet");
  }, [clientSecret]);

  const currentPrice = VARIANTS[variant].price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: "Please add your name and email.", variant: "destructive" });
      return;
    }
    if (!form.consent) {
      toast({ title: "Please confirm consent so I can be in touch.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const { data, error } = await supabase.functions.invoke("create-co-design-checkout", {
        body: {
          variant,
          name: form.name.trim(),
          email: form.email.trim(),
          roleOrg: form.roleOrg.trim(),
          focus: form.focus.trim(),
          consent: form.consent,
          source,
          utmSource: params.get("utm_source") ?? "",
          utmMedium: params.get("utm_medium") ?? "",
          utmCampaign: params.get("utm_campaign") ?? "",
          honeypot: form.honeypot,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/co-design/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        },
      });
      if (error) throw error;
      if (!data?.clientSecret) throw new Error(data?.error || "Could not start checkout");
      setClientSecret(data.clientSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast({ title: "Couldn't start checkout", description: msg, variant: "destructive" });
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        data-theme={theme}
        className="notion-canvas w-full sm:max-w-xl overflow-y-auto p-0 bg-background border-l border-hairline text-foreground"
      >
        {!clientSecret ? (
          <div className="relative">
            <div className="relative overflow-hidden border-b border-hairline bg-paper px-6 pb-6 pt-8 sm:px-8">
              <span
                aria-hidden
                className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(closest-side, hsl(var(--indigo)), transparent)" }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-20 top-10 h-48 w-48 rounded-full opacity-25 blur-3xl"
                style={{ background: "radial-gradient(closest-side, hsl(var(--orange)), transparent)" }}
              />
              <SheetHeader className="relative space-y-3 text-left">
                <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-hairline bg-background/70 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider text-ink-soft backdrop-blur">
                  <Sparkles className="h-3 w-3 text-indigo" strokeWidth={2} />
                  Co-Design Session
                </div>
                <SheetTitle className="font-sans not-italic text-3xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[34px]">
                  Build it{" "}
                  <span className="font-serif-pro italic font-normal text-gradient-warm">
                    together, in the room.
                  </span>
                </SheetTitle>
                <SheetDescription className="text-[14.5px] leading-relaxed text-ink-soft">
                  Ninety minutes of shared thinking on a workflow, product, or narrative you're
                  building. Pick a single session to unlock one thing, or a six-session series
                  to build something end-to-end.
                </SheetDescription>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-ink-soft">
                  <li className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo" strokeWidth={2} /> 90 min per session
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-orange" strokeWidth={2} /> Co-created output
                  </li>
                </ul>
              </SheetHeader>
            </div>

            <div className="space-y-6 px-6 py-7 sm:px-8">
              {/* Variant picker */}
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(VARIANTS) as Variant[]).map((key) => {
                  const v = VARIANTS[key];
                  const selected = variant === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setVariant(key)}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-indigo bg-indigo/5 shadow-sm"
                          : "border-hairline bg-card hover:border-indigo/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium">{v.label}</span>
                        {selected && <CheckCircle2 className="h-4 w-4 text-indigo" />}
                      </div>
                      <div className="mt-1 font-sans text-[20px] font-semibold tracking-tight">
                        £{(v.price / 100).toLocaleString()}
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">{v.blurb}</p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-hairline bg-card p-4 text-card-foreground">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-muted-foreground">{VARIANTS[variant].label}</span>
                  <span className="font-sans text-[22px] font-semibold tracking-tight">
                    £{(currentPrice / 100).toLocaleString()}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.honeypot}
                  onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                  aria-hidden="true"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="cd-name">Name *</Label>
                    <Input
                      id="cd-name"
                      required
                      maxLength={120}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cd-email">Email *</Label>
                    <Input
                      id="cd-email"
                      type="email"
                      required
                      maxLength={255}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cd-role">Role &amp; organisation</Label>
                  <Input
                    id="cd-role"
                    placeholder="e.g. Founder, Acme Studio"
                    maxLength={255}
                    value={form.roleOrg}
                    onChange={(e) => setForm({ ...form, roleOrg: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cd-focus">What you'd like to co-design</Label>
                  <Textarea
                    id="cd-focus"
                    rows={4}
                    maxLength={2000}
                    placeholder="A workflow, a product moment, a narrative. Rough is fine."
                    value={form.focus}
                    onChange={(e) => setForm({ ...form, focus: e.target.value })}
                  />
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <Checkbox
                    id="cd-consent"
                    checked={form.consent}
                    onCheckedChange={(v) => setForm({ ...form, consent: v === true })}
                  />
                  <Label
                    htmlFor="cd-consent"
                    className="text-xs font-normal leading-relaxed text-muted-foreground sm:text-sm"
                  >
                    I'm happy for Brendan to contact me about my booking. See the{" "}
                    <a href="/privacy" target="_blank" className="underline">
                      privacy policy
                    </a>
                    .
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="group h-12 w-full text-accent-foreground transition-transform hover:-translate-y-px"
                  style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting checkout…
                    </>
                  ) : (
                    <>
                      Continue to payment
                      <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </span>
                    </>
                  )}
                </Button>

                <p className="inline-flex w-full items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" /> Secure payment via Stripe.
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-background p-4">
            {stripeError ? (
              <div className="mx-auto mt-12 max-w-md space-y-4 rounded-xl border border-hairline bg-card p-6 text-center text-card-foreground">
                <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
                <div className="space-y-1">
                  <p className="font-sans text-lg font-semibold">Payment couldn't load</p>
                  <p className="text-sm text-muted-foreground">{stripeError}</p>
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setClientSecret(null);
                      setStripeError(null);
                      setStripeInstance(null);
                      setSubmitting(false);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      const cs = clientSecret;
                      resetStripeLoader();
                      setStripeInstance(null);
                      setClientSecret(null);
                      setStripeError(null);
                      setTimeout(() => setClientSecret(cs), 50);
                    }}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            ) : !stripeInstance ? (
              <div className="flex min-h-[400px] items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading secure payment…
              </div>
            ) : (
              <EmbeddedCheckoutProvider stripe={stripeInstance} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
