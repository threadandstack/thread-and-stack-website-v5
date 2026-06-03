import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ContactDrawer } from "@/components/ContactDrawer";

export function CTA() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b border-hairline bg-card text-card-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-[600px] max-w-4xl opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(40% 60% at 25% 40%, hsl(var(--indigo) / 0.6), transparent 70%), radial-gradient(40% 60% at 75% 50%, hsl(var(--orange) / 0.55), transparent 70%), radial-gradient(50% 60% at 50% 80%, hsl(var(--violet) / 0.45), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-foreground/[0.04] px-3 py-1 text-[11.5px] uppercase tracking-wider text-foreground/70">
          <Sparkles className="h-3 w-3 text-indigo" strokeWidth={2} />
          Stack Diagnostic · £395
        </div>
        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-6xl">
          Book the Diagnostic.<br />
          <span className="font-serif-pro italic text-clay-soft">Leave with a plan.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] text-foreground/70">
          90 minutes live. A written blueprint within 48 hours. Credited in full against
          any build you choose afterwards.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group inline-flex h-12 items-center rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
            style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
          >
            Book the Diagnostic · £395
            <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
              <ArrowRight className="h-4 w-4 shrink-0" />
            </span>
          </button>
          <a
            href="mailto:br@brendanrodgers.uk"
            className="inline-flex h-12 items-center gap-2 rounded-md border border-hairline px-6 text-[14.5px] font-medium text-foreground/90 transition-colors hover:bg-foreground/[0.06]"
          >
            Email instead
          </a>
        </div>
      </div>
      <ContactDrawer open={open} onOpenChange={setOpen} />
    </section>
  );
}
