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
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 space-y-8">
            <h2 className="text-5xl md:text-6xl mb-12 text-balance font-light leading-tight">
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
            
            <div className="space-y-6 text-lg md:text-xl leading-relaxed border-l-4 border-accent/20 pl-8">
              <p className="text-2xl font-light not-italic">
                You know what you stand for. You know the work matters. But somewhere between intention and execution, things get tangled—tabs, drafts, half-finished ideas that never quite land the way you meant them to.
              </p>
              
              <p>
                This is the <span className="italic">creative tax</span>—the cognitive load of admin, chaos, and context switching that drags you away from meaningful work. It shows up as messaging that doesn't quite capture what you mean, visuals that feel disconnected from your values, and a brand that's harder to explain than it should be.
              </p>
              
              <p>
                The cost compounds. Your team loses time to confusion. Your audience feels the inconsistency. And the work that actually moves things forward—the <span className="italic">strategic thinking</span>, the <span className="italic">creative direction</span>, the decisions that matter—gets buried under everything else.
              </p>
              
              <p>
                What's needed isn't more content or another campaign. It's clarity: a <span className="italic">visual identity</span> that supports your narrative, <span className="italic">positioning</span> that resonates, and systems that let your team ship work that feels cohesive and true.
              </p>
              
              <p className="not-italic font-light">
                When you close the gap between what you mean and what you're saying, your brand becomes a living presence. Your team stays aligned. And you get time back for the work that matters.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <img 
              src={thinkingImage} 
              alt="Strategic thinking"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
