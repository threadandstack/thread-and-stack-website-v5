import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import brendanPhoto from "@/assets/brendan-brick.jpeg";

export const About = () => {
  return (
    <section id="about" className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-12 font-light">
          About
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src={brendanPhoto} 
              alt="Brendan - Thread & Stack founder"
              className="border-2 thread-border w-full h-auto"
            />
          </div>
          
          <div className="space-y-6 text-lg leading-relaxed border-l-2 thread-border pl-8">
            <p>
              I'm a brand strategist and systems thinker who's spent years helping purpose-led teams clarify what they stand for and how they work.
            </p>
            
            <p>
              My background blends brand strategy (positioning, messaging, narrative) with practical systems design (Notion, AI workflows, operations). I believe the best brands aren't just beautiful—they're functional. They help you make decisions, focus effort, and protect the work that matters.
            </p>
            
            <p>
              I work with founders and teams who care more about the mission than the optics—but still need the brand to work. People who want to grow without burning out, scale without losing integrity, and build systems that support humans rather than exhaust them.
            </p>
            
            <p className="not-italic">
              If that sounds like you, let's talk.
            </p>
          </div>
        </div>
        
        
        <div className="mt-12">
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 group border thread-border"
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
