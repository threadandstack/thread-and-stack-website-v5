import React, { useState, useEffect } from "react";
import { PillButton } from "@/components/ui/pill-button";
import { ArrowRight, Check, Target, Layers, FileText, Users, Calendar, Zap, Repeat, MessageCircle, Rocket, Search } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FAQ } from "@/components/FAQ";
import { ContactDrawer } from "@/components/ContactDrawer";
import { trackServiceView, useScrollDepthTracking } from "@/hooks/useAnalytics";

const FractionalDeepEngagement = () => {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    trackServiceView('Fractional & Deep Engagement');
    const cleanup = useScrollDepthTracking('fractional-deep-engagement');
    return cleanup;
  }, []);

  const fractionalBenefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Senior Strategic Thinking",
      description: "Access to strategic expertise without the overhead of a full-time senior hire"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Flexibility & Scalability",
      description: "Scale engagement up or down based on your needs and strategic priorities"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Embedded Partnership",
      description: "Work as an integrated part of your team, not an external consultant"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Consistent Support",
      description: "Ongoing access for questions, unblocking, and strategic guidance"
    }
  ];

  const engagementModels = [
    {
      title: "Core Retainer",
      commitment: "2-3 days per month",
      ideal: "Teams needing regular strategic guidance and campaign direction",
      includes: [
        "Monthly strategy sessions and planning",
        "Ongoing brand positioning, messaging, and visual direction support",
        "Campaign strategy, creative direction, and asset guidance",
        "Slack/email access for strategic and creative questions",
        "Quarterly strategic reviews"
      ]
    },
    {
      title: "Extended Retainer",
      commitment: "4-6 days per month",
      ideal: "Organizations undergoing growth or transformation requiring deeper involvement",
      includes: [
        "Everything in Core Retainer",
        "Weekly check-ins and strategic alignment",
        "Team workshops and capability building",
        "Market research and competitive analysis",
        "Documentation and framework development"
      ]
    },
    {
      title: "Strategic Leadership",
      commitment: "8-10 days per month",
      ideal: "Companies needing fractional CMO or Head of Strategy support",
      includes: [
        "Everything in Extended Retainer",
        "Leadership team participation",
        "Cross-functional strategic projects",
        "Vendor and agency management",
        "Board-level strategic reporting"
      ]
    }
  ];

  const projectTypes = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Brand Refresh",
      duration: "2-3 months",
      description: "Update positioning, messaging, and visual identity system while preserving brand equity. Includes brand world building and asset development.",
      ideal: "Organizations needing modernization without complete reinvention"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Positioning Overhaul",
      duration: "3-4 months",
      description: "Complete repositioning for new markets, audiences, or strategic direction",
      ideal: "Companies pivoting, expanding, or addressing positioning misalignment"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Marketing System Build",
      duration: "4-6 months",
      description: "Build comprehensive marketing infrastructure, creative workflows, and capabilities including content systems and design asset libraries",
      ideal: "Teams scaling operations or transitioning from founder-led to system-driven"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Complete Transformation",
      duration: "5-6 months",
      description: "End-to-end strategic work combining brand positioning, visual identity system, creative direction, and operational systems",
      ideal: "Organizations ready for comprehensive transformation with lasting impact"
    }
  ];

  const phases = [
    {
      month: "Month 1",
      title: "Deep Discovery",
      activities: [
        "Stakeholder interviews across all levels",
        "Comprehensive brand and market audit",
        "Competitive analysis and opportunity mapping",
        "Internal systems and capabilities assessment",
        "Strategic foundation and alignment workshop"
      ]
    },
    {
      month: "Months 2-4",
      title: "Build & Develop",
      activities: [
        "Core strategic framework development",
        "Positioning and messaging architecture",
        "Visual identity systems and brand world building",
        "Creative direction and asset development",
        "Marketing systems and infrastructure design",
        "Team workshops and capability building",
        "Iterative refinement with stakeholder feedback"
      ]
    },
    {
      month: "Months 5-6",
      title: "Refine & Transition",
      activities: [
        "Final implementation and documentation",
        "Team training and knowledge transfer",
        "Sustainability and governance planning",
        "Launch support and change management",
        "Transition to ongoing support (optional retainer)"
      ]
    }
  ];

  const deliverables = [
    "Strategic Foundation Document (positioning, messaging, frameworks)",
    "Visual Identity System and Brand Guidelines",
    "Creative Direction and Asset Development",
    "Marketing Systems and Process Documentation",
    "Team Training and Capability Development",
    "Implementation Roadmap and Governance",
    "Sustainability and Transition Plan"
  ];

  const faqItems = [
    {
      question: "What's the difference between Fractional Strategy and Deep Engagement?",
      answer: "Fractional Strategy is ongoing monthly support - I work as an embedded member of your team providing continuous strategic guidance. Deep Engagement is a time-bounded project (2-6 months) with specific deliverables and transformation goals. Many clients do a Deep Engagement first, then transition to Fractional for sustained momentum."
    },
    {
      question: "How do I know which one I need?",
      answer: "If you need consistent strategic support month-to-month and value flexibility, Fractional is right for you. If you have a specific transformation goal - rebrand, positioning overhaul, system build - and can commit to an intensive engagement with clear deliverables, go with Deep Engagement."
    },
    {
      question: "What does 'days per month' actually mean for Fractional?",
      answer: "It's not necessarily consecutive days. A '3 days per month' retainer might mean monthly strategy sessions, weekly check-ins, ongoing Slack/email access, quarterly reviews, plus ad-hoc unblocking as needed. The time distributes across the month based on your team's rhythm and priorities."
    },
    {
      question: "What kind of organizations is this for?",
      answer: "Scale-ups (20-100 people) growing fast but can't justify a full-time CMO yet; established organizations with marketing teams needing strategic leadership and capability building; or any team that values flexibility and wants senior strategic support without the full-time commitment."
    },
    {
      question: "Can I start small and scale up?",
      answer: "Absolutely. Many clients start with a Core Retainer to test the partnership, then scale to Extended or Strategic Leadership as priorities evolve. The month-to-month structure allows you to adjust as needs change."
    },
    {
      question: "What's required from my side for a Deep Engagement?",
      answer: "Executive sponsorship and decision-making authority, stakeholder time for interviews and workshops (typically 4-6 hours/month per stakeholder), internal team collaboration, and commitment to implementation and change management. This is a partnership, not a hand-off."
    },
    {
      question: "What's the investment range?",
      answer: "Fractional retainers: Core £2-3k/month, Extended £4-6k/month, Strategic Leadership £8-12k/month. Deep Engagements: Brand Refresh £20-30k, Positioning Overhaul £30-40k, Marketing System Build £35-50k, Complete Transformation £45-65k. All scoped based on specific needs."
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="fractional-deep" />

      {/* Hero with Anchor Navigation */}
      <section className="py-24 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-accent mb-2 not-italic">Strategic Partnership & Transformation</p>
            <h1 className="text-5xl md:text-6xl mb-6 text-balance font-light">
              Fractional & Deep Engagement
            </h1>
            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-accent mb-6">
              <p className="text-lg text-muted-foreground mb-4">
                Two models for sustained strategic partnership. Ongoing monthly retainers for continuous support, or intensive 2-6 month projects for comprehensive transformation. For scale-ups and established organizations (20-100+ people) ready to invest in strategic and creative leadership.
              </p>
              
              {/* Quick Navigation with CTA language */}
              <div className="flex flex-wrap gap-3 mt-4">
                <PillButton 
                  variant="outline"
                  size="sm"
                  icon={Search}
                  onClick={() => scrollToSection('fractional')}
                >
                  Explore Fractional Strategy
                </PillButton>
                <PillButton 
                  size="sm"
                  variant="indigo"
                  icon={Layers}
                  onClick={() => scrollToSection('deep-engagement')}
                >
                  Learn About Deep Engagement
                </PillButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fractional Strategy Section */}
      <section id="fractional" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Repeat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-light">Fractional Strategy</h2>
              <p className="text-accent">Ongoing Strategic Partnership</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-3">The Model</h3>
            <p className="text-xl mb-4">Strategic expertise. Embedded support. Flexible commitment.</p>
            <p className="text-lg text-muted-foreground mb-6">
              I work as an integrated member of your team, providing ongoing strategic guidance on brand positioning, campaign development, creative direction, and visual identity systems. You get senior-level strategic thinking and design craft without the full-time salary, benefits, and commitment.
            </p>
            <PillButton 
              size="lg" 
              icon={MessageCircle}
              onClick={() => setContactOpen(true)}
            >
              Discuss Your Needs
            </PillButton>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-light mb-6">Why Fractional?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {fractionalBenefits.map((benefit, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                      {benefit.icon}
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{benefit.title}</h4>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-light mb-6">Engagement Models</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Choose the level of involvement that fits your needs. All engagements are month-to-month with flexible scaling.
              </p>
              <div className="space-y-6">
                {engagementModels.map((model, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-8">
                    <div className="mb-6">
                      <h4 className="text-2xl font-semibold mb-2">{model.title}</h4>
                      <p className="text-accent font-semibold mb-2">{model.commitment}</p>
                      <p className="text-muted-foreground italic">{model.ideal}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-3">What's Included:</h5>
                      <ul className="space-y-2">
                        {model.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Engagement Section - Indigo Background */}
      <section id="deep-engagement" className="py-24 px-6 bg-indigo text-indigo-foreground">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-light text-white">Deep Engagement</h2>
              <p className="text-white/80">2-6 Month Transformation Projects</p>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-3 text-white">The Commitment</h3>
            <p className="text-xl mb-4 text-white">Deep work. Clear deliverables. Lasting transformation.</p>
            <p className="text-lg text-white/90 mb-6">
              This isn't a quick fix or surface-level refresh. It's a comprehensive engagement where we work together intensively over 2-6 months to create fundamental strategic change. You get complete transformation with documented systems that outlive the engagement.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-indigo hover:bg-white/90 group"
              onClick={() => setContactOpen(true)}
            >
              Explore Projects
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-light mb-6 text-white">Project Types</h3>
              <p className="text-lg text-white/80 mb-6">
                Each engagement is customized to your specific needs, but most fall into these categories:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {projectTypes.map((project, index) => (
                  <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white">
                      {project.icon}
                    </div>
                    <h4 className="text-xl font-semibold mb-2 text-white">{project.title}</h4>
                    <p className="text-white/70 text-sm mb-3">{project.duration}</p>
                    <p className="text-white/80 mb-3">{project.description}</p>
                    <p className="text-sm text-white/70 italic">Ideal for: {project.ideal}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-light mb-6 text-white">The Process</h3>
              <div className="space-y-6">
                {phases.map((phase, index) => (
                  <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-8">
                    <div className="mb-4">
                      <h4 className="text-2xl font-semibold mb-1 text-white">{phase.title}</h4>
                      <p className="text-white/70 font-semibold">{phase.month}</p>
                    </div>
                    <ul className="space-y-2">
                      {phase.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                          <span className="text-white/80">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-light mb-6 text-white">What You Get</h3>
              <p className="text-lg text-white/80 mb-4">
                Comprehensive deliverables designed for implementation and sustainability:
              </p>
              <div className="bg-white/10 border border-white/20 rounded-lg p-8">
                <ul className="space-y-3">
                  {deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
                      <span className="text-lg text-white/90">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-8 text-center mt-12">
            <h2 className="text-2xl mb-4 font-light text-white">Ready to explore a partnership?</h2>
            <p className="text-white/80 mb-6">
              Let's discuss your challenges and find the right engagement model for your team.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-indigo hover:bg-white/90 group"
              onClick={() => setContactOpen(true)}
            >
              Start a Conversation
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
      <Footer />
    </div>
  );
};

export default FractionalDeepEngagement;
