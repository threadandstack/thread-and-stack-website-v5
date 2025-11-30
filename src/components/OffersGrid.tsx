import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Zap, Users } from "lucide-react";
import { OfferModal } from "./OfferModal";
import { Emphasis } from "@/components/Emphasis";

export const OffersGrid = () => {
  const [selectedOffer, setSelectedOffer] = useState<typeof offers[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const offers = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Clarity Sessions",
      tagline: "Rapid Strategic Intervention",
      description: "One Hour. One Problem. Solved. A focused session to unblock positioning, validate decisions, or diagnose messy systems. Leave with recording, AI summary, and a clear action plan.",
      fullDescription: "Sometimes you don't need a 6-week sprint. Sometimes you just need 60 minutes to unblock a specific problem, validate a decision, or get a second brain on a messy situation. A focused, high-intensity consulting session designed to clear the fog and give you an immediate path forward.",
      price: "£300",
      duration: "60 minutes",
      whatYouGet: [
        "The Recording: Full video/audio of the session",
        "The Summary: Thread AI transcription and summary of key decisions",
        "The Action Plan: A bulleted list of exactly what you need to do next",
        "Pre-session review of your notes",
        "Immediate, actionable path forward"
      ],
      process: [
        "Send your notes in advance for review",
        "60-minute focused session tackling your specific problem",
        "Receive recording with AI summary and action plan",
        "Leave with clarity and immediate next steps"
      ],
      cta: "Book a Session",
      link: "/clarity-sessions"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Thread AI Sprint",
      tagline: "A 6-Week Intensive for Purpose-Driven Marketers",
      description: "Transform how you work with AI without losing your creative edge. Build a custom productivity system that gives you 5-10 hours back each week. Human-centered. Tool-agnostic. Creativity-first.",
      fullDescription: "A 6-week 1:1 mentorship program where we build AI-supported workflows tailored to your tools, role, and working style. You stay in control—AI handles mechanical tasks while you focus on creative, strategic work that moves the needle. It's about unlocking time, not replacing thinking.",
      price: "From £1k",
      duration: "6 weeks",
      whatYouGet: [
        "6 weekly 1-hour sessions with structured agendas",
        "Custom productivity system built for your actual role and tools",
        "5-10 hours back each week through AI-enabled workflows",
        "Confidence using AI without second-guessing or quality drops",
        "Works in any ecosystem: Microsoft, Google, Notion, or browser-only",
        "Ongoing support between sessions",
        "Documentation and playbooks you can reference later"
      ],
      process: [
        "Week 1-2: Foundation & Setup - map workflow, identify pain points",
        "Week 3-4: Implementation & Integration - build tailored AI workflows",
        "Week 5-6: Refinement & Mastery - refine system, build sustainable habits"
      ],
      cta: "Explore Sprints",
      link: "/mentorship-sprint"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Brand Connection Workshops",
      tagline: "A Modular Strategy System for Purpose-Driven Brands",
      description: "Fix the disconnect between your brand and your audience. Modular, co-created workshops that get your team aligned on story, positioning, and roadmap. Build exactly what you need—from lean sprints to comprehensive overhauls.",
      fullDescription: "Most brand strategy is a black box. You pay a fortune, wait three months, and get a PDF that gathers dust. This is different. It's a modular, co-created workshop system designed to fix the disconnect between your brand and your audience...on your terms. Choose the depth and price for each phase to build the workshop that fits your budget and burning questions.",
      price: "From £2k",
      duration: "Modular: Half-day to 2-day sprints",
      whatYouGet: [
        "Clarity over Confusion: Hard evidence, not assumptions",
        "Alignment over Arguments: Force consensus across teams",
        "Momentum over Stagnation: 3 months of work in 2 days",
        "Confidence over Risk: Test positioning before building assets",
        "Modular phases: Discovery, Workshop, and Output options",
        "Strategic playbook with frameworks and roadmap"
      ],
      process: [
        "Phase 1: Discovery - Questionnaires, interviews, or customer research",
        "Phase 2: Workshop - Half-day diagnostic to 2-day sprint",
        "Phase 3: Output - Summary, strategic playbook, or pitch building"
      ],
      cta: "Plan a Workshop",
      link: "/workshops"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-24 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl md:text-6xl mb-4 text-balance font-light">
            Ways to work <span className="relative inline-block">together
              <Emphasis className="absolute -bottom-2 left-0 right-0" delay={isVisible ? 0.5 : 999} />
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Clear entry points that protect your time, build trust, and create momentum
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-8 transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent">
                {offer.icon}
              </div>
              
              <h3 className="text-2xl mb-2 font-light">
                {offer.title}
              </h3>
              
              <p className="text-sm text-accent mb-4">
                {offer.tagline}
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                {offer.description}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-border/30">
                <p className="text-sm font-medium text-foreground/70 not-italic">
                  {offer.price}
                </p>
                
                <Button 
                  className="w-full group bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                  onClick={() => {
                    setSelectedOffer(offer);
                    setModalOpen(true);
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <OfferModal
        offer={selectedOffer}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};
