import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactDrawer } from "@/components/ContactDrawer";
import { PortfolioDetailModal } from "@/components/PortfolioDetailModal";
import { PillButton } from "@/components/ui/pill-button";
import { Send, Lock } from "lucide-react";

interface PortfolioItem {
  id: string;
  name: string;
  tags: string[];
  text: string;
  monthYear: string;
  date: string | null;
  coverImage: string | null;
  hasNda: boolean;
}

interface PortfolioGalleryProps {
  databaseId: string;
  tags?: string[];
  pillar: "creative" | "notion";
  ctaLabel?: string;
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

export const PortfolioGallery = ({
  databaseId,
  tags: filterTags,
  pillar,
  ctaLabel = "Like what you see? Let's talk",
}: PortfolioGalleryProps) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<PortfolioItem | null>(null);

  const { data: items = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["portfolio", databaseId, filterTags],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-portfolio", {
        body: { database_id: databaseId, tags: filterTags },
      });
      if (error) throw error;
      return data?.items || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Split featured vs regular
  const featuredItems = items.filter((i) => i.tags.includes("Featured"));
  const regularItems = items.filter((i) => !i.tags.includes("Featured"));

  // Collect unique tags for filter bar (exclude NDA, Not Ready, Featured)
  const allTags = Array.from(
    new Set(items.flatMap((i) => i.tags))
  ).filter((t) => !["NDA", "Not Ready", "Featured"].includes(t));

  const displayed = activeTag
    ? regularItems.filter((i) => i.tags.includes(activeTag))
    : regularItems;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-16">
        Portfolio items coming soon.
      </p>
    );
  }

  return (
    <>
      {/* Tag filter bar */}
      {allTags.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-sans transition-all border ${
              !activeTag
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-background text-muted-foreground border-border hover:border-accent/50"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-sans transition-all border ${
                activeTag === tag
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-background text-muted-foreground border-border hover:border-accent/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Gallery grid */}
      {/* Masonry gallery */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {displayed.map((item) => (
          <article
            key={item.id}
            className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-md transition-shadow cursor-pointer break-inside-avoid"
            onClick={() => setDetailItem(item)}
          >
            {/* Cover image */}
            {item.coverImage && !item.hasNda ? (
              <div className="overflow-hidden bg-muted">
                <img
                  src={item.coverImage}
                  alt={item.name}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                {item.hasNda ? (
                  <div className="text-center text-muted-foreground">
                    <Lock className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-xs font-sans">Under NDA</span>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent/10" />
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-5 space-y-3">
              {/* Tags first */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags
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

              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-2xl md:text-3xl text-foreground leading-tight">
                  {item.name}
                </h3>
                {item.monthYear && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap font-sans mt-1">
                    {item.monthYear}
                  </span>
                )}
              </div>

              {item.text && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.text}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <p className="text-muted-foreground mb-4 font-sans">{ctaLabel}</p>
        <PillButton
          icon={Send}
          onClick={() => setContactOpen(true)}
        >
          Start a Conversation
        </PillButton>
      </div>

      <ContactDrawer
        open={contactOpen}
        onOpenChange={setContactOpen}
        source={`portfolio-${pillar}`}
      />

      <PortfolioDetailModal
        open={!!detailItem}
        onOpenChange={(open) => { if (!open) setDetailItem(null); }}
        pageId={detailItem?.id || null}
        name={detailItem?.name || ""}
        hasNda={detailItem?.hasNda || false}
      />
    </>
  );
};
