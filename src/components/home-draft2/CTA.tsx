import { useState } from "react";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Tilt3D } from "@/components/Tilt3D";
import { DiagnosticDrawer } from "./DiagnosticDrawer";

interface CTAProps {
  theme?: "light" | "dark";
}

export function CTA({ theme = "light" }: CTAProps = {}) {
  const [open, setOpen] = useState(false);

  return (
    <section id="contact" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <Tilt3D maxX={7} maxY={5} className="w-full">
          <div className="relative rounded-2xl bg-background/70 p-8 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:p-12">
            <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
              {/* Copy */}
              <div>
                <span className="mb-4 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                  Next step
                </span>
                <h2 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[52px]">
                  Start with a call.<br />
                  <span className="text-gradient-warm">Leave with a plan.</span>
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  Book a free 30-minute intro call. If a paid Stack Diagnostic is
                  the right next step, we can book it from there — credited in full
                  against any build you choose afterwards.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[14px] font-medium text-white transition-all hover:-translate-y-px"
                  style={{
                    backgroundImage:
                      "linear-gradient(95deg, hsl(320 85% 55%), hsl(var(--orange)))",
                  }}
                >
                  <Phone className="h-4 w-4" />
                  Book a free intro call
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </button>

                <a
                  href="mailto:br@brendanrodgers.uk"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-hairline bg-background px-6 text-[14px] font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  Email instead
                </a>

                <p className="text-center text-[12px] text-ink-soft">
                  30 minutes · no obligation · usually within the week
                </p>
              </div>
            </div>
          </div>
        </Tilt3D>
      </div>

      <DiagnosticDrawer
        open={open}
        onOpenChange={setOpen}
        theme={theme}
        source="home-draft2-cta"
        initialMode="intro"
      />
    </section>
  );
}
