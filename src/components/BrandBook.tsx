import { useEffect, useState } from "react";
import { Emphasis } from "@/components/Emphasis";
import { 
  ArrowRight, 
  Check, 
  ChevronDown, 
  Menu, 
  X, 
  Mail, 
  Linkedin,
  Clock,
  Zap,
  Users,
  Target,
  Repeat,
  Loader2
} from "lucide-react";

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

// Custom social icons used in Footer
const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.882 1.082-6.498-2.83-7.078a6.036 6.036 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.296 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.479 0-.689-.139-1.861-.902-2.203-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
  </svg>
);

const SubstackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
);

// Brand Book - Living reference for Thread & Stack
export const BrandBook = () => {
  const [showUnderline, setShowUnderline] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowUnderline(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background p-8 md:p-16 space-y-24">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Internal Reference</p>
          <h1 className="font-serif-pro text-4xl md:text-5xl font-bold mb-4">
            Brand Book
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Logos, typography, iconography, and approved styles for Thread & Stack.
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

        {/* ICONOGRAPHY */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">★ ICONS</span>
            <h2 className="font-serif-pro text-xl font-semibold">Iconography</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Icons used across the site. All from Lucide React unless noted. Simple, line-based style.
          </p>
          
          <div className="space-y-8 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Navigation & UI */}
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-4 block">Navigation & UI</span>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Menu className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Menu</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <X className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Close</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <ChevronDown className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">ChevronDown</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">ArrowRight</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  <span className="text-xs text-muted-foreground">Loader2</span>
                </div>
              </div>
            </div>

            {/* Actions & Status */}
            <div className="pt-6 border-t border-border/50">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-4 block">Actions & Status</span>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Check className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-xs text-muted-foreground">Check</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Zap className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Zap</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Clock className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Clock</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Target className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Target</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Repeat className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Repeat</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Users</span>
                </div>
              </div>
            </div>

            {/* Social & Contact */}
            <div className="pt-6 border-t border-border/50">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-4 block">Social & Contact</span>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Mail className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Mail</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <Linkedin className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">LinkedIn</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <BlueskyIcon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Bluesky*</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <SubstackIcon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">Substack*</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">* Custom SVG icons (not Lucide)</p>
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

export default BrandBook;