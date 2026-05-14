import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/ui/pill-button";
import { ContactDrawer } from "@/components/ContactDrawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
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
import notionAdmin from "@/assets/notion-certified-admin.webp";
import notionAdvanced from "@/assets/notion-advanced.webp";
import notionWorkflows from "@/assets/notion-workflows.webp";
import notionEssentials from "@/assets/notion-essentials.webp";
import notionAmbassadorBlack from "@/assets/notion-ambassador-black.webp";
import notionConsultingPartner from "@/assets/notion-consulting-partner.webp";
import notionServiceSpecialist from "@/assets/notion-service-specialist.webp";
import notionCmsBuild from "@/assets/notion-cms-build.webp";
import notionCustomAgents from "@/assets/notion-custom-agents.webp";

const HomePageDraft = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(1);

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
      headline: "A safe pair of hands",
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


  const onSelect = useCallback(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <main className="min-h-screen relative pt-24 bg-background">
      <Navigation hideLogo />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="home-draft" />

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Thread & Stack"
              className="h-32 sm:h-44 md:h-64 w-auto"
            />
          </div>
          <p className="text-xl text-muted-foreground mb-8 text-center leading-relaxed max-w-2xl mx-auto">
            AI Ops & Systems for teams who want the work to flow.
          </p>

          <div className="flex justify-center mb-8">
            <Button>Get in touch</Button>
          </div>
        </div>
      </section>

      {/* Testimonials slider */}
      <section className="pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Carousel
            setApi={setTApi}
            opts={{ align: "center", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((t, idx) => (
                <CarouselItem key={idx} className="basis-full">
                  <div className="bg-card rounded-2xl p-8 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)] text-center">
                    <Quote className="w-8 h-8 text-accent/40 mx-auto mb-4" />
                    <p className="text-lg md:text-xl font-semibold italic mb-4">
                      {t.headline}
                    </p>
                    <p className="font-sans text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
                      "{t.quote}"
                    </p>
                    <p className="font-sans text-sm text-foreground">
                      {t.author}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground/70">
                      {t.date}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => tApi?.scrollTo(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === tSelected ? "w-8 bg-accent" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Build Domains Carousel */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{ align: "center", loop: true, startIndex: 1, skipSnaps: false }}
            className="w-full"
          >
            <div className="relative">
              <CarouselContent className="-ml-6 py-10">
                {builds.map((build, index) => {
                  const isActive = index === selected;
                  return (
                    <CarouselItem
                      key={index}
                      className="pl-6 basis-[82%] sm:basis-[58%] md:basis-[46%] lg:basis-[40%] xl:basis-[36%]"
                    >
                      <button
                        type="button"
                        onClick={() => api?.scrollTo(index)}
                        className={`text-left w-full bg-card rounded-2xl p-8 transition-all duration-500 flex flex-col h-full ${
                          isActive
                            ? "ring-2 ring-foreground shadow-[0_12px_40px_rgba(0,0,0,0.14)] scale-[1.04] opacity-100"
                            : "shadow-[0_2px_12px_rgba(0,0,0,0.06)] opacity-50 scale-[0.94] hover:opacity-80"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
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
                        <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                          {build.description}
                        </p>

                        <ul className="space-y-2 mb-8 flex-grow">
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
                            setContactOpen(true);
                          }}
                        >
                          {build.cta}
                        </PillButton>
                      </button>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {/* Floating prev/next — sit on top of the rail, hidden on small screens */}
              <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 h-12 w-12 bg-background shadow-lg" />
              <CarouselNext className="hidden md:flex -right-4 lg:-right-6 h-12 w-12 bg-background shadow-lg" />
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {builds.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => api?.scrollTo(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === selected ? "w-8 bg-accent" : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to ${builds[idx].label}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </section>

      {/* System Build Showcase */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <span className="inline-flex items-center rounded-full bg-accent/10 text-accent text-xs font-sans font-semibold px-3 py-1 mb-4">
                System Build Example
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold italic mb-4">
                Notion + Lovable CMS Build
              </h2>
              <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                A three-tier content management system combining Notion as the editorial backend, Supabase Edge Functions as the API layer, and a custom-built Lovable frontend — all working in sync.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Notion Content Library as the single source of truth",
                  "API integration via Edge Functions for real-time content sync",
                  "Custom frontend with category filtering, OG images & SEO",
                  "Third-party tool orchestration across the full stack",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-sans text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-zoom-in transition-transform hover:scale-[1.02]"
              onClick={() => setZoomedImage({ src: notionCmsBuild, alt: "Three-tier Notion CMS build" })}
            >
              <img
                src={notionCmsBuild}
                alt="Three-tier Notion CMS build showing Content Library, Published Blog Library, and the live Thread & Stack Journal"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fractional Ops Showcase */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div
              className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-zoom-in transition-transform hover:scale-[1.02]"
              onClick={() => setZoomedImage({ src: notionCustomAgents, alt: "Custom Notion AI agent" })}
            >
              <img
                src={notionCustomAgents}
                alt="Custom Notion AI agent 'Email Recapper' with daily email summary delivered to mobile inbox"
                className="w-full h-auto"
              />
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-accent/10 text-accent text-xs font-sans font-semibold px-3 py-1 mb-4">
                Fractional Ops Example
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold italic mb-4">
                Custom Agents & Automations
              </h2>
              <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                A custom Notion AI agent designed to process and triage a busy inbox every morning — summarising action items, flagging replies, and delivering a structured daily briefing straight to your phone.
              </p>
              <ul className="space-y-2">
                {[
                  "Custom Notion AI agent built to your workflow",
                  "Automated daily email triage and summarisation",
                  "Priority flagging with actionable next steps",
                  "Delivered as a Notion notification — no extra tools needed",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-sans text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

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

              <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                Brendan is a Certified Notion Admin and Official Notion Ambassador — one of a small group globally recognised by Notion for expertise in workspace design, workflow automation, and systems strategy.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <img src={notionAdmin} alt="Notion Certified Admin" className="h-24 w-auto" />
                <img src={notionAdvanced} alt="Notion Academy Advanced" className="h-24 w-auto" />
                <img src={notionWorkflows} alt="Notion Academy Workflows" className="h-24 w-auto" />
                <img src={notionEssentials} alt="Notion Academy Essentials" className="h-24 w-auto" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <img src={notionAmbassadorBlack} alt="Notion Official Ambassador" className="h-14 w-auto" />
                <img src={notionConsultingPartner} alt="Notion Consulting Partner" className="h-24 w-auto" />
                <img src={notionServiceSpecialist} alt="Notion Service Specialist" className="h-24 w-auto" />
              </div>
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
