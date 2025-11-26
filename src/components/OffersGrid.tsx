import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Zap, Users } from "lucide-react";

export const OffersGrid = () => {
  const offers = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Stacked Sessions",
      tagline: "60-minute strategic power hours",
      description: "Unblock positioning, refine an offer, diagnose a messy system, or untangle a messaging problem. You leave with a clear decision, a small action plan, and specific language you can use immediately.",
      price: "~£300",
      cta: "Book a Stacked Session",
      link: "/stacked-sessions"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Thread AI Mentorship Sprint",
      tagline: "6-week 1:1 mentorship",
      description: "Build a 'second brain' and AI-supported workflows tailored to your real tools, ethics, and working style. No generic AI hacks—everything is contextual. Save hours weekly and protect creative energy.",
      price: "Investment varies",
      cta: "Explore the Sprint",
      link: "/mentorship-sprint"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Brand Connection Workshops",
      tagline: "Modular strategy workshops",
      description: "Align your team on story, audience, and behaviour. Answer the big question: 'How do we scale the mission without losing the magic?' Leave with clear positioning, decision filters, and practical artefacts.",
      price: "Custom pricing",
      cta: "Plan a Workshop",
      link: "/workshops"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Ways to work together
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three doors into building brand clarity and systems that scale sustainably
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-lg p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-xl flex flex-col"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent">
                {offer.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                {offer.title}
              </h3>
              
              <p className="text-sm text-accent font-medium mb-4">
                {offer.tagline}
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                {offer.description}
              </p>
              
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground/70">
                  {offer.price}
                </p>
                
                <Button 
                  className="w-full group bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <a href={offer.link}>
                    {offer.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
