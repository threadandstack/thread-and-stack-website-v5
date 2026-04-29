import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PillButton } from "@/components/ui/pill-button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Footer } from "@/components/Footer";
import WhiteLogo from "@/assets/thread-stack-logo-white.png";

type State = "loading" | "valid" | "already" | "invalid" | "submitting" | "done" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } },
        );
        const data = await res.json();
        if (res.ok && data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch {
        setState("error");
      }
    })();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setState("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success || data?.reason === "already_unsubscribed") setState("done");
      else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:py-20 space-y-8">
        <img src={WhiteLogo} alt="Thread & Stack" className="h-12 sm:h-14 opacity-80" />

        <div className="rounded-xl border bg-card p-6 sm:p-8 space-y-5">
          {state === "loading" && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> Checking your link…
            </div>
          )}

          {state === "valid" && (
            <>
              <h1 className="font-serif-pro text-2xl sm:text-3xl font-semibold italic">
                Unsubscribe from Thread & Stack emails?
              </h1>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                You'll stop receiving transactional emails from this address. You can always re-subscribe by
                contacting br@brendanrodgers.uk.
              </p>
              <PillButton onClick={handleConfirm}>Confirm unsubscribe</PillButton>
            </>
          )}

          {state === "submitting" && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> Processing…
            </div>
          )}

          {state === "already" && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4" /> Already unsubscribed
              </div>
              <p className="text-sm text-muted-foreground">
                This address is already on the unsubscribe list. No further action needed.
              </p>
            </div>
          )}

          {state === "done" && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-[hsl(var(--accent))]">
                <CheckCircle2 className="w-5 h-5" />{" "}
                <span className="font-sans text-sm uppercase tracking-widest">Unsubscribed</span>
              </div>
              <h1 className="font-serif-pro text-2xl font-semibold italic">You're off the list.</h1>
              <p className="text-sm text-muted-foreground">
                Sorry to see you go. If this was a mistake, just email br@brendanrodgers.uk.
              </p>
            </div>
          )}

          {state === "invalid" && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />{" "}
                <span className="font-sans text-sm uppercase tracking-widest">Invalid link</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This unsubscribe link isn't valid or has expired. If you'd like to be removed, email
                br@brendanrodgers.uk and I'll sort it.
              </p>
            </div>
          )}

          {state === "error" && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />{" "}
                <span className="font-sans text-sm uppercase tracking-widest">Something went wrong</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Please try again or email br@brendanrodgers.uk to be removed manually.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
