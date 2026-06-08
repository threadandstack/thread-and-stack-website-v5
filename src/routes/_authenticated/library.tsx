import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/library")({
  component: Library,
});

function Library() {
  return (
    <main className="relative min-h-[100dvh] bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-hairline px-6 py-5">
        <Link to="/capture" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Capture
        </Link>
        <h1 className="font-serif-pro text-2xl italic">library</h1>
        <div className="w-16" />
      </header>
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <p className="text-sm text-ink-soft">Your notes will appear here.</p>
      </div>
    </main>
  );
}
