import React, { useState, useEffect } from "react";
import { PillButton } from "@/components/ui/pill-button";
import { Check, Zap, Layers, Repeat, MessageCircle, Rocket } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ContactDrawer } from "@/components/ContactDrawer";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { trackServiceView, useScrollDepthTracking } from "@/hooks/useAnalytics";
import heroImage from "@/assets/brendan-cafe-landscape.jpg";

const FractionalDeepEngagement = () => {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    trackServiceView('Narratives & Strategy Services');
    const cleanup = useScrollDepthTracking('narratives-strategy');
    return cleanup;
  }, []);

  const tiers = [
    {
      icon: <Zap className="w-6 h-6" />,
      label: "Rapid Intervention",
      title: "Strategy Session",
      tagline: "1 Focus · 1 Discussion · 1 Output",
      description:
        "A single, focused session to unblock a positioning challenge, pressure-test messaging, or get a strategic second opinion.",
      includes: [
        "60-minute deep-dive on one strategic focus",
        "Full recording, AI transcription & summary",
        "A clear, bulleted action plan you can run with",
      ],
      cta: "Book a Session",
    },
    {
      icon: <Repeat className="w-6 h-6" />,
      label: "Ongoing Partnership",
      title: "Fractional Strategy Director",
      tagline: "Ongoing strategic, scaleable support",
      description:
        "Embedded strategic and creative leadership on retainer. Brand positioning, campaign direction, creative oversight — without the full-time overhead.",
      includes: [
        "Monthly strategy sessions & ongoing Slack access",
        "Brand positioning, messaging & creative direction",
        "Campaign strategy & marketing system guidance",
        "Quarterly reviews & scaleable commitment",
      ],
      cta: "Explore a Retainer",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      label: "Concentrated Project",
      title: "Project Engagement",
      tagline: "Scoped block of brand & narrative strategy",
      description:
        "A concentrated engagement to tackle a defined strategic challenge — brand refresh, positioning overhaul, or narrative rebuild.",
      includes: [
        "Discovery, research & stakeholder alignment",
        "Positioning, messaging & narrative architecture",
        "Visual identity direction & brand world building",
        "Documentation, handover & implementation roadmap",
      ],
      cta: "Discuss a Project",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation variant="image-hero" />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="narratives-strategy" />

      {/* Mobile hero — stacked */}
      <section className="md:hidden">
        <div className="relative h-[60vh]">
          <img
            src={heroImage}
            alt="Brendan in a café discussing creative strategy"
            className="absolute inset-0 w-full h-full object-cover object-[50%_15%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 z-10">
            <span className="inline-block text-white/90 font-sans text-xs bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full mb-3">Narratives, Strategy & Creative Direction</span>
            <h1 className="text-4xl font-semibold italic text-white w-[70vw]">
              Narratives & Strategy Services
            </h1>
          </div>
        </div>
        <div className="bg-background px-6 pb-10 pt-6 relative z-10">
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              The brands that stick aren't the loudest — they're the ones that know what they stand for and say it clearly. That's what we work on together.
            </p>
            <p>
              From positioning and messaging architecture to full brand narrative rebuilds, I help purpose-led founders and teams find the story underneath the noise. The one that makes people lean in, not scroll past.
            </p>
            <p className="font-medium text-foreground">
              Whether you need a sharp second opinion in a single session, a concentrated project sprint, or an ongoing strategic partner — the goal is always the same: clarity that compounds.
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
          alt="Brendan in a café discussing creative strategy"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-6 pb-44 pt-32">
          <div className="max-w-6xl mx-auto">
            <span className="inline-block text-white/90 font-sans text-sm bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">Narratives, Strategy & Creative Direction</span>
            <h1 className="text-6xl lg:text-7xl font-semibold italic text-white mb-8" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
              Narratives & Strategy Services
            </h1>
            <div className="space-y-4 text-lg leading-relaxed text-white/90 max-w-2xl">
              <p>
                The brands that stick aren't the loudest — they're the ones that know what they stand for and say it clearly. That's what we work on together.
              </p>
              <p>
                From positioning and messaging architecture to full brand narrative rebuilds, I help purpose-led founders and teams find the story underneath the noise. The one that makes people lean in, not scroll past.
              </p>
              <p className="font-light text-white">
                Whether you need a sharp second opinion in a single session, a concentrated project sprint, or an ongoing strategic partner — the goal is always the same: clarity that compounds.
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

      {/* 3-Column Product Cards — bridging into hero */}
      <section className="relative z-10 mt-0 md:-mt-20 pb-24 px-6 pt-0 md:pt-0">
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

      <FeaturedProjects />

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

      <Footer />
    </div>
  );
};

export default FractionalDeepEngagement;