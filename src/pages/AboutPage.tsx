import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Credentials } from "@/components/home-draft2/Credentials";
import { FAQ } from "@/components/home-draft2/FAQ";
import { CTA } from "@/components/home-draft2/CTA";
import { SectionHeader } from "@/components/home-draft2/SectionHeader";

import { ArrowRight, Layers, Cpu, Heart, Compass, Sun, Moon } from "lucide-react";
import brendanWalking from "@/assets/photos/shoreditch/brendan-27.webp";

const AboutPage = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
      <Navigation
        variant={theme === "dark" ? "image-hero" : "default"}
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
        {/* Hero — mobile stacked */}
        <section className="md:hidden">
          <div className="relative h-[58vh]">
            <img
              src={brendanWalking}
              alt="Brendan walking past street art in Shoreditch"
              className="absolute inset-0 h-full w-full object-cover object-[65%_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <span className="mb-3 inline-block text-[11px] uppercase tracking-[0.22em] text-white/75">
                About
              </span>
              <h1 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] text-white">
                About <span className="text-clay">Brendan</span>
              </h1>
            </div>
          </div>

          <div className="bg-background px-6 pb-12 pt-10">
            <p className="mb-8 text-[15.5px] leading-relaxed text-ink-soft">
              Fifteen years of figuring out why things don't work. This is what I do with that.
            </p>

            <div className="space-y-4 text-[15.5px] leading-relaxed text-ink-soft">
              <p>
                I studied Media, Communications and Philosophy at Keele — two disciplines that people told me were a waste of time, in combination they said made even less sense. What I understood, even then, was that the ethics of how information moves and the systems people build to hold it are the same problem looked at from different angles. That turned out to be a reasonable foundation for what came next.
              </p>
              <p>
                The fifteen years after that took me across a range of organisations most consultants only ever see one type of. Global enterprises like eBay and Dentsu. Agencies. Nonprofits. Purpose-led startups. Marketing directorships at early-stage companies where I was almost always running operations alongside the brand work, because in organisations of that size the two are never actually separate. And across all of it, the same pattern kept surfacing — not as a strategic observation but as something you feel in the room. Great creatives bogged down in spreadsheets they never wanted to be anywhere near, carrying cognitive load that had nothing to do with the work they were hired to do. Founders who were the vision of the company spending their days as its task router, every decision passing through them because nobody else had the context to act. New team members arriving full of energy for genuinely challenging work, and finding themselves stuck in admin within a week. The blockers were never the people. They were always the ops. And ops that get fixed properly don't just make a business run better — they give the culture room to breathe.
              </p>
              <p className="text-foreground font-medium">
                Ops that help culture. That's what this is.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
              <a
                href="/services"
                className="group inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-clay"
              >
                Services
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/journal"
                className="group inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-clay"
              >
                Journal
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Hero — desktop full-bleed overlay */}
        <section className="relative hidden md:flex min-h-[88vh] items-end">
          <img
            src={brendanWalking}
            alt="Brendan walking past street art in Shoreditch"
            className="absolute inset-0 h-full w-full object-cover object-[75%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          <div className="relative z-10 w-full px-6 pb-20 pt-32 md:px-10">
            <div className="mx-auto max-w-5xl">
              <span className="mb-5 inline-block text-[11px] uppercase tracking-[0.22em] text-white/75">
                About
              </span>
              <div className="font-serif-pro italic font-normal text-balance text-5xl leading-[1.03] tracking-[-0.02em] text-white md:text-[72px]">
                About <span className="text-clay">Brendan</span>
              </div>

              <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/85">
                Fifteen years of figuring out why things don't work. This is what I do with that.
              </p>

              <div className="mt-8 max-w-2xl space-y-4 text-[16px] leading-relaxed text-white/85">
                <p>
                  I studied Media, Communications and Philosophy at Keele — two disciplines that people told me were a waste of time, in combination they said made even less sense. What I understood, even then, was that the ethics of how information moves and the systems people build to hold it are the same problem looked at from different angles. That turned out to be a reasonable foundation for what came next.
                </p>
                <p>
                  The fifteen years after that took me across a range of organisations most consultants only ever see one type of. Global enterprises like eBay and Dentsu. Agencies. Nonprofits. Purpose-led startups. Marketing directorships at early-stage companies where I was almost always running operations alongside the brand work, because in organisations of that size the two are never actually separate. And across all of it, the same pattern kept surfacing — not as a strategic observation but as something you feel in the room. Great creatives bogged down in spreadsheets they never wanted to be anywhere near, carrying cognitive load that had nothing to do with the work they were hired to do. Founders who were the vision of the company spending their days as its task router, every decision passing through them because nobody else had the context to act. New team members arriving full of energy for genuinely challenging work, and finding themselves stuck in admin within a week. The blockers were never the people. They were always the ops. And ops that get fixed properly don't just make a business run better — they give the culture room to breathe.
                </p>
                <p className="text-white font-medium">
                  Ops that help culture. That's what this is.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14.5px]">
                <a
                  href="/services"
                  className="group inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-clay"
                >
                  Services
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="/journal"
                  className="group inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-clay"
                >
                  Journal
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section: The instinct was scepticism */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-24">
            <SectionHeader>
              The instinct was <span className="text-clay">scepticism.</span>
            </SectionHeader>
            <div className="space-y-4 text-[15.5px] leading-relaxed text-ink-soft">
              <p>
                When AI arrived as something organisations actually had to reckon with rather than just watch from a distance, my first instinct was scepticism. Not of the technology — the capability was obvious. Of the tendency to reach for it before asking what it should and shouldn't be doing. I kept coming back to the same four questions. What happens to connection when a machine handles the relationship? What happens to creativity when generation becomes automatic? What happens to curiosity when the answer always arrives instantly? What happens to contribution when effort is abstracted away? Those questions became the Four C's — the framework I use to decide where AI earns its place in a working system and where it quietly degrades the thing it was supposed to help.
              </p>
            </div>
          </div>
        </section>

        {/* Four C's */}
        <section>
          <div className="mx-auto max-w-5xl px-6 pb-20 md:px-10 md:pb-24">
            <SectionHeader eyebrow="Framework">
              The Four <span className="text-clay">C's</span>
            </SectionHeader>

            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[15.5px] leading-relaxed text-ink-soft">
                What AI must earn the right to approach.
              </p>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
                The question I kept coming back to, resolved into four principles.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {["Connection", "Creativity", "Curiosity", "Contribution"].map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full border border-hairline bg-background px-5 py-2.5 text-[13.5px] font-medium text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Methodology */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-24">
            <SectionHeader>
              The methodology behind <span className="text-clay">every build.</span>
            </SectionHeader>
            <div className="space-y-4 text-[15.5px] leading-relaxed text-ink-soft">
              <p>
                That framework sits alongside the Intentional Tool Stack approach, which governs how every tool in a client's system gets assessed — not just for what it can do, but for its data practices, its security posture, its ethical commitments, and whether it actually belongs. And the THREAD Agent Framework, which structures how AI agents are instructed, scoped, and held accountable within a Notion workspace. These aren't abstractions. They're the methodology behind every build.
              </p>
            </div>
          </div>
        </section>

        {/* Frameworks & Methodology cards */}
        <section>
          <div className="mx-auto max-w-5xl px-6 pb-20 md:px-10 md:pb-24">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-background p-8 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo/15 text-indigo">
                    <Layers className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-medium tracking-tight">
                    Intentional <span className="font-serif-pro italic text-clay">Tool Stack</span>
                  </h3>
                </div>
                <p className="text-[14.5px] leading-relaxed text-ink-soft">
                  Every tool in a client's system gets assessed — not just for what it can do, but for its data practices, its security posture, its ethical commitments, and whether it actually belongs. No tool enters the stack on convenience alone.
                </p>
              </div>

              <div className="rounded-2xl border border-hairline bg-background p-8 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet/15 text-violet">
                    <Cpu className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-medium tracking-tight">
                    THREAD <span className="font-serif-pro italic text-clay">Agent Framework</span>
                  </h3>
                </div>
                <p className="text-[14.5px] leading-relaxed text-ink-soft">
                  Structures how AI agents are instructed, scoped, and held accountable within a Notion workspace. Model-agnostic by design, permissioned by default, and built so your data stays where you own it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: The instinct was right */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-24">
            <SectionHeader>
              The instinct was <span className="text-clay">right.</span>
            </SectionHeader>
            <div className="space-y-4 text-[15.5px] leading-relaxed text-ink-soft">
              <p>
                The human-first approach that came out of that early scepticism has turned out to be one of the more durable ways of working with AI — something Anthropic's own thinking has landed on independently from a different direction. I find that alignment reassuring rather than coincidental. It suggests the instinct was right.
              </p>
            </div>
          </div>
        </section>

        {/* Credentials */}

        {/* FAQ — reuse home-draft2 FAQ */}
        <FAQ />

        <CTA theme="light" />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
