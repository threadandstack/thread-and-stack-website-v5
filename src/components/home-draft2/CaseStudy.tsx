import { useState } from "react";
import { Play } from "lucide-react";

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
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-foreground/[0.04] px-3 py-1 text-[11.5px] uppercase tracking-wider text-foreground/70">
              Case study · The IMMA Collective
            </div>
            <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-[-0.025em] md:text-[56px]">
              Marketing that finally{" "}
              <span className="font-serif-pro italic text-clay-soft">felt joined up.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-foreground/70">
              Lilli came in with a marketing function spread across half a dozen tools, a
              growing community, and no single place to plan from. We built one Notion
              workspace as the operating layer for the business. Strategy, content,
              campaigns, and CRM in one place, with a clear vision the team could plan
              against.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a
                href="#contact"
                className="inline-flex h-11 items-center rounded-md bg-background px-5 text-[14px] font-medium text-foreground transition-transform hover:-translate-y-px"
              >
                Book the Diagnostic →
              </a>
              <a
                href="#how"
                className="inline-flex h-11 items-center rounded-md border border-hairline px-5 text-[14px] font-medium text-foreground/90 transition-colors hover:bg-foreground/[0.06]"
              >
                See the architecture
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline">
            {stats.map((s) => (
              <div key={s.l} className="bg-card p-6 md:p-7">
                <div className="font-serif-pro italic text-[44px] leading-none text-clay-soft md:text-[56px]">
                  {s.v}
                </div>
                <div className="mt-3 text-[13.5px] font-medium text-foreground">{s.l}</div>
                <div className="mt-1 text-[12px] text-foreground/55">{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        <figure className="mt-14 max-w-3xl border-l-2 border-indigo pl-6">
          <blockquote className="font-serif-pro italic text-2xl leading-snug text-foreground md:text-[32px]">
            "Brendan is like a Swiss army knife when it comes to marketing, strategic and
            hands-on. He helped me build a system that actually works for The IMMA
            Collective. I've got real peace of mind, a clear vision for the business, and
            marketing that feels properly joined up."
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

        <div className="mt-14 max-w-3xl">
          <VideoEmbed />
        </div>
      </div>
    </section>
  );
}

function VideoEmbed() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-hairline bg-black">
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="group relative h-full w-full"
        >
          <img
            src="https://img.youtube.com/vi/aoHXlRb_bAI/maxresdefault.jpg"
            alt="The IMMA Collective testimonial"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 h-6 w-6 text-foreground" fill="currentColor" />
            </div>
          </div>
        </button>
      ) : (
        <iframe
          className="h-full w-full"
          src="https://www.youtube-nocookie.com/embed/aoHXlRb_bAI?autoplay=1&modestbranding=1&rel=0"
          title="The IMMA Collective testimonial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}
