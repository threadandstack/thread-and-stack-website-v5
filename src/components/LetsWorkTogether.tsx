import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

interface LetsWorkTogetherProps {
  source?: string;
}

export const LetsWorkTogether = ({ source = "blog" }: LetsWorkTogetherProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          name: name.trim() || null,
          email: email.trim(),
          message: message.trim() || null,
          source
        });

      if (error) throw error;

      toast({
        title: "Thanks for reaching out!",
        description: "I'll be in touch soon."
      });
      
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      console.error("Lead submission error:", error);
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
    <section className="py-24 px-6 bg-accent/5">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl mb-6 font-light">Let's Work Together</h2>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Ready to build a brand that feels more human? Start a conversation and let's explore how we can work together.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto text-left">
          <div>
            <Label htmlFor="lead-name" className="text-sm text-muted-foreground">Name</Label>
            <Input 
              id="lead-name"
              type="text" 
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background rounded-lg mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="lead-email" className="text-sm text-muted-foreground">Email *</Label>
            <Input 
              id="lead-email"
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background rounded-lg mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="lead-message" className="text-sm text-muted-foreground">What are you working on?</Label>
            <Textarea 
              id="lead-message"
              placeholder="Tell me a bit about your project or what you're wrestling with..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-background rounded-lg mt-1 min-h-[100px]"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl group"
          >
            {isSubmitting ? "Sending..." : "Start the Conversation"}
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
        
        <p className="text-sm text-muted-foreground mt-6">
          Or book a <a href="/clarity-sessions" className="text-accent hover:underline">Clarity Session</a> directly.
        </p>
      </div>
    </section>
  );
};
