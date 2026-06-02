import { ArrowRight, ArrowDown, BadgeCheck, Repeat, MapPin } from "lucide-react";
import { LogoTilt } from "./LogoTilt";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div aria-hidden className="aurora">
        <span />
      </div>
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          maskImage:
            "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="flex flex-col items-center text-center">
          <div className="fade-up mb-8">
            <LogoTilt className="h-28 sm:h-36 md:h-44" />
          </div>
          <a
            href="#how"
            className="fade-up fade-up-1 group inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/70 py-1 pl-1 pr-3 text-[12px] text-ink-soft backdrop-blur transition-colors hover:border-indigo/50"
          >
            <span
              className="rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-accent-foreground"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, hsl(var(--indigo)), hsl(var(--violet)))",
              }}
            >
              For ops-led teams
            </span>
            <span>Notion · Claude · custom agents</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h1 className="fade-up fade-up-2 mt-7 max-w-5xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.035em] md:text-[84px]">
            One central knowledge hub.
            <br />
            <span
              className="font-serif-pro italic font-normal bg-clip-text text-transparent text-5xl md:text-7xl"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, var(--gradient-4color))",
              }}
            >
              Your centre of truth.
            </span>
          </h1>

          <p className="fade-up fade-up-3 mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
            For 5–50 person teams who've outgrown their tool stack.
            <br />
            We build your information architecture and create a Knowledge Lake that
            grows in value, as your team does. Reducing cognitive load,
            eliminating busy work, unleashing your team's brilliance.
          </p>

          <div className="fade-up fade-up-4 mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="group inline-flex h-12 items-center gap-2 rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
              style={{
                backgroundImage:
                  "linear-gradient(95deg, var(--gradient-3color))",
              }}
            >
              Book the Stack Diagnostic — £395
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#scorecard"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-hairline bg-background px-6 text-[14.5px] font-medium text-foreground transition-colors hover:bg-paper"
            >
              Take the 2-min Scorecard
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          <div className="fade-up fade-up-5 mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-indigo" strokeWidth={2} />
              Notion Certified
            </span>
            <span className="hidden h-3 w-px bg-hairline sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <Repeat className="h-3.5 w-3.5 text-violet" strokeWidth={2} />
              Rolling support, no tie-in
            </span>
            <span className="hidden h-3 w-px bg-hairline sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-orange" strokeWidth={2} />
              UK-based · booking Q3
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
