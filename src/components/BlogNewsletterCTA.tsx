import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BlogNewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="max-w-xl mx-auto mb-16 text-center bg-muted/50 rounded-xl p-6 border border-border/30">
      <p className="text-foreground font-medium mb-4">
        Notify me about the next issue ↓
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
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
          variant="outline"
          className="shrink-0"
        >
          {isSubmitting ? "..." : "Subscribe"}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground/70 mt-3">
        By subscribing, you agree to receive emails from Thread & Stack. You can unsubscribe at any time. We respect your privacy and will never share your data.
      </p>
    </div>
  );
};
