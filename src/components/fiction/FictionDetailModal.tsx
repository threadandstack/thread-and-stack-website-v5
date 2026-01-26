import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Users, TrendingUp, Sparkles } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/integrations/supabase/client";
import { BookShuffleLoader } from "./BookShuffleLoader";

interface FictionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  clusterKey: string | null;
}

interface BookDetails {
  summary: string;
  author: string | null;
  cover_url: string | null;
  audience_fact: string | null;
  recommendation: string | null;
}

export function FictionDetailModal({ isOpen, onClose, title, clusterKey }: FictionDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<BookDetails | null>(null);
  const [addedCount, setAddedCount] = useState(0);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    setCoverError(false);

    const fetchData = async () => {
      setLoading(true);
      
      const [countResult, detailsResult] = await Promise.all([
        supabase
          .from("fiction_favorites")
          .select("id", { count: "exact" })
          .or(`cluster_key.eq.${clusterKey},answer.ilike.%${title}%`),
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-book-details`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({ title })
          }
        )
      ]);

      setAddedCount(countResult.count || 1);

      if (detailsResult.ok) {
        const data = await detailsResult.json();
        setDetails(data);
      } else {
        setDetails({
          summary: "Unable to fetch details for this title.",
          author: null,
          cover_url: null,
          audience_fact: null,
          recommendation: null
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [isOpen, title, clusterKey]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="bg-background rounded-2xl max-w-lg w-full shadow-2xl border border-border relative max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky close button - always visible */}
            <button
              onClick={onClose}
              className="sticky top-0 z-10 ml-auto mr-4 mt-4 p-2 text-muted-foreground hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-8 pb-8 -mt-6">
              {/* Header with cover art */}
              <div className="flex gap-4 mb-6">
                {/* Book cover */}
                <div className="flex-shrink-0 w-24 md:w-28">
                  {loading ? (
                    <div className="w-full aspect-[2/3] rounded-lg flex items-center justify-center p-4">
                      <BookShuffleLoader />
                    </div>
                  ) : details?.cover_url && !coverError ? (
                    <AspectRatio ratio={2/3} className="overflow-hidden rounded-lg shadow-md">
                      <img
                        src={details.cover_url}
                        alt={`Cover of ${title}`}
                        className="w-full h-full object-cover"
                        onError={() => setCoverError(true)}
                      />
                    </AspectRatio>
                  ) : (
                    <div className="w-full aspect-[2/3] bg-accent/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-accent" />
                    </div>
                  )}
                </div>

                {/* Title and author */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-serif italic text-foreground leading-tight">
                    {title}
                  </h2>
                  {loading ? (
                    <div className="h-4 w-24 bg-muted rounded animate-pulse mt-2" />
                  ) : details?.author && (
                    <p className="text-muted-foreground text-sm mt-1">
                      by {details.author}
                    </p>
                  )}
                  
                  {/* Added count badge */}
                  {!loading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                      <Users className="h-4 w-4" />
                      <span>
                        {addedCount === 1 
                          ? "You're the first to add this!" 
                          : `Added by ${addedCount} ${addedCount === 1 ? 'person' : 'people'} here`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">About this book</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {details?.summary}
                    </p>
                  </div>

                  {/* Audience fact callout */}
                  {details?.audience_fact && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-accent/10 border border-accent/20 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-accent/20 flex-shrink-0">
                          <TrendingUp className="h-4 w-4 text-accent" />
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {details.audience_fact}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Recommendation callout */}
                  {details?.recommendation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="bg-muted/50 border border-border rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-muted flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-foreground/70" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {details.recommendation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
