import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { PortfolioLoader } from "@/components/PortfolioLoader";
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

/** Convert <img> tags with .mp4 src to <video> elements */
function convertMp4ImgsToVideo(html: string): string {
  return html.replace(
    /<img\s+src="([^"]+\.mp4)"[^/]*\/>/gi,
    '<video controls preload="metadata" style="width:100%;border-radius:0.5rem;"><source src="$1" type="video/mp4" /></video>'
  );
}

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

  useEffect(() => {
    if (open && pageId && !hasNda) {
      fetchContent(pageId);
    }
    if (!open) {
      setContent(null);
      setError(null);
    }
  }, [open, pageId]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-3xl p-0 overflow-y-auto"
      >
        {hasNda ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            <Lock className="w-8 h-8 mx-auto mb-3" />
            <p className="font-sans">This project is under NDA.</p>
            <p className="text-sm mt-1">Get in touch to discuss similar work.</p>
          </div>
        ) : isLoading ? (
          <PortfolioLoader />
        ) : error ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            <p>{error}</p>
          </div>
        ) : content ? (
          <div className="bg-background">
            {content.coverImage && (
              <div className="bg-muted">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={content.coverImage}
                    alt={content.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="px-6 pt-5 pb-4 border-b border-border bg-background">
              <SheetHeader className="text-left">
                <SheetTitle className="text-2xl font-light leading-tight text-left">
                  {content.name}
                </SheetTitle>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {content.monthYear && (
                    <span className="text-sm text-muted-foreground font-sans">
                      {content.monthYear}
                    </span>
                  )}
                  {content.tags
                    .filter((t) => !["NDA", "Not Ready", "Featured", "Featured-Hero", "Masonry-Top"].includes(t))
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
              </SheetHeader>
            </div>

            <div className="bg-background px-6 py-6">
              <div
                className="blog-content prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(convertMp4ImgsToVideo(content.html)) }}
              />
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
