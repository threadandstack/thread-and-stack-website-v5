import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/home-draft2/CTA";
import { Problem } from "@/components/home-draft2/Problem";
import { LogoTilt } from "@/components/home-draft2/LogoTilt";
import tsWayBlack from "@/assets/logos/TSWay_Black.png.asset.json";
import tsWayWhite from "@/assets/logos/TSWay_White.png.asset.json";


const HowIWorkDraft2Page = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <>
      <Helmet>
        <title>How I Work | Thread &amp; Stack</title>
        <meta name="description" content="My approach to brand strategy, systems design, and AI integration for teams that want to grow truer, not just faster." />
        <link rel="canonical" href="https://threadandstack.com/how-i-work" />
        <meta property="og:url" content="https://threadandstack.com/how-i-work" />
        <meta property="og:title" content="How I Work | Thread & Stack" />
        <meta property="og:description" content="My approach to brand strategy, systems design, and AI integration for teams that want to grow truer, not just faster." />
      </Helmet>
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
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-hairline">
          <div aria-hidden className="aurora">
            <span />
          </div>
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              maskImage:
                "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
            }}
          />

          <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">
            <div className="flex flex-col items-center text-center">
              <Link
                to="/"
                className="fade-up mb-8 inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to home
              </Link>

              <div className="fade-up fade-up-1 mt-10 flex justify-center">
                <LogoTilt
                  className="h-[13.5rem] sm:h-[17.5rem] md:h-[21.5rem]"
                  theme={theme}
                  darkSrc={tsWayWhite.url}
                  lightSrc={tsWayBlack.url}
                  alt="The Thread & Stack Way"
                />
              </div>

              <p className="fade-up fade-up-3 mt-10 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
                A map for protecting the creativity, judgment, and meaning that no model can replace — and using AI with the skill, restraint, and accountability the work deserves.
              </p>
            </div>
          </div>
        </section>

        {/* How we work together — moved from home-draft2 */}
        <Problem />

        <CTA />
      </main>

      <Footer />
    </div>
    </>
  );
};

export default HowIWorkDraft2Page;
