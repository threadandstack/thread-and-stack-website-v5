import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import workshopImage from "@/assets/photos/workshop/brendan-22.jpg";

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
    title: "Your story has moved on.",
    description: "Your values and ambition have shifted, but the brand still speaks in an older voice. You need clarity, updated language, and creative direction that reflect who you are today.",
    linkText: "Want to tell your story with soul?",
    linkUrl: "/blog/storytelling-with-a-soul"
  }, {
    title: "Your brand is becoming a universe.",
    description: "You are expanding across new touchpoints and channels. The brand needs coherence, expression, and a visual system that keeps everything connected and true.",
    linkText: "What is a brand universe?",
    linkUrl: "/blog/what-is-a-brand-universe"
  }, {
    title: "Your team needs clarity and creative support.",
    description: "You want to grow without sacrificing wellbeing or creative integrity. Your team needs systems and support that protect their energy and strengthen the work they produce.",
    linkText: "The role of strategic clarity",
    linkUrl: "/blog/why-you-and-your-team-care-about-clarity"
  }];
  return <section ref={sectionRef} className={`py-24 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 items-start mb-12">
          <div className="md:col-span-3">
            <h2 className="text-5xl md:text-6xl mb-6 text-balance font-light">For makers, founders, and teams.</h2>
          </div>
          <div className="md:col-span-2 overflow-hidden rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <img src={workshopImage} alt="Workshop collaboration in action" className="w-full h-48 md:h-56 object-cover" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => <div key={index} className="bg-card p-8 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Check className="w-5 h-5 text-accent" />
              </div>
              
              <h3 className="text-2xl mb-4 font-light not-italic">
                {audience.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                {audience.description}
              </p>
              
              <Link 
                to={audience.linkUrl} 
                className="text-sm italic text-accent hover:text-accent/80 transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                {audience.linkText} →
              </Link>
            </div>)}
        </div>
      </div>
    </section>;
};