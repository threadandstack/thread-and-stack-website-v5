import { ArrowRight, User } from "lucide-react";
import brendanPhoto from "@/assets/photos/shoreditch/brendan-34.webp";

interface AboutProps {
  onBookDiagnostic?: () => void;
}

export function About({ onBookDiagnostic }: AboutProps) {
  return (
    <section className="border-b border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
              The human behind it
            </div>
            <h2 className="font-sans not-italic mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.025em] md:text-[56px]">
              About{" "}
              <span className="font-serif-pro italic text-clay text-5xl md:text-7xl">
                Thread & Stack
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-ink-soft">
            Twelve years of brand, marketing, and systems work — now pointed at one problem worth solving.
          </p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-5 md:gap-14">
          <div className="md:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-hairline shadow-[0_16px_40px_-24px_rgba(0,0,0,0.3)]">
              <img
                src={brendanPhoto}
                alt="Brendan — Thread & Stack founder"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-serif-pro italic text-2xl md:text-3xl leading-[1.2] text-foreground">
              I'm Brendan, founder of Thread & Stack.
            </p>

            <div className="mt-6 space-y-5 text-[15.5px] leading-relaxed text-ink-soft">
              <p>
                I've spent 12+ years in brand and marketing across global consumer brands, international consultancies, creative agencies, disruptive tech, ambitious start-ups and nonprofits.
              </p>
              <p>
                Now I focus that experience on one thing: helping purpose-led teams turn messy marketing into clear narratives and practical workflows they can sustain.
              </p>
              <p>
                Most of the founders and teams I work with are already doing meaningful work. The problem isn't a lack of ideas. It's the gap between what they mean and what they're actually saying and shipping.
              </p>
              <p className="text-foreground">
                My work sits at the intersection of brand strategy, creative direction, and systems design — protecting both your brand integrity and your team's creative energy.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
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
                  Book the Stack Diagnostic
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </button>
              )}
              <a
                href="/about"
                className="group inline-flex h-11 items-center rounded-md border border-hairline bg-background px-5 text-[14px] font-medium text-foreground transition-colors hover:bg-paper"
              >
                <User className="mr-2 h-4 w-4" strokeWidth={1.75} />
                More about me
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
