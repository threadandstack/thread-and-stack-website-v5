import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import brendanPhoto from "@/assets/brendan-brick.jpeg";
import { useEffect, useRef, useState } from "react";

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className={`py-24 px-6 bg-card transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'}`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-16 font-semibold italic">
          About Thread & Stack
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src={brendanPhoto} 
              alt="Brendan - Thread & Stack founder"
              className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto"
            />
          </div>
          
          <div className="space-y-6 text-base md:text-lg leading-relaxed border-l-4 border-accent/20 pl-8 font-sans">
            <p className="text-xl md:text-2xl font-sans not-italic">
              I'm Brendan, founder of Thread & Stack.
            </p>
            
            <p>
              I've spent 12+ years in brand and marketing across global consumer brands, international consultancies, creative agencies, disruptive tech, ambitious start-ups and nonprofits.
            </p>
            
            <p>
              Now I focus that experience on one thing: helping purpose-led teams turn messy marketing into clear narratives and practical workflows they can sustain.
            </p>
            
            <p>
              Most of the founders and teams I work with are already doing meaningful work. The problem isn't a lack of ideas. It's the gap between what they mean and what they're actually saying and shipping.
            </p>
            
            <p className="not-italic">
              My work sits at the intersection of brand strategy, creative direction, and systems design, protecting both your brand integrity and your team's creative energy.
            </p>
          </div>
        </div>
        
        
        <div className="mt-12 flex gap-4">
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            asChild
          >
            <a href="#contact">
              Book an Intro Call
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="group rounded-xl"
            asChild
          >
            <a href="/about">
              More About Me
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
