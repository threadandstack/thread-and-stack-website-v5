import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ContactDrawer } from "@/components/ContactDrawer";

interface BlogCTACalloutProps {
  theme?: string | null;
  title?: string;
}

const getThemeCTA = (theme: string | null | undefined) => {
  switch (theme?.toLowerCase()) {
    case 'growth':
      return {
        headline: "Ready to grow with intention?",
        subtext: "Let's talk about scaling your impact without losing your soul.",
        buttonText: "Start a Conversation"
      };
    case 'strategy':
      return {
        headline: "Need strategic clarity?",
        subtext: "Book a session to cut through the noise and find your path forward.",
        buttonText: "Book a Strategy Session"
      };
    case 'creative':
      return {
        headline: "Want to unlock your creative edge?",
        subtext: "Let's explore how to make your brand feel more alive.",
        buttonText: "Let's Talk Creative"
      };
    case 'systems':
      return {
        headline: "Ready to build better systems?",
        subtext: "Discover how AI-powered workflows can give you back 5-10 hours a week.",
        buttonText: "Explore AI Systems"
      };
    case 'case studies':
      return {
        headline: "Want results like these?",
        subtext: "Let's discuss how we can achieve similar outcomes for your organization.",
        buttonText: "Start a Conversation"
      };
    default:
      return {
        headline: "Let's work together",
        subtext: "Whether you need a focused hour or a longer engagement, I'd love to hear about your challenge.",
        buttonText: "Get in Touch"
      };
  }
};

export const BlogCTACallout = ({ theme, title }: BlogCTACalloutProps) => {
  const [contactOpen, setContactOpen] = useState(false);
  const cta = getThemeCTA(theme);

  return (
    <>
      <ContactDrawer 
        open={contactOpen} 
        onOpenChange={setContactOpen} 
        source={`blog-${title?.toLowerCase().replace(/\s+/g, '-') || 'post'}`} 
      />
      
      <div className="my-16 p-6 md:p-8 rounded-xl bg-muted/40 border border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">{cta.headline}</h3>
              <p className="text-muted-foreground">{cta.subtext}</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setContactOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 group whitespace-nowrap"
          >
            {cta.buttonText}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </>
  );
};
