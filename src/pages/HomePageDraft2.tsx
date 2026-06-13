import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/home-draft2/Hero";
import { Logos } from "@/components/home-draft2/Logos";
import { Problem } from "@/components/home-draft2/Problem";

import { Engagements } from "@/components/home-draft2/Engagements";
import { CaseStudy } from "@/components/home-draft2/CaseStudy";
import { KindWords } from "@/components/home-draft2/KindWords";
import { Credentials } from "@/components/home-draft2/Credentials";
import { FAQ } from "@/components/home-draft2/FAQ";
import { CTA } from "@/components/home-draft2/CTA";
import { WhoItsFor } from "@/components/home-draft2/WhoItsFor";
import { AboutIntro } from "@/components/home-draft2/AboutIntro";
import { CollapsibleSection } from "@/components/home-draft2/CollapsibleSection";
import { DiagnosticDrawer } from "@/components/home-draft2/DiagnosticDrawer";

const HomePageDraft2 = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const openDiagnostic = () => setDiagnosticOpen(true);

  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
      <Navigation
        variant={theme === "dark" ? "image-hero" : "default"}
        hideLogo
        themeToggle={
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-muted/60 text-foreground/70 backdrop-blur-sm transition-all hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        }
        floatingBadge={
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/80 px-3 py-1.5 text-[12px] text-ink-soft backdrop-blur-md">
            <span className="relative grid h-2 w-2 place-items-center">
              <span
                className="absolute inset-0 animate-ping rounded-full opacity-60"
                style={{ background: "linear-gradient(135deg, hsl(var(--orange)), hsl(var(--violet)))" }}
              />
              <span
                className="relative h-2 w-2 rounded-full"
                style={{ background: "linear-gradient(135deg, hsl(var(--orange)), hsl(var(--violet)))" }}
              />
            </span>
            Currently booking Q3
          </span>
        }
      />


      <main>
        <Hero theme={theme} onToggleTheme={toggleTheme} onBookDiagnostic={openDiagnostic} />
        <Logos theme={theme} />

        {/* Personal welcome — not collapsible */}
        <AboutIntro onBookDiagnostic={openDiagnostic} />

        <div id="how" />

        <CollapsibleSection
          eyebrow="The Thread & Stack Way"
          title={<>How we <span className="text-clay">work together.</span></>}
          preview="A four-phase journey: diagnose the leakage, build the base, launch with adoption, and compound the gains."
          defaultOpen
        >
          <Problem />
        </CollapsibleSection>

        <CollapsibleSection
          eyebrow="Who it's for"
          title={<>Three signals it's <span className="text-clay">time.</span></>}
          preview="Your marketing no longer feels like you. The work isn't compounding. The leakage is real but invisible."
        >
          <WhoItsFor />
        </CollapsibleSection>

        <CollapsibleSection
          eyebrow="Engagements"
          title={<>Four ways <span className="text-clay">forward.</span></>}
          preview="From a co-design sprint to a bespoke multi-team build. Pricing and scope are clear up front."
        >
          <Engagements />
        </CollapsibleSection>

        {/* Combined: Case study + Kind words */}
        <CollapsibleSection
          eyebrow="Proof"
          title={<>Proof in practice, in <span className="text-clay">clients' words.</span></>}
          preview="A real engagement from diagnostic to adoption, alongside a stack of kind words from people I've worked with."
        >
          <CaseStudy onBookDiagnostic={openDiagnostic} />
          <KindWords />
        </CollapsibleSection>

        <CollapsibleSection
          eyebrow="FAQ"
          title={<>Hard <span className="text-clay">questions.</span></>}
          preview="Why the diagnostic is paid, why the build prices look higher, and what happens with your data."
        >
          <FAQ />
        </CollapsibleSection>

        <CollapsibleSection
          eyebrow="Credentials"
          title={<>Certified, <span className="text-clay">embedded.</span></>}
        >
          <Credentials />
        </CollapsibleSection>

        <CTA />
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

export default HomePageDraft2;
