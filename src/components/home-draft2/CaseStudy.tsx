import { useState } from "react";
import { Play, ArrowRight } from "lucide-react";

const stats = [
  { v: "1", l: "Joined-up system", d: "marketing, ops, and CRM in one place" },
  { v: "5+", l: "Tools consolidated", d: "TBC · replaced by a single Notion workspace" },
  { v: "Weeks", l: "To first wins", d: "TBC · adoption felt fast across the team" },
  { v: "Peace", l: "Of mind", d: "founder out of the routing layer" },
];

export function CaseStudy() {
  return (
    <section
      id="work"
      className="relative overflow-hidden border-b border-hairline bg-card text-card-foreground"
    >
      <div aria-hidden className="bg-noise pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-foreground/[0.04] px-3 py-1 text-[11.5px] uppercase tracking-wider text-foreground/70">
            Case study · The IMMA Collective
          </div>
          <h2 className="mt-5 text-4xl font-sans font-semibold not-italic leading-[1.05] tracking-[-0.025em] md:text-[56px]">
            Ops that finally{" "}
            <span className="font-serif-pro italic font-normal text-clay text-7xl">felt joined up.</span>
          </h2>
          <p className="mt-6 text-[15.5px] leading-relaxed text-foreground/70">
            Lilli came in with a marketing function spread across half a dozen tools, a
            growing community, and no single place to plan from. We built one Notion
            workspace as the operating layer for the business — strategy, content,
            campaigns, and CRM in one place, with a clear vision the team could plan
            against.
          </p>
        </div>

        {/* Video + Stats */}
        <div className="mt-12 grid gap-8 md:mt-14 md:grid-cols-[1.5fr_1fr] md:items-stretch">
          <VideoEmbed />

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-1">
            {stats.map((s) => (
              <div key={s.l} className="flex flex-col justify-center bg-card p-5 md:p-6">
                <div className="font-serif-pro italic text-[40px] leading-none text-clay-soft md:text-[48px]">
                  {s.v}
                </div>
                <div className="mt-2 text-[13px] font-medium text-foreground">{s.l}</div>
                <div className="mt-1 text-[11.5px] leading-snug text-foreground/55">{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote + CTAs */}
        <div className="mt-14 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <figure className="border-l-2 border-indigo pl-6">
            <blockquote className="font-serif-pro italic text-2xl leading-snug text-foreground md:text-[30px]">
              "Brendan is like a Swiss army knife, strategic and hands-on. He helped me
              build a system that actually works for The IMMA Collective. I've got real
              peace of mind, a clear vision for the business, and content ops that feel
              properly joined up."
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3 text-[13px] text-foreground/60">
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-[12px] font-semibold text-accent-foreground"
                style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--indigo)), hsl(var(--orange)))" }}
              >
                LG
              </span>
              <span>
                <span className="text-foreground">Lilli Graf</span>, Founder, The IMMA Collective
              </span>
            </figcaption>
          </figure>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <a
              href="#contact"
              className="group inline-flex h-11 items-center rounded-md bg-background px-5 text-[14px] font-medium text-foreground transition-transform hover:-translate-y-px"
            >
              Book the Diagnostic
              <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-4 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                <ArrowRight className="h-4 w-4 shrink-0" />
              </span>
            </a>
            <a
              href="#how"
              className="inline-flex h-11 items-center rounded-md border border-hairline px-5 text-[14px] font-medium text-foreground/90 transition-colors hover:bg-foreground/[0.06]"
            >
              See the architecture
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoEmbed() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="aspect-video h-full w-full overflow-hidden rounded-2xl border border-hairline bg-black">
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="group relative h-full w-full"
          aria-label="Play testimonial video"
        >
          <img
            src="https://img.youtube.com/vi/aoHXlRb_bAI/maxresdefault.jpg"
            alt="The IMMA Collective testimonial"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 h-6 w-6 text-black" fill="currentColor" />
            </div>
          </div>
        </button>
      ) : (
        <iframe
          className="h-full w-full"
          src="https://www.youtube.com/embed/aoHXlRb_bAI?autoplay=1&modestbranding=1&rel=0&playsinline=1"
          title="The IMMA Collective testimonial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}
