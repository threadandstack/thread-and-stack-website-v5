import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/hooks/useAnalytics";

interface PasswordGateProps {
  storageKey: string;
  portfolio: string;
  children: React.ReactNode;
}

export const PasswordGate = ({ storageKey, children }: PasswordGateProps) => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(storageKey) === "true");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-portfolio-password", {
        body: { password: value.trim() },
      });

      if (fnError || !data?.valid) {
        setError(true);
        setTimeout(() => setError(false), 1500);
      } else {
        sessionStorage.setItem(storageKey, "true");
        setUnlocked(true);
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 1500);
    } finally {
      setLoading(false);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
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
      </form>
    </div>
  );
};
