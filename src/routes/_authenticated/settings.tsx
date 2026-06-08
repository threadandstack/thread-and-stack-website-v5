import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  component: Settings,
});

function Settings() {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }
  return (
    <main className="relative min-h-[100dvh] bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-hairline px-6 py-5">
        <Link to="/capture" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Capture
        </Link>
        <h1 className="font-serif-pro text-2xl italic">settings</h1>
        <div className="w-16" />
      </header>
      <div className="mx-auto max-w-md space-y-6 px-6 py-10">
        <section>
          <h2 className="mb-2 text-xs uppercase tracking-wider text-ink-soft">Notion</h2>
          <div className="rounded-lg border border-hairline bg-paper/40 p-4 text-sm text-ink-soft">
            Notion destination is configured on your first sync.
          </div>
        </section>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-md border border-hairline px-4 py-2 text-sm text-foreground hover:bg-paper"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </main>
  );
}
