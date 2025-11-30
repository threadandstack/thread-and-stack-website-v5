import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Target, Layers, FileText, Users } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

const DeepEngagement = () => {
  const projectTypes = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Brand Refresh",
      duration: "2-3 months",
      description: "Update positioning, messaging, and visual identity while preserving brand equity",
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
      description: "Build comprehensive marketing infrastructure, processes, and capabilities",
      ideal: "Teams scaling operations or transitioning from founder-led to system-driven"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Complete Transformation",
      duration: "5-6 months",
      description: "End-to-end strategic work combining brand, positioning, and systems",
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

  const caseStudies = [
    {
      client: "Regional Healthcare Provider",
      industry: "Healthcare",
      size: "85 staff, multi-site operations",
      challenge: "Outdated positioning failing to differentiate in competitive market, internal teams misaligned on brand",
      project: "5-month Complete Transformation",
      investment: "£45k",
      outcomes: [
        "New positioning framework driving 52% increase in qualified inquiries",
        "Unified brand architecture across 5 service lines",
        "Marketing team capability increased from junior to strategic",
        "Documentation and systems enabling sustainable growth",
        "Board-approved 3-year strategic roadmap"
      ]
    },
    {
      client: "Tech-for-Good Startup",
      industry: "Social Enterprise",
      size: "30 people, Series A funded",
      challenge: "Post-funding growth requiring scalable marketing systems and clear positioning for B2B pivot",
      project: "4-month Marketing System Build",
      investment: "£32k",
      outcomes: [
        "Built marketing function from scratch (hired and trained 3-person team)",
        "Implemented Notion-based marketing operations system",
        "Created repeatable campaign frameworks reducing execution time by 60%",
        "B2B positioning clarity driving 8 enterprise deals in 6 months",
        "Transitioned to Core Retainer for ongoing support"
      ]
    }
  ];

  const deliverables = [
    "Strategic Foundation Document (positioning, messaging, frameworks)",
    "Brand Architecture and Guidelines",
    "Marketing Systems and Process Documentation",
    "Team Training and Capability Development",
    "Implementation Roadmap and Governance",
    "Sustainability and Transition Plan"
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-24 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-accent font-semibold mb-2">2-6 Month Transformation Projects</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Deep Engagement
            </h1>
            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-accent mb-6">
              <p className="text-lg text-muted-foreground">
                Comprehensive strategic projects for organizations ready to commit to transformation. Full brand refreshes, positioning overhauls, or marketing system builds with clear deliverables and measurable impact.
              </p>
              <p className="text-lg text-muted-foreground mt-3 font-semibold">
                For teams (20-100+ people) ready to invest in deep work that creates lasting change.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-semibold mb-3">The Commitment</h3>
            <p className="text-xl mb-4">Deep work. Clear deliverables. Lasting transformation.</p>
            <p className="text-lg text-muted-foreground mb-6">
              This isn't a quick fix or surface-level refresh. It's a comprehensive engagement where we work together intensively over 2-6 months to create fundamental strategic change. You get complete transformation with documented systems that outlive the engagement.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              <a href="/#contact" className="flex items-center">
                Explore Projects
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Project Types</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Each engagement is customized to your specific needs, but most fall into these categories:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {projectTypes.map((project, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                      {project.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-accent text-sm mb-3">{project.duration}</p>
                    <p className="text-muted-foreground mb-3">{project.description}</p>
                    <p className="text-sm text-muted-foreground italic">Ideal for: {project.ideal}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">The Process</h2>
              <p className="text-lg text-muted-foreground mb-8">
                A structured approach ensuring clarity, alignment, and sustainable outcomes.
              </p>
              <div className="space-y-6">
                {phases.map((phase, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-8">
                    <div className="mb-4">
                      <h3 className="text-2xl font-semibold mb-1">{phase.title}</h3>
                      <p className="text-accent font-semibold">{phase.month}</p>
                    </div>
                    <ul className="space-y-2">
                      {phase.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">What You Get</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Comprehensive deliverables designed for implementation and sustainability:
              </p>
              <div className="bg-card border border-border rounded-lg p-8">
                <ul className="space-y-3">
                  {deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-lg">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Case Studies</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Real transformations from deep engagement projects.
              </p>
              <div className="space-y-8">
                {caseStudies.map((study, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold mb-2">{study.client}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                        <span className="bg-secondary/20 px-3 py-1 rounded-full">{study.industry}</span>
                        <span className="bg-secondary/20 px-3 py-1 rounded-full">{study.size}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">The Challenge</h4>
                        <p className="text-muted-foreground">{study.challenge}</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">The Project</h4>
                          <p className="text-accent">{study.project}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Investment</h4>
                          <p className="text-accent">{study.investment}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">The Outcomes</h4>
                        <ul className="space-y-2">
                          {study.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
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
              <h2 className="text-3xl font-bold mb-6">Investment & Commitment</h2>
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Pricing Structure</h3>
                  <p className="text-muted-foreground mb-4">
                    Projects are scoped based on complexity, duration, and deliverables. Most engagements range:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Brand Refresh (2-3 months): £20-30k</li>
                    <li>• Positioning Overhaul (3-4 months): £30-40k</li>
                    <li>• Marketing System Build (4-6 months): £35-50k</li>
                    <li>• Complete Transformation (5-6 months): £45-65k</li>
                  </ul>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">What's Required From You</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Executive sponsorship and decision-making authority</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Stakeholder time for interviews and workshops (typically 4-6 hours/month per stakeholder)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Internal team collaboration and knowledge sharing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Commitment to implementation and change management</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Who This Is For</h2>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">✓ You're ready to commit</h3>
                  <p className="text-muted-foreground">
                    You understand this is a partnership requiring time, resources, and organizational buy-in. You're committed to doing the work and implementing the outcomes.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">✓ You need fundamental change</h3>
                  <p className="text-muted-foreground">
                    Surface-level fixes won't solve your challenges. You need comprehensive strategic work that addresses root causes and creates lasting transformation.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">✓ You value sustainability</h3>
                  <p className="text-muted-foreground">
                    You want systems, documentation, and capability that outlive the engagement. You're building for the long term, not quick wins.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to explore a deep engagement?</h2>
              <p className="text-muted-foreground mb-6">
                Let's discuss your challenges and determine if this level of commitment makes sense.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
                <a href="/#contact" className="flex items-center">
                  Book a Scoping Call
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DeepEngagement;