import { useRef, useEffect, useState } from "react";
import { PillButton } from "@/components/ui/pill-button";
import { ArrowRight, ChevronDown, Compass, Rocket } from "lucide-react";
import { trackCtaClick } from "@/hooks/useAnalytics";

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 50;
      const fadeEnd = 200;
      const opacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      setScrollOpacity(scrollY < fadeStart ? 1 : opacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px thread-divider" />
      
      <div className="max-w-5xl mx-auto text-center space-y-8">
        {/* 07 Subtle Application style headline */}
        <div className="space-y-4">
          <h1 className="font-sans not-italic text-4xl md:text-6xl font-semibold leading-[0.98] tracking-[-0.035em] max-w-4xl mx-auto">
            Marketing that feels{" "}
            <span className="inline-block" style={{ transform: "translateY(-1px)" }}>more</span>{" "}
            <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>
              human
            </span>
          </h1>
        </div>
        
        <div ref={ref} className="max-w-3xl mx-auto text-balance leading-relaxed">
          <p className="font-sans text-base md:text-lg text-muted-foreground">
            The brands that feel <span className="text-accent font-medium">alive</span>, are remembered.
          </p>
          <p className={`mt-4 font-sans text-base text-muted-foreground/70 max-w-xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`} style={{
            transitionDelay: isVisible ? '400ms' : '0ms'
          }}>
            Through strategy, creative direction, and systems that{" "}
            <span className="inline-block font-medium" style={{ transform: "translateY(-0.5px)" }}>actually</span>{" "}
            work.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <PillButton size="lg" icon={Rocket} className="text-lg font-semibold" asChild>
            <a href="#contact" onClick={() => trackCtaClick('Book an Intro Call', 'hero')}>
              Book an Intro Call
            </a>
          </PillButton>
          
          <PillButton size="lg" variant="outline" icon={Compass} className="text-lg" asChild>
            <a href="/how-i-work" onClick={() => trackCtaClick('How I Work', 'hero')}>
              How I Work
            </a>
          </PillButton>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-300"
        style={{ opacity: scrollOpacity }}
      >
        <ChevronDown 
          className="w-6 h-6 text-accent animate-bounce" 
          strokeWidth={2}
        />
      </div>
    </section>
  );
};