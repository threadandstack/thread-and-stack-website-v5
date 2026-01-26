import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FictionCloudItem } from "@/components/fiction/FictionCloudItem";
import { FictionDetailModal } from "@/components/fiction/FictionDetailModal";
import { ConstellationLines } from "@/components/fiction/ConstellationLines";
import { AddedCountBadge } from "@/components/fiction/AddedCountBadge";
import { FictionTagInput } from "@/components/fiction/FictionTagInput";
import { StarryBackdrop } from "@/components/fiction/StarryBackdrop";
import { CampfireScene } from "@/components/fiction/CampfireScene";
import { filterProfanity } from "@/lib/profanityFilter";
import { normalizeTitle, generateClusterKey } from "@/lib/titleNormalizer";
import { useGenreClusteredPositions } from "@/hooks/useGenreClusteredPositions";
import fictionHeroImage from "@/assets/fiction-hero.png";

interface FictionFavorite {
  id: string;
  answer: string;
  enriched_answer: string | null;
  emojis: string | null;
  cluster_key: string | null;
  genre: string | null;
  created_at: string;
}

interface CelebrationData {
  message: string;
  gif_url: string | null;
  answer: string;
}

interface SelectedBook {
  title: string;
  clusterKey: string | null;
}

// Aggregate items by cluster - return ONE representative item per cluster with count
interface AggregatedFavorite extends FictionFavorite {
  count: number;
}

