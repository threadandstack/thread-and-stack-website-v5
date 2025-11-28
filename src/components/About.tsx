import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import brendanPhoto from "@/assets/brendan-brick.jpeg";

export const About = () => {
  return (
    <section id="about" className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-16 font-light">
          About Thread & Stack
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src={brendanPhoto} 
              alt="Brendan - Thread & Stack founder"
              className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto"
            />
          </div>
          
          <div className="space-y-6 text-lg md:text-xl leading-relaxed border-l-4 border-accent/20 pl-8">
            <p className="text-2xl md:text-3xl font-light not-italic">
              I'm Brendan, founder of Thread & Stack.
            </p>
            
            <p>
              I've spent 12+ years in brand and marketing across global consumer brands, international consultancies, creative agencies, disruptive tech, ambitious start-ups and nonprofits.
            </p>
            
            <p>
              Now I focus that experience on one thing: helping purpose-led teams turn messy marketing into clear narratives and practical workflows they can sustain.
            </p>
            
            <p>
              Most of the founders and teams I work with are already doing meaningful work. The problem isn't a lack of ideas. It's the gap between what they mean and what they're actually saying and shipping.
            </p>
            
            <p className="not-italic font-light">
              My work sits at the intersection of strategy, clarity and systems—protecting both your brand integrity and your team's creative energy.
            </p>
          </div>
        </div>
        
        
        <div className="mt-12">
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            asChild
          >
            <a href="#contact">
              Work Together
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
