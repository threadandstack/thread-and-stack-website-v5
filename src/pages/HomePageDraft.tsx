import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { ContactDrawer } from "@/components/ContactDrawer";
import { TestimonialVariants } from "@/components/TestimonialVariants";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  Check,
  Rocket,
  MessageCircle,
  Shield,
  Bot,
  Briefcase,
  TrendingUp,
  Crown,
  Sparkles,
  Compass,
  PenTool,
  Wrench,
  HeartHandshake,
  Quote,
} from "lucide-react";
import logo from "@/assets/logos/Black_TS_Stacked.svg";
import logoIndigo from "@/assets/logos/Indigo_TS_Stacked.svg";
import notionBadges from "@/assets/notion-badges.png";

const HomePageDraft = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);
  const [selected, setSelected] = useState(0);

  const builds = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: "BizOps",
      title: "The Operating System for the Business",
      description:
        "The connective tissue of your company — workflows, SOPs, knowledge bases, and the documentation layer that keeps everyone moving in the same direction.",
      includes: [
        "Workspace architecture & information design",
        "Workflow mapping, SOPs & documentation",
        "Cross-team handoffs & process clarity",
        "Single source of truth for the team",
      ],
      cta: "Build my BizOps",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "RevOps",
      title: "Pipeline, CRM & Revenue Workflows",
      description:
        "Joined-up sales and marketing operations — from first touch to closed-won. Lead lifecycle, pipeline hygiene, and attribution that actually tells you what works.",
      includes: [
        "CRM design, migration & cleanup",
        "Lead lifecycle & pipeline workflows",
        "Marketing → sales handoff automations",
        "Attribution, reporting & revenue dashboards",
      ],
      cta: "Build my RevOps",
    },
    {
      icon: <Crown className="w-6 h-6" />,
      label: "ExecOps",
      title: "A Leadership OS for Founders & Teams",
      description:
        "The operating rhythm that lets a leadership team think clearly — meeting cadences, decision logs, weekly reviews, and the dashboards that surface what matters.",
      includes: [
        "Meeting cadence & decision-log design",
        "Weekly / monthly review systems",
        "Exec dashboards & team-health signals",
        "Strategic planning workflows",
      ],
      cta: "Build my ExecOps",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      label: "AIOps",
      title: "Team OS",
      description:
        "AI woven through your existing stack — custom agents, content pipelines, and automations that quietly do the work in the background and give your team back time.",
      includes: [
        "Custom AI agents built to your workflow",
        "Email triage, summarisation & briefing",
        "Content & research automation pipelines",
        "Stack-wide automation orchestration",
      ],
      cta: "Build my AIOps",
    },
  ];

  const testimonials = [
    {
      headline: "Genuinely transformative",
      quote:
        "This Notion Mentorship sprint has been genuinely transformative for me. In just a few weeks, I significantly upped my productivity and efficiency — not just in how much I get done, but in how clearly I can show the value of my work.",
      author: "Jasmine Stone",
      date: "Marketing Manager",
    },
    {
      headline: "Hire Brendan, you won't regret it!",
      quote:
        "Brendan is like a Swiss army knife when it comes to marketing — strategic and hands-on. He helped me build a system that actually works for The IMMA Collective, I've now got real peace of mind, a clear vision for the business, and marketing that feels properly joined up.",
      author: "Lilli Graf",
      date: "Apr 17, 2026",
    },
    {
      headline: "Brendan does great work!",
      quote:
        "Brendan did a terrific and patient job of untangling my Notion ineptitude. I'm saving time already with the new cleaned up format.",
      author: "Lucian James",
      date: "May 8, 2026",
    },
    {
      headline: "More progress in months than a year",
      quote:
        "Brendan has been a dream. His support totally invigorated us. We've made more progress in the last couple of months than we had in the previous year.",
      author: "Alex Aggidis",
      date: "Head of Marketing, Fundraising Everywhere",
    },
    {
      headline: "Tenacious and exceptional",
      quote:
        "Brendan is one of the most tenacious marketers I've met, fast to action plans with exceptional follow through to get the job done.",
      author: "Courtney Evans",
      date: "CEO, Funraisin",
    },
    {
      headline: "A safe pair of hands",
      quote:
        "Brendan is smart. He gets it quickly. He's a very safe pair of hands.",
      author: "Gary O'Donnell",
      date: "Operations Director, Dentsu Aegis",
    },
    {
      headline: "Big thinking, sharp strategy",
      quote:
        "Brendan constantly combined big thinking and strategic expertise to propose innovative new ideas for guiding content development — aligning deep research and analysis with project objectives and KPIs.",
      author: "Chris Mejaski",
      date: "Content Strategist, eBay",
    },
    {
      headline: "Built trust, boosted efficiency",
      quote:
        "Brendan quickly built trust among our DE/UK stakeholders, boosting marketing efficiency through creative strategy and consulting, and spearheading cross-functional collaboration across global marketing teams.",
      author: "Xania Khan",
      date: "Head of Content Strategy, eBay",
    },
    {
      headline: "Trends before anyone else",
      quote:
        "Brendan's extensive industry experience and knowledge of the latest marketing trends — before anyone else — makes every campaign feel exciting and innovative. His commitment and passion for delivering meaningful change, powered by tech, is inspiring.",
      author: "Matthew Ivo",
      date: "Marketing colleague",
    },
  ];

  const [tApi, setTApi] = useState<CarouselApi>();
  const [tSelected, setTSelected] = useState(0);

  useEffect(() => {
    if (!tApi) return;
    const update = () => setTSelected(tApi.selectedScrollSnap());
    update();
    tApi.on("select", update);
    tApi.on("reInit", update);
    return () => {
      tApi.off("select", update);
      tApi.off("reInit", update);
    };
  }, [tApi]);

  // Auto-advance testimonials
  useEffect(() => {
    if (!tApi) return;
    const id = setInterval(() => tApi.scrollNext(), 6000);
    return () => clearInterval(id);
  }, [tApi]);

  const journey = [
    {
      icon: <Compass className="w-6 h-6" />,
      stage: "Stage One",
      title: "Discovery",
      description:
        "We get to know the team, surface what's really going on, and align on a Statement of Work and timeline. No assumptions — just a clear picture of where you are and where you're heading.",
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      stage: "Stage Two",
      title: "Design",
      description:
        "We architect the system on paper before we touch a tool — workflows, information design, and the shape of the build. You see the plan before anything gets wired up.",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      stage: "Stage Three",
      title: "Delivery",
      description:
        "We build, test, and iterate in the open. Regular check-ins, working sessions, and a system that lands fully documented and ready for your team to actually use.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      stage: "Stage Four",
      title: "Aftercare",
      description:
        "A handover that sticks — training, documentation, and a window of post-launch support so the system embeds properly. Optional ongoing retainer if you want us to stay close.",
    },
  ];





  return (
    <main className="min-h-screen relative pt-24 bg-background">
      <Navigation hideLogo />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="home-draft" />

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div
              className="relative group cursor-pointer [perspective:800px]"
              onMouseMove={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                const r = el.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * 100;
                const y = ((e.clientY - r.top) / r.height) * 100;
                // tilt: -8deg to +8deg, shadow offset based on cursor
                const tx = (x - 50) / 6; // rotateY
                const ty = (50 - y) / 6; // rotateX
                const sx = (50 - x) / 4; // shadow x
                const sy = (50 - y) / 4; // shadow y
                el.style.setProperty("--mx", `${x}%`);
                el.style.setProperty("--my", `${y}%`);
                el.style.setProperty("--tx", `${tx}deg`);
                el.style.setProperty("--ty", `${ty}deg`);
                el.style.setProperty("--sx", `${sx}px`);
                el.style.setProperty("--sy", `${sy}px`);
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.setProperty("--tx", `0deg`);
                el.style.setProperty("--ty", `0deg`);
                el.style.setProperty("--sx", `0px`);
                el.style.setProperty("--sy", `0px`);
              }}
              style={{
                ["--mx" as any]: "50%",
                ["--my" as any]: "50%",
                ["--tx" as any]: "0deg",
                ["--ty" as any]: "0deg",
                ["--sx" as any]: "0px",
                ["--sy" as any]: "0px",
              }}
            >
              <div
                className="relative transition-transform duration-200 ease-out [transform-style:preserve-3d]"
                style={{ transform: "rotateX(var(--ty)) rotateY(var(--tx))" }}
              >
                {/* Base black logo with dynamic 3D drop shadow */}
                <img
                  src={logo}
                  alt="Thread & Stack"
                  className="relative h-32 sm:h-44 md:h-64 w-auto transition-[filter] duration-200"
                  style={{
                    filter:
                      "drop-shadow(calc(var(--sx) * -1) calc(var(--sy) * -1) 12px hsl(var(--foreground) / 0.18)) drop-shadow(var(--sx) var(--sy) 4px hsl(var(--foreground) / 0.08))",
                  }}
                />
                {/* Indigo tint, masked to a small soft area under cursor */}
                <img
                  src={logoIndigo}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-32 sm:h-44 md:h-64 w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    WebkitMaskImage:
                      "radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)",
                    maskImage:
                      "radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)",
                  }}
                />
                {/* Soft indigo glow halo following cursor (outside logo) */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl"
                  style={{
                    background:
                      "radial-gradient(circle 90px at var(--mx) var(--my), hsl(var(--accent) / 0.45), transparent 70%)",
                  }}
                />
              </div>
            </div>
          </div>
          <p className="text-xl text-muted-foreground mb-8 text-center leading-relaxed max-w-2xl mx-auto">
            AI Ops & Systems for teams who want the work to flow.
          </p>

          <div className="flex justify-center mb-8">
            <Button>Get in touch</Button>
          </div>
        </div>
      </section>

      {/* Build Domains — 3D Coverflow */}
      <section className="relative z-10 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative h-[640px] md:h-[680px] [perspective:1800px]"
          >
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {builds.map((build, index) => {
                const len = builds.length;
                let offset = index - selected;
                if (offset > len / 2) offset -= len;
                if (offset < -len / 2) offset += len;
                const abs = Math.abs(offset);
                const isActive = offset === 0;
                const angle = offset * 38; // degrees of Y rotation
                const translateX = offset * 260; // px lateral spread
                const translateZ = isActive ? 0 : -180 - (abs - 1) * 80;
                const scale = isActive ? 1.02 : 0.9;
                const opacity = abs > 1 ? 0 : isActive ? 1 : 0.45;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setSelected(index)}
                    aria-label={`Show ${build.label}`}
                    style={{
                      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${-angle}deg) scale(${scale})`,
                      opacity,
                      zIndex: 20 - abs,
                      transition:
                        "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 500ms ease, box-shadow 500ms ease",
                      pointerEvents: abs > 1 ? "none" : "auto",
                    }}
                    className={`absolute left-1/2 top-1/2 w-[340px] md:w-[380px] text-left bg-card rounded-2xl p-7 md:p-8 flex flex-col [backface-visibility:hidden] ${
                      isActive
                        ? "ring-2 ring-foreground shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
                        : "shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:opacity-80"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                        isActive
                          ? "bg-foreground text-background"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {build.icon}
                    </div>

                    <p className="text-sm font-sans text-accent mb-2 uppercase tracking-wide">
                      {build.label}
                    </p>
                    <h3 className="text-2xl mb-4 font-semibold italic">
                      {build.title}
                    </h3>
                    <p className="font-sans text-muted-foreground leading-relaxed mb-6 text-sm">
                      {build.description}
                    </p>

                    <ul className="space-y-2 mb-6 flex-grow">
                      {build.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-sans text-muted-foreground">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <PillButton
                      className={
                        isActive
                          ? "w-full bg-foreground text-background hover:bg-indigo hover:text-white"
                          : "w-full"
                      }
                      icon={Rocket}
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isActive) {
                          setSelected(index);
                          return;
                        }
                        setContactOpen(true);
                      }}
                    >
                      {build.cta}
                    </PillButton>
                  </button>
                );
              })}
            </div>

            {/* Prev / Next */}
            <button
              type="button"
              onClick={() =>
                setSelected((s) => (s - 1 + builds.length) % builds.length)
              }
              aria-label="Previous"
              className="hidden md:flex absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-background shadow-lg border border-border/60 hover:bg-muted transition"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setSelected((s) => (s + 1) % builds.length)}
              aria-label="Next"
              className="hidden md:flex absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-background shadow-lg border border-border/60 hover:bg-muted transition"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {builds.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelected(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === selected ? "w-8 bg-accent" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to ${builds[idx].label}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — Kanban scatter directly under product carousel */}
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold italic mb-6">
          A stack of kind words
        </h2>
      </div>
      <TestimonialVariants testimonials={testimonials} />

      {/* Credentials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-semibold italic">Notion Certified</h3>
              </div>

              <div className="mb-6">
                <img src={notionBadges} alt="Notion certifications: Academy Essentials, Workflows, Advanced, AI, Certified Admin, Service Specialist, Consulting Partner" className="w-full h-auto" />
              </div>

              <p className="font-sans text-muted-foreground leading-relaxed">
                Brendan is a Certified Notion Admin and Official Notion Ambassador — one of a small group globally recognised by Notion for expertise in workspace design, workflow automation, and systems strategy.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-semibold italic">Fluent in AI Frameworks</h3>
              </div>

              <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                Brendan holds Anthropic's AI Fluency &amp; Foundations certificate and Notion's AI Workflows badge. Thread&nbsp;&amp;&nbsp;Stack operates as an AI-first business — integrating AI into strategy, operations, and creative workflows to reduce cognitive load and give teams back time, attention, and voice.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-sans font-medium text-muted-foreground">
                  Anthropic AI Fluency &amp; Foundations
                </span>
                <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-sans font-medium text-muted-foreground">
                  Notion AI Workflows
                </span>
                <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-sans font-medium text-muted-foreground">
                  AI-First Business
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-indigo rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-10 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold italic mb-4 text-white">
              Not sure which is right?
            </h2>
            <p className="font-sans text-white/70 text-lg mb-8">
              Start with a conversation. We'll figure out the right shape together.
            </p>
            <PillButton size="lg" icon={MessageCircle} variant="outline" className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => setContactOpen(true)}>
              Start a Conversation
            </PillButton>
          </div>
        </div>
      </section>

      {/* Image Zoom Lightbox */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-5xl w-[95vw] p-2 bg-background/95 backdrop-blur-sm border-border/50">
          {zoomedImage && (
            <img
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
};

export default HomePageDraft;
