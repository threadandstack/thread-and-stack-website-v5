import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let's talk
          </h2>
          <p className="text-xl text-muted-foreground">
            Tell me what you're wrestling with. No pressure, just conversation.
          </p>
        </div>
        
        <form className="space-y-6 bg-card p-8 rounded-lg border border-border">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Your name"
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com"
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role / Organization</Label>
            <Input 
              id="role" 
              placeholder="Founder at..."
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">What are you wrestling with?</Label>
            <Textarea 
              id="message" 
              placeholder="Tell me about your challenge, question, or what you're hoping to work on..."
              className="min-h-32 bg-background"
            />
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};
