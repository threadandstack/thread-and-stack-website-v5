import React, { useState, useEffect } from "react";
import { PillButton } from "@/components/ui/pill-button";
import { Check, Zap, Layers, Repeat, MessageCircle, Rocket } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ContactDrawer } from "@/components/ContactDrawer";
import { Emphasis } from "@/components/Emphasis";
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
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="narratives-strategy" />

      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-5xl mx-auto pt-32 pb-56">
          <span className="inline-block text-white/90 font-sans text-sm bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3">Narratives, Strategy & Creative Direction</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold italic leading-[1.1] mb-6 text-white">
            Narratives &{" "}
            <span className="relative inline-block text-accent">
              Strategy
              <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0.3} />
            </span>{" "}
            Services
          </h1>
          <p className="font-sans text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed">
            We work on the stuff underneath. What you stand for, how you talk about it, and why it lands. We find the message. We find the narrative.
          </p>
        </div>
      </section>

      {/* 3-Column Product Cards — bridging into hero */}
      <section className="relative z-10 -mt-80 pb-24 px-6">
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

      {/* Indigo CTA */}
      <section className="py-24 px-6 bg-indigo text-indigo-foreground">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-10 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold italic mb-4 text-foreground">
              Not sure which is right?
            </h2>
            <p className="font-sans text-muted-foreground text-lg mb-8">
              Start with a conversation. We'll figure out the right shape together.
            </p>
            <PillButton size="lg" icon={MessageCircle} onClick={() => setContactOpen(true)}>
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
