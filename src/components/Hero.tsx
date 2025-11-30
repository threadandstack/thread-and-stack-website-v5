import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";
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
      
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl leading-[1.1] text-balance font-light">
            Marketing that feels <span className="relative inline-block">more human
              <Emphasis className="absolute -bottom-2 left-0 right-0" />
            </span>
          </h1>
        </div>
        
        <div ref={ref} className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed font-light">
          <p>The brands that feel <span className="text-accent">alive</span>, are remembered.</p>
          <p className={`mt-2 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{
          transitionDelay: isVisible ? '1300ms' : '0ms'
        }}>Will yours be?</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-lg px-8 group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] not-italic" asChild>
            <a href="#contact">
              Book a Clarity Session
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          
          <Button size="lg" variant="outline" className="text-lg px-8 rounded-xl hover:bg-foreground hover:text-background not-italic shadow-[0_2px_8px_rgba(0,0,0,0.04)]" asChild>
            <a href="#how-we-work">
              How We Work
            </a>
          </Button>
        </div>
      </div>
    </section>;
};