import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";

interface PortfolioDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageId: string | null;
  name: string;
  hasNda: boolean;
}

interface PageContent {
  name: string;
  html: string;
  coverImage: string | null;
  tags: string[];
  monthYear: string;
}

const TAG_COLORS: Record<string, string> = {
  "Brand Strategy": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Content Strategy": "bg-pink-100 text-pink-800 border-pink-200",
  "Copywriting & Storytelling": "bg-orange-100 text-orange-800 border-orange-200",
  "Customer Journey Mapping": "bg-blue-100 text-blue-800 border-blue-200",
  "Design": "bg-purple-100 text-purple-800 border-purple-200",
  "CRM": "bg-green-100 text-green-800 border-green-200",
  "Performance": "bg-gray-100 text-gray-800 border-gray-200",
  "Clientside": "bg-amber-100 text-amber-800 border-amber-200",
};

export const PortfolioDetailModal = ({
  open,
  onOpenChange,
  pageId,
  name,
  hasNda,
}: PortfolioDetailModalProps) => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("fetch-portfolio-page", {
        body: { page_id: id },
      });
      if (fnError) throw fnError;
      setContent(data?.page || null);
    } catch (e) {
      console.error("Error fetching portfolio page:", e);
      setError("Failed to load project details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && pageId && !hasNda) {
      // Only fetch if we don't already have this page cached in state
      if (!content || content.name !== name) {
        fetchContent(pageId);
      }
    }
    if (!isOpen) {
      setContent(null);
      setError(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {hasNda ? (
          <div className="py-12 text-center text-muted-foreground">
            <Lock className="w-8 h-8 mx-auto mb-3" />
            <p className="font-sans">This project is under NDA.</p>
            <p className="text-sm mt-1">Get in touch to discuss similar work.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>{error}</p>
          </div>
        ) : content ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-light leading-tight">
                {content.name}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {content.monthYear && (
                  <span className="text-sm text-muted-foreground font-sans">
                    {content.monthYear}
                  </span>
                )}
                {content.tags
                  .filter((t) => !["NDA", "Not Ready"].includes(t))
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`text-[11px] font-sans ${TAG_COLORS[tag] || "bg-muted text-muted-foreground border-border"}`}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </DialogHeader>

            {content.coverImage && (
              <div className="aspect-[16/10] overflow-hidden rounded-lg mt-2 bg-muted">
                <img
                  src={content.coverImage}
                  alt={content.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              className="blog-content prose prose-sm max-w-none mt-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.html) }}
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
