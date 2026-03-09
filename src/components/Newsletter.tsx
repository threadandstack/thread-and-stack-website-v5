import { useState } from "react";
import { PillButton } from "@/components/ui/pill-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackNewsletterSignup } from "@/hooks/useAnalytics";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, silently reject (bot detected)
    if (honeypot) {
      return;
    }

    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please agree to receive emails before subscribing.",
        variant: "destructive"
      });
      return;
    }
    
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
      trackNewsletterSignup();
      toast({
        title: "Subscribed!",
        description: "You've been added to the newsletter. Check your inbox for a welcome email."
      });
      setEmail("");
      setConsent(false);
    } catch (error: any) {
      console.error("Newsletter subscription failed:", error);
      const errorMessage = error?.message?.includes('already subscribed') 
        ? "This email is already subscribed to the newsletter." 
        : "Please try again or email me directly.";
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-accent/5">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl mb-6 font-light">Subscribe to Stacked Behaviors</h2>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Thoughts on brand, creativity, and systems that build our businesses. Subscribe here, and I'll send you monthly signals on building brands that stay true while scaling.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <Label htmlFor="newsletter-email" className="sr-only">Email</Label>
              <Input 
                id="newsletter-email" 
                type="email" 
                placeholder="your@email.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="bg-background rounded-lg" 
              />
            </div>
            <PillButton 
              type="submit" 
              disabled={isSubmitting || !consent} 
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </PillButton>
          </div>
          
          <div className="flex items-start gap-2 text-left">
            <Checkbox 
              id="newsletter-consent" 
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              className="mt-0.5"
            />
            <Label 
              htmlFor="newsletter-consent" 
              className="text-sm text-muted-foreground cursor-pointer leading-tight"
            >
              I agree to receive email communications from Thread & Stack
            </Label>
          </div>
          
          {/* Honeypot field - hidden from users, catches bots */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <Input 
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
        </form>
        
        <p className="text-sm text-muted-foreground mt-4">
          Unsubscribe anytime. Your email stays private.
        </p>
      </div>
    </section>
  );
};