import { Sparkles, Layers, Users } from "lucide-react";
import { Link } from "react-router-dom";

const audiences = [
  {
    icon: Sparkles,
    color: "orange",
    title: "Your story has moved on.",
    description:
      "Your values and ambition have shifted, but the brand still speaks in an older voice. You need clarity, updated language, and creative direction that reflect who you are today.",
    linkText: "Want to tell your story with soul?",
    linkUrl: "/blog/storytelling-with-a-soul",
  },
  {
    icon: Layers,
    color: "violet",
    title: "Your brand is becoming a universe.",
    description:
      "You are expanding across new touchpoints and channels. The brand needs coherence, expression, and a visual system that keeps everything connected and true.",
    linkText: "What is a brand universe?",
    linkUrl: "/blog/what-is-a-brand-universe",
  },
  {
    icon: Users,
    color: "indigo",
    title: "Your team needs clarity and creative support.",
    description:
      "You want to grow without sacrificing wellbeing or creative integrity. Your team needs systems and support that protect their energy and strengthen the work they produce.",
    linkText: "The role of strategic clarity",
    linkUrl: "/blog/why-you-and-your-team-care-about-clarity",
  },
] as const;

export function WhoItsFor() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/70 px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground backdrop-blur">
              Who it's for
            </div>
            <h2 className="font-sans not-italic mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.025em] md:text-[56px]">
              For{" "}
              <span className="font-serif-pro italic text-clay text-5xl md:text-7xl">
                makers, founders,
              </span>{" "}
              and teams.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-ink-soft">
            Three signals that the gap between intention and execution has become too costly to leave alone.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((a) => {
            const Icon = a.icon;
            return (
              <article
                key={a.title}
                className="group flex flex-col rounded-2xl border border-hairline bg-paper/60 p-8 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.3)]"
                style={{ ["--c" as string]: `hsl(var(--${a.color}))` }}
              >
                <span
                  className="mb-5 grid h-10 w-10 place-items-center rounded-xl border"
                  style={{ borderColor: "var(--c)", color: "var(--c)" }}
                >
                  <span
                    aria-hidden
                    className="absolute h-10 w-10 rounded-xl opacity-10"
                    style={{ background: "var(--c)" }}
                  />
                  <Icon className="relative h-4 w-4" strokeWidth={1.75} />
                </span>

                <h3 className="text-[22px] font-medium leading-snug tracking-tight">
                  {a.title}
                </h3>

                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-soft">
                  {a.description}
                </p>

                <Link
                  to={a.linkUrl}
                  className="mt-5 inline-flex items-center gap-1 text-[13px] italic transition-colors"
                  style={{ color: "var(--c)" }}
                >
                  {a.linkText} →
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
