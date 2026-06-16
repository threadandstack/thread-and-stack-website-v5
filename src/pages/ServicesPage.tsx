import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Engagements } from "@/components/home-draft2/Engagements";
import { WhoItsFor } from "@/components/home-draft2/WhoItsFor";
import { CaseStudy } from "@/components/home-draft2/CaseStudy";
import { KindWords } from "@/components/home-draft2/KindWords";
import { CTA } from "@/components/home-draft2/CTA";
import { DiagnosticDrawer } from "@/components/home-draft2/DiagnosticDrawer";

const ServicesPage = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const openDiagnostic = () => setDiagnosticOpen(true);

  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
      <Navigation
        variant={theme === "dark" ? "image-hero" : "default"}
        themeToggle={
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-muted/60 text-foreground/70 backdrop-blur-sm transition-all hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        }
      />

      <main>
        {/* Page intro */}
        <section className="pt-32 md:pt-40">
          <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
            <span className="mb-5 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Services
            </span>
            <h1 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[64px]">
              The right engagement for where you{" "}
              <span className="text-clay">are.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
              From a co-design sprint to a bespoke multi-team build. Scope and
              pricing are clear before anything starts. Pick the shape that fits.
            </p>
          </div>
        </section>


        {/* Services up front */}
        <Engagements />

        {/* Who it's for — three signals */}
        <section>
          <WhoItsFor onBookDiagnostic={openDiagnostic} />
        </section>


        {/* Proof — case study + kind words */}
        <section>
          <div className="mx-auto max-w-3xl px-6 pt-8 text-center md:px-10 md:pt-12">
            <span className="mb-4 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Proof in practice.
            </span>
            <h2 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[56px]">
              Proof in <span className="text-clay">practice.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              A real engagement, from diagnostic to adoption.
            </p>
          </div>
          <div className="mt-10 md:mt-14">
            <CaseStudy onBookDiagnostic={openDiagnostic} />
          </div>
          <KindWords />
        </section>


        <CTA theme={theme} />
      </main>
      <Footer />

      <DiagnosticDrawer
        open={diagnosticOpen}
        onOpenChange={setDiagnosticOpen}
        theme={theme}
      />
    </div>
  );
};

export default ServicesPage;
