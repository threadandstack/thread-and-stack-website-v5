import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Replace with your actual Beehiiv publication ID
    const beehiivUrl = "https://api.beehiiv.com/v2/publications/YOUR_PUBLICATION_ID/subscriptions";
    
    try {
      // Note: You'll need to configure this with your Beehiiv API key
      // For now, this is a placeholder that shows the structure
      const response = await fetch(beehiivUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_API_KEY"
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: "website",
          utm_medium: "organic"
        })
      });

      if (response.ok) {
        toast({
          title: "Subscribed!",
          description: "You've been added to the newsletter. Check your inbox.",
        });
        setEmail("");
      } else {
        throw new Error("Subscription failed");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or email me directly.",
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
