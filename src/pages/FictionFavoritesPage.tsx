import { useState, useEffect, useMemo, useCallback } from "react";
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
import { DraggableConstellationAnchor } from "@/components/fiction/DraggableConstellationAnchor";
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
  genre: string | null;
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
  const [pulsingGenres, setPulsingGenres] = useState<Set<string>>(new Set());
  const [liveReaderCount, setLiveReaderCount] = useState(0);
  
  // Manual position overrides from dragging
  const [manualBookPositions, setManualBookPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [manualAnchorPositions, setManualAnchorPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  
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

    // Subscribe to realtime updates for new favorites
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
            const newItem = payload.new as FictionFavorite;
            setFavorites(prev => [newItem, ...prev]);
            
            // Trigger pulse animation for this genre
            if (newItem.genre) {
              setPulsingGenres(prev => new Set([...prev, newItem.genre!]));
              setTimeout(() => {
                setPulsingGenres(prev => {
                  const next = new Set(prev);
                  next.delete(newItem.genre!);
                  return next;
                });
              }, 2500);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedItem = payload.new as FictionFavorite;
            setFavorites(prev => 
              prev.map(f => f.id === updatedItem.id ? updatedItem : f)
            );
            
            // Also pulse on update (when genre is assigned via enrichment)
            if (updatedItem.genre) {
              setPulsingGenres(prev => new Set([...prev, updatedItem.genre!]));
              setTimeout(() => {
                setPulsingGenres(prev => {
                  const next = new Set(prev);
                  next.delete(updatedItem.genre!);
                  return next;
                });
              }, 2500);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Presence tracking for live reader count
  useEffect(() => {
    const uniqueId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    
    const presenceChannel = supabase
      .channel('fiction_presence')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const count = Object.keys(state).reduce((acc, key) => acc + state[key].length, 0);
        setLiveReaderCount(count);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user_id: uniqueId });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
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
  const { positions: autoPositions, genreAnchors: autoGenreAnchors, genreZoneBounds } = useGenreClusteredPositions(aggregatedFavorites, {
    mobileHeaderHeightPx: 420 // Larger value to ensure constellations start well below input
  });
  
  // Merge auto positions with manual overrides
  const positions = useMemo(() => {
    const merged = new Map(autoPositions);
    manualBookPositions.forEach((pos, id) => {
      merged.set(id, pos);
    });
    return merged;
  }, [autoPositions, manualBookPositions]);
  
  const genreAnchors = useMemo(() => {
    const merged = new Map(autoGenreAnchors);
    manualAnchorPositions.forEach((pos, genre) => {
      merged.set(genre, pos);
    });
    return merged;
  }, [autoGenreAnchors, manualAnchorPositions]);
  
  // Handlers for drag position updates
  const handleBookPositionChange = useCallback((id: string, newPosition: { x: number; y: number }) => {
    setManualBookPositions(prev => {
      const next = new Map(prev);
      next.set(id, newPosition);
      return next;
    });
  }, []);
  
  // When anchor moves, move all books in that genre by the same delta
  const handleAnchorPositionChange = useCallback((genre: string, delta: { x: number; y: number }, newPosition: { x: number; y: number }) => {
    // Update anchor position
    setManualAnchorPositions(prev => {
      const next = new Map(prev);
      next.set(genre, newPosition);
      return next;
    });
    
    // Move all books in this genre by the same delta
    setManualBookPositions(prev => {
      const next = new Map(prev);
      aggregatedFavorites.forEach(item => {
        if (item.genre === genre) {
          const currentPos = positions.get(item.id) || { x: 50, y: 50 };
          const newBookX = Math.max(5, Math.min(95, currentPos.x + delta.x));
          const newBookY = Math.max(5, Math.min(95, currentPos.y + delta.y));
          next.set(item.id, { x: newBookX, y: newBookY });
        }
      });
      return next;
    });
  }, [aggregatedFavorites, positions]);
  
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
  
  // Generate genre color for anchors
  const getGenreColor = useCallback((genre: string): string => {
    const hash = genre.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }, []);
  
  // Get visible genres (those with enough books)
  const visibleGenres = useMemo(() => {
    const genreCounts = new Map<string, number>();
    aggregatedFavorites.forEach(item => {
      if (item.genre) {
        genreCounts.set(item.genre, (genreCounts.get(item.genre) || 0) + 1);
      }
    });
    return Array.from(genreCounts.entries())
      .filter(([_, count]) => count >= 2)
      .map(([genre]) => genre);
  }, [aggregatedFavorites]);

  // Render cloud items helper
  const renderCloudItems = () => (
    <AnimatePresence>
      {aggregatedFavorites.map((item) => {
        const pos = positions.get(item.id) || { x: 50, y: 20 };
        const isNew = item.id === newItemId;
        const displayText = item.enriched_answer || item.answer;
        const genreColor = item.genre ? getGenreColor(item.genre) : undefined;
        
        return (
          <FictionCloudItem
            key={item.id}
            id={item.id}
            displayText={displayText}
            clusterKey={item.cluster_key || item.answer.toLowerCase()}
            isNew={isNew}
            count={item.count}
            position={pos}
            genreColor={genreColor}
            onClick={() => setSelectedBook({ 
              title: item.answer, 
              clusterKey: item.cluster_key,
              genre: item.genre
            })}
            onPositionChange={handleBookPositionChange}
          />
        );
      })}
    </AnimatePresence>
  );
  
  // Render draggable constellation anchors
  const renderDraggableAnchors = (isMobile: boolean = false) => (
    <>
      {visibleGenres.map(genre => {
        const anchor = genreAnchors.get(genre);
        if (!anchor) return null;
        
        return (
          <DraggableConstellationAnchor
            key={genre}
            genre={genre}
            position={anchor}
            color={getGenreColor(genre)}
            isMobile={isMobile}
            isPulsing={pulsingGenres.has(genre)}
            onPositionChange={handleAnchorPositionChange}
          />
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Navigation variant="dark" />
      
      {/* DESKTOP LAYOUT - scrollable double-height experience */}
      <main className="hidden lg:block flex-1 relative overflow-hidden">
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
          
          {/* Draggable constellation anchors - layered above lines */}
          <div className="absolute inset-0 z-[5]">
            {renderDraggableAnchors(false)}
          </div>

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
                Populate the night sky with the stories that shaped you!<br />
                Add any title you want to our constellation of narratives.
              </p>

              <FictionTagInput 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />

              <div className="text-muted-foreground/80 text-sm text-center mt-4 space-y-1">
                <p>💡 Tap any title to learn more and vote your love for it!</p>
                <p>⭐️ If you enter a book that's already in the sky, it will add a +1 to it!</p>
              </div>
              
              {/* Live reader count */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-muted-foreground/60 text-sm italic mt-6"
              >
                ✨ {Math.max(2, liveReaderCount)} {Math.max(2, liveReaderCount) === 1 ? 'person is' : 'people are'} reading the sky tonight
              </motion.p>

              {favorites.length === 0 && (
                <p className="text-muted-foreground text-sm italic mt-4">
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

      {/* MOBILE/TABLET LAYOUT - Full viewport with fixed footer */}
      <main className="lg:hidden flex-1 flex flex-col relative">
        {/* Starry backdrop - covers entire scrollable area */}
        <div className="fixed inset-0 z-0">
          <StarryBackdrop />
        </div>

        {/* Added count badge */}
        <AddedCountBadge count={addedCount} show={showAddedBadge} />

        {/* Content container - scrollable vertical layout with safe padding */}
        <div className="relative z-10 flex flex-col pt-20 pb-36 px-5 md:px-8 min-h-screen">
          {/* Header section with compact CTA card */}
          <div className="pb-3">
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
                  Populate the night sky with the stories that shaped you!<br />
                  Add any title you want to our constellation of narratives.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Input section - outside the white box, against night sky */}
          <div className="py-3">
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
              
              <div className="text-white/70 text-xs text-center mt-3 space-y-0.5">
                <p>💡 Tap any title to learn more and vote your love for it!</p>
                <p>⭐️ If you enter a book that's already in the sky, it will add a +1 to it!</p>
              </div>
              
              {/* Live reader count - mobile */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-white/50 text-xs italic mt-3 text-center"
              >
                ✨ {Math.max(2, liveReaderCount)} {Math.max(2, liveReaderCount) === 1 ? 'person is' : 'people are'} reading the sky tonight
              </motion.p>

              {favorites.length === 0 && (
                <p className="text-white/70 text-sm italic mt-4 text-center">
                  Be the first to share your favorite fiction...
                </p>
              )}
            </motion.div>
          </div>

          {/* Cloud zone - relative container for positioned items with calculated height */}
          {favorites.length > 0 && (() => {
            // Calculate unique genres for height
            const uniqueGenres = new Set(aggregatedFavorites.map(f => f.genre || 'Uncategorized'));
            const numGenres = uniqueGenres.size;
            return (
            <div 
              className="relative mt-4"
              style={{ 
                // Calculate height based on number of genres - each genre gets ~25vh
                height: `${Math.max(60, numGenres * 25)}vh`,
                minHeight: '400px'
              }}
            >
              {/* Constellation lines for mobile */}
              <ConstellationLines 
                genreAnchors={genreAnchors} 
                bookPositions={bookPositionsWithGenre} 
                minCount={2}
                isMobile={true}
              />
              
              {/* Draggable constellation anchors for mobile */}
              {renderDraggableAnchors(true)}
              
              {/* Book items */}
              {renderCloudItems()}
            </div>
            );
          })()}
        </div>

        {/* Campfire scene and footer - anchored at natural document flow end */}
        <div className="relative z-30 flex-shrink-0">
          <CampfireScene />
          <Footer />
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
        genreColor={selectedBook?.genre ? getGenreColor(selectedBook.genre) : undefined}
        onVoteAdded={() => {
          // Realtime subscription will handle the update automatically
        }}
      />

      {/* Desktop footer only - mobile footer is in mobile layout */}
      <div className="hidden lg:block relative z-40">
        <Footer />
      </div>
    </div>
  );
}
