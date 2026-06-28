import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, Mic, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/capture" });
  },
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden className="aurora"><span /></div>
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          maskImage: "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 pb-16 pt-20 text-center md:pt-28">
        <div className="fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/60 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-ink-soft backdrop-blur">
          <Sparkles className="h-3 w-3 text-clay" />
          voice → Notion
        </div>

        <h1 className="fade-up fade-up-1 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.035em] md:text-[84px]">
          Think out loud.
          <br />
          <span className="font-serif-pro italic font-normal text-gradient-warm text-5xl md:text-7xl">
            Land in your brain.
          </span>
        </h1>

        <p className="fade-up fade-up-2 mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft">
          One tap to record. Whisper-fast transcription, auto-tagged, auto-titled,
          and filed in your Notion the moment you stop talking.
        </p>

        <div className="fade-up fade-up-3 mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/auth"
            className="group inline-flex h-12 items-center rounded-md bg-gradient-warm px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-px"
          >
            <Mic className="mr-2 h-4 w-4" />
            Start recording
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="fade-up fade-up-5 mt-20 grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { n: "01", t: "Tap & talk", d: "Up to 10 minutes per note. Live waveform, big timer." },
            { n: "02", t: "Auto-formatted", d: "Title, summary, body, subject and tags inferred." },
            { n: "03", t: "Synced to Notion", d: "Lands in your Brain DB with timestamp and source." },
          ].map((f) => (
            <div key={f.n} className="rounded-xl border border-hairline bg-paper/40 p-5 text-left backdrop-blur">
              <div className="font-serif-pro text-2xl italic text-clay">{f.n}</div>
              <div className="mt-2 text-sm font-medium text-foreground">{f.t}</div>
              <div className="mt-1 text-xs text-ink-soft">{f.d}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
