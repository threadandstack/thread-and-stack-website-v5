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
  BadgePercent,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Clock,
  FileText,
} from "lucide-react";
import type { Stripe } from "@stripe/stripe-js";

interface DiagnosticDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: "dark" | "light";
  source?: string;
  defaultCoupon?: string;
}

const FULL_PRICE = 39500;

type CouponDef =
  | { kind: "amount"; amountOff: number; label: string }
  | { kind: "percent"; percentOff: number; label: string };

const COUPONS: Record<string, CouponDef> = {
  CHARITYMEETUP100: { kind: "amount", amountOff: 10000, label: "£100 off" },
  IMPACT15: { kind: "percent", percentOff: 15, label: "15% off" },
};

function applyCoupon(coupon: CouponDef | null): number {
  if (!coupon) return FULL_PRICE;
  if (coupon.kind === "amount") return Math.max(0, FULL_PRICE - coupon.amountOff);
  return Math.round(FULL_PRICE * (1 - coupon.percentOff / 100));
}

export function DiagnosticDrawer({
  open,
  onOpenChange,
  theme,
  source = "home-draft2-diagnostic",
  defaultCoupon = "",
}: DiagnosticDrawerProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    roleOrg: "",
    focus: "",
    couponCode: defaultCoupon,
    consent: false,
    honeypot: "",
  });

  useEffect(() => {
    setForm((f) => ({ ...f, couponCode: defaultCoupon }));
  }, [defaultCoupon]);

  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setSubmitting(false);
      setStripeError(null);
    }
  }, [open]);

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

  const couponNormalized = form.couponCode.trim().toUpperCase();
  const matchedCoupon = COUPONS[couponNormalized] ?? null;
  const couponLooksValid = matchedCoupon !== null;
  const displayedTotal = applyCoupon(matchedCoupon);

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    if (clientSecret) return clientSecret;
    throw new Error("No client secret yet");
  }, [clientSecret]);

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
      const { data, error } = await supabase.functions.invoke("create-power-hour-checkout", {
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          roleOrg: form.roleOrg.trim(),
          focus: form.focus.trim(),
          couponCode: form.couponCode.trim(),
          consent: form.consent,
          source,
          utmSource: params.get("utm_source") ?? "",
          utmMedium: params.get("utm_medium") ?? "",
          utmCampaign: params.get("utm_campaign") ?? "",
          honeypot: form.honeypot,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/power-hour/thank-you?session_id={CHECKOUT_SESSION_ID}`,
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
            {/* Themed header band */}
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
                  Stack Diagnostic
                </div>
                <SheetTitle className="font-sans not-italic text-3xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[34px]">
                  Book your{" "}
                  <span className="font-serif-pro italic font-normal text-clay">
                    90-minute session to create meaningful change.
                  </span>
                </SheetTitle>
                <SheetDescription className="text-[14.5px] leading-relaxed text-ink-soft">
                  One paid session. A written blueprint within 48 hours. Credited in full
                  against any build you choose afterwards.
                </SheetDescription>

                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-ink-soft">
                  <li className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo" strokeWidth={2} /> 90 min live
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-violet" strokeWidth={2} /> Written blueprint
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-orange" strokeWidth={2} /> Credited against builds
                  </li>
                </ul>
              </SheetHeader>
            </div>

            <div className="space-y-6 px-6 py-7 sm:px-8">
              <div className="rounded-xl border border-hairline bg-card p-4 text-card-foreground">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-muted-foreground">Stack Diagnostic</span>
                  <span className="font-sans text-[22px] font-semibold tracking-tight">
                    £{(displayedTotal / 100).toFixed(2).replace(/\.00$/, "")}
                  </span>
                </div>
                {matchedCoupon && (
                  <div className="mt-1.5 flex items-center justify-between text-[12px] text-indigo">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Coupon {couponNormalized} — {matchedCoupon.label}
                    </span>
                    <span className="line-through text-muted-foreground">£395</span>
                  </div>
                )}
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
                    <Label htmlFor="diag-name">Name *</Label>
                    <Input
                      id="diag-name"
                      required
                      maxLength={120}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="diag-email">Email *</Label>
                    <Input
                      id="diag-email"
                      type="email"
                      required
                      maxLength={255}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="diag-role">Role &amp; organisation</Label>
                  <Input
                    id="diag-role"
                    placeholder="e.g. Founder, Acme Studio"
                    maxLength={255}
                    value={form.roleOrg}
                    onChange={(e) => setForm({ ...form, roleOrg: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="diag-focus">What you'd like to focus on</Label>
                  <Textarea
                    id="diag-focus"
                    rows={4}
                    maxLength={2000}
                    placeholder="Your stack, your sprawl, and the questions your team keeps asking."
                    value={form.focus}
                    onChange={(e) => setForm({ ...form, focus: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="diag-coupon" className="inline-flex items-center gap-1.5">
                    <BadgePercent className="h-3.5 w-3.5" /> Coupon code (optional)
                  </Label>
                  <Input
                    id="diag-coupon"
                    placeholder="Got a code? Add it here"
                    maxLength={40}
                    value={form.couponCode}
                    onChange={(e) =>
                      setForm({ ...form, couponCode: e.target.value.toUpperCase() })
                    }
                    className="uppercase tracking-wider"
                  />
                  {form.couponCode && !couponLooksValid && (
                    <p className="text-[11.5px] text-muted-foreground">
                      We'll check this when you continue.
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <Checkbox
                    id="diag-consent"
                    checked={form.consent}
                    onCheckedChange={(v) => setForm({ ...form, consent: v === true })}
                  />
                  <Label
                    htmlFor="diag-consent"
                    className="text-xs font-normal leading-relaxed text-muted-foreground sm:text-sm"
                  >
                    I'm happy for Brendan to contact me about my booking and the Diagnostic. See the{" "}
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
                  <p className="text-xs text-muted-foreground">
                    This can happen if Stripe is blocked by browser settings or a temporary connection issue.
                  </p>
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
