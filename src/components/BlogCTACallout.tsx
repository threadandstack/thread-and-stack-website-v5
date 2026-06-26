import { Link } from "react-router-dom";
import { PillButton } from "@/components/ui/pill-button";
import { MessageCircle } from "lucide-react";

interface BlogCTACalloutProps {
  theme?: string | null;
  title?: string;
}

const getThemeCTA = (theme: string | null | undefined) => {
  switch (theme?.toLowerCase()) {
    case 'growth':
      return {
        headline: "Ready to grow with intention?",
        subtext: "Explore Narratives & Strategy Services built for scaling impact without losing your edge.",
        buttonText: "See Strategy Services",
        link: "/narratives-and-strategy-services"
      };
    case 'strategy':
      return {
        headline: "Need strategic clarity?",
        subtext: "See how focused strategy engagements can cut through the noise.",
        buttonText: "See Strategy Services",
        link: "/narratives-and-strategy-services"
      };
    case 'creative':
      return {
        headline: "Did you know?",
        subtext: "I still consult as a Marketing and Creative Strategist. If your brand needs more signal and less noise, let's explore what's possible.",
        buttonText: "See Creative Services",
        link: "/narratives-and-strategy-services"
      };
    case 'systems':
      return {
        headline: "Ready to build better systems?",
        subtext: "Explore Notion & Systems Consultancy designed around creative integrity and human intentionality.",
        buttonText: "See Systems Services",
        link: "/services"
      };
    case 'case studies':
      return {
        headline: "Want results like these?",
        subtext: "See how Narratives & Strategy Services can create similar outcomes for your organisation.",
        buttonText: "See Strategy Services",
        link: "/narratives-and-strategy-services"
      };
    default:
      return {
        headline: "Let's work together",
        subtext: "Whether you need a focused hour or a longer engagement, explore the services that fit your challenge.",
        buttonText: "See Services",
        link: "/services"
      };
  }
};

export const BlogCTACallout = ({ theme, title }: BlogCTACalloutProps) => {
  const cta = getThemeCTA(theme);

  return (
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
        
        <Link to={cta.link}>
          <PillButton 
            icon={MessageCircle}
            className="whitespace-nowrap"
          >
            {cta.buttonText}
          </PillButton>
        </Link>
      </div>
    </div>
  );
};
