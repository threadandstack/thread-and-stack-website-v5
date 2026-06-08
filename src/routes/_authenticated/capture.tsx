import { createFileRoute, Link } from "@tanstack/react-router";
import { Library, Settings as SettingsIcon } from "lucide-react";
import { CaptureScreen } from "@/components/capture/CaptureScreen";

export const Route = createFileRoute("/_authenticated/capture")({
  component: Capture,
});

function Capture() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <div aria-hidden className="aurora"><span /></div>
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 85%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 pt-6">
        <Link to="/capture" className="font-serif-pro text-2xl italic text-foreground">brain</Link>
        <nav className="flex items-center gap-1">
          <Link to="/library" className="rounded-md p-2 text-ink-soft transition-colors hover:bg-paper/60 hover:text-foreground" aria-label="Library">
            <Library className="h-5 w-5" />
          </Link>
          <Link to="/settings" className="rounded-md p-2 text-ink-soft transition-colors hover:bg-paper/60 hover:text-foreground" aria-label="Settings">
            <SettingsIcon className="h-5 w-5" />
          </Link>
        </nav>
      </header>

      <div className="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-6">
        <CaptureScreen />
      </div>
    </main>
  );
}
