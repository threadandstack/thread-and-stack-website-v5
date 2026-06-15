import { useEffect, useRef, useState } from "react";
import { Sun, Moon, ArrowLeft, Compass, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/home-draft2/CTA";
import { Problem } from "@/components/home-draft2/Problem";

const fourCs = [
  {
    word: "Connection",
    color: "indigo",
    description:
      "The need to belong, relate, and build trust. AI can scale reach, but it can't manufacture genuine rapport. Connection is where brand loyalty actually lives.",
  },
  {
    word: "Creativity",
    color: "orange",
    description:
      "The drive to make, shape, and express. AI can generate options, but creative judgment, taste, and the courage to commit to a direction is irreplaceably human.",
  },
  {
    word: "Curiosity",
    color: "violet",
    description:
      "The pull to explore, question, and reframe. AI can retrieve and summarise, but the instinct to ask a better question, or challenge a brief, is what produces breakthrough work.",
  },
  {
    word: "Contribution",
    color: "sky",
    description:
      "The desire to matter and leave something behind. AI optimises for metrics; humans optimise for meaning. The best brands are built on purpose, not just performance.",
  },
] as const;

const fourDs = [
  {
    letter: "Delegation",
    description:
      "Knowing whether, when, and how to engage AI. Not every task benefits from automation. The skill is in choosing wisely, protecting the work that deserves human attention.",
  },
  {
    letter: "Description",
    description:
      "Articulating goals clearly enough to prompt useful AI behaviour. This is where strategic thinking meets practical fluency — vague inputs produce vague outputs.",
  },
  {
    letter: "Discernment",
    description:
      "Accurately assessing AI outputs. Knowing what's good enough, what needs reworking, and what should be thrown away entirely. This is taste, applied to a new medium.",
  },
  {
    letter: "Diligence",
    description:
      "Taking responsibility for what we do with AI and how we do it. Ethics, transparency, and accountability aren't optional extras — they're the foundation of trust.",
  },
] as const;

const HowIWorkDraft2Page = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const [cVisible, setCVisible] = useState(false);
  const [dVisible, setDVisible] = useState(false);
  const cRef = useRef<HTMLElement>(null);
  const dRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (e.target === cRef.current) setCVisible(true);
            if (e.target === dRef.current) setDVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (cRef.current) observer.observe(cRef.current);
    if (dRef.current) observer.observe(dRef.current);
    return () => observer.disconnect();
  }, []);

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
                to="/home-draft2"
                className="fade-up mb-8 inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to home
              </Link>

              <div className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/70 px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground backdrop-blur">
                <Compass className="h-3 w-3 text-indigo" strokeWidth={2} />
                How I work · principles & practice
              </div>

              <h1 className="fade-up fade-up-2 mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.035em] md:text-[76px]">
                Human first.
                <br />
                <span
                  className="font-serif-pro italic font-normal bg-clip-text text-transparent text-5xl md:text-7xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, var(--gradient-4color))",
                  }}
                >
                  AI with intention.
                </span>
              </h1>

              <p className="fade-up fade-up-3 mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
                A map for protecting the creativity, judgment, and meaning that no model can replace — and using AI with the skill, restraint, and accountability the work deserves.
              </p>
            </div>
          </div>
        </section>

        {/* How we work together — moved from home-draft2 */}
        <Problem />

        {/* 4 C's */}
        <section
          ref={cRef}
          className={`border-b border-hairline transition-all duration-1000 ${
            cVisible ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4"
          }`}
        >
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/70 px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground backdrop-blur">
                  The 4 C's
                </div>
                <h2 className="font-sans not-italic mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.025em] md:text-[56px]">
                  What AI must{" "}
                  <span className="font-serif-pro italic text-clay text-5xl md:text-7xl">
                    never replace.
                  </span>
                </h2>
              </div>
              <p className="max-w-md text-[15px] text-ink-soft">
                Four drivers that shape how we work, create, and connect. Any AI strategy worth its salt protects them — or it doesn't ship.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {fourCs.map((item, i) => (
                <article
                  key={item.word}
                  className="rounded-2xl border border-hairline bg-paper/60 p-8 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.3)]"
                  style={{
                    ["--c" as string]: `hsl(var(--${item.color}))`,
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  <div
                    className="mb-3 text-[11.5px] uppercase tracking-wider"
                    style={{ color: "var(--c)" }}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="font-serif-pro italic text-3xl md:text-4xl font-normal" style={{ color: "var(--c)" }}>
                    {item.word}
                  </h3>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4 D's */}
        <section
          id="ai-fluency"
          ref={dRef}
          className={`border-b border-hairline bg-paper transition-all duration-1000 ${
            dVisible ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4"
          }`}
        >
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
                  <Brain className="h-3 w-3 text-orange" strokeWidth={2} />
                  Practitioner perspective
                </div>
                <h2 className="font-sans not-italic mt-5 text-4xl font-semibold leading-[1.03] tracking-[-0.025em] md:text-[56px]">
                  The discipline{" "}
                  <span className="font-serif-pro italic text-clay text-5xl md:text-7xl">
                    behind the tools.
                  </span>
                </h2>
              </div>
              <p className="max-w-md text-[15px] text-ink-soft">
                Anthropic's <strong className="text-foreground font-medium">4D AI Fluency Framework</strong> — four competencies for effective, ethical, and safe AI interaction. Studied, certified, applied.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {fourDs.map((item, i) => (
                <article
                  key={item.letter}
                  className="rounded-2xl border border-hairline bg-background p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.3)]"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="mb-3 text-[11.5px] uppercase tracking-wider text-orange">
                    D{i + 1}
                  </div>
                  <h3 className="font-serif-pro italic text-3xl md:text-4xl font-normal text-orange">
                    {item.letter}
                  </h3>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-hairline bg-background p-8 md:p-10">
              <h3 className="font-serif-pro italic text-2xl md:text-3xl">
                Where the frameworks meet.
              </h3>
              <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
                The 4 C's tell us what to protect. The 4 D's tell us how to operate. Together, they form a complete picture: AI that serves human connection, applied with professional rigour. It's the foundation of every system, narrative, and stack I build with clients.
              </p>
            </div>

            <p className="mt-8 text-xs text-muted-foreground/60">
              The 4D AI Fluency Framework is © 2025 Rick Dakan, Joseph Feller, and Anthropic, released under CC BY-NC-SA 4.0. Referenced here with attribution.
            </p>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default HowIWorkDraft2Page;
