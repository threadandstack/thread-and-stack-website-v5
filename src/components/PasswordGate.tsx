import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import * as analytics from "@/hooks/useAnalytics";
import { toast } from "sonner";
import BlackWordmark from "@/assets/logos/Black_TS_Wordmark.svg";

interface PasswordGateProps {
  storageKey: string;
  portfolio: string;
  children: React.ReactNode;
}

export const PasswordGate = ({ storageKey, portfolio, children }: PasswordGateProps) => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(storageKey) === "true");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Request access form state
  const [requestOpen, setRequestOpen] = useState(false);
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-portfolio-password", {
        body: { password: value.trim(), portfolio, userAgent: navigator.userAgent },
      });

      if (fnError || !data?.valid) {
        setError(true);
        setTimeout(() => setError(false), 1500);
      } else {
        sessionStorage.setItem(storageKey, "true");
        if (data.label) {
          sessionStorage.setItem(`${storageKey}-source`, data.label);
          analytics.trackEvent("portfolio_unlocked", { source: data.label, portfolio });
        }
        setUnlocked(true);
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot trap
    if (!reqEmail.trim() || !reqName.trim()) return;

    setReqLoading(true);
    try {
      const leadData = {
        email: reqEmail.trim(),
        name: reqName.trim(),
        message: reqMessage.trim() || null,
        source: `portfolio-access-request:${portfolio}`,
      };

      const { error: insertError } = await supabase.from("leads").insert(leadData);
      if (insertError) throw insertError;

      // Sync to Notion (fire-and-forget)
      supabase.functions.invoke("sync-lead-to-notion", { body: leadData }).catch(() => {});

      analytics.trackEvent("portfolio_access_requested", { portfolio });
      toast.success("Request sent! I'll be in touch soon.");
      setRequestOpen(false);
      setReqName("");
      setReqEmail("");
      setReqMessage("");
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setReqLoading(false);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <img src={BlackWordmark} alt="Thread & Stack" className="h-16 md:h-20 mb-12" />
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground mb-1">Password Required</h1>
          <p className="text-sm text-muted-foreground">Enter the password to view this portfolio.</p>
        </div>
        <Input
          type="password"
          placeholder="Password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={error ? "border-destructive" : ""}
          autoFocus
        />
        {error && <p className="text-sm text-destructive">Incorrect password</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock"}
        </Button>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setRequestOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Request access
          </button>
        </div>
      </form>

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Access</DialogTitle>
            <DialogDescription>
              Let me know who you are and I'll send you the password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestAccess} className="space-y-4">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] opacity-0"
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="space-y-2">
              <Label htmlFor="req-name">Name</Label>
              <Input
                id="req-name"
                placeholder="Your name"
                value={reqName}
                onChange={(e) => setReqName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-email">Email</Label>
              <Input
                id="req-email"
                type="email"
                placeholder="you@example.com"
                value={reqEmail}
                onChange={(e) => setReqEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-message">Message (optional)</Label>
              <Textarea
                id="req-message"
                placeholder="What brings you here?"
                value={reqMessage}
                onChange={(e) => setReqMessage(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full" disabled={reqLoading}>
              {reqLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
