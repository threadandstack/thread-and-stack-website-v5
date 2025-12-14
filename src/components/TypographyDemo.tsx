import { useEffect, useState } from "react";
import { Emphasis } from "@/components/Emphasis";

// Typography demo exploring Crimson Pro with academic/strategic imperfection
export const TypographyDemo = () => {
  return (
    <div className="min-h-screen bg-background p-8 md:p-16 space-y-24">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Typography Exploration</p>
          <h1 className="font-serif-pro text-4xl md:text-5xl font-bold mb-4">
            Crimson Pro: Academic Imperfection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Drawing from academia, strategy, and human imperfection. 
            Each variation explores weight, baseline dance, and organic placement.
          </p>
        </header>

        {/* LOGO REFERENCE SECTION */}
        <section className="space-y-8 pb-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">00</span>
            <h2 className="font-serif-pro text-xl font-semibold">Logo Reference</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Upload your logo assets to see them against these typography treatments.
          </p>
          
          <div className="bg-muted/20 p-8 md:p-12 rounded-2xl border-2 border-dashed border-border">
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <p className="text-muted-foreground text-center">
                Logo files not found in assets folder.<br />
                <span className="text-sm">Add logo images to src/assets/ and I'll display them here.</span>
              </p>
              <div className="flex gap-8 mt-4">
                <div className="w-32 h-32 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                  Logo Light
                </div>
                <div className="w-32 h-32 bg-foreground rounded-lg flex items-center justify-center text-background text-xs">
                  Logo Dark
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECOMMENDED COMBINATION */}
        <section className="space-y-8 py-16 border-b-2 border-accent/30">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">★ RECOMMENDED</span>
            <h2 className="font-serif-pro text-xl font-semibold">Marginalia + Subtle Application</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Combining the expressive mixed-weight approach of Marginalia with the refined restraint of Subtle Application.
          </p>
          
          <div className="space-y-8 bg-accent/5 p-8 md:p-12 rounded-2xl border border-accent/20">
            {/* Hero-level treatment using Marginalia style */}
            <div className="space-y-4">
              <h3 className="font-serif-pro text-4xl md:text-6xl leading-snug">
                <span className="font-bold">Marketing</span>{" "}
                <span className="font-normal text-3xl md:text-5xl text-muted-foreground inline-block" style={{ transform: "translateY(2px)" }}>
                  that feels
                </span>
                <br />
                <span className="font-extrabold inline-block relative" style={{ transform: "rotate(-0.5deg)" }}>
                  more human
                  <Emphasis className="absolute -bottom-2 left-0 right-0" delay={500} />
                </span>
              </h3>
              
              {/* Subtitle with accent on "alive" */}
              <p className="font-serif-pro text-xl md:text-2xl text-muted-foreground">
                The brands that feel <span className="text-accent font-medium">alive</span>, are remembered.
              </p>
            </div>

            {/* Section header using Subtle Application */}
            <div className="pt-8 border-t border-border/50">
              <h4 className="font-serif-pro text-2xl md:text-4xl font-semibold leading-tight max-w-3xl">
                I help purpose-led teams build brands that{" "}
                <span className="inline-block" style={{ transform: "translateY(-1px)" }}>stay</span>{" "}
                <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>true</span>{" "}
                while scaling.
              </h4>
            </div>

            {/* Annotation/quote using Marginalia */}
            <p className="font-serif-pro italic text-lg text-muted-foreground border-l-2 border-accent/30 pl-4 max-w-md" style={{ transform: "rotate(-0.3deg)" }}>
              Strategy. Creative direction. Systems that work.
            </p>
          </div>
        </section>

        {/* VARIATION 1: Scholarly Authority - Updated with accent "alive" and underline like Hero */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">01</span>
            <h2 className="font-serif-pro text-xl font-semibold">Scholarly Authority (Hero-style)</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Updated with accent color on "alive" and underline treatment matching the current hero.
          </p>
          
          <div className="space-y-6 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Title with underline like Hero */}
            <h3 className="font-serif-pro text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Marketing that feels{" "}
              <span className="inline-block" style={{ transform: "translateY(-2px) rotate(-0.5deg)" }}>
                more
              </span>{" "}
              <span className="inline-block relative" style={{ transform: "translateY(3px) rotate(0.8deg)" }}>
                human
                <Emphasis className="absolute -bottom-2 left-0 right-0" delay={300} />
              </span>
            </h3>
            
            {/* Subtitle with accent on alive */}
            <p className="font-serif-pro text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl">
              The brands that feel{" "}
              <span className="inline-block italic text-accent" style={{ transform: "translateY(1px)" }}>alive</span>, 
              are remembered.
            </p>
          </div>
        </section>

        {/* VARIATION 2: Thesis Statement */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">02</span>
            <h2 className="font-serif-pro text-xl font-semibold">Thesis Statement</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Each word as a deliberate choice. Rotation suggests handwritten margin notes.
          </p>
          
          <div className="space-y-6 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Title with staggered words */}
            <h3 className="font-serif-pro text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="inline-block" style={{ transform: "rotate(-1deg)" }}>Clear</span>{" "}
              <span className="inline-block font-medium" style={{ transform: "translateY(4px) rotate(0.5deg)" }}>narratives.</span>
              <br />
              <span className="inline-block" style={{ transform: "rotate(0.5deg)" }}>Practical</span>{" "}
              <span className="inline-block font-medium" style={{ transform: "translateY(-2px) rotate(-0.8deg)" }}>workflows.</span>
            </h3>
            
            {/* Subtitle */}
            <p className="font-serif-pro text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Turn messy marketing into something you can{" "}
              <span className="inline-block font-semibold" style={{ transform: "rotate(-0.3deg)" }}>trust</span>.
            </p>
          </div>
        </section>

        {/* VARIATION 3: Marginalia - Marked as BEST */}
        <section className="space-y-8 py-16 border-b border-border bg-accent/5 -mx-8 md:-mx-16 px-8 md:px-16 rounded-2xl">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">03 ★ BEST</span>
            <h2 className="font-serif-pro text-xl font-semibold">Marginalia</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Inspired by notes in margins. Mixed weights and sizes suggest evolving thought. <strong>Best for hero-level usage.</strong>
          </p>
          
          <div className="space-y-6 bg-background p-8 md:p-12 rounded-2xl border border-border/50">
            {/* Title with mixed treatment */}
            <h3 className="font-serif-pro text-3xl md:text-5xl leading-snug">
              <span className="font-bold">Strategy</span>{" "}
              <span className="font-normal text-2xl md:text-4xl text-muted-foreground inline-block" style={{ transform: "translateY(2px)" }}>
                that protects
              </span>
              <br />
              <span className="font-extrabold text-accent inline-block" style={{ transform: "rotate(-0.5deg)" }}>
                creative
              </span>{" "}
              <span className="font-bold">integrity</span>
            </h3>
            
            {/* Annotation style */}
            <p className="font-serif-pro italic text-lg text-muted-foreground border-l-2 border-accent/30 pl-4 max-w-md" style={{ transform: "rotate(-0.3deg)" }}>
              Not replacement. Empowerment.
            </p>
          </div>
        </section>

        {/* VARIATION 4: Pull Quote / Testimonial */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">04</span>
            <h2 className="font-serif-pro text-xl font-semibold">Pull Quotes (Hero vs Standard)</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Hero quotes for impact, standard quotes for blog content. Blog quotes inherit smaller styling with Notion-style line highlighter.
          </p>
          
          <div className="space-y-8 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Quote 1 - Hero Quote (Large) */}
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
            
            {/* Quote 2 - Standard/Blog Quote (Smaller, with line highlighter) */}
            <div className="pt-8 border-t border-border/50">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-4 block">Standard Quote (Blog)</span>
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

        {/* VARIATION 5: Section Headers - Smaller numbers, more presence */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">05</span>
            <h2 className="font-serif-pro text-xl font-semibold">Section Headers (Refined)</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Reduced number size, increased section presence. More balanced hierarchy.
          </p>
          
          <div className="space-y-10 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Header style 1 - refined */}
            <div className="flex items-baseline gap-4 border-b border-border/30 pb-4">
              <span className="font-serif-pro text-3xl md:text-4xl font-light text-accent">01</span>
              <h3 className="font-serif-pro text-2xl md:text-4xl font-bold" style={{ transform: "translateY(2px) rotate(-0.3deg)" }}>
                What We Do
              </h3>
            </div>
            
            {/* Header style 2 - refined */}
            <div className="flex items-baseline gap-4 border-b border-border/30 pb-4">
              <span className="font-serif-pro text-3xl md:text-4xl font-light text-accent">02</span>
              <h3 className="font-serif-pro text-2xl md:text-4xl font-bold" style={{ transform: "translateY(-1px) rotate(0.4deg)" }}>
                How It Works
              </h3>
            </div>
            
            {/* Header style 3 - refined */}
            <div className="flex items-baseline gap-4 border-b border-border/30 pb-4">
              <span className="font-serif-pro text-3xl md:text-4xl font-light text-accent">03</span>
              <h3 className="font-serif-pro text-2xl md:text-4xl font-bold" style={{ transform: "translateY(1px) rotate(-0.5deg)" }}>
                Featured Work
              </h3>
            </div>
          </div>
        </section>

        {/* VARIATION 6: Product Cards (Using Subtle Application Style 07) */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">06</span>
            <h2 className="font-serif-pro text-xl font-semibold">Product Cards (Subtle Application)</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Using the Subtle Application style for product cards. Clean, minimal intervention.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Product Card 1 */}
            <div className="bg-muted/20 p-6 rounded-2xl space-y-3 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-serif-pro text-2xl md:text-3xl font-semibold leading-tight">
                Clarity{" "}
                <span className="inline-block" style={{ transform: "translateY(1px)" }}>
                  <span style={{ color: "hsl(234 89% 50%)" }}>Sessions</span>
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">60-minute strategic power hours</p>
            </div>

            {/* Product Card 2 */}
            <div className="bg-muted/20 p-6 rounded-2xl space-y-3 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-serif-pro text-2xl md:text-3xl font-semibold leading-tight">
                Mentorship{" "}
                <span className="inline-block" style={{ transform: "translateY(1px)" }}>
                  <span style={{ color: "hsl(234 89% 50%)" }}>Sprints</span>
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">6-week AI workflow builds</p>
            </div>

            {/* Product Card 3 */}
            <div className="bg-muted/20 p-6 rounded-2xl space-y-3 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-serif-pro text-2xl md:text-3xl font-semibold leading-tight">
                Brand{" "}
                <span className="inline-block" style={{ transform: "translateY(1px)" }}>
                  <span style={{ color: "hsl(234 89% 50%)" }}>Workshops</span>
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">Modular team strategy sessions</p>
            </div>
          </div>
        </section>

        {/* VARIATION 7: Subtle Application - Overall use */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">07 ★ DEFAULT</span>
            <h2 className="font-serif-pro text-xl font-semibold">Subtle Application</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Minimal intervention. Sensible for overall use, letting the logo do most of the singing.
          </p>
          
          <div className="space-y-6 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Near-normal with tiny shifts */}
            <h3 className="font-serif-pro text-3xl md:text-5xl font-semibold leading-tight max-w-3xl">
              I help purpose-led teams build brands that{" "}
              <span className="inline-block" style={{ transform: "translateY(-1px)" }}>stay</span>{" "}
              <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>true</span>{" "}
              while scaling.
            </h3>
            
            <p className="font-serif-pro text-lg text-muted-foreground max-w-xl leading-relaxed">
              Through strategy, creative direction, and systems that{" "}
              <span className="inline-block font-medium" style={{ transform: "translateY(-0.5px)" }}>actually</span>{" "}
              work.
            </p>
          </div>
        </section>

        {/* Weight comparison */}
        <section className="space-y-8 pt-16 border-t border-border">
          <h2 className="font-serif-pro text-xl font-semibold">Weight Reference</h2>
          <div className="grid gap-4">
            <p className="font-serif-pro text-2xl font-normal">Regular (400) — Body text, longer passages</p>
            <p className="font-serif-pro text-2xl font-medium">Medium (500) — Emphasis, subtitles</p>
            <p className="font-serif-pro text-2xl font-semibold">Semibold (600) — Section headers, quotes</p>
            <p className="font-serif-pro text-2xl font-bold">Bold (700) — Primary headlines</p>
            <p className="font-serif-pro text-2xl font-extrabold">Extrabold (800) — Maximum impact</p>
            <p className="font-serif-pro text-2xl font-black">Black (900) — Logo-weight, hero moments</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TypographyDemo;
