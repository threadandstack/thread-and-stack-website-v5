import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";

const HeadlineWord = ({ children, delay, isEmphasized = false }: { children: React.ReactNode; delay: number; isEmphasized?: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (isEmphasized) {
    return (
      <span 
        className={`relative inline-block transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {children}
        <Emphasis className="absolute -bottom-2 left-0 right-0" delay={isVisible ? 0 : 100} />
      </span>
    );
  }

  return (
    <span 
      className={`inline-block transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </span>
  );
};

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.3
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);
  return <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px thread-divider" />
      
      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* Marginalia-style hero headline */}
        <div className="space-y-4">
          <h1 className="font-serif-pro leading-snug">
            <span className="block">
              <HeadlineWord delay={100}>
                <span className="text-5xl md:text-7xl font-bold">Marketing</span>
              </HeadlineWord>{" "}
              <HeadlineWord delay={250}>
                <span className="text-4xl md:text-6xl font-normal text-muted-foreground inline-block" style={{ transform: "translateY(2px)" }}>
                  that feels
                </span>
              </HeadlineWord>
            </span>
            <span className="block mt-2">
              <HeadlineWord delay={400} isEmphasized>
                <span className="text-5xl md:text-7xl font-extrabold inline-block" style={{ transform: "rotate(-0.5deg)" }}>
                  more human
                </span>
              </HeadlineWord>
            </span>
          </h1>
        </div>
        
        <div ref={ref} className="max-w-3xl mx-auto text-balance leading-relaxed">
          <p className="font-serif-pro text-xl md:text-2xl text-muted-foreground">
            The brands that feel <span className="text-accent font-medium">alive</span>, are remembered.
          </p>
          <p className={`mt-4 font-serif-pro italic text-base md:text-lg text-muted-foreground/70 border-l-2 border-accent/30 pl-4 inline-block transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`} style={{
            transitionDelay: isVisible ? '1800ms' : '0ms',
            transform: isVisible ? 'rotate(-0.3deg)' : 'rotate(0deg)'
          }}>
            Strategy. Creative direction. Systems that work.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-lg px-8 group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] not-italic font-serif-pro font-semibold" asChild>
            <a href="#contact">
              Book a Clarity Session
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          
          <Button size="lg" variant="outline" className="text-lg px-8 rounded-xl hover:bg-foreground hover:text-background not-italic shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-serif-pro" asChild>
            <a href="#how-we-work">
              How We Work
            </a>
          </Button>
        </div>
      </div>
    </section>;
};