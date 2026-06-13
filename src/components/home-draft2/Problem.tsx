import { useEffect, useRef, useState } from "react";
import { Compass, Hammer, Rocket, Repeat } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const phases = [
  {
    icon: Compass,
    color: "sky",
    n: "01",
    title: "Diagnose",
    duration: "Free chemistry call · paid 90–120 min diagnostic",
    lede: "We sit down together and pull at the threads of growth.",
    body:
      "It starts with a free chemistry call — just to say hi and see if we're a fit. From there we move into a 90 to 120 minute diagnostic where, as a team, we walk through every challenge facing your operations right now. We start pulling at the threads, surfacing the patterns, and naming the places where the leader has become the routing layer.",
    outcomes: [
      "Map of tools, data, and decision-makers",
      "Written blueprint inside 48 hours",
      "Credited against any build that follows",
    ],
  },
  {
    icon: Hammer,
    color: "orange",
    n: "02",
    title: "Build",
    duration: "Once the proposal is approved",
    lede: "Notion becomes the knowledge base your whole operation grows around.",
    body:
      "I build out your workspace and position Notion as the knowledge base that supports seamless knowledge transfer between internal stakeholders, and relational knowledge sharing with the people outside the building — customers, beneficiaries, funders. Permissions and team structure are set up properly. Your SOPs are transformed into supporting, automated experiences that lift the team rather than burden them.",
    outcomes: [
      "Five-layer Knowledge Base in your Notion",
      "Permissions, teams, and external sharing",
      "SOPs turned into automated workflows",
    ],
  },
  {
    icon: Rocket,
    color: "violet",
    n: "03",
    title: "Launch",
    duration: "Tailored adoption support per package",
    lede: "Adoption is the work. We protect it so the system actually lands.",
    body:
      "Depending on the package, we monitor how adoption is going across the team — who's flying, who's struggling, and with which parts of the workspace. I offer up to 10 hours of training and support per month, delivered in a tailored fashion so your team are given a real chance to adopt and embrace the new way of working.",
    outcomes: [
      "Live adoption monitoring across the team",
      "Up to 10 hours of tailored training a month",
      "Loom library so the answer is always there",
    ],
  },
  {
    icon: Repeat,
    color: "indigo",
    n: "04",
    title: "Compound",
    duration: "Rolling Stack Support · no tie-in",
    lede: "The base keeps growing. Your horizon keeps extending.",
    body:
      "Once the foundations are strong, we lift our eyes to the horizon. What has this new strength of internal operations actually unlocked? This is where compounding begins — website operations, customer onboarding journeys, employee onboarding journeys, live event trackers, testimonial gathering automations, and much more. Async access, scaled per half-day, cancel any month.",
    outcomes: [
      "Customer & employee onboarding journeys",
      "Website ops, event trackers, testimonial loops",
      "Async support scaled to your rhythm",
    ],
  },
] as const;

export function Problem() {
  return (
    <section id="how">
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeader eyebrow="The journey">
          The Thread & Stack <span className="text-clay">Way.</span>
        </SectionHeader>

        <div className="relative">
          {/* Vertical thread — gradient line connecting the phases */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, hsl(var(--sky) / 0.6) 8%, hsl(var(--orange) / 0.6) 35%, hsl(var(--violet) / 0.6) 65%, hsl(var(--indigo) / 0.6) 92%, transparent)",
            }}
          />

          <ol className="flex flex-col gap-16 md:gap-28">
            {phases.map((p, i) => (
              <PhaseSlide key={p.title} phase={p} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PhaseSlide({
  phase,
  index,
}: {
  phase: (typeof phases)[number];
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);
  const isLeft = index % 2 === 0;
  const Icon = phase.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className="relative"
      style={{ ["--c" as string]: `hsl(var(--${phase.color}))` }}
    >
      {/* Node on the central line (desktop) */}
      <span
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-2 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 bg-background transition-all duration-700 md:block ${
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        style={{ borderColor: "var(--c)" }}
      />

      <div
        className={`grid items-start gap-10 md:grid-cols-2 md:gap-16 ${
          isLeft ? "" : "md:[direction:rtl]"
        }`}
      >
        {/* Text panel */}
        <div
          className={`transition-all duration-700 ease-out [direction:ltr] ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          } ${isLeft ? "md:pr-6" : "md:pl-6"}`}
          style={{ transitionDelay: visible ? "120ms" : "0ms" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="grid h-12 w-12 place-items-center rounded-xl border bg-background shadow-[0_8px_24px_-14px_rgba(0,0,0,0.25)]"
              style={{ borderColor: "var(--c)", color: "var(--c)" }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <div
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: "var(--c)" }}
              >
                Phase {phase.n}
              </div>
              <h3 className="text-[26px] font-medium tracking-tight md:text-[30px]">
                {phase.title}
              </h3>
            </div>
          </div>

          <p className="mt-6 font-serif-pro italic text-[22px] leading-snug text-foreground md:text-[26px]">
            {phase.lede}
          </p>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
            {phase.body}
          </p>
          <div className="mt-5 text-[11.5px] uppercase tracking-wider text-muted-foreground">
            {phase.duration}
          </div>
        </div>

        {/* Outcomes card */}
        <div
          className={`transition-all duration-700 ease-out [direction:ltr] ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          } ${isLeft ? "md:pl-6" : "md:pr-6"}`}
          style={{ transitionDelay: visible ? "280ms" : "0ms" }}
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-hairline bg-background p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-25 blur-3xl"
              style={{ background: "var(--c)" }}
            />
            <div
              className="text-[10.5px] uppercase tracking-[0.22em]"
              style={{ color: "var(--c)" }}
            >
              What you walk away with
            </div>
            <ul className="relative mt-4 flex flex-col gap-3">
              {phase.outcomes.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-3 text-[14.5px] text-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--c)" }}
                  />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}
