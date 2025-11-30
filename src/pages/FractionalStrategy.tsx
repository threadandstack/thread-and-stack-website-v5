import React from "react";
import { Button } from "@/components/ui/button";
import { HandDrawnArrowRight, HandDrawnCheck, HandDrawnCalendar, HandDrawnTarget, HandDrawnUsers, HandDrawnZap } from "@/components/icons/HandDrawnIcons";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FAQ } from "@/components/FAQ";

const FractionalStrategy = () => {
  const benefits = [
    {
      icon: <HandDrawnTarget className="w-6 h-6" />,
      title: "Senior Strategic Thinking",
      description: "Access to strategic expertise without the overhead of a full-time senior hire"
    },
    {
      icon: <HandDrawnZap className="w-6 h-6" />,
      title: "Flexibility & Scalability",
      description: "Scale engagement up or down based on your needs and strategic priorities"
    },
    {
      icon: <HandDrawnUsers className="w-6 h-6" />,
      title: "Embedded Partnership",
      description: "Work as an integrated part of your team, not an external consultant"
    },
    {
      icon: <HandDrawnCalendar className="w-6 h-6" />,
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
        "Ongoing brand positioning and messaging support",
        "Campaign strategy and creative direction",
        "Slack/email access for questions",
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

  const caseStudies = [
    {
      client: "Scale-up B Corp",
      industry: "Ethical Consumer Goods",
      size: "45 people, £8M revenue",
      challenge: "Rapid growth creating brand dilution and messaging inconsistency across channels",
      engagement: "6-month Core Retainer (3 days/month)",
      outcomes: [
        "Developed cohesive brand positioning framework adopted across all teams",
        "Created campaign strategy that increased conversion by 38%",
        "Trained internal team on strategic decision-making frameworks",
        "Reduced external agency dependency by 60%"
      ]
    },
    {
      client: "Nonprofit Organization",
      industry: "Social Impact",
      size: "120 staff, national presence",
      challenge: "Needed strategic marketing leadership without full-time hire commitment",
      engagement: "12-month Strategic Leadership (8 days/month)",
      outcomes: [
        "Led rebrand and repositioning reaching 2M+ stakeholders",
        "Built marketing function from 2 to 6 person team",
        "Increased donor engagement by 45% year-over-year",
        "Created sustainable systems reducing founder dependence"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-24 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-accent font-semibold mb-2">Ongoing Strategic Partnership</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Fractional Strategy
            </h1>
            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-accent mb-6">
              <p className="text-lg text-muted-foreground">
                Get senior strategic support embedded with your team on a monthly retainer. Brand positioning, campaign strategy, and creative direction—without the overhead of a full-time hire.
              </p>
              <p className="text-lg text-muted-foreground mt-3 font-semibold">
                Perfect for scale-ups and established organizations (20-100+ people) who need consistent strategic thinking but want flexibility.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-semibold mb-3">The Model</h3>
            <p className="text-xl mb-4">Strategic expertise. Embedded support. Flexible commitment.</p>
            <p className="text-lg text-muted-foreground mb-6">
              I work as an integrated member of your team, providing ongoing strategic guidance on brand positioning, campaign development, and creative direction. You get senior-level thinking without the full-time salary, benefits, and commitment.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              <a href="/#contact" className="flex items-center">
                Discuss Your Needs
                <HandDrawnArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Fractional?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Engagement Models</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Choose the level of involvement that fits your needs. All engagements are month-to-month with flexible scaling.
              </p>
              <div className="space-y-6">
                {engagementModels.map((model, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold mb-2">{model.title}</h3>
                      <p className="text-accent font-semibold mb-2">{model.commitment}</p>
                      <p className="text-muted-foreground italic">{model.ideal}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">What's Included:</h4>
                      <ul className="space-y-2">
                        {model.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <HandDrawnCheck className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-secondary/10 rounded-lg p-6 mt-8 border-l-4 border-accent">
                <p className="text-muted-foreground">
                  <strong>Pricing:</strong> Case-by-case based on scope and commitment level. Most Core Retainers start around £2-3k/month, Extended Retainers £4-6k/month, Strategic Leadership £8-12k/month.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Case Studies</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Real outcomes from fractional partnerships.
              </p>
              <div className="space-y-8">
                {caseStudies.map((study, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold mb-2">{study.client}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="bg-secondary/20 px-3 py-1 rounded-full">{study.industry}</span>
                        <span className="bg-secondary/20 px-3 py-1 rounded-full">{study.size}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">The Challenge</h4>
                        <p className="text-muted-foreground">{study.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">The Engagement</h4>
                        <p className="text-accent">{study.engagement}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">The Outcomes</h4>
                        <ul className="space-y-2">
                          {study.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <HandDrawnCheck className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Who This Is For</h2>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">✓ You're a scale-up (20-100 people)</h3>
                  <p className="text-muted-foreground">
                    Growing fast but can't justify a full-time CMO or Head of Strategy yet. You need strategic thinking that keeps pace with your growth.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">✓ You're an established organization</h3>
                  <p className="text-muted-foreground">
                    You have a marketing team but they need strategic leadership, direction, and capability building to operate at the next level.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">✓ You value flexibility</h3>
                  <p className="text-muted-foreground">
                    You want senior strategic support but need the ability to scale engagement up or down based on your priorities and budget.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to discuss a fractional partnership?</h2>
              <p className="text-muted-foreground mb-6">
                Let's explore what level of engagement makes sense for your team.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
                <a href="/#contact" className="flex items-center">
                  Book a Discovery Call
                  <HandDrawnArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={[
        {
          question: "What is Fractional Strategy?",
          answer: "Ongoing strategic partnership on a monthly retainer basis. I work as an integrated member of your team, providing senior-level brand positioning, campaign strategy, and creative direction without the overhead of a full-time hire. You get strategic expertise embedded with your team with flexible commitment - perfect for scale-ups and established organizations (20-100+ people)."
        },
        {
          question: "How is this different from hiring a full-time strategist or CMO?",
          answer: "You get senior strategic thinking without the full-time salary, benefits, recruitment process, and long-term commitment. Fractional engagements are month-to-month with flexible scaling - you can increase or decrease involvement based on your priorities and budget. Plus, you benefit from cross-industry perspective that comes from working with multiple clients."
        },
        {
          question: "What are the engagement models and how do I choose?",
          answer: "Three models: Core Retainer (2-3 days/month, £2-3k/month) for regular strategic guidance and campaign direction; Extended Retainer (4-6 days/month, £4-6k/month) for growth or transformation requiring deeper involvement; Strategic Leadership (8-10 days/month, £8-12k/month) for fractional CMO or Head of Strategy support. Choice depends on your team size, strategic priorities, and level of support needed."
        },
        {
          question: "What does 'days per month' actually mean in practice?",
          answer: "It's not necessarily consecutive days. A '3 days per month' retainer might mean monthly strategy sessions, weekly check-ins, ongoing Slack/email access, quarterly reviews, plus ad-hoc unblocking as needed. The time distributes across the month based on your team's rhythm and priorities. We'll define exact cadence and expectations in our engagement agreement."
        },
        {
          question: "Who is this right for?",
          answer: "Scale-ups (20-100 people) growing fast but can't justify a full-time CMO yet; established organizations with marketing teams needing strategic leadership and capability building; or any team that values flexibility and wants to scale strategic support up or down based on priorities. You need consistent strategic thinking but want to avoid the commitment and cost of a full-time senior hire."
        },
        {
          question: "Can I start small and scale up?",
          answer: "Absolutely. Many clients start with a Core Retainer to test the partnership, then scale to Extended or Strategic Leadership as priorities evolve. The month-to-month structure allows you to adjust as needs change. Some clients even transition from Deep Engagement projects to ongoing Fractional Strategy for continuity."
        },
        {
          question: "How does Fractional Strategy fit with Thread & Stack's approach?",
          answer: "Fractional Strategy provides consistent strategic support - the opposite of one-off projects. It's ideal for teams needing ongoing brand positioning work, campaign direction, and strategic unblocking while we reduce the creative tax on your team. Think of it as having a strategic partner in your corner, month after month, protecting what matters while building momentum."
        }
      ]} />
      <Footer />
    </div>
  );
};

export default FractionalStrategy;