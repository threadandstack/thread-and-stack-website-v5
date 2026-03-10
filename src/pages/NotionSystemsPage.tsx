import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactDrawer } from "@/components/ContactDrawer";
import { PillButton } from "@/components/ui/pill-button";
import { Check, Zap, Layers, Repeat, Rocket, MessageCircle, Shield, Bot } from "lucide-react";
import notionAdmin from "@/assets/notion-certified-admin.png";
import notionAdvanced from "@/assets/notion-advanced.png";
import notionWorkflows from "@/assets/notion-workflows.png";
import notionEssentials from "@/assets/notion-essentials.png";
import notionAmbassadorBlack from "@/assets/notion-ambassador-black.png";
import heroImage from "@/assets/photos/shoreditch/brendan-36.jpg";

const NotionSystemsPage = () => {
  const [contactOpen, setContactOpen] = useState(false);

  const tiers = [
    {
      icon: <Zap className="w-6 h-6" />,
      label: "Rapid Intervention",
      title: "Notion Session",
      tagline: "1 System · 1 Discussion · 1 Workflow fixed",
      description:
        "A single focused session to unblock a Notion problem, validate a workspace decision, or fix a broken workflow.",
      includes: [
        "60-minute deep-dive on one system or workflow",
        "Full recording, AI transcription & summary",
        "A clear action plan — exactly what to do next",
      ],
      cta: "Book a Session",
    },
    {
      icon: <Repeat className="w-6 h-6" />,
      label: "Ongoing Partnership",
      title: "Fractional Ops & Automations Director",
      tagline: "Monthly system focuses & AI ops support",
      description:
        "Embedded operational support on retainer. Notion administration, AI automations, and a new system focus each month.",
      includes: [
        "Monthly system focus & optimisation sprint",
        "Ongoing Notion administration & maintenance",
        "AI workflow design & automation support",
        "Slack access for ops questions & unblocking",
      ],
      cta: "Explore a Retainer",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      label: "Concentrated Project",
      title: "System Build Engagement",
      tagline: "Workflows, CRM, marketing ops — scoped & built",
      description:
        "A scoped engagement to build or rebuild your Notion workspace. CRM migration, content pipelines, or operational untangling.",
      includes: [
        "Workspace audit & workflow mapping",
        "Custom Notion system design & build",
        "CRM migration, marketing ops, or team workflows",
        "Documentation, training & handover",
      ],
      cta: "Discuss a Build",
    },
  ];

  return (
    <main className="min-h-screen relative">
      <Navigation variant="image-hero" />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="notion-systems" />

      {/* Mobile hero — stacked */}
      <section className="md:hidden">
        <div className="relative h-[60vh]">
          <img
            src={heroImage}
            alt="Brendan working on laptop on the street"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 z-10">
            <h1 className="text-4xl font-semibold italic text-white w-[70vw]">
              Notion & Systems Consultancy
            </h1>
          </div>
        </div>
        <div className="bg-background px-6 pb-10 pt-6 relative z-10">
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Most teams don't have a productivity problem — they have a systems problem. Too many tabs, too many tools, too many processes that nobody fully understands.
            </p>
            <p>
              As a Certified Notion Admin and Official Notion Ambassador, I help teams untangle their workspaces, design workflows that reduce cognitive load, and build AI-powered automations that give time back.
            </p>
            <p className="font-medium text-foreground">
              Whether it's a single workflow fix, a full workspace rebuild, or ongoing operational partnership — the goal is always systems that serve people, not the other way around.
            </p>
          </div>
          <div className="mt-6">
            <PillButton size="lg" icon={Rocket} onClick={() => setContactOpen(true)}>
              Book an Intro Call
            </PillButton>
          </div>
        </div>
      </section>

      {/* Desktop hero — About-style full-bleed */}
      <section className="relative hidden md:flex min-h-[90vh] items-end">
        <img
          src={heroImage}
          alt="Brendan working on laptop on the street"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-6 pb-44 pt-32">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-6xl lg:text-7xl font-semibold italic text-white mb-8" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
              Notion & Systems Consultancy
            </h1>
            <div className="space-y-4 text-lg leading-relaxed text-white/90 max-w-2xl">
              <p>
                Most teams don't have a productivity problem — they have a systems problem. Too many tabs, too many tools, too many processes that nobody fully understands.
              </p>
              <p>
                As a Certified Notion Admin and Official Notion Ambassador, I help teams untangle their workspaces, design workflows that reduce cognitive load, and build AI-powered automations that give time back.
              </p>
              <p className="font-light text-white">
                Whether it's a single workflow fix, a full workspace rebuild, or ongoing operational partnership — the goal is always systems that serve people, not the other way around.
              </p>
            </div>
            <div className="mt-8">
              <PillButton size="lg" variant="dark" icon={Rocket} onClick={() => setContactOpen(true)}>
                Book an Intro Call
              </PillButton>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Product Cards */}
      <section className="relative z-10 -mt-80 md:-mt-20 pb-24 px-6 pt-0 md:pt-0">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => {
              const isRecommended = index === 1;
              return (
                <div
                  key={index}
                  className={`bg-card rounded-2xl p-8 transition-all duration-300 flex flex-col relative ${
                    isRecommended
                      ? "ring-2 ring-accent shadow-[0_8px_30px_rgba(0,0,0,0.12)] scale-[1.02] md:scale-105"
                      : "shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-accent text-accent-foreground text-xs font-sans font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    isRecommended ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent"
                  }`}>
                    {tier.icon}
                  </div>

                  <h3 className="text-2xl mb-2 font-semibold italic">{tier.title}</h3>
                  <p className="text-sm font-sans text-accent mb-4">{tier.label}</p>
                  <p className="font-sans text-muted-foreground leading-relaxed mb-6">{tier.description}</p>

                  <ul className="space-y-2 mb-8 flex-grow">
                    {tier.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-sans text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <PillButton
                    className="w-full"
                    icon={Rocket}
                    variant={isRecommended ? "indigo" : "default"}
                    onClick={() => setContactOpen(true)}
                  >
                    {tier.cta}
                  </PillButton>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Credential Cards */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Notion */}
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
              <img
                src={notionAmbassadorBlack}
                alt="Notion Official Ambassador"
                className="h-14 w-auto"
              />
            </div>

            {/* AI Fluency */}
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
            <PillButton size="lg" icon={MessageCircle} variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setContactOpen(true)}>
              Start a Conversation
            </PillButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NotionSystemsPage;
