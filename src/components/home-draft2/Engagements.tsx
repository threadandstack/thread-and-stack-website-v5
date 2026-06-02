import { useState, useEffect, useRef } from "react";
import { Check, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const tiers = [
  {
    n: "01",
    name: "Co-Design Sprint",
    price: "£2,000",
    sub: "6 weeks · weekly check-ins",
    blurb:
      "We design and build the system together. You learn the patterns, your team feels the shift, and the work stays in your hands. For founders and team leads who want to own the craft, not just the output.",
    features: [
      "Weekly 1:1 working sessions",
      "Co-built in your Notion",
      "Async access between calls",
      "Practice library you keep",
    ],
    cta: "Start a sprint",
    accent: "violet",
    featured: false,
  },
  {
    n: "02",
    name: "Knowledge Lake Starter",
    price: "from £3,400",
    sub: "~2 weeks · fixed scope · support included",
    blurb:
      "One core system built around the lake, plus one purpose-built agent wired in. The fastest way to feel what an intentional stack actually does. 30 days of adoption support baked in.",
    features: [
      "One core system (wiki · CRM · projects)",
      "One custom agent",
      "Team walkthrough + Loom library",
      "30 days adoption support included",
    ],
    cta: "Scope a starter",
    accent: "sky",
    featured: false,
  },
  {
    n: "03",
    name: "Knowledge Infrastructure Build",
    price: "from £6,900",
    sub: "scoped · phased · support included",
    blurb:
      "The full five-layer Knowledge Lake in your Notion — Claude reasoning wired in, custom agents around it, automations doing the dumb mechanical work. For teams ready to consolidate properly.",
    features: [
      "Deep Discovery blueprint",
      "Full five-layer build",
      "Claude + Cowork + custom agents",
      "Team training + Loom library",
      "60 days adoption support included",
    ],
    cta: "Scope a build",
    accent: "orange",
    featured: true,
    badge: "Most chosen",
  },
  {
    n: "04",
    name: "Bespoke Systems",
    price: "On application",
    sub: "multi-team · scoped to your needs",
    blurb:
      "For ops-heavy organisations untangling years of tool sprawl across multiple teams. Stack consolidation, safe data migration, custom agents for live operations, phased rollout, 90 days of adoption support.",
    features: [
      "Stack consolidation",
      "Safe data migration",
      "Bespoke agents for live ops",
      "Multi-team rollout",
      "90 days adoption support included",
    ],
    cta: "Request a scope",
    accent: "clay",
    featured: false,
  },
] as const;

export function Engagements() {
  const [selected, setSelected] = useState(2);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!stageRef.current) return;
      const inView = stageRef.current.getBoundingClientRect();
      if (inView.bottom < 0 || inView.top > window.innerHeight) return;
      if (e.key === "ArrowRight") setSelected((s) => (s + 1) % tiers.length);
      if (e.key === "ArrowLeft") setSelected((s) => (s - 1 + tiers.length) % tiers.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="engagements" className="border-b border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-28">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
              Engagements
            </div>
            <h2 className="font-sans not-italic mt-5 max-w-2xl text-4xl font-semibold leading-[1.03] tracking-[-0.025em] md:text-[52px]">
              Four ways <span className="font-serif-pro italic text-clay text-3xl">forward.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14.5px] text-ink-soft">
            One offer in focus at a time. Click, drag, or use the arrow keys to cycle through.
          </p>
        </div>

        <div
          ref={stageRef}
          className="relative h-[600px] [perspective:1800px] select-none md:h-[640px]"
          style={{ touchAction: "pan-y" }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            (e.currentTarget as any)._tsx = t.clientX;
            (e.currentTarget as any)._tsy = t.clientY;
            (e.currentTarget as any)._tsLocked = false;
          }}
          onTouchMove={(e) => {
            const el = e.currentTarget as any;
            if (el._tsx == null) return;
            const dx = e.touches[0].clientX - el._tsx;
            const dy = e.touches[0].clientY - el._tsy;
            if (!el._tsLocked && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) el._tsLocked = true;
            if (el._tsLocked && e.cancelable) e.preventDefault();
          }}
          onTouchEnd={(e) => {
            const el = e.currentTarget as any;
            if (el._tsx == null) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - el._tsx;
            const dy = t.clientY - el._tsy;
            el._tsx = null;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
              if (dx < 0) setSelected((s) => (s + 1) % tiers.length);
              else setSelected((s) => (s - 1 + tiers.length) % tiers.length);
            }
          }}
        >
          <div className="absolute inset-0 [transform-style:preserve-3d]">
            {tiers.map((t, index) => {
              const len = tiers.length;
              let offset = index - selected;
              if (offset > len / 2) offset -= len;
              if (offset < -len / 2) offset += len;
              const abs = Math.abs(offset);
              const isActive = offset === 0;
              const angle = offset * 38;
              const translateX = offset * 260;
              const translateZ = isActive ? 0 : -180 - (abs - 1) * 80;
              const scale = isActive ? 1.02 : 0.9;
              const opacity = abs > 1 ? 0 : isActive ? 1 : 0.45;
              const isFeatured = t.featured;
              return (
                <button
                  type="button"
                  key={t.n}
                  onClick={() => { if (!isActive) setSelected(index); }}
                  aria-label={`Show ${t.name}`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${-angle}deg) scale(${scale})`,
                    opacity,
                    zIndex: 20 - abs,
                    transition: "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 500ms ease, box-shadow 500ms ease",
                    pointerEvents: abs > 1 ? "none" : "auto",
                    ["--c" as string]: `hsl(var(--${t.accent}))`,
                  }}
                  className={`absolute left-1/2 top-1/2 flex w-[340px] flex-col gap-5 rounded-2xl p-7 text-left [backface-visibility:hidden] md:w-[400px] md:p-8 ${
                    isFeatured ? "bg-card text-card-foreground" : "bg-background text-foreground"
                  } ${
                    isActive
                      ? "shadow-[0_30px_70px_rgba(0,0,0,0.28)] ring-1 ring-foreground/15"
                      : "shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
                  }`}
                >
                  {isFeatured && "badge" in t && t.badge && (
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider transition-all ${
                        isActive ? "text-accent-foreground" : "bg-foreground/10 text-foreground/70"
                      }`}
                      style={isActive ? { backgroundImage: "linear-gradient(90deg, var(--gradient-3color-even))" } : undefined}
                    >
                      <Sparkles className="h-3 w-3" strokeWidth={2} />
                      {t.badge}
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: "var(--c)" }}>
                      {t.n}
                    </span>
                    <span className={`text-[11.5px] uppercase tracking-wider ${isFeatured ? "text-foreground/55" : "text-muted-foreground"}`}>
                      {t.sub.split(" · ")[0]}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[20px] font-medium tracking-tight md:text-[22px]">{t.name}</h3>
                    <div className="mt-2 text-[34px] font-medium leading-none tracking-[-0.03em] md:text-[40px]">{t.price}</div>
                    <div className={`mt-1.5 text-[12px] ${isFeatured ? "text-foreground/55" : "text-muted-foreground"}`}>
                      {t.sub}
                    </div>
                  </div>

                  <p className={`text-[13.5px] leading-relaxed ${isFeatured ? "text-foreground/75" : "text-ink-soft"}`}>
                    {t.blurb}
                  </p>

                  <div className={`h-px ${isFeatured ? "bg-foreground/15" : "bg-hairline"}`} />

                  <ul className={`flex flex-col gap-2 text-[13px] ${isFeatured ? "text-foreground/85" : "text-ink-soft"}`}>
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--c)" }} strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isActive ? (
                    <a
                      href="#contact"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-auto inline-flex h-11 items-center justify-center rounded-md px-5 text-[13.5px] font-medium text-accent-foreground transition-transform hover:-translate-y-px"
                      style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                    >
                      {t.cta} →
                    </a>
                  ) : (
                    <span className={`mt-auto inline-flex h-11 items-center justify-center rounded-md border px-5 text-[13.5px] font-medium ${
                      isFeatured ? "border-white/15 text-foreground/80" : "border-hairline text-foreground/70"
                    }`}>
                      Tap to focus
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setSelected((s) => (s - 1 + tiers.length) % tiers.length)}
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-background shadow-lg hover:bg-paper md:flex lg:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setSelected((s) => (s + 1) % tiers.length)}
            aria-label="Next"
            className="absolute right-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-background shadow-lg hover:bg-paper md:flex lg:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-hairline bg-background p-7 md:p-10">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(closest-side, hsl(var(--indigo)), transparent)" }}
          />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo/10 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider text-indigo">
                  <Sparkles className="h-3 w-3" strokeWidth={2} /> Start here
                </span>
                <span className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
                  Stack Diagnostic · £395
                </span>
              </div>
              <h2 className="mt-4 max-w-xl text-[28px] font-medium leading-tight tracking-tight md:text-[36px] font-sans">
                A paid 90-minute session.{" "}
                <span className="font-serif-pro italic text-clay text-3xl">A written blueprint.</span>
              </h2>
              <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-soft">
                Bring your stack, your sprawl, and the questions your team keeps asking.
                Leave with a plan you could execute alone. Credited in full against any
                build you choose afterwards.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-[14.5px] font-medium text-accent-foreground transition-transform hover:-translate-y-px"
              style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
            >
              Book the Diagnostic <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
