import { Compass, Hammer, Rocket, Repeat } from "lucide-react";

const phases = [
  {
    icon: Compass,
    color: "sky",
    title: "Diagnose",
    duration: "Paid Stack Diagnostic · 90 min + blueprint",
    body:
      "We map the tools, the data, the people, and where the leader has become the routing layer. You leave with a written plan. Credited against whatever build comes next.",
  },
  {
    icon: Hammer,
    color: "orange",
    title: "Build",
    duration: "Notion as your knowledge lake",
    body:
      "We build Notion as your knowledge lake, with connecting streams set up to all your vital tools. The work happens in your workspace, in public, with every decision documented.",
  },
  {
    icon: Rocket,
    color: "violet",
    title: "Launch",
    duration: "30–90 days of adoption support",
    body:
      "Every package includes 30–90 days of built-in adoption support and guidance. Training, async access, and a Loom library so the team actually uses what we've built.",
  },
  {
    icon: Repeat,
    color: "indigo",
    title: "Compound",
    duration: "Rolling Stack Support · no tie-in",
    body:
      "The more you use the system, the deeper the lake becomes — filling with knowledge, resource, and value. Async access, scaled per half-day, cancel any month.",
  },
] as const;

export function Problem() {
  return (
    <section id="how" className="border-b border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
              The pattern
            </div>
            <h2 className="font-sans not-italic mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.025em] md:text-[56px]">
              The <span className="font-serif-pro italic text-clay text-7xl">Thread & Stack</span> Way
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-ink-soft">
            An intentional approach to your knowledge stack. A connected journey
            — each step earns the next.
          </p>
        </div>

        {/* Curvy path (desktop) */}
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 right-0 top-0 hidden h-20 w-full md:block"
          >
            <defs>
              <linearGradient id="phaseFlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--sky))" />
                <stop offset="33%" stopColor="hsl(var(--orange))" />
                <stop offset="66%" stopColor="hsl(var(--violet))" />
                <stop offset="100%" stopColor="hsl(var(--indigo))" />
              </linearGradient>
            </defs>
            <path
              d="M 125 40 C 200 -20, 300 100, 375 40 S 550 -20, 625 40 S 800 100, 875 40"
              fill="none"
              stroke="url(#phaseFlow)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="2 6"
              opacity="0.7"
            />
          </svg>

          <ol className="relative grid gap-12 md:grid-cols-4 md:gap-6">
            {phases.map((p) => {
              const Icon = p.icon;
              return (
                <li
                  key={p.title}
                  className="group relative flex flex-col items-center text-center"
                  style={{ ["--c" as string]: `hsl(var(--${p.color}))` }}
                >
                  {/* Circle node */}
                  <span
                    className="relative z-10 grid h-20 w-20 place-items-center rounded-full border bg-background shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] transition-transform group-hover:-translate-y-0.5"
                    style={{ borderColor: "var(--c)", color: "var(--c)" }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full opacity-15"
                      style={{ background: "var(--c)" }}
                    />
                    <Icon className="relative h-7 w-7" strokeWidth={1.5} />
                  </span>

                  <div className="mt-6 max-w-[260px]">
                    <h3 className="text-[20px] font-medium tracking-tight">
                      {p.title}
                    </h3>
                    <div
                      className="mt-1 text-[11.5px] uppercase tracking-wider"
                      style={{ color: "var(--c)" }}
                    >
                      {p.duration}
                    </div>
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                      {p.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
