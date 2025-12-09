import thinkingImage from "@/assets/brendan-cafe.jpeg";
import { Emphasis } from "@/components/Emphasis";
import { useEffect, useRef, useState } from "react";

export const WhatWeDo = () => {
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

  return (
    <section 
      ref={sectionRef}
      className={`py-24 px-6 bg-card transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-5xl md:text-6xl mb-12 md:mb-16 text-balance font-light leading-tight">
          <span className="relative inline-block">Clear
            <Emphasis className="absolute -bottom-2 left-0 right-0" delay={isVisible ? 0.5 : 999} />
          </span> narratives.<br />
          <span className="relative inline-block">Creative
            <Emphasis className="absolute -bottom-2 left-0 right-0" delay={isVisible ? 1.2 : 999} />
          </span> direction.<br />
          <span className="relative inline-block">Living
            <Emphasis className="absolute -bottom-2 left-0 right-0" delay={isVisible ? 1.9 : 999} />
          </span> brands.
        </h2>
        
        {/* Content row - text on left, image on right */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 flex flex-col">
            <p className="text-xl md:text-2xl font-light not-italic leading-relaxed">
              You know what you stand for. But somewhere between intention and execution, things get tangled. The <span className="italic">creative tax</span>, the cognitive load of admin, chaos, and context switching, buries the strategic thinking and creative direction that actually moves things forward. What's needed is clarity: positioning that resonates, visual identity that confidently articulates your narrative, and systems that let your team ship work that feels cohesive and true.
            </p>
            
            <a 
              href="/how-i-work" 
              className="mt-4 text-sm italic text-accent hover:text-accent/80 transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              How I work →
            </a>
          </div>
          
          <div className="order-first md:order-last">
            <img 
              src={thinkingImage} 
              alt="Strategic thinking"
              className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
