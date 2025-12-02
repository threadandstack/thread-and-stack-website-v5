import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Combine role and message for storage
    const fullMessage = role.trim() 
      ? `[${role.trim()}]\n\n${message.trim()}` 
      : message.trim();

    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          name: name.trim() || null,
          email: email.trim(),
          message: fullMessage || null,
          source: 'homepage-contact'
        });

      if (error) throw error;

      // Sync to Notion in background
      supabase.functions.invoke('sync-lead-to-notion', {
        body: {
          name: name.trim() || null,
          email: email.trim(),
          message: fullMessage || null,
          source: 'homepage-contact'
        }
      }).catch(err => console.error('Notion sync error:', err));

      toast({
        title: "Message sent!",
        description: "I'll be in touch soon."
      });
      
      setName("");
      setEmail("");
      setRole("");
      setMessage("");
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or email me directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="space-y-2">
            <Label htmlFor="name" className="not-italic">Name</Label>
            <Input 
              id="name" 
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="not-italic">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="not-italic">Role / Organisation</Label>
            <Input 
              id="role" 
              placeholder="Founder at..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-background rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="not-italic">What are you wrestling with?</Label>
            <Textarea 
              id="message" 
              placeholder="Tell me about your challenge, question, or what you're hoping to work on..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-32 bg-background rounded-lg"
            />
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>
  );
};
