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
              <span className="relative inline-block">Practical
                <Emphasis className="absolute -bottom-2 left-0 right-0" delay={isVisible ? 1.2 : 999} />
              </span> workflows.<br />
              <span className="relative inline-block">Living
                <Emphasis className="absolute -bottom-2 left-0 right-0" delay={isVisible ? 1.9 : 999} />
              </span> brands.
            </h2>
            
            <div className="space-y-6 text-lg md:text-xl leading-relaxed border-l-4 border-accent/20 pl-8">
              <p className="text-2xl font-light not-italic">
                I help purpose-led teams close the gap between what they mean and what they're actually saying and shipping.
              </p>
              
              <p>
                That means sharper positioning, honest messaging, and practical strategies and systems that lead to human, intentional, and engaging creatives. I call this the <span className="italic">creative tax</span>—the cognitive load of admin, chaos, and context switching that drags you away from meaningful creative and strategic projects you know need to happen.
              </p>
              
              <p>
                Marketing without strategy is like sinking in quicksand. Together we transform messy marketing into clear narratives that avoid going through the motions, posting for posting's sake. Like a chrysalis emerging, we build strategies that help your brand become what it was always meant to be—torch-bearing work that lights the way forward.
              </p>
              
              <p className="not-italic font-light">
                Your brand becomes a living presence. Your team stays aligned. You get time back for the work that matters.
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
