import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const About = () => {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          About
        </h2>
        
        <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
          <p>
            I'm a brand strategist and systems thinker who's spent years helping purpose-led teams clarify what they stand for and how they work.
          </p>
          
          <p>
            My background blends brand strategy (positioning, messaging, narrative) with practical systems design (Notion, AI workflows, operations). I believe the best brands aren't just beautiful—they're functional. They help you make decisions, focus effort, and protect the work that matters.
          </p>
          
          <p>
            I work with founders and teams who care more about the mission than the optics—but still need the brand to work. People who want to grow without burning out, scale without losing integrity, and build systems that support humans rather than exhaust them.
          </p>
          
          <p>
            If that sounds like you, let's talk.
          </p>
        </div>
        
        <div className="mt-10">
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 group"
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
