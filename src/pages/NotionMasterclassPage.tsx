import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { PillButton } from "@/components/ui/pill-button";
import { Emphasis } from "@/components/Emphasis";
import { MasterclassRegisterDrawer } from "@/components/MasterclassRegisterDrawer";
import { ShapeDivider } from "@/components/ShapeDivider";
import {
  Rocket,
  MessageCircle,
  Check,
  Compass,
  Layers,
  Workflow,
  Sparkles,
  Target,
  Calendar,
  Clock,
  Video,
  Download,
} from "lucide-react";
import {
  trackServiceView,
  trackCtaClick,
  useScrollDepthTracking,
} from "@/hooks/useAnalytics";

import workshop1 from "@/assets/photos/workshop/brendan-1.webp";
import workshop22 from "@/assets/photos/workshop/brendan-22.webp";
import workshop24 from "@/assets/photos/workshop/brendan-24.webp";
import portrait7 from "@/assets/photos/portraits/brendan-7.webp";

const PRICE_LABEL = "£149";

const FAQ_ITEMS = [
  {
    question: "What's the format?",
    answer:
      "A 90-minute live online session — half teaching, half live build, with time at the end for your specific questions. Everyone gets the recording and the workspace template afterwards.",
  },
  {
    question: "Do I need to be a Notion expert?",
    answer:
      "No. You should be comfortable enough that Notion isn't intimidating, but the masterclass is built for founders who feel their setup has outgrown them — not for power users looking for advanced API tricks.",
  },
  {
    question: "Will I get the recording?",
    answer:
      "Yes — every attendee gets a high-quality recording, the slides, the Notion workspace template, and a 30-day implementation checklist. Yours to keep.",
  },
  {
    question: "Can I expense it?",
    answer:
      "Absolutely. You'll receive a proper invoice on registration. I'm not VAT registered, so the price you see is the price you pay.",
  },
  {
    question: "What if I can't make the live session?",
    answer:
      "Register anyway. You'll get the full recording and materials, and can submit your question in advance — I'll answer it on the call so it's there when you watch back.",
  },
  {
    question: "Are refunds available?",
    answer:
      "Because you receive the full materials immediately on registration, refunds aren't possible. If you're unsure whether it's the right fit, send me a question via the drawer below — I'd rather you skip it than buy something that doesn't suit you.",
  },
];

// Soft fade-up wrapper used across sections
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
};

const NotionMasterclassPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"register" | "question">(
    "register",
  );

  useEffect(() => {
    document.title = "Notion Masterclass for Founders — Thread & Stack";
    trackServiceView("Notion Masterclass");
    const cleanup = useScrollDepthTracking("notion-masterclass");
    return cleanup;
  }, []);

  const openRegister = (location: string) => {
    trackCtaClick("Save my seat", location);
    setDrawerMode("register");
    setDrawerOpen(true);
  };

  const openQuestion = (location: string) => {
    trackCtaClick("Ask a question", location);
    setDrawerMode("question");
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* HERO */}
      <section className="relative pt-32 md:pt-40 lg:pt-44 pb-24 md:pb-28 px-6 overflow-hidden">
        {/* Subtle indigo glow accents */}
        <div className="pointer-events-none absolute top-20 -left-32 w-[460px] h-[460px] rounded-full bg-accent/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 w-[380px] h-[380px] rounded-full bg-accent/5 blur-3xl" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-sans font-medium text-accent tracking-wide uppercase">
                Live Online Masterclass · 90 minutes
              </span>
            </div>

            <h1 className="font-serif-pro text-4xl md:text-5xl lg:text-[3.5rem] font-semibold italic leading-[1.05] tracking-tight max-w-xl">
              The Notion{" "}
              <span className="relative inline-block text-accent">
                Masterclass
                <Emphasis className="absolute -bottom-2 left-0 right-0" delay={400} animate />
              </span>
              <br />
              for a system that{" "}
              <span className="text-accent">sticks</span>.
            </h1>

            <p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              Ninety minutes to turn a tangle of tabs and half-built templates
              into one workspace that quietly runs your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <PillButton
                size="lg"
                icon={Rocket}
                className="font-semibold"
                onClick={() => openRegister("hero")}
              >
                Save my seat — {PRICE_LABEL}
              </PillButton>
              <PillButton
                size="lg"
                variant="outline"
                icon={Compass}
                asChild
              >
                <a href="#what-youll-leave-with">What you'll leave with</a>
              </PillButton>
            </div>

            <p className="text-sm text-muted-foreground/70 pt-1 max-w-md">
              Includes the recording, workspace template, and £100 credit toward
              Notion &amp; Systems Consultancy.
            </p>
          </div>

          {/* Hero visual — frosted card on photo */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(19,64,232,0.35)]">
              <img
                src={workshop1}
                alt="Brendan running a Notion workshop"
                className="w-full h-[460px] lg:h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-background/90 backdrop-blur-md rounded-2xl p-5">
                <div className="flex items-center gap-3 text-sm font-sans">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="text-foreground font-medium">
                    Next cohort dates announced soon
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm font-sans mt-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">
                    90 minutes live · plus recording &amp; templates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM — indigo callout card */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative bg-indigo text-indigo-foreground rounded-[2rem] md:rounded-[2.5rem] px-8 py-14 md:px-14 md:py-20 overflow-hidden shadow-[0_30px_80px_-30px_rgba(19,64,232,0.45)]">
              {/* Soft glow accents — preserved style */}
              <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 -right-20 w-[480px] h-[480px] rounded-full bg-white/5 blur-3xl" />

              <div className="relative text-center">
                <p className="text-sm uppercase tracking-widest text-indigo-foreground/60 mb-4">
                  The problem
                </p>
                <h2 className="font-serif-pro text-3xl md:text-4xl font-semibold italic leading-tight mb-6 text-indigo-foreground">
                  You don't have a Notion problem.{" "}
                  <br className="hidden md:block" />
                  You have a{" "}
                  <span className="relative inline-block">
                    system
                    <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white/50 rounded-full" />
                  </span>{" "}
                  problem.
                </h2>
                <p className="font-sans text-lg text-indigo-foreground/80 leading-relaxed max-w-2xl mx-auto">
                  Most founders I meet are paying a quiet creative tax —
                  context-switching between a dozen apps, rebuilding the same
                  pages, losing track of what they decided last Tuesday. Notion
                  isn't the issue. The architecture under it is.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="font-serif-pro text-3xl md:text-4xl font-semibold italic text-center mb-12">
              Who this is for
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Founders building from scratch",
                body:
                  "You've outgrown the messy Google Drive era and want one place where everything lives — without spending six weekends building it.",
              },
              {
                title: "Solo operators wearing every hat",
                body:
                  "Strategy, ops, content, sales, finance — all in your head. You need a workspace that holds it for you so you can stop holding it all.",
              },
              {
                title: "Makers building a stack",
                body:
                  "You've got Notion, Linear, Airtable, three Google Sheets and a Trello board you forgot about. Time to consolidate with intent.",
              },
              {
                title: "Operators going from scrappy to scalable",
                body:
                  "The duct tape worked when it was just you. Now there's a contractor, a VA, a partner — and the system needs to work for them too.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="bg-card rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(19,64,232,0.08)] transition-shadow h-full">
                  <div className="flex items-start gap-3">
                    <span className="mt-2 w-2.5 h-2.5 rounded-full bg-accent ring-[5px] ring-accent/15 flex-shrink-0" />
                    <div>
                      <h3 className="font-serif-pro text-xl italic font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL LEAVE WITH */}
      <section
        id="what-youll-leave-with"
        className="relative py-20 px-6 bg-muted/30 overflow-hidden"
      >
        <ShapeDivider position="top" fillClassName="fill-background" />
        <ShapeDivider position="bottom" fillClassName="fill-background" />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-sm uppercase tracking-widest text-muted-foreground text-center mb-4">
              What you'll master
            </p>
            <h2 className="font-serif-pro text-3xl md:text-4xl font-semibold italic text-center mb-12">
              Four shifts in 90 minutes
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: Layers,
                title: "An architecture that scales with you",
                body:
                  "The four-layer stack I use with every client — from atomic notes through to the dashboards your future hires will actually open.",
              },
              {
                icon: Workflow,
                title: "Capture · Process · Publish",
                body:
                  "A repeatable workflow for getting ideas, tasks and content out of your head and into the right place without thinking about it.",
              },
              {
                icon: Target,
                title: "Killing the twelve-tool tax",
                body:
                  "How to decide what stays in Notion, what stays in its specialist tool, and how to wire the two together so nothing falls between cracks.",
              },
              {
                icon: Sparkles,
                title: "Templates you'll use tomorrow",
                body:
                  "You'll leave with a working Notion workspace template — not a shiny demo, but the actual scaffolding for your operating system.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="bg-card rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-full">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-serif-pro text-xl italic font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL #1 (placeholder pull-quote) */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="bg-card rounded-2xl p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <p className="font-serif-pro text-2xl md:text-3xl italic leading-snug mb-6">
                "Brendan rebuilt the way we run the studio in a single
                afternoon. Six months on, we're still using exactly what he set
                up — and adding to it."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-semibold">
                  AS
                </div>
                <div>
                  <p className="font-sans font-semibold">Alex S.</p>
                  <p className="text-sm text-muted-foreground">
                    Founder, independent design studio
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE FRAMEWORK — indigo callout card */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-indigo text-indigo-foreground rounded-[2rem] md:rounded-[2.5rem] px-8 py-14 md:px-14 md:py-16 overflow-hidden shadow-[0_30px_80px_-30px_rgba(19,64,232,0.45)]">
            {/* Soft glow accents */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-20 w-[480px] h-[480px] rounded-full bg-white/5 blur-3xl" />

            <div className="relative grid md:grid-cols-12 gap-10 items-center">
              <Reveal className="md:col-span-7">
                <p className="text-sm uppercase tracking-widest text-indigo-foreground/60 mb-4">
                  The framework
                </p>
                <h2 className="font-serif-pro text-3xl md:text-4xl font-semibold italic mb-6 leading-tight text-indigo-foreground">
                  Thread → Stack → Ship
                </h2>
                <p className="text-indigo-foreground/80 leading-relaxed mb-4">
                  Every system we build runs on the same spine. Pull the
                  <span className="text-indigo-foreground font-medium"> thread </span>
                  of how your business actually works. Build the
                  <span className="text-indigo-foreground font-medium"> stack </span>
                  that holds it. Then
                  <span className="text-indigo-foreground font-medium"> ship </span>
                  the workflows that use it daily.
                </p>
                <p className="text-indigo-foreground/80 leading-relaxed">
                  The masterclass walks the same three steps live, with your
                  business as the example. You'll leave with the framework, the
                  language, and the workspace.
                </p>
              </Reveal>
              <Reveal className="md:col-span-5" delay={120}>
                <div className="rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-white/15">
                  <img
                    src={workshop22}
                    alt="Workshop participants mapping a Notion system"
                    className="w-full h-[360px] object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-10 items-center">
          <Reveal className="md:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)]">
              <img
                src={portrait7}
                alt="Brendan Rodgers — Notion Certified Consultant"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="md:col-span-7" delay={120}>
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Your instructor
            </p>
            <h2 className="font-serif-pro text-3xl md:text-4xl font-semibold italic mb-6 leading-tight">
              Hi, I'm Brendan.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm a Notion Certified Consultant, designer and strategist. For
                the last decade I've helped founders and creative teams turn
                tangled tools and half-finished docs into systems they
                genuinely use.
              </p>
              <p>
                I've built workspaces for solo founders, ten-person studios and
                teams inside eBay, Dentsu and IMMA Collective. The masterclass
                is the distilled, founder-grade version of what I run inside
                paid engagements — opinionated, practical, and built around
                the realities of running a small business in 2026.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRICING */}
      <section className="relative py-20 px-6 bg-muted/30 overflow-hidden">
        <ShapeDivider position="top" fillClassName="fill-background" />
        <ShapeDivider position="bottom" fillClassName="fill-background" />
        <div className="relative max-w-2xl mx-auto">
          <Reveal>
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-[0_8px_40px_-10px_rgba(19,64,232,0.15)] border border-accent/10">
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
                The Notion Masterclass
              </p>
              <h2 className="font-serif-pro text-3xl md:text-4xl italic font-semibold mb-2">
                One session, lifetime access.
              </h2>
              <p className="text-muted-foreground mb-6">
                Live 90-minute online session. Recording, slides and Notion
                workspace template yours to keep.
              </p>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-serif-pro text-5xl md:text-6xl font-semibold text-accent">
                  {PRICE_LABEL}
                </span>
                <span className="text-muted-foreground">per seat</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Live 90-minute online masterclass",
                  "High-quality recording — yours to keep",
                  "The full Notion workspace template",
                  "30-day implementation checklist",
                  "£100 credit toward Notion & Systems Consultancy",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-accent ring-[5px] ring-accent/15 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <PillButton
                size="lg"
                icon={Rocket}
                className="w-full font-semibold"
                onClick={() => openRegister("pricing")}
              >
                Save my seat — {PRICE_LABEL}
              </PillButton>

              <p className="text-xs text-muted-foreground/70 text-center mt-4">
                Not VAT registered — the price you see is the price you pay.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT YOU TAKE HOME */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-sm uppercase tracking-widest text-muted-foreground text-center mb-4">
              Bonus material
            </p>
            <h2 className="font-serif-pro text-3xl md:text-4xl font-semibold italic text-center mb-12">
              What you take home
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Video,
                title: "The recording",
                body:
                  "Full HD recording of the live session, plus the slides — so you can rewatch, share or revisit any time.",
              },
              {
                icon: Download,
                title: "The workspace template",
                body:
                  "A complete Notion template implementing the framework — duplicated into your workspace and ready to adapt.",
              },
              {
                icon: Check,
                title: "The 30-day checklist",
                body:
                  "A simple, day-by-day implementation plan so the masterclass turns into a system you actually use.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="bg-card rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-full">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-serif-pro text-xl italic font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL #2 */}
      <section className="relative py-20 px-6 bg-muted/30 overflow-hidden">
        <ShapeDivider position="top" fillClassName="fill-background" />
        <ShapeDivider position="bottom" fillClassName="fill-background" />
        <div className="relative max-w-3xl mx-auto">
          <Reveal>
            <div className="bg-card rounded-2xl p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <p className="font-serif-pro text-2xl md:text-3xl italic leading-snug mb-6">
                "Ninety minutes with Brendan saved me about six weekends of
                template-tweaking. I left with a system, not just ideas."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-semibold">
                  JM
                </div>
                <div>
                  <p className="font-sans font-semibold">Jess M.</p>
                  <p className="text-sm text-muted-foreground">
                    Founder, B2B SaaS
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={FAQ_ITEMS} title="Common questions" />

      {/* FINAL CTA — indigo tier */}
      <section className="relative py-28 px-6 bg-indigo text-indigo-foreground overflow-hidden">
        <ShapeDivider position="top" fillClassName="fill-background" />
        {/* Subtle glow accents */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full bg-white/5 blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <h2 className="font-serif-pro text-3xl md:text-5xl font-semibold italic leading-tight mb-6 text-indigo-foreground">
              Ready for a Notion system that{" "}
              <span className="italic underline decoration-white/40 decoration-2 underline-offset-[6px]">
                actually sticks
              </span>
              ?
            </h2>
            <p className="text-lg text-indigo-foreground/80 max-w-xl mx-auto mb-8 leading-relaxed">
              Save your seat for the next live session, or send me a question
              first — whichever feels right.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <PillButton
                size="lg"
                icon={Rocket}
                className="font-semibold bg-white text-accent hover:bg-white/90"
                onClick={() => openRegister("final-cta")}
              >
                Save my seat — {PRICE_LABEL}
              </PillButton>
              <PillButton
                size="lg"
                variant="outline"
                icon={MessageCircle}
                className="border-white/40 text-indigo-foreground hover:bg-white/10"
                onClick={() => openQuestion("final-cta")}
              >
                Ask a question
              </PillButton>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />

      <MasterclassRegisterDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        source="notion-masterclass"
      />
    </div>
  );
};

export default NotionMasterclassPage;
