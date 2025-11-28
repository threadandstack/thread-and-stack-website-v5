import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Project {
  title: string;
  role: string;
  description: string;
  fullDescription?: string;
  images: string[];
  outcomes?: string[];
  link?: string;
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