const aggregateByCluster = (items: FictionFavorite[]): AggregatedFavorite[] => {
  const groups: Record<string, FictionFavorite[]> = {};
  items.forEach(item => {
    const key = item.cluster_key || item.answer.toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  
  // Return one representative item per cluster (prefer the one with enriched_answer)
  return Object.values(groups).map(group => {
    // Sort to prefer items with enriched_answer and emojis
    const sorted = [...group].sort((a, b) => {
      if (a.enriched_answer && !b.enriched_answer) return -1;
      if (!a.enriched_answer && b.enriched_answer) return 1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    return {
      ...sorted[0],
      count: group.length
    };
  });
};

export default function FictionFavoritesPage() {
  const [favorites, setFavorites] = useState<FictionFavorite[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<CelebrationData | null>(null);
  const [selectedBook, setSelectedBook] = useState<SelectedBook | null>(null);
  const [addedCount, setAddedCount] = useState(0);
  const [showAddedBadge, setShowAddedBadge] = useState(false);
  const { toast } = useToast();

  // Fetch existing favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from("fiction_favorites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching favorites:", error);
      } else {
        setFavorites(data || []);
      }
    };

    fetchFavorites();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("fiction_favorites_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "fiction_favorites"
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFavorites(prev => [payload.new as FictionFavorite, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setFavorites(prev => 
              prev.map(f => f.id === payload.new.id ? payload.new as FictionFavorite : f)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Get device metadata for tracking
  const getDeviceMetadata = () => {
    const ua = navigator.userAgent;
    let deviceType = 'desktop';
    if (/Mobi|Android/i.test(ua)) deviceType = 'mobile';
    else if (/Tablet|iPad/i.test(ua)) deviceType = 'tablet';
    
    // Check repeat visitor
    const hasVisited = localStorage.getItem('fiction_visitor');
    const isRepeat = !!hasVisited;
    if (!hasVisited) {
      localStorage.setItem('fiction_visitor', 'true');
    }
    
    return {
      device_type: deviceType,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      is_repeat_visitor: isRepeat,
      user_agent: ua.slice(0, 255) // Truncate user agent
    };
  };

  const handleSubmit = async (titles: string[]) => {
    if (titles.length === 0) return;

    // Check for profanity in all titles
    for (const title of titles) {
      const { isClean, reason } = filterProfanity(title);
      if (!isClean) {
        toast({
          title: "Whoops!",
          description: reason,
          variant: "destructive"
        });
        return;
      }
    }

    setIsSubmitting(true);
    const metadata = getDeviceMetadata();

    try {
      // Normalize all titles - duplicates are allowed (they increment the count badge)
      const normalizedTitles = titles.map(normalizeTitle);

      // Insert all titles (duplicates will be aggregated in display)
      const insertPromises = normalizedTitles.map(title => 
        supabase
          .from("fiction_favorites")
          .insert({ 
            answer: title,
            cluster_key: generateClusterKey(title)
          })
          .select()
          .single()
      );
      
      const results = await Promise.all(insertPromises);
      const insertedItems = results.filter(r => !r.error).map(r => r.data!);
      
      if (insertedItems.length === 0) throw new Error("Failed to insert any items");

      // Highlight the first inserted item
      setNewItemId(insertedItems[0].id);

      // Celebrate the FIRST title only, enrich all titles
      const firstTitle = titles[0];
      const enrichPromises = insertedItems.map(item => 
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enrich-fiction`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({ answer: item.answer, id: item.id, metadata })
          }
        )
      );

      const [celebrateResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/celebrate-fiction`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({ answer: firstTitle })
          }
        ),
        ...enrichPromises
      ]);

      if (celebrateResponse.ok) {
        const celebrateData = await celebrateResponse.json();
        const displayAnswer = titles.length > 1 
          ? `${firstTitle} (+${titles.length - 1} more)`
          : firstTitle;
        setCelebration({
          message: celebrateData.message,
          gif_url: celebrateData.gif_url,
          answer: displayAnswer
        });
      }

      // Show added count badge
      if (insertedItems.length > 0) {
        setAddedCount(insertedItems.length);
        setShowAddedBadge(true);
        setTimeout(() => setShowAddedBadge(false), 3000);
      }

      // Clear the animation highlight after a delay
      setTimeout(() => setNewItemId(null), 3000);

    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCelebration = () => {
    setCelebration(null);
  };

  // Aggregate to show one pill per unique book
  const aggregatedFavorites = aggregateByCluster(favorites);
  
  // Use genre-clustered positioning - books of the same genre cluster together
  const { positions, genreAnchors } = useGenreClusteredPositions(aggregatedFavorites);
  
  // Build book positions with genre info for constellation lines
  const bookPositionsWithGenre = useMemo(() => {
    return aggregatedFavorites.map(item => {
      const pos = positions.get(item.id) || { x: 50, y: 50 };
      return {
        id: item.id,
        genre: item.genre,
        x: pos.x,
        y: pos.y
      };
    });
  }, [aggregatedFavorites, positions]);

  // Render cloud items helper
  const renderCloudItems = () => (
    <AnimatePresence>
      {aggregatedFavorites.map((item) => {
        const pos = positions.get(item.id) || { x: 50, y: 20 };
        const isNew = item.id === newItemId;
        const displayText = item.enriched_answer || item.answer;
        
        return (
          <FictionCloudItem
            key={item.id}
            id={item.id}
            displayText={displayText}
            clusterKey={item.cluster_key || item.answer.toLowerCase()}
            isNew={isNew}
            count={item.count}
            position={pos}
            onClick={() => setSelectedBook({ 
              title: item.answer, 
              clusterKey: item.cluster_key 
            })}
          />
        );
      })}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation variant="dark" />
      
      {/* DESKTOP LAYOUT - scrollable double-height experience */}
      <main className="hidden lg:block flex-1 relative overflow-y-auto overflow-x-hidden">
        {/* Double-height container for scrollable constellation space */}
        <div className="relative" style={{ height: '200vh' }}>
          {/* Starry backdrop - covers full scrollable area */}
          <div className="absolute inset-0">
            <StarryBackdrop />
          </div>

          {/* Added count badge - fixed position */}
          <div className="fixed top-20 right-4 z-50">
            <AddedCountBadge count={addedCount} show={showAddedBadge} />
          </div>

          {/* Constellation lines - connecting stars to book clusters */}
          <ConstellationLines 
            genreAnchors={genreAnchors} 
            bookPositions={bookPositionsWithGenre} 
            minCount={2} 
          />

          {/* Full-page cloud container - spans double height */}
          <div className="absolute inset-0">
            {favorites.length > 0 && renderCloudItems()}
          </div>

          {/* Centered CTA - sticky to stay visible while scrolling */}
          <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none z-30">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center px-6 pointer-events-auto max-w-2xl"
          >
            <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-12 border border-primary/20 shadow-lg">
              <img 
                src={fictionHeroImage} 
                alt="Open book with letters floating around it" 
                className="w-40 h-auto mx-auto mb-4"
              />
              <h1 className="text-5xl font-serif mb-4">
                What's your favourite<br />
                <span className="italic text-accent">work of fiction?</span>
              </h1>
              
              <p className="text-muted-foreground text-lg mb-6">
                Share the stories that shaped you. Watch them join the cloud of narratives we all carry with us.
              </p>

              <FictionTagInput 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />

              {favorites.length > 0 && (
                <p className="text-muted-foreground/70 text-sm text-center mt-4">
                  💡 Click any book title to learn more about it
                </p>
              )}

              {favorites.length === 0 && (
                <p className="text-muted-foreground text-sm italic mt-6">
                  Be the first to share your favorite fiction...
                </p>
              )}
            </div>
          </motion.div>
          </div>

          {/* Campfire scene at the bottom of scrollable area */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <CampfireScene />
          </div>
        </div>
      </main>

      {/* MOBILE/TABLET LAYOUT - Vertical scroll experience */}
      <main className="lg:hidden flex-1 flex flex-col relative overflow-x-hidden">
        {/* Starry backdrop - covers entire scrollable area */}
        <div className="fixed inset-0 z-0">
          <StarryBackdrop />
        </div>

        {/* Added count badge */}
        <AddedCountBadge count={addedCount} show={showAddedBadge} />

        {/* Content container - scrollable vertical layout */}
        <div className="relative z-10 flex flex-col pt-20">
          {/* Header section with compact CTA card */}
          <div className="pb-3 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-md mx-auto"
            >
              {/* Compact white box - just image, title, and description */}
              <div className="bg-background/95 backdrop-blur-sm rounded-2xl px-4 py-4 border border-primary/20 shadow-lg">
                <img 
                  src={fictionHeroImage} 
                  alt="Open book with letters floating around it" 
                  className="w-16 h-auto mx-auto mb-2"
                />
                <h1 className="text-2xl md:text-3xl font-serif mb-1.5">
                  What's your favourite <span className="italic text-accent">work of fiction?</span>
                </h1>
                
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Share the stories that shaped you. Watch them join the cloud of narratives we all carry with us.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Input section - outside the white box, against night sky */}
          <div className="px-4 py-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <FictionTagInput 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
              
              {favorites.length > 0 && (
                <p className="text-white/60 text-xs text-center mt-3">
                  💡 Tap any title to learn more
                </p>
              )}

              {favorites.length === 0 && (
                <p className="text-white/70 text-sm italic mt-4 text-center">
                  Be the first to share your favorite fiction...
                </p>
              )}
            </motion.div>
          </div>

          {/* Constellation lines for mobile */}
          <ConstellationLines 
            genreAnchors={genreAnchors} 
            bookPositions={bookPositionsWithGenre} 
            minCount={2}
            isMobile={true}
          />

          {/* Cloud zone - entries float here, below the input */}
          <div 
            className="relative flex-1"
            style={{ minHeight: `${Math.max(600, favorites.length * 60)}px` }}
          >
            {favorites.length > 0 && renderCloudItems()}
          </div>

          {/* Campfire scene at bottom of mobile */}
          <CampfireScene />
        </div>
      </main>

      {/* Celebration Modal */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm"
            onClick={closeCelebration}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-background rounded-2xl p-8 max-w-md w-full shadow-2xl border border-border relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeCelebration}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  className="text-4xl mb-4"
                >
                  🎉
                </motion.div>

                <h2 className="text-xl font-serif italic text-accent mb-2">
                  "{celebration.answer}"
                </h2>

                <p className="text-foreground text-lg mb-6">
                  {celebration.message}
                </p>

                {celebration.gif_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl overflow-hidden mb-4"
                  >
                    <img
                      src={celebration.gif_url}
                      alt="Celebration GIF"
                      className="w-full h-auto max-h-64 object-cover"
                    />
                  </motion.div>
                )}

                <Button
                  onClick={closeCelebration}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Back to the cloud
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Detail Modal */}
      <FictionDetailModal
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        title={selectedBook?.title || ""}
        clusterKey={selectedBook?.clusterKey || null}
      />

      <div className="relative z-40">
        <Footer />
      </div>
    </div>
  );
}
