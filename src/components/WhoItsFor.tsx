import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
export const WhoItsFor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.2
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const audiences = [{
    title: "Brands that have outgrown their old story",
    description: "Your values and ambition have evolved, but your brand narrative is stuck several chapters back. Different teams tell different versions of the story. Competitors with less depth are claiming your space more loudly, while your authentic message gets lost in translation."
  }, {
    title: "Teams building a brand universe",
    description: "You're creating something cohesive across multiple touchpoints, but the vision in leadership's heads gets diluted by the time it reaches execution. In crucial moments—fundraising, launches, partnerships—the brand doesn't land with the impact you know it should."
  }, {
    title: "Leaders seeking sustainable content cycles",
    description: "You're growing, but refuse to sacrifice your team's wellbeing or creative integrity. Marketing shouldn't depend on late nights and heroics. You need systems that utilize AI not to replace creativity, but to empower creative thinking and protect what matters most."
  }];
  return <section ref={sectionRef} className={`py-24 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-16 text-balance font-light">This is for the builders.</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => <div key={index} className="bg-card p-8 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Check className="w-5 h-5 text-accent" />
              </div>
              
              <h3 className="text-2xl mb-4 font-light not-italic">
                {audience.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-lg">
                {audience.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};