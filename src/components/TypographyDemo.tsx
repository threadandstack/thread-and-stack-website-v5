import { useEffect, useState } from "react";

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

        {/* VARIATION 1: Scholarly Authority */}
        <section className="space-y-8 pb-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">01</span>
            <h2 className="font-serif-pro text-xl font-semibold">Scholarly Authority</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Heavy weight with subtle baseline shifts on key words. Academic gravitas with human warmth.
          </p>
          
          <div className="space-y-6 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Title */}
            <h3 className="font-serif-pro text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Marketing that feels{" "}
              <span className="inline-block" style={{ transform: "translateY(-2px) rotate(-0.5deg)" }}>
                more
              </span>{" "}
              <span className="inline-block text-accent" style={{ transform: "translateY(3px) rotate(0.8deg)" }}>
                human
              </span>
            </h3>
            
            {/* Subtitle */}
            <p className="font-serif-pro text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl">
              The brands that feel{" "}
              <span className="inline-block italic" style={{ transform: "translateY(1px)" }}>alive</span>, 
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

        {/* VARIATION 3: Marginalia */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">03</span>
            <h2 className="font-serif-pro text-xl font-semibold">Marginalia</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Inspired by notes in margins. Mixed weights and sizes suggest evolving thought.
          </p>
          
          <div className="space-y-6 bg-muted/20 p-8 md:p-12 rounded-2xl">
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
            <h2 className="font-serif-pro text-xl font-semibold">Pull Quotes</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Testimonials with presence. The slight tilt suggests authentic voice.
          </p>
          
          <div className="space-y-8 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Quote 1 - Large */}
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
            
            {/* Quote 2 - Medium */}
            <blockquote className="pt-8 border-t border-border/50" style={{ transform: "rotate(0.2deg)" }}>
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
        </section>

        {/* VARIATION 5: Section Headers */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">05</span>
            <h2 className="font-serif-pro text-xl font-semibold">Section Headers</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Hierarchy with personality. Numbers as anchors, titles with subtle motion.
          </p>
          
          <div className="space-y-12 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Header style 1 */}
            <div className="flex items-baseline gap-6">
              <span className="font-serif-pro text-6xl md:text-8xl font-extralight text-accent/40">01</span>
              <h3 className="font-serif-pro text-2xl md:text-4xl font-bold" style={{ transform: "translateY(4px) rotate(-0.3deg)" }}>
                What We Do
              </h3>
            </div>
            
            {/* Header style 2 */}
            <div className="flex items-baseline gap-6">
              <span className="font-serif-pro text-6xl md:text-8xl font-extralight text-accent/40">02</span>
              <h3 className="font-serif-pro text-2xl md:text-4xl font-bold" style={{ transform: "translateY(-2px) rotate(0.4deg)" }}>
                How It Works
              </h3>
            </div>
            
            {/* Header style 3 */}
            <div className="flex items-baseline gap-6">
              <span className="font-serif-pro text-6xl md:text-8xl font-extralight text-accent/40">03</span>
              <h3 className="font-serif-pro text-2xl md:text-4xl font-bold" style={{ transform: "translateY(2px) rotate(-0.5deg)" }}>
                Featured Work
              </h3>
            </div>
          </div>
        </section>

        {/* VARIATION 6: Stacked Words (Logo-inspired) */}
        <section className="space-y-8 py-16 border-b border-border">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">06</span>
            <h2 className="font-serif-pro text-xl font-semibold">Stacked Words (Logo-inspired)</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Direct translation of logo energy. Stacked, shifted, intentionally imperfect.
          </p>
          
          <div className="space-y-6 bg-muted/20 p-8 md:p-12 rounded-2xl">
            {/* Logo-style stacking */}
            <div className="space-y-0">
              <h3 
                className="font-serif-pro text-5xl md:text-8xl font-black leading-none"
                style={{ transform: "rotate(-1deg)", letterSpacing: "-0.02em" }}
              >
                Thread
              </h3>
              <h3 
                className="font-serif-pro text-5xl md:text-8xl font-black leading-none text-accent"
                style={{ transform: "translateX(10px) rotate(0.5deg)", letterSpacing: "-0.02em" }}
              >
                Stack
              </h3>
            </div>
            
            {/* Application to other words */}
            <div className="pt-8 space-y-0">
              <h3 
                className="font-serif-pro text-4xl md:text-6xl font-bold leading-none"
                style={{ transform: "rotate(-0.8deg)" }}
              >
                Brand
              </h3>
              <h3 
                className="font-serif-pro text-4xl md:text-6xl font-bold leading-none"
                style={{ transform: "translateX(8px) rotate(0.3deg)" }}
              >
                Strategy
              </h3>
              <h3 
                className="font-serif-pro text-4xl md:text-6xl font-bold leading-none text-accent"
                style={{ transform: "translateX(-4px) rotate(-0.5deg)" }}
              >
                Systems
              </h3>
            </div>
          </div>
        </section>

        {/* VARIATION 7: Subtle Application */}
        <section className="space-y-8 py-16">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">07</span>
            <h2 className="font-serif-pro text-xl font-semibold">Subtle Application</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Minimal intervention. Just enough imperfection to feel human without being distracting.
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
