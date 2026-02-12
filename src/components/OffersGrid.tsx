import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Users, Target } from "lucide-react";
import { ServiceDrawer } from "./ServiceDrawer";
import { Emphasis } from "@/components/Emphasis";

export const OffersGrid = () => {
  const [selectedOffer, setSelectedOffer] = useState<typeof offers[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Fallback: make visible after 2 seconds if observer doesn't trigger
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  const offers = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Sessions & Sprints",
      tagline: "Focused Strategic Support",
      description: "One-hour Clarity Sessions for rapid intervention (£300), or six-week Thread AI Sprints to transform how you work with AI (from £1k). Two ways to get unstuck and build momentum.",
      link: "/sessions-and-sprints",
      price: "From £300",
      cta: "Learn More"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Brand Connection Workshops",
      tagline: "A Modular Strategy System for Purpose-Driven Brands",
      description: "Fix the disconnect between your brand and your audience. Modular, co-created workshops that get your team aligned on story, positioning, visual identity direction, and roadmap. Build exactly what you need, from lean sprints to comprehensive overhauls.",
      link: "/workshops",
      price: "From £2k",
      cta: "Learn More"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Fractional & Deep Engagement",
      tagline: "Strategic Partnership & Transformation",
      description: "Two models for sustained partnership. Ongoing monthly retainers for continuous strategic support, or intensive 2-6 month projects for comprehensive transformation. For scale-ups and established organizations (20-100+ people).",
      link: "/fractional-deep-engagement",
      price: "Case-by-case",
      cta: "Learn More"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-24 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl md:text-6xl mb-4 text-balance font-semibold italic">
            Ways to work <span className="relative inline-block">together
              <Emphasis className="absolute -bottom-2 left-0 right-0" delay={isVisible ? 0.5 : 999} />
            </span>
          </h2>
          <p className="text-base md:text-lg font-sans text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
              
              <h3 className="text-2xl mb-2 font-semibold italic">
                {offer.title}
              </h3>
              
              <p className="text-sm font-sans text-accent mb-4">
                {offer.tagline}
              </p>
              
              <p className="font-sans text-muted-foreground leading-relaxed mb-6 flex-grow">
                {offer.description}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-border/30">
                <p className="text-sm font-sans font-medium text-foreground/70 not-italic">
                  {offer.price}
                </p>
                
                <Button 
                  className="w-full group bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                  onClick={() => {
                    setSelectedOffer(offer);
                    setDrawerOpen(true);
                  }}
                >
                  {offer.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <ServiceDrawer
        offer={selectedOffer}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </section>
  );
};