import { ArrowRight } from "lucide-react";
import brendanPhoto from "@/assets/photos/shoreditch/brendan-34.webp";

/**
 * Personal welcome at the top of the page — NOT a collapsible.
 * A short hello from Brendan with a portrait, and links to
 * the About page and How I Work page.
 */
export function AboutIntro() {
  return (
    <section aria-label="A welcome from Brendan">
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-10 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_2fr] md:gap-14">
          {/* Portrait */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative h-44 w-44 overflow-hidden rounded-full border border-hairline shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] md:h-56 md:w-56">
              <img
                src={brendanPhoto}
                alt="Brendan, founder of Thread & Stack"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Welcome copy */}
          <div className="max-w-2xl">
            <span className="mb-4 inline-block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Hello
            </span>
            <h1 className="font-serif-pro italic font-normal text-balance text-3xl leading-[1.1] tracking-[-0.02em] md:text-[44px]">
              I'm Brendan, and it's good to{" "}
              <span className="text-clay">have you here.</span>
            </h1>

            <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-ink-soft">
              <p>
                I help organisations transform their operations and give their
                business a home. Some call it an operating system. I call it your
                business's day-to-day home. Let's make sure it actually works for
                you and your team.
              </p>
              <p>
                Every engagement includes a period of aftercare to make sure
                what we build actually sticks — with adoption support and
                technical help until your team is confident running it.
              </p>
              <p>
                Transformation doesn't work unless it works.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
              <a
                href="/about"
                className="group inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-clay"
              >
                About me
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/how-i-work"
                className="group inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-clay"
              >
                The Thread & Stack way
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
