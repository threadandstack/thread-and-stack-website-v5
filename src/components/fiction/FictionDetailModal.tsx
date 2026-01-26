import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Users, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface FictionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  clusterKey: string | null;
}

interface BookDetails {
  summary: string;
  author: string | null;
  goodreads_url: string | null;
}

export function FictionDetailModal({ isOpen, onClose, title, clusterKey }: FictionDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<BookDetails | null>(null);
  const [addedCount, setAddedCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      
      // Fetch count of similar entries and book details in parallel
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
          goodreads_url: null
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
            className="bg-background rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-border relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-accent/10">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-serif italic text-foreground">
                  {title}
                </h2>
                {details?.author && (
                  <p className="text-muted-foreground text-sm mt-1">
                    by {details.author}
                  </p>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BookOpen className="h-12 w-12 text-accent" />
                </motion.div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                  <Users className="h-4 w-4" />
                  <span>
                    {addedCount === 1 
                      ? "You're the first to add this!" 
                      : `Added by ${addedCount} ${addedCount === 1 ? 'person' : 'people'} here`}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">About this book</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {details?.summary}
                    </p>
                  </div>

                  {details?.goodreads_url && (
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a 
                        href={details.goodreads_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on Goodreads
                      </a>
                    </Button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
