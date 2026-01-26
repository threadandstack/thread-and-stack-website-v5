import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Users, TrendingUp, Sparkles, Heart, AlertCircle, Check } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { BookShuffleLoader } from "./BookShuffleLoader";
import { generateClusterKey } from "@/lib/titleNormalizer";
import { toast } from "sonner";

interface FictionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  clusterKey: string | null;
  genreColor?: string; // HSL color from constellation for styling
  onVoteAdded?: () => void; // Callback to refresh the list
}

// Parse HSL color and generate celestial styling
const getModalColors = (genreColor?: string) => {
  if (!genreColor) {
    return {
      border: `hsl(234, 70%, 70%)`,
      glow: `0 0 20px hsla(234, 70%, 70%, 0.4), 0 0 40px hsla(234, 70%, 70%, 0.2)`,
      accent: `hsl(234, 70%, 60%)`,
    };
  }
  
  const match = genreColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) {
    return {
      border: `hsl(234, 70%, 70%)`,
      glow: `0 0 20px hsla(234, 70%, 70%, 0.4), 0 0 40px hsla(234, 70%, 70%, 0.2)`,
      accent: `hsl(234, 70%, 60%)`,
    };
  }
  
  const hue = parseInt(match[1]);
  const saturation = parseInt(match[2]);
  
  return {
    border: `hsl(${hue}, ${saturation}%, 65%)`,
    glow: `0 0 20px hsla(${hue}, ${saturation}%, 70%, 0.5), 0 0 40px hsla(${hue}, ${saturation}%, 70%, 0.25)`,
    accent: `hsl(${hue}, ${saturation}%, 55%)`,
  };
};

interface BookDetails {
  summary: string;
  author: string | null;
  cover_url: string | null;
  audience_fact: string | null;
  recommendation: string | null;
}

