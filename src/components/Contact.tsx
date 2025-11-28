import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl mb-6 font-light">
            Let's talk
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Tell me what you're wrestling with. No pressure, just conversation.
          </p>
        </div>
        
        <form className="space-y-6 bg-card p-8 border-2 thread-border">
          <div className="space-y-2">
            <Label htmlFor="name" className="not-italic">Name</Label>
            <Input 
              id="name" 
              placeholder="Your name"
              className="bg-background border thread-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="not-italic">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com"
              className="bg-background border thread-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="not-italic">Role / Organization</Label>
            <Input 
              id="role" 
              placeholder="Founder at..."
              className="bg-background border thread-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="not-italic">What are you wrestling with?</Label>
            <Textarea 
              id="message" 
              placeholder="Tell me about your challenge, question, or what you're hoping to work on..."
              className="min-h-32 bg-background border thread-border"
            />
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border thread-border"
          >
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};
