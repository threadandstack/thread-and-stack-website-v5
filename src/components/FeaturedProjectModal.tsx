import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Project {
  title: string;
  role: string;
  description: string;
  fullDescription?: string;
  quote?: string;
  quoteAttribution?: string;
  images: string[];
  outcomes?: string[];
  link?: string;
  creativeDirection?: string;
  visualSystem?: string;
  designLeadership?: string;
}

interface FeaturedProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeaturedProjectModal = ({
  project,
  open,
  onOpenChange,
}: FeaturedProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-light mb-4">
            {project.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <p className="text-accent font-light not-italic">
            {project.role}
          </p>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground/80 leading-relaxed">
              {project.fullDescription || project.description}
            </p>
          </div>
          
          {project.quote && (
            <blockquote className="border-l-4 border-accent pl-6 py-4 my-6 bg-muted/30 rounded-r-lg">
              <p className="text-foreground/90 italic leading-relaxed text-lg">
                "{project.quote}"
              </p>
              {project.quoteAttribution && (
                <footer className="mt-3 text-foreground/70 not-italic text-base">
                  — {project.quoteAttribution}
                </footer>
              )}
            </blockquote>
          )}
          
          {(project.creativeDirection || project.visualSystem || project.designLeadership) && (
            <div className="space-y-6 my-8">
              <h4 className="text-2xl font-light mb-6 not-italic">Creative Rationale</h4>
              
              {project.creativeDirection && (
                <div>
                  <h5 className="text-lg font-light mb-2 text-accent not-italic">Creative Direction</h5>
                  <p className="text-foreground/80 leading-relaxed">
                    {project.creativeDirection}
                  </p>
                </div>
              )}
              
              {project.visualSystem && (
                <div>
                  <h5 className="text-lg font-light mb-2 text-accent not-italic">Visual System</h5>
                  <p className="text-foreground/80 leading-relaxed">
                    {project.visualSystem}
                  </p>
                </div>
              )}
              
              {project.designLeadership && (
                <div>
                  <h5 className="text-lg font-light mb-2 text-accent not-italic">Design Leadership</h5>
                  <p className="text-foreground/80 leading-relaxed">
                    {project.designLeadership}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {project.outcomes && project.outcomes.length > 0 && (
            <div>
              <h4 className="text-xl font-light mb-3 not-italic">Key Outcomes</h4>
              <ul className="space-y-2">
                {project.outcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span className="text-foreground/80">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-border/20 flex flex-col items-center text-center space-y-4">
            <p className="text-foreground/70 text-lg">
              Ready to transform your brand like this?
            </p>
            <Button asChild size="lg" className="font-light">
              <Link to="/contact">Book a Call</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
