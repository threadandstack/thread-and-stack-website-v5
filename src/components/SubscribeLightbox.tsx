import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SubscribeLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscribeLightbox = ({ open, onOpenChange }: SubscribeLightboxProps) => {
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
      const { error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email }
      });
      if (error) throw error;
      toast({
        title: "Subscribed!",
        description: "You've been added to the newsletter."
      });
      setEmail("");
      setConsent(false);
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error?.message?.includes('already subscribed') 
        ? "This email is already subscribed." 
        : "Please try again.";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light">
            Subscribe to <span className="italic">Stacked Behaviours</span>
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Thoughts on brand, creativity, and the systems that build our businesses. Monthly signals on building brands that stay true while scaling.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="relative mt-4">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border-border"
            />
            
            <div className="flex items-start gap-2">
              <Checkbox 
                id="lightbox-newsletter-consent" 
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                className="mt-0.5"
              />
              <Label 
                htmlFor="lightbox-newsletter-consent" 
                className="text-sm text-muted-foreground cursor-pointer leading-tight"
              >
                I agree to receive email communications from Thread & Stack
              </Label>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || !consent}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
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
        
        <p className="text-xs text-muted-foreground/70 text-center mt-2">
          You can unsubscribe at any time. We respect your privacy and will never share your data.
        </p>
      </DialogContent>
    </Dialog>
  );
};
