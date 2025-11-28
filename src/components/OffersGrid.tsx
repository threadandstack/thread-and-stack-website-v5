import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Zap, Users } from "lucide-react";

export const OffersGrid = () => {
  const offers = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Clarity Sessions",
      tagline: "Strategic power hours",
      description: "Unblock positioning, refine your offer, diagnose messy systems, or untangle messaging problems. Leave with a clear decision, actionable steps, and specific language you can use immediately.",
      price: "From £300",
      cta: "Book a Session",
      link: "/stacked-sessions"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "AI & Creative Strategy Sprints",
      tagline: "6-week deep work",
      description: "Build your 'second brain' with AI-supported workflows tailored to your tools, ethics, and working style. Turn messy ideas and channel experiments into clear narrative and practical systems.",
      price: "From £1k",
      cta: "Explore Sprints",
      link: "/mentorship-sprint"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Brand Connection Workshops",
      tagline: "Team alignment sessions",
      description: "Get your team on the same page about story, audience, and behaviour. Answer: 'How do we scale the mission without losing the magic?' Leave with shared language and decision filters.",
      price: "From £2k",
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
              className="bg-card border-2 thread-border p-8 hover:border-accent transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 border-2 thread-border flex items-center justify-center mb-6 text-accent">
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
              
              <div className="space-y-4 pt-4 border-t thread-border">
                <p className="text-sm font-medium text-foreground/70 not-italic">
                  {offer.price}
                </p>
                
                <Button 
                  className="w-full group bg-primary text-primary-foreground hover:bg-primary/90 border thread-border"
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
