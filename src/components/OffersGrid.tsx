import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Zap, Users } from "lucide-react";
import { OfferModal } from "./OfferModal";

export const OffersGrid = () => {
  const [selectedOffer, setSelectedOffer] = useState<typeof offers[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const offers = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Clarity Sessions",
      tagline: "Strategic power hours",
      description: "Unblock positioning, refine your offer, diagnose messy systems, or untangle messaging problems. Leave with a clear decision, actionable steps, and specific language you can use immediately.",
      fullDescription: "60-minute strategic power hours designed to unblock positioning, refine your offer, diagnose messy systems, or untangle messaging problems. These focused sessions cut through the noise and help you make clear decisions fast.",
      price: "From £300",
      duration: "60 minutes",
      whatYouGet: [
        "Pre-session questionnaire to focus the conversation",
        "60-minute strategic consultation",
        "Clear decision or direction",
        "Actionable next steps",
        "Specific language and frameworks you can use immediately",
        "Follow-up notes and resources"
      ],
      process: [
        "Book your session and complete pre-work questionnaire",
        "We meet for 60 minutes to tackle your specific challenge",
        "Leave with clarity, decisions, and next steps",
        "Receive follow-up notes and resources within 24 hours"
      ],
      cta: "Book a Session",
      link: "/stacked-sessions"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Thread AI Sprint",
      tagline: "AI & Creative Strategy • 6-week deep work",
      description: "Build your 'second brain' with AI-supported workflows tailored to your tools, ethics, and working style. Turn messy ideas and channel experiments into clear narrative and practical systems.",
      fullDescription: "A 6-week 1:1 mentorship program to build AI-supported workflows tailored to your tools, ethics, and working style. This isn't about replacing human creativity—it's about creating invisible scaffolding that reduces cognitive load and protects your creative energy.",
      price: "From £1k",
      duration: "6 weeks",
      whatYouGet: [
        "6 weekly 1-hour sessions with structured agendas",
        "Custom AI workflow design for your specific tools and needs",
        "Hands-on implementation support",
        "Ethical AI framework aligned with your values",
        "Content systems and templates",
        "Ongoing Slack/email support between sessions",
        "Documentation and playbooks you can reference later"
      ],
      process: [
        "Week 1: Audit your current systems and identify friction points",
        "Week 2-3: Design and implement AI workflows tailored to your tools",
        "Week 4-5: Build content systems and test in real scenarios",
        "Week 6: Refine, document, and ensure sustainability"
      ],
      cta: "Explore Sprints",
      link: "/mentorship-sprint"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Brand Connection Workshops",
      tagline: "Team alignment sessions",
      description: "Get your team on the same page about story, audience, and behaviour. Answer: 'How do we scale the mission without losing the magic?' Leave with shared language and decision filters.",
      fullDescription: "Modular team strategy workshops designed to align your team on story, audience, and behaviour. These sessions address the core question: 'How do we scale the mission without losing the magic?' Perfect for teams of 5-20 people navigating growth.",
      price: "From £2k",
      duration: "Half-day or full-day sessions",
      whatYouGet: [
        "Pre-workshop stakeholder interviews and audit",
        "Facilitated strategy session(s) for your team",
        "Interactive exercises and frameworks",
        "Shared language and decision filters",
        "Clear action plan and next steps",
        "Workshop documentation and follow-up resources",
        "Optional: 30-day follow-up check-in"
      ],
      process: [
        "Discovery call to understand your team's challenges",
        "Pre-workshop stakeholder interviews and preparation",
        "Facilitated workshop session(s) with your team",
        "Document outcomes, decisions, and action plans",
        "Follow-up to ensure momentum and clarity"
      ],
      cta: "Plan a Workshop",
      link: "/workshops"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl md:text-6xl mb-4 text-balance font-light">
            Ways to work together
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