export function FictionDetailModal({ isOpen, onClose, title, clusterKey, genreColor, onVoteAdded }: FictionDetailModalProps) {
  const modalColors = getModalColors(genreColor);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<BookDetails | null>(null);
  const [detailsAvailable, setDetailsAvailable] = useState(true);
  const [addedCount, setAddedCount] = useState(0);
  const [coverError, setCoverError] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showAuthorCorrection, setShowAuthorCorrection] = useState(false);
  const [authorCorrection, setAuthorCorrection] = useState("");
  const [isSubmittingCorrection, setIsSubmittingCorrection] = useState(false);
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    setCoverError(false);
    setHasVoted(false);
    setDetailsAvailable(true);
    setShowAuthorCorrection(false);
    setAuthorCorrection("");
    setCorrectionSubmitted(false);

    const fetchData = async () => {
      setLoading(true);
      
      const effectiveClusterKey = clusterKey || generateClusterKey(title);
      
      const [countResult, detailsResult] = await Promise.all([
        supabase
          .from("fiction_favorites")
          .select("id", { count: "exact" })
          .eq("cluster_key", effectiveClusterKey),
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
        // Check if we got real data or just a fallback
        if (data.summary && !data.summary.includes("Unable to fetch")) {
          setDetails(data);
          setDetailsAvailable(true);
        } else {
          setDetails(null);
          setDetailsAvailable(false);
        }
      } else {
        setDetails(null);
        setDetailsAvailable(false);
      }

      setLoading(false);
    };

    fetchData();
  }, [isOpen, title, clusterKey]);

  const handleVote = async () => {
    setIsVoting(true);
    
    try {
      const effectiveClusterKey = clusterKey || generateClusterKey(title);
      
      // Insert a new entry for this book
      const { error } = await supabase
        .from("fiction_favorites")
        .insert({
          answer: title,
          cluster_key: effectiveClusterKey,
          enriched_answer: title, // Use plain title for votes
          emojis: "📚✨",
          is_repeat_visitor: true,
          device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop"
        });

      if (error) throw error;

      setAddedCount(prev => prev + 1);
      setHasVoted(true);
      toast.success("Your vote has been added!");
      onVoteAdded?.();
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Couldn't add your vote. Try again?");
    } finally {
      setIsVoting(false);
    }
  };

  const getCountText = () => {
    if (addedCount === 1) {
      return "1 person has added this book so far";
    }
    return `${addedCount} people have added this book`;
  };

  const handleSubmitCorrection = async () => {
    if (!authorCorrection.trim()) return;
    
    setIsSubmittingCorrection(true);
    try {
      // For now, we'll log the correction - in future this could be stored/reviewed
      console.log(`Author correction for "${title}": ${authorCorrection.trim()}`);
      
      // Could add a database table for corrections in future
      setCorrectionSubmitted(true);
      setShowAuthorCorrection(false);
      toast.success("Thanks! We'll review this correction.");
    } catch (error) {
      console.error("Error submitting correction:", error);
      toast.error("Couldn't submit correction. Try again?");
    } finally {
      setIsSubmittingCorrection(false);
    }
  };

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
            className="bg-background rounded-2xl max-w-lg w-full shadow-2xl relative max-h-[80vh] flex flex-col"
            style={{
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: modalColors.border,
              boxShadow: modalColors.glow,
            }}
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
              {/* Header with cover art and vote button */}
              <div className="flex gap-4 mb-6">
                {/* Book cover with vote button below */}
                <div className="flex-shrink-0 w-24 md:w-28 flex flex-col gap-3">
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
                    <div 
                      className="w-full aspect-[2/3] rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${modalColors.border}20`,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        borderColor: modalColors.border,
                      }}
                    >
                      <BookOpen className="h-10 w-10" style={{ color: modalColors.accent }} />
                    </div>
                  )}
                  
                  {/* Vote button next to cover */}
                  {!loading && (
                    hasVoted ? (
                      <div className="flex items-center justify-center gap-1 py-2" style={{ color: modalColors.accent }}>
                        <Heart className="h-4 w-4 fill-current" />
                        <span className="text-xs font-medium">Voted!</span>
                      </div>
                    ) : (
                      <Button
                        onClick={handleVote}
                        disabled={isVoting}
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        style={{
                          borderColor: modalColors.border,
                          color: modalColors.accent,
                        }}
                      >
                        <Heart className={`h-3 w-3 ${isVoting ? 'animate-pulse' : ''}`} />
                        {isVoting ? "..." : "Love it!"}
                      </Button>
                    )
                  )}
                </div>

                {/* Title, author, and count */}
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
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{getCountText()}</span>
                      </div>
                      
                      {/* Author correction CTA */}
                      {details?.author && !correctionSubmitted && (
                        <AnimatePresence mode="wait">
                          {!showAuthorCorrection ? (
                            <motion.button
                              key="cta"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setShowAuthorCorrection(true)}
                              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" />
                              Wrong author credited?
                            </motion.button>
                          ) : (
                            <motion.div
                              key="input"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex gap-2 items-center"
                            >
                              <Input
                                value={authorCorrection}
                                onChange={(e) => setAuthorCorrection(e.target.value)}
                                placeholder="Correct author name..."
                                className="h-7 text-xs flex-1"
                                onKeyDown={(e) => e.key === "Enter" && handleSubmitCorrection()}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                onClick={handleSubmitCorrection}
                                disabled={isSubmittingCorrection || !authorCorrection.trim()}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                onClick={() => {
                                  setShowAuthorCorrection(false);
                                  setAuthorCorrection("");
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                      
                      {correctionSubmitted && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-muted-foreground/60 flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Correction noted, thanks!
                        </motion.p>
                      )}
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
              ) : detailsAvailable && details ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">About this book</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {details.summary}
                    </p>
                  </div>

                  {/* Audience fact callout */}
                  {details.audience_fact && (
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
                  {details.recommendation && (
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
              ) : (
                /* Fallback when no details available - just show vote prompt */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <p className="text-muted-foreground text-sm mb-2">
                    This is a beloved favorite in our constellation.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
