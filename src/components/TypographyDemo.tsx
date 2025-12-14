import { useEffect, useState } from "react";
import { Emphasis } from "@/components/Emphasis";

// Logo imports
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import IndigoStacked from "@/assets/logos/Indigo_TS_Stacked.svg";
import BlackStacked from "@/assets/logos/Black_TS_Stacked.svg";
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import GreyWordmark from "@/assets/logos/Grey_TS_Wordmark.svg";
import IndigoWordmark from "@/assets/logos/Indigo_TS_Wordmark.svg";
import BlackWordmark from "@/assets/logos/Black_TS_Wordmark.svg";
import WhiteWordmark from "@/assets/logos/White_TS_Wordmark.svg";
import GreySocialSq from "@/assets/logos/Grey_TS_SocialSq.svg";
import IndigoSocialSq from "@/assets/logos/Indigo_TS_SocialSq.svg";
import BlackSocialSq from "@/assets/logos/Black_TS_SocialSq.svg";
import WhiteSocialSq from "@/assets/logos/White_TS_SocialSq.svg";

// Typography demo - Approved styles only
export const TypographyDemo = () => {
  const [showUnderline, setShowUnderline] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowUnderline(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background p-8 md:p-16 space-y-24">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Approved Styles</p>
          <h1 className="font-serif-pro text-4xl md:text-5xl font-bold mb-4">
            Typography System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Refined styles based on feedback. Ready for implementation.
          </p>
        </header>

        {/* LOGO REFERENCE SECTION */}
        <section className="space-y-8 pb-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">00</span>
            <h2 className="font-serif-pro text-xl font-semibold">Logo Reference</h2>
          </div>
          
          {/* Stacked Logos */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Stacked versions</p>
            <div className="flex flex-wrap gap-8 items-end">
              <div className="bg-background p-6 rounded-xl border border-border">
                <img src={GreyStacked} alt="Grey Stacked" className="h-20 w-auto" />
                <p className="text-xs text-muted-foreground mt-2">Grey (Default)</p>
              </div>
              <div className="bg-background p-6 rounded-xl border border-border">
                <img src={IndigoStacked} alt="Indigo Stacked" className="h-20 w-auto" />
                <p className="text-xs text-muted-foreground mt-2">Indigo (Hover)</p>
              </div>
              <div className="bg-background p-6 rounded-xl border border-border">
                <img src={BlackStacked} alt="Black Stacked" className="h-20 w-auto" />
                <p className="text-xs text-muted-foreground mt-2">Black</p>
              </div>
            </div>
          </div>

          {/* Wordmark Logos */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Wordmark versions</p>
            <div className="flex flex-wrap gap-8 items-end">
              <div className="bg-background p-6 rounded-xl border border-border">
                <img src={GreyWordmark} alt="Grey Wordmark" className="h-8 w-auto" />
                <p className="text-xs text-muted-foreground mt-2">Grey</p>
              </div>
              <div className="bg-background p-6 rounded-xl border border-border">
                <img src={IndigoWordmark} alt="Indigo Wordmark" className="h-8 w-auto" />
                <p className="text-xs text-muted-foreground mt-2">Indigo</p>
              </div>
              <div className="bg-background p-6 rounded-xl border border-border">
                <img src={BlackWordmark} alt="Black Wordmark" className="h-8 w-auto" />
                <p className="text-xs text-muted-foreground mt-2">Black</p>
              </div>
            </div>
          </div>

          {/* Dark background preview */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">On dark background</p>
            <div className="bg-foreground p-8 rounded-xl flex flex-wrap gap-8 items-center">
              <img src={WhiteStacked} alt="White on dark" className="h-16 w-auto" />
              <img src={WhiteWordmark} alt="White Wordmark on dark" className="h-6 w-auto" />
              <img src={IndigoStacked} alt="Indigo on dark" className="h-16 w-auto" />
            </div>
          </div>

          {/* Social Square / Favicon */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Social Square (Favicon style)</p>
            <div className="flex flex-wrap gap-6 items-end">
              <div className="bg-background p-4 rounded-xl border border-border">
                <img src={GreySocialSq} alt="Grey SocialSq" className="h-12 w-12" />
                <p className="text-xs text-muted-foreground mt-2">Grey</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <img src={IndigoSocialSq} alt="Indigo SocialSq" className="h-12 w-12" />
                <p className="text-xs text-muted-foreground mt-2">Indigo</p>
              </div>
              <div className="bg-background p-4 rounded-xl border border-border">
                <img src={BlackSocialSq} alt="Black SocialSq" className="h-12 w-12" />
                <p className="text-xs text-muted-foreground mt-2">Black</p>
              </div>
              <div className="bg-foreground p-4 rounded-xl">
                <img src={WhiteSocialSq} alt="White SocialSq" className="h-12 w-12" />
                <p className="text-xs text-background/70 mt-2">White</p>
              </div>
            </div>
          </div>
        </section>

        {/* APPROVED HERO STYLE */}
        <section className="space-y-8 py-16 border-b-2 border-accent/30">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">★ HERO</span>
            <h2 className="font-serif-pro text-xl font-semibold">Subtle Application + Underline</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            07 Default style with accent color and animated underline on "human". Currently live on homepage.
          </p>
          
          <div className="space-y-6 bg-accent/5 p-8 md:p-12 rounded-2xl border border-accent/20">
            <h3 className="font-serif-pro text-4xl md:text-6xl font-semibold leading-tight max-w-4xl">
              Marketing that feels{" "}
              <span className="inline-block" style={{ transform: "translateY(-1px)" }}>more</span>{" "}
              <span className="inline-block text-accent relative" style={{ transform: "translateY(1px)" }}>
                human
                {showUnderline && <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0} animate={true} />}
              </span>
            </h3>
            
            <p className="font-serif-pro text-xl md:text-2xl text-muted-foreground">
              The brands that feel <span className="text-accent font-medium">alive</span>, are remembered.
            </p>
            
            <p className="font-serif-pro text-lg text-muted-foreground/70 max-w-xl">
              Through strategy, creative direction, and systems that{" "}
              <span className="inline-block font-medium" style={{ transform: "translateY(-0.5px)" }}>actually</span>{" "}
              work.
            </p>
          </div>
        </section>

        {/* SECTION HEADERS */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">★ HEADERS</span>
            <h2 className="font-serif-pro text-xl font-semibold">Section Headers</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Numbered sections with accent color and subtle baseline shifts.
          </p>
          
          <div className="space-y-10 bg-muted/20 p-8 md:p-12 rounded-2xl">
            <div className="flex items-baseline gap-4 border-b border-border/30 pb-4">
              <span className="font-serif-pro text-3xl md:text-4xl font-light text-accent">01</span>
              <h3 className="font-serif-pro text-2xl md:text-4xl font-bold" style={{ transform: "translateY(2px) rotate(-0.3deg)" }}>
                What We Do
              </h3>
            </div>
            
            <div className="flex items-baseline gap-4 border-b border-border/30 pb-4">
              <span className="font-serif-pro text-3xl md:text-4xl font-light text-accent">02</span>
              <h3 className="font-serif-pro text-2xl md:text-4xl font-bold" style={{ transform: "translateY(-1px) rotate(0.4deg)" }}>
                How It Works
              </h3>
            </div>
            
            <div className="flex items-baseline gap-4 border-b border-border/30 pb-4">
              <span className="font-serif-pro text-3xl md:text-4xl font-light text-accent">03</span>
              <h3 className="font-serif-pro text-2xl md:text-4xl font-bold" style={{ transform: "translateY(1px) rotate(-0.5deg)" }}>
                Featured Work
              </h3>
            </div>
          </div>
        </section>

        {/* PRODUCT CARDS */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">★ CARDS</span>
            <h2 className="font-serif-pro text-xl font-semibold">Product Cards</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Subtle Application style for service cards. Accent on key word.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-muted/20 p-6 rounded-2xl space-y-3 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-serif-pro text-2xl md:text-3xl font-semibold leading-tight">
                Clarity{" "}
                <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>
                  Sessions
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">60-minute strategic power hours</p>
            </div>

            <div className="bg-muted/20 p-6 rounded-2xl space-y-3 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-serif-pro text-2xl md:text-3xl font-semibold leading-tight">
                Mentorship{" "}
                <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>
                  Sprints
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">6-week AI workflow builds</p>
            </div>

            <div className="bg-muted/20 p-6 rounded-2xl space-y-3 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-serif-pro text-2xl md:text-3xl font-semibold leading-tight">
                Brand{" "}
                <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>
                  Workshops
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">Modular team strategy sessions</p>
            </div>
          </div>
        </section>

        {/* QUOTES */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">★ QUOTES</span>
            <h2 className="font-serif-pro text-xl font-semibold">Pull Quotes</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Hero quote (large) and standard blog quote styles.
          </p>
          
          <div className="space-y-8 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Hero Quote */}
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-4 block">Hero Quote</span>
              <blockquote className="relative" style={{ transform: "rotate(-0.3deg)" }}>
                <p className="font-serif-pro text-2xl md:text-4xl font-semibold leading-snug max-w-3xl">
                  "Brendan helped us find the{" "}
                  <span className="inline-block text-accent" style={{ transform: "translateY(-2px) rotate(0.5deg)" }}>
                    words
                  </span>{" "}
                  we'd been searching for."
                </p>
                <footer className="mt-4 font-serif-pro text-base text-muted-foreground">
                  <span className="inline-block" style={{ transform: "rotate(0.5deg)" }}>— Karen Cockburn</span>, CEO, Nerve Tumours UK
                </footer>
              </blockquote>
            </div>
            
            {/* Blog Quote */}
            <div className="pt-8 border-t border-border/50">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-4 block">Blog Quote</span>
              <blockquote className="border-l-4 border-accent pl-4 py-2" style={{ transform: "rotate(0.2deg)" }}>
                <p className="font-serif-pro text-xl md:text-2xl font-medium italic leading-relaxed max-w-2xl text-foreground/80">
                  "Finally, a strategist who{" "}
                  <span className="inline-block not-italic font-bold" style={{ transform: "translateY(1px)" }}>understands</span>{" "}
                  design."
                </p>
                <footer className="mt-3 font-serif-pro text-sm text-muted-foreground">
                  — A founder who gets it
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* WEIGHT REFERENCE */}
        <section className="space-y-8 pt-16">
          <h2 className="font-serif-pro text-xl font-semibold">Weight Reference</h2>
          <div className="grid gap-4">
            <p className="font-serif-pro text-2xl font-normal">Regular (400) — Body text</p>
            <p className="font-serif-pro text-2xl font-medium">Medium (500) — Emphasis</p>
            <p className="font-serif-pro text-2xl font-semibold">Semibold (600) — Section headers</p>
            <p className="font-serif-pro text-2xl font-bold">Bold (700) — Headlines</p>
            <p className="font-serif-pro text-2xl font-extrabold">Extrabold (800) — Maximum impact</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TypographyDemo;