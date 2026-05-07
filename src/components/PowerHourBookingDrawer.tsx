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
import { Loader2, ArrowRight, BadgePercent, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";
import type { Stripe } from "@stripe/stripe-js";

interface PowerHourBookingDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function PowerHourBookingDrawer({
  open,
  onOpenChange,
  source = "charity-meetup-april26",
  defaultCoupon = "",
}: PowerHourBookingDrawerProps) {
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
    if (!open) {
      // Reset on close
      setClientSecret(null);
      setSubmitting(false);
      setStripeError(null);
    }
  }, [open]);

  useEffect(() => {
    setForm((f) => ({ ...f, couponCode: defaultCoupon }));
  }, [defaultCoupon]);

  // Pre-load Stripe.js as soon as we have a clientSecret so we can show
  // a clear error if the Stripe script fails to load (otherwise the
  // EmbeddedCheckout silently renders nothing → white screen).
  useEffect(() => {
    if (!clientSecret) return;
    let cancelled = false;
    setStripeError(null);
    setStripeInstance(null);
    getStripe()
      .then((s) => {
        if (cancelled) return;
        if (!s) {
          setStripeError("Stripe failed to initialise. Please try again.");
        } else {
          setStripeInstance(s);
        }
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
  const couponLooksValid = couponNormalized === "CHARITYMEETUP100";
  const displayedTotal = couponLooksValid ? FULL_PRICE - COUPON_DISCOUNT : FULL_PRICE;

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
      toast({
        title: "Please confirm consent so I can be in touch.",
        variant: "destructive",
      });
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
      if (!data?.clientSecret) {
        throw new Error(data?.error || "Could not start checkout");
      }
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
        className="w-full sm:max-w-xl overflow-y-auto p-0 bg-background"
      >
        {!clientSecret ? (
          <div className="p-6 sm:p-8 space-y-6">
            <SheetHeader className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest text-[hsl(var(--accent))]">
                <BadgePercent className="w-3.5 h-3.5" /> AI Power-Hour
              </div>
              <SheetTitle className="font-serif-pro text-2xl sm:text-3xl font-semibold italic leading-tight">
                Claim your slot
              </SheetTitle>
              <SheetDescription className="text-sm sm:text-base">
                Sixty focused minutes, 1:1 with Brendan. Tell me a bit about you and pay to confirm
                — I'll be in touch within 24h to book a time.
              </SheetDescription>
            </SheetHeader>

            <div className="rounded-xl border bg-card p-4 space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-sans text-muted-foreground">AI Power-Hour</span>
                <span className="font-serif-pro text-xl font-semibold">
                  £{(displayedTotal / 100).toFixed(0)}
                </span>
              </div>
              {couponLooksValid && (
                <div className="flex items-center justify-between text-xs text-[hsl(var(--accent))]">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon CHARITYMEETUP100 — £100 off
                  </span>
                  <span className="line-through text-muted-foreground">£395</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                className="absolute -left-[9999px] w-px h-px opacity-0"
                aria-hidden="true"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ph-name">Name *</Label>
                  <Input
                    id="ph-name"
                    required
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ph-email">Email *</Label>
                  <Input
                    id="ph-email"
                    type="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ph-role">Role &amp; organisation</Label>
                <Input
                  id="ph-role"
                  placeholder="e.g. Head of Comms, Hope Charity"
                  maxLength={255}
                  value={form.roleOrg}
                  onChange={(e) => setForm({ ...form, roleOrg: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ph-focus">What you'd like to focus on</Label>
                <Textarea
                  id="ph-focus"
                  rows={4}
                  maxLength={2000}
                  placeholder="A short note on the AI question or workflow you'd like help with."
                  value={form.focus}
                  onChange={(e) => setForm({ ...form, focus: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ph-coupon" className="inline-flex items-center gap-1.5">
                  <BadgePercent className="w-3.5 h-3.5" /> Coupon code (optional)
                </Label>
                <Input
                  id="ph-coupon"
                  placeholder="Got a code? Add it here"
                  maxLength={40}
                  value={form.couponCode}
                  onChange={(e) =>
                    setForm({ ...form, couponCode: e.target.value.toUpperCase() })
                  }
                  className="uppercase tracking-wider"
                />
                {form.couponCode && !couponLooksValid && (
                  <p className="text-xs text-muted-foreground">
                    We'll check this when you continue.
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 pt-1">
                <Checkbox
                  id="ph-consent"
                  checked={form.consent}
                  onCheckedChange={(v) => setForm({ ...form, consent: v === true })}
                />
                <Label
                  htmlFor="ph-consent"
                  className="text-xs sm:text-sm font-normal text-muted-foreground leading-relaxed"
                >
                  I'm happy for Brendan to contact me about my booking and the Power-Hour. See the{" "}
                  <a href="/privacy" target="_blank" className="underline">
                    privacy policy
                  </a>
                  .
                </Label>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent))]/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Starting checkout…
                  </>
                ) : (
                  <>
                    Continue to payment <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5 justify-center w-full">
                <ShieldCheck className="w-3 h-3" /> Secure payment via Stripe.
              </p>
            </form>
          </div>
        ) : (
          <div className="min-h-screen bg-background p-4">
            {stripeError ? (
              <div className="max-w-md mx-auto mt-12 rounded-xl border bg-card p-6 text-center space-y-4">
                <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
                <div className="space-y-1">
                  <p className="font-serif-pro text-lg font-semibold">Payment couldn't load</p>
                  <p className="text-sm text-muted-foreground">{stripeError}</p>
                  <p className="text-xs text-muted-foreground">
                    This can happen if Stripe is blocked by browser settings, a content security rule,
                    or a temporary connection issue. Please try again, or use another browser if it persists.
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
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
              <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading secure payment…
              </div>
            ) : (
              <EmbeddedCheckoutProvider
                stripe={stripeInstance}
                options={{ fetchClientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
