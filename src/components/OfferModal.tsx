import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PillButton } from "@/components/ui/pill-button";
import { ArrowRight } from "lucide-react";

interface Offer {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  fullDescription?: string;
  price: string;
  duration?: string;
  whatYouGet?: string[];
  process?: string[];
  cta: string;
  link: string;
}

interface OfferModalProps {
  offer: Offer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OfferModal = ({
  offer,
  open,
  onOpenChange,
}: OfferModalProps) => {
  if (!offer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              {offer.icon}
            </div>
            <div>
              <DialogTitle className="text-3xl font-light">
                {offer.title}
              </DialogTitle>
              <p className="text-accent font-light not-italic mt-1">
                {offer.tagline}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground/80 leading-relaxed text-lg">
              {offer.fullDescription || offer.description}
            </p>
          </div>
          
          {offer.duration && (
            <div className="bg-accent/5 p-4 rounded-xl">
              <p className="text-sm font-medium text-foreground/70 not-italic">
                Duration: {offer.duration}
              </p>
            </div>
          )}
          
          {offer.whatYouGet && offer.whatYouGet.length > 0 && (
            <div>
              <h4 className="text-xl font-light mb-3 not-italic">What You Get</h4>
              <ul className="space-y-2">
                {offer.whatYouGet.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {offer.process && offer.process.length > 0 && (
            <div>
              <h4 className="text-xl font-light mb-3 not-italic">How It Works</h4>
              <ol className="space-y-2">
                {offer.process.map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-accent font-medium mr-3">{idx + 1}.</span>
                    <span className="text-foreground/80">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          <div className="pt-6 border-t border-border/30 flex items-center justify-between">
            <p className="text-xl font-medium text-foreground/70 not-italic">
              {offer.price}
            </p>
            
            <Button 
              className="group bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
              asChild
            >
              <a href={offer.link}>
                {offer.cta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
