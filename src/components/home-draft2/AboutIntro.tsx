import { ArrowRight, Calendar } from "lucide-react";
import brendanPhoto from "@/assets/photos/shoreditch/brendan-34.webp";

interface AboutIntroProps {
  onBookDiagnostic?: () => void;
}

/**
 * Personal welcome at the top of the page — NOT a collapsible.
 * A short hello from Brendan with a portrait, an inline video placeholder,
 * and a nudge to explore the toggles below or book a call.
 */
export function AboutIntro({ onBookDiagnostic }: AboutIntroProps) {
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
                I help organisations transform their operations and go-to-market
                strategies. The way I work is laid out below — each title opens
                into a fuller picture, so you can take it at your own pace.
              </p>
              <p>
                Go ahead and{" "}
                <span className="text-orange font-medium">expand any title</span>{" "}
                to explore, or skip the reading and book a call. I'd be happy to
                walk you through it together.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {onBookDiagnostic && (
                <button
                  type="button"
                  onClick={onBookDiagnostic}
                  className="group inline-flex h-11 items-center rounded-md px-5 text-[14px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
                  style={{
                    backgroundImage:
                      "linear-gradient(95deg, var(--gradient-3color))",
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" strokeWidth={1.75} />
                  Book a call
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </button>
              )}
              <a
                href="#how"
                className="inline-flex h-11 items-center rounded-md border border-hairline bg-background px-5 text-[14px] font-medium text-foreground transition-colors hover:bg-paper"
              >
                Explore below
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
