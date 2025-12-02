import workshopImage from "@/assets/brendan-collaboration.jpeg";
import { useEffect, useRef, useState } from "react";
export const HowWeWork = () => {
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
  const principles = [{
    number: "01",
    title: "Start with your reality",
    description: "No generic playbooks or cookie-cutter processes. Every engagement begins with understanding your specific context, ethics, and working style."
  }, {
    number: "02",
    title: "Co-create visual and strategic systems",
    description: "You're not outsourcing your thinking to a consultant. We collaborate to build positioning, visual identity, and workflows that are genuinely yours, from brand world building to practical implementation."
  }, {
    number: "03",
    title: "Hunt decisions and tangible outputs",
    description: "Every session delivers clear language, actionable decisions, and concrete deliverables: creative direction, asset development, strategic frameworks. Not vague concepts."
  }, {
    number: "04",
    title: "Protect what matters",
    description: "We design workflows that reduce friction and cognitive load while preserving human judgement, aesthetic taste, and the creative work you care about."
  }, {
    number: "05",
    title: "Design craft meets strategic thinking",
    description: "Rare combination of strategic positioning and design execution means your brand doesn't just sound right; it looks and feels right across every touchpoint."
  }];
  return <section id="how-we-work" ref={sectionRef} className={`py-24 px-6 bg-muted/30 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-16 text-balance font-light">We start with your reality.</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1">
            <img src={workshopImage} alt="Collaborative workshop session" className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto" />
          </div>
          
          <div className="order-1 md:order-2 space-y-8">
            {principles.slice(0, 2).map((principle, index) => <div key={index} className="space-y-3 group border-l-4 border-accent/20 pl-6">
                <div className="text-accent text-sm not-italic font-light">
                  {principle.number}
                </div>
                
                <h3 className="text-2xl md:text-3xl group-hover:text-accent transition-colors font-light not-italic">
                  {principle.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {principle.description}
                </p>
              </div>)}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {principles.slice(2).map((principle, index) => <div key={index + 2} className="space-y-3 group border-l-4 border-accent/20 pl-6">
              <div className="text-accent text-sm not-italic font-light">
                {principle.number}
              </div>
              
              <h3 className="text-2xl md:text-3xl group-hover:text-accent transition-colors font-light not-italic">
                {principle.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-lg">
                {principle.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};