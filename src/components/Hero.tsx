import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/brendan-street.jpeg";

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-24 overflow-hidden border-b-2 thread-border">
      <div className="absolute top-0 left-0 right-0 h-px thread-divider" />
      
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-5xl md:text-7xl leading-tight text-balance font-light">
          Brand strategy and systems for purpose‑led teams who refuse to burn out
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
          Grow not just faster, but truer. We blend deep brand strategy with practical systems so you protect creative integrity while you scale.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-lg px-8 group border thread-border not-italic"
            asChild
          >
            <a href="#contact">
              Book a Stacked Session
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 border-2 thread-border hover:bg-foreground hover:text-background not-italic"
            asChild
          >
            <a href="#how-we-work">
              How We Work
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
