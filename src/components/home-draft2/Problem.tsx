import { Compass, Hammer, Rocket, Repeat } from "lucide-react";

const phases = [
  {
    n: "01",
    icon: Compass,
    color: "indigo",
    title: "Diagnose",
    duration: "Paid Stack Diagnostic · 90 min + blueprint",
    body:
      "We map the tools, the data, the people, and where the leader has become the routing layer. You leave with a written plan. Credited against whatever build comes next.",
    bullets: ["Stack + knowledge audit", "Architecture sketch", "Phased proposal"],
  },
  {
    n: "02",
    icon: Hammer,
    color: "orange",
    title: "Build",
    duration: "Notion as your knowledge lake",
    body:
      "We build Notion as your knowledge lake, with connecting streams set up to all your vital tools. The work happens in your workspace, in public, with every decision documented.",
    bullets: ["Notion-native build", "Connected streams", "Claude + custom agents"],
  },
  {
    n: "03",
    icon: Rocket,
    color: "violet",
    title: "Launch",
    duration: "30–90 days of adoption support",
    body:
      "Every package includes 30–90 days of built-in adoption support and guidance. Training, async access, and a Loom library so the team actually uses what we've built.",
    bullets: ["Adoption support", "Team training", "Loom library"],
  },
  {
    n: "04",
    icon: Repeat,
    color: "sky",
    title: "Compound",
    duration: "Rolling Stack Support · no tie-in",
    body:
      "The more you use the system, the deeper the lake becomes — filling with knowledge, resource, and value. Async access, scaled per half-day, cancel any month.",
    bullets: ["From £495/mo", "Cancel anytime", "Async + half-day"],
  },
] as const;

export function Problem() {
  return (
    <section id="how" className="border-b border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
              The pattern
            </div>
            <h2 className="mt-5 text-4xl font-medium leading-[1.03] tracking-[-0.025em] md:text-[56px]">
              The <span className="font-serif-pro italic text-clay">Thread & Stack</span> Way
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-ink-soft">
            An intentional approach to your knowledge stack. Built in four phases
            — each one earns the next.
          </p>
        </div>

        {/* Timeline */}
        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {/* Horizontal rail (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px md:block"
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsl(var(--indigo)) 0%, hsl(var(--orange)) 33%, hsl(var(--violet)) 66%, hsl(var(--sky)) 100%)",
              opacity: 0.5,
            }}
          />

          {phases.map((p) => {
            const Icon = p.icon;
            return (
              <li
                key={p.n}
                className="group relative flex flex-col gap-4"
                style={{ ["--c" as string]: `hsl(var(--${p.color}))` }}
              >
                {/* Node marker */}
                <div className="relative flex items-center gap-3 md:block">
                  <span
                    className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-hairline bg-background shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]"
                    style={{ color: "var(--c)" }}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>
                  <span
                    className="text-[11px] font-medium uppercase tracking-[0.18em] md:absolute md:right-0 md:top-3"
                    style={{ color: "var(--c)" }}
                  >
                    {p.n}
                  </span>
                </div>

                {/* Card */}
                <div className="relative flex flex-1 flex-col gap-3 overflow-hidden rounded-2xl border border-hairline bg-background p-5 md:p-6">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-40"
                    style={{
                      background:
                        "radial-gradient(closest-side, var(--c), transparent)",
                    }}
                  />
                  <div className="relative">
                    <h3 className="text-[20px] font-medium tracking-tight">
                      {p.title}
                    </h3>
                    <div className="mt-0.5 text-[11.5px] uppercase tracking-wider text-muted-foreground">
                      {p.duration}
                    </div>
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                      {p.body}
                    </p>
                  </div>
                  <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-2 text-[12px]">
                    {p.bullets.map((b) => (
                      <li
                        key={b}
                        className="rounded-full border border-hairline bg-paper px-2.5 py-1 text-ink-soft"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
