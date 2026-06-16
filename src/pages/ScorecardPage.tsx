import { useState } from "react";
import { Sun, Moon, ArrowLeft, Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Scorecard } from "@/components/home-draft2/Scorecard";

const ScorecardPage = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

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
        {/* Hero intro */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="aurora">
            <span />
          </div>
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              maskImage:
                "radial-gradient(ellipse 60% 50% at 50% 25%, black 35%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 50% at 50% 25%, black 35%, transparent 85%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-24 md:pb-20 md:pt-28">
            <div className="flex flex-col items-center text-center">
              <Link
                to="/"
                className="fade-up mb-8 inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to home
              </Link>

              <div className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/70 px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground backdrop-blur">
                <Gauge className="h-3 w-3 text-indigo" strokeWidth={2} />
                Scorecard · 2 minutes · 8 questions
              </div>

              <h1 className="fade-up fade-up-2 mt-7 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">
                How mature is your
                <br />
                <span
                  className="font-serif-pro italic font-normal bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, var(--gradient-4color))",
                  }}
                >
                  knowledge stack?
                </span>
              </h1>

              <p className="fade-up fade-up-3 mt-6 max-w-xl text-[16px] leading-relaxed text-ink-soft">
                Eight honest questions about how your team finds answers, hands
                things off, and uses AI today. You'll see exactly where you sit
                on the ladder, and the engagement that fits.
              </p>

              <p className="fade-up fade-up-4 mt-5 text-[12px] text-muted-foreground">
                Your answers stay on this device. Nothing is logged or sent.
              </p>
            </div>
          </div>
        </section>

        <Scorecard />
      </main>

      <Footer />
    </div>
  );
};

export default ScorecardPage;
