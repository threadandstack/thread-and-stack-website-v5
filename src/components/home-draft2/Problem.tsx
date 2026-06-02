import { Compass, Hammer, Repeat } from "lucide-react";

const phases = [
  {
    n: "01",
    icon: Compass,
    color: "indigo",
    title: "Diagnose",
    duration: "Paid Stack Diagnostic · 90 min + blueprint",
    body:
      "We map the tools, the data, the people, and where the leader has become the routing layer. You leave with a written plan — credited against whatever build comes next.",
    bullets: ["Stack + knowledge audit", "Architecture sketch", "Phased proposal"],
  },
  {
    n: "02",
    icon: Hammer,
    color: "orange",
    title: "Build",
    duration: "In your Notion, in public, with support included",
    body:
      "The lake is built in your workspace, not a sandbox. Daily updates, async access, every decision documented. Training and 30–90 days of adoption support are part of the build, not an upsell.",
    bullets: ["Notion-native build", "Claude + custom agents", "Training + Loom library"],
  },
  {
    n: "03",
    icon: Repeat,
    color: "violet",
    title: "Compound",
    duration: "Rolling Stack Support · no tie-in",
    body:
      "Once the system holds, we keep it growing. Async access, scaled per half-day, cancel any month. The lake deepens, the agents get sharper, you keep sovereignty over the whole thing.",
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
              Six tools.
              <br />
              <span className="font-serif-pro italic text-clay">One bottleneck.</span>{" "}
              <span className="text-muted-foreground">(you.)</span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-ink-soft">
            When the founder is the only router between the tools, the team waits.
            The fix isn't another tool — it's an intentional stack, built in three
            phases. You only continue when the last one earned the next.
          </p>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
          {phases.map((p) => {
            const Icon = p.icon;
            return (
              <li
                key={p.n}
                className="group relative flex flex-col gap-4 overflow-hidden bg-background p-7 md:p-8"
                style={{ ["--c" as string]: `hsl(var(--${p.color}))` }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-40"
                  style={{
                    background:
                      "radial-gradient(closest-side, var(--c), transparent)",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-lg border border-hairline bg-paper"
                    style={{ color: "var(--c)" }}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </div>
                  <span
                    className="text-[11px] font-medium uppercase tracking-[0.18em]"
                    style={{ color: "var(--c)" }}
                  >
                    {p.n}
                  </span>
                </div>
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
                <ul className="relative mt-auto flex flex-wrap gap-1.5 text-[12px]">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-hairline bg-paper px-2.5 py-1 text-ink-soft"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
