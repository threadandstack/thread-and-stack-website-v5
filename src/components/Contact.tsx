import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

export const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className={`py-24 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl mb-6 font-light">
            Let's talk
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Tell me what you're wrestling with. No pressure, just conversation.
          </p>
        </div>
        
        <form className="space-y-6 bg-card p-8 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="space-y-2">
            <Label htmlFor="name" className="not-italic">Name</Label>
            <Input 
              id="name" 
              placeholder="Your name"
              className="bg-background rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="not-italic">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com"
              className="bg-background rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="not-italic">Role / Organization</Label>
            <Input 
              id="role" 
              placeholder="Founder at..."
              className="bg-background rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="not-italic">What are you wrestling with?</Label>
            <Textarea 
              id="message" 
              placeholder="Tell me about your challenge, question, or what you're hoping to work on..."
              className="min-h-32 bg-background rounded-lg"
            />
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
          >
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};
