import { useState, useEffect, useRef } from "react";
import { Check, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const tiers = [
  {
    n: "01",
    name: "Co-Design Sprint",
    price: "£2,500",
    sub: "Six weeks · 60 days async support",
    blurb:
      "For founders and functional owners building their own Notion OS. You have a clear goal and are ready to build. What you need is structure, a thinking partner, and someone who can help you navigate the harder parts. We meet weekly, you build between sessions, and the system that emerges is genuinely yours.",
    features: [
      "Six weekly one-hour sessions",
      "Session prep and follow-up",
      "Resources and templates as we go",
      "60 days async Slack access",
    ],
    cta: "Start a sprint",
    accent: "violet",
    featured: false,
  },
  {
    n: "02",
    name: "Knowledge Base Starter",
    price: "from £5,400",
    sub: "Includes 30 days adoption support",
    blurb:
      "For small teams ready to consolidate properly. The essential workspace. A company HQ everyone lands in, a knowledge base the team can actually find things in, a CRM that replaces whatever fragmented system you're currently routing through one person. Clean, connected, and built to be used.",
    features: [
      "Company HQ and team spaces",
      "Knowledge base and wiki",
      "CRM build",
      "Core automations",
      "Team training sessions",
      "Async Slack access",
      "30 days adoption support",
    ],
    cta: "Scope a starter",
    accent: "sky",
    featured: false,
  },
  {
    n: "03",
    name: "Infrastructure Build",
    price: "from £8,500",
    sub: "Includes 60 days adoption support",
    blurb:
      "For teams ready to consolidate properly and wire in AI. The full build. Everything in the Starter, plus a custom AI assistant configured specifically for your organisation, purpose-built agents for the tasks that currently route through a person, and automations that handle the mechanical work quietly in the background.",
    features: [
      "Full workspace build",
      "Custom AI assistant",
      "Purpose-built agents",
      "Workflow automations",
      "Client or field-facing interfaces",
      "Data migration included",
      "Team training sessions",
      "Async Slack access",
      "60 days adoption support",
    ],
    cta: "Scope a build",
    accent: "orange",
    featured: true,
    badge: "Most chosen",
  },
  {
    n: "04",
    name: "Bespoke System",
    price: "On application",
    sub: "Includes 90 days adoption support",
    blurb:
      "For ops-heavy organisations with multiple teams and complex needs. When the scope reaches across multiple teams, each with their own complex requirements, a standard tier stops making sense. Phased rollout, bespoke agents built for live operations, and a support period long enough to see the system properly embedded.",
    features: [
      "Multi-team workspace architecture",
      "Bespoke agents for live ops",
      "Complex integrations",
      "Phased rollout",
      "Full data migration",
      "Team training across functions",
      "Async Slack access",
      "90 days adoption support",
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
    <section id="engagements">
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-28">




        <div
          ref={stageRef}
          className="relative my-6 h-[680px] overflow-hidden [perspective:1800px] select-none md:my-0 md:h-[640px] md:overflow-visible"
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
              const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
              const angle = offset * (isMobile ? 28 : 38);
              const translateX = offset * (isMobile ? 180 : 260);
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
                  className={`absolute left-1/2 top-1/2 flex w-[280px] flex-col gap-5 rounded-2xl p-6 text-left [backface-visibility:hidden] sm:w-[340px] sm:p-7 md:w-[400px] md:p-8 ${
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
                      className="group mt-auto inline-flex h-11 items-center justify-center rounded-md px-5 text-[13.5px] font-medium text-accent-foreground transition-transform hover:-translate-y-px"
                      style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                    >
                      {t.cta}
                      <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-4 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </span>
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

      </div>
    </section>
  );
}
