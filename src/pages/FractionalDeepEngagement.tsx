import React, { useState, useEffect } from "react";
import { PillButton } from "@/components/ui/pill-button";
import { Check, Zap, Layers, Repeat, MessageCircle, Rocket } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ContactDrawer } from "@/components/ContactDrawer";
import { Emphasis } from "@/components/Emphasis";
import { trackServiceView, useScrollDepthTracking } from "@/hooks/useAnalytics";

const FractionalDeepEngagement = () => {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    trackServiceView('Narratives & Strategy Services');
    const cleanup = useScrollDepthTracking('narratives-strategy');
    return cleanup;
  }, []);

  const tiers = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Rapid Intervention",
      title: "Strategy Session",
      tagline: "1 Focus · 1 Discussion · 1 Output",
      description:
        "A single, focused session to unblock a positioning challenge, pressure-test messaging, or get a strategic second opinion. No ongoing commitment required.",
      includes: [
        "60-minute deep-dive on one strategic focus",
        "Full recording, AI transcription & summary",
        "A clear, bulleted action plan you can run with",
      ],
      cta: "Book a Session",
      ctaAction: "strategy-session",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: "Concentrated Project",
      title: "Project Engagement",
      tagline: "Scoped block of brand & narrative strategy work",
      description:
        "A concentrated engagement to tackle a defined strategic challenge — a brand refresh, positioning overhaul, or narrative rebuild. Scoped together, delivered with clear milestones.",
      includes: [
        "Discovery, research & stakeholder alignment",
        "Positioning, messaging & narrative architecture",
        "Visual identity direction & brand world building",
        "Documentation, handover & implementation roadmap",
      ],
      cta: "Discuss a Project",
      ctaAction: "project-engagement",
    },
    {
      icon: <Repeat className="w-5 h-5" />,
      label: "Ongoing Partnership",
      title: "Fractional Strategy Director",
      tagline: "Ongoing strategic, scaleable support for varied focuses",
      description:
        "Embedded strategic and creative leadership on a monthly retainer. I work as an integrated member of your team — brand positioning, campaign direction, creative oversight — without the full-time overhead.",
      includes: [
        "Monthly strategy sessions & ongoing Slack access",
        "Brand positioning, messaging & creative direction",
        "Campaign strategy & marketing system guidance",
        "Quarterly reviews & scaleable commitment",
      ],
      cta: "Explore a Retainer",
      ctaAction: "fractional-director",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="narratives-strategy" />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-accent font-sans text-sm mb-3">Narratives, Strategy & Creative Direction</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold italic leading-[1.1] mb-6">
            Narratives &{" "}
            <span className="relative inline-block text-accent">
              Strategy
              <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0.3} />
            </span>{" "}
            Services
          </h1>
          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            We work on the stuff underneath. What you stand for, how you talk about it, and why it lands. We find the message. We find the narrative.
          </p>
        </div>
      </section>

      {/* First two tiers */}
      {tiers.slice(0, 2).map((tier, index) => (
        <section key={index} className="py-20 px-6 bg-card">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 text-accent">
                    {tier.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold italic">{tier.title}</h2>
                    <p className="text-sm font-sans text-accent">{tier.label}</p>
                  </div>
                </div>
                <p className="font-sans font-medium mb-3 text-foreground">{tier.tagline}</p>
                <p className="font-sans leading-relaxed mb-6 text-muted-foreground">{tier.description}</p>
                <PillButton icon={Rocket} onClick={() => setContactOpen(true)}>
                  {tier.cta}
                </PillButton>
              </div>
              <div>
                <h3 className="font-semibold font-sans mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {tier.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 mt-1 flex-shrink-0 text-accent" />
                      <span className="font-sans text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Fractional tier + CTA — indigo background */}
      <section className="pt-20 pb-24 px-6 bg-indigo text-indigo-foreground">
        <div className="max-w-5xl mx-auto">
          {/* Fractional content */}
          <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white">
                  {tiers[2].icon}
                </div>
                <div>
                  <h2 className="text-3xl font-semibold italic text-white">{tiers[2].title}</h2>
                  <p className="text-sm font-sans text-white/80">{tiers[2].label}</p>
                </div>
              </div>
              <p className="font-sans font-medium mb-3 text-white/90">{tiers[2].tagline}</p>
              <p className="font-sans leading-relaxed mb-6 text-white/80">{tiers[2].description}</p>
              <PillButton icon={Rocket} variant="white" onClick={() => setContactOpen(true)}>
                {tiers[2].cta}
              </PillButton>
            </div>
            <div>
              <h3 className="font-semibold font-sans mb-4 text-white">What's Included</h3>
              <ul className="space-y-3">
                {tiers[2].includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 mt-1 flex-shrink-0 text-white" />
                    <span className="font-sans text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Floating white CTA pill */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-10 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold italic mb-4 text-foreground">
              Not sure which is right?
            </h2>
            <p className="font-sans text-muted-foreground text-lg mb-8">
              Start with a conversation. We'll figure out the right shape together.
            </p>
            <PillButton
              size="lg"
              icon={MessageCircle}
              onClick={() => setContactOpen(true)}
            >
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
