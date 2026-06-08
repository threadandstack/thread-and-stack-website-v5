import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Mic } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/capture` },
        });
        if (error) throw error;
        toast.success("Account created. You're in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/capture" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden className="aurora"><span /></div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <Link to="/" className="fade-up mb-8 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-foreground">
          <Mic className="h-4 w-4 text-clay" />
          <span className="font-serif-pro italic">brain</span>
        </Link>

        <h1 className="fade-up fade-up-1 text-4xl font-semibold tracking-[-0.03em]">
          {mode === "signin" ? "Welcome back." : (
            <>
              <span>Make a </span>
              <span className="font-serif-pro italic text-gradient-warm">brain.</span>
            </>
          )}
        </h1>
        <p className="fade-up fade-up-2 mt-2 text-sm text-ink-soft">
          {mode === "signin" ? "Sign in to keep capturing." : "An email and password is all we need."}
        </p>

        <form onSubmit={submit} className="fade-up fade-up-3 mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-hairline bg-paper/60 px-3 py-2.5 text-sm text-foreground placeholder:text-ink-soft/60 focus:border-clay focus:outline-none"
              placeholder="you@domain.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-hairline bg-paper/60 px-3 py-2.5 text-sm text-foreground focus:border-clay focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group inline-flex h-11 w-full items-center justify-center rounded-md bg-gradient-warm px-5 text-sm font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-px disabled:opacity-60"
          >
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="fade-up fade-up-4 mt-6 text-center text-xs text-ink-soft hover:text-foreground"
        >
          {mode === "signin" ? "Don't have an account? Sign up" : "Already have one? Sign in"}
        </button>
      </div>
    </main>
  );
}
