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
import { About } from "@/components/home-draft2/About";
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
        <Problem />
        <WhoItsFor />
        <Engagements />
        <CaseStudy onBookDiagnostic={openDiagnostic} />
        <FAQ />
        <KindWords />
        <Credentials />
        <About onBookDiagnostic={openDiagnostic} />
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
