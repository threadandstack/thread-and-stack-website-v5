import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";
import heroImage from "@/assets/photos/shoreditch/brendan-30.jpg";

export const HeroPhoto = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showUnderline, setShowUnderline] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowUnderline(true), 600);
    return () => clearTimeout(timer);
  }, []);
  
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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-background/85" />
      
      <div className="absolute top-0 left-0 right-0 h-px thread-divider" />
      
      <div className="relative max-w-5xl mx-auto text-center space-y-8 px-6 py-24">
        <div className="space-y-4">
          <h1 className="font-serif-pro text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto">
            Marketing that feels{" "}
            <span className="inline-block" style={{ transform: "translateY(-1px)" }}>more</span>{" "}
            <span className="inline-block text-accent relative" style={{ transform: "translateY(1px)" }}>
              human
              {showUnderline && <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0} animate={true} />}
            </span>
          </h1>
        </div>
        
        <div ref={ref} className="max-w-3xl mx-auto text-balance leading-relaxed">
          <p className="font-serif-pro text-xl md:text-2xl text-muted-foreground">
            The brands that feel <span className="text-accent font-medium">alive</span>, are remembered.
          </p>
          <p className={`mt-4 font-serif-pro text-lg text-muted-foreground/70 max-w-xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`} style={{
            transitionDelay: isVisible ? '400ms' : '0ms'
          }}>
            Through strategy, creative direction, and systems that{" "}
            <span className="inline-block font-medium" style={{ transform: "translateY(-0.5px)" }}>actually</span>{" "}
            work.
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
