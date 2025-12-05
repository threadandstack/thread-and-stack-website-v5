import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp } from "lucide-react";

export const BlogNewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, silently reject (bot detected)
    if (honeypot) {
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
      setIsExpanded(false);
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

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        Subscribe
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-center bg-accent/10 rounded-xl p-6 border border-accent/30">
      <div className="flex justify-between items-start mb-4">
        <p className="text-foreground font-medium">
          Notify me about the next issue ↓
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
          className="text-muted-foreground hover:text-foreground -mt-1"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto relative">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background border-border/50"
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isSubmitting ? "..." : "Subscribe"}
        </Button>
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
      <p className="text-xs text-muted-foreground/70 mt-3">
        By subscribing, you agree to receive emails from Thread & Stack. You can unsubscribe at any time. We respect your privacy and will never share your data.
      </p>
    </div>
  );
};
