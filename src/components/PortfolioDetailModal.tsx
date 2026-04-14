import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, RefreshCw } from "lucide-react";
import { PortfolioLoader } from "@/components/PortfolioLoader";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";
import { toast } from "sonner";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async (
    id: string,
    options?: { force?: boolean; preserveContent?: boolean }
  ) => {
    const preserveContent = options?.preserveContent === true;

    if (preserveContent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke("fetch-portfolio-page", {
        body: { page_id: id, force: options?.force === true },
      });
      if (fnError) throw fnError;

      setError(null);
      setContent(data?.page || null);

      if (preserveContent) {
        toast.success("Portfolio page refreshed from Notion.");
      }
    } catch (e) {
      console.error("Error fetching portfolio page:", e);

      if (preserveContent) {
        toast.error("Failed to refresh portfolio page.");
      } else {
        setError("Failed to load project details.");
      }
    } finally {
      if (preserveContent) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleForceRefresh = () => {
    if (!pageId) return;
    void fetchContent(pageId, { force: true, preserveContent: true });
  };

  useEffect(() => {
    if (open && pageId && !hasNda) {
      void fetchContent(pageId);
    }
    if (!open) {
      setContent(null);
      setError(null);
      setIsRefreshing(false);
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
              <div className="flex items-start justify-between gap-4">
                <SheetHeader className="text-left flex-1">
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

                {import.meta.env.DEV && pageId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={handleForceRefresh}
                    disabled={isLoading || isRefreshing}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh from Notion
                  </Button>
                )}
              </div>
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
