import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/home-draft2/Hero";
import { Logos } from "@/components/home-draft2/Logos";

import { Engagements } from "@/components/home-draft2/Engagements";
import { CaseStudy } from "@/components/home-draft2/CaseStudy";
import { KindWords } from "@/components/home-draft2/KindWords";
import { Credentials } from "@/components/home-draft2/Credentials";
import { FAQ } from "@/components/home-draft2/FAQ";
import { CTA } from "@/components/home-draft2/CTA";
import { WhoItsFor } from "@/components/home-draft2/WhoItsFor";
import { AboutIntro } from "@/components/home-draft2/AboutIntro";
import { AgentsSection } from "@/components/home-draft2/AgentsSection";
import { CollapsibleSection } from "@/components/home-draft2/CollapsibleSection";
import { DiagnosticDrawer } from "@/components/home-draft2/DiagnosticDrawer";

const HomePageDraft2 = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
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
      />


      <main>
        <Hero theme={theme} onToggleTheme={toggleTheme} onBookDiagnostic={openDiagnostic} />
        <Logos theme={theme} />

        {/* Personal welcome — not collapsible */}
        <AboutIntro />

        <AgentsSection />

        <div id="how" />


        <CTA theme={theme} />

        <CollapsibleSection
          eyebrow="Credentials"
          title={<>Certified, <span className="text-clay">embedded.</span></>}
          defaultOpen
        >
          <Credentials />
        </CollapsibleSection>

        <CollapsibleSection
          eyebrow="FAQ"
          title={<>Hard <span className="text-clay">questions.</span></>}
          preview="Why the diagnostic is paid, why the build prices look higher, and what happens with your data."
          defaultOpen
        >
          <FAQ />
        </CollapsibleSection>
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
