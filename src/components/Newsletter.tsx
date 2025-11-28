import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Subscribing email to newsletter:", email);
      
      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email }
      });

      if (error) {
        console.error("Newsletter subscription error:", error);
        throw error;
      }

      console.log("Newsletter subscription response:", data);

      toast({
        title: "Subscribed!",
        description: "You've been added to the newsletter. Check your inbox for a welcome email.",
      });
      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription failed:", error);
      
      const errorMessage = error?.message?.includes('already subscribed') 
        ? "This email is already subscribed to the newsletter."
        : "Please try again or email me directly.";
      
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-accent/5">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl mb-6 font-light">
          Ideas on brand, AI & creative systems
        </h2>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Monthly reflections on building brands that stay true while scaling. No spam, just signal.
        </p>
        
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <div className="flex-1">
            <Label htmlFor="newsletter-email" className="sr-only">Email</Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background rounded-lg"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        
        <p className="text-sm text-muted-foreground mt-4">
          Unsubscribe anytime. Your email stays private.
        </p>
      </div>
    </section>
  );
};
