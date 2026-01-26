import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface FictionFavorite {
  id: string;
  answer: string;
  enriched_answer: string | null;
  emojis: string | null;
  cluster_key: string | null;
  created_at: string;
}

// Generate a consistent position for each cluster - avoiding center area
const getClusterPosition = (clusterKey: string, index: number, total: number) => {
  const hash = clusterKey.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Define zones around the edges (avoiding center 30-70% area)
  // Zones: top-left, top, top-right, left, right, bottom-left, bottom, bottom-right
  const edgeZones = [
    { xMin: 3, xMax: 25, yMin: 8, yMax: 30 },   // top-left
    { xMin: 30, xMax: 70, yMin: 5, yMax: 20 },  // top
    { xMin: 75, xMax: 97, yMin: 8, yMax: 30 },  // top-right
    { xMin: 3, xMax: 22, yMin: 35, yMax: 65 },  // left
    { xMin: 78, xMax: 97, yMin: 35, yMax: 65 }, // right
    { xMin: 3, xMax: 25, yMin: 70, yMax: 92 },  // bottom-left
    { xMin: 30, xMax: 70, yMin: 80, yMax: 95 }, // bottom
    { xMin: 75, xMax: 97, yMin: 70, yMax: 92 }, // bottom-right
  ];
  
  // Pick zone based on hash
  const zoneIndex = Math.abs(hash) % edgeZones.length;
  const zone = edgeZones[zoneIndex];
  
  // Add variance within the zone based on index
  const xRange = zone.xMax - zone.xMin;
  const yRange = zone.yMax - zone.yMin;
  const offsetX = (Math.abs(hash * (index + 1)) % 100) / 100 * xRange;
  const offsetY = (Math.abs(hash * (index + 2)) % 100) / 100 * yRange;
  
  return {
    x: zone.xMin + offsetX,
    y: zone.yMin + offsetY
  };
};

// Group items by cluster
const groupByCluster = (items: FictionFavorite[]) => {
  const groups: Record<string, FictionFavorite[]> = {};
  items.forEach(item => {
    const key = item.cluster_key || item.answer.toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
};

export default function FictionFavoritesPage() {
  const [favorites, setFavorites] = useState<FictionFavorite[]>([]);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast({
        title: "Please enter your favorite fiction",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert the answer
      const { data, error } = await supabase
        .from("fiction_favorites")
        .insert({ answer: input.trim() })
        .select()
        .single();

      if (error) throw error;

      setNewItemId(data.id);
      setInput("");
      
      toast({
        title: "Thank you!",
        description: "Your favorite is being enriched with magic ✨"
      });

      // Trigger enrichment
      const enrichResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enrich-fiction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({ answer: data.answer, id: data.id })
        }
      );

      if (!enrichResponse.ok) {
        console.error("Enrichment failed");
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

  const clusteredGroups = groupByCluster(favorites);
  const clusterKeys = Object.keys(clusteredGroups);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Navigation />
      
      <main className="flex-1 relative">
        {/* Full-page cloud container */}
        <div className="absolute inset-0 overflow-hidden">
          {favorites.length > 0 && (
            <AnimatePresence>
              {clusterKeys.map((clusterKey) => {
                const items = clusteredGroups[clusterKey];
                const isCluster = items.length > 1;
                
                return items.map((item, idx) => {
                  const pos = getClusterPosition(clusterKey, idx, items.length);
                  const isNew = item.id === newItemId;
                  const displayText = item.enriched_answer || item.answer;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={isNew ? { 
                        opacity: 0, 
                        scale: 0.5,
                        x: "50vw",
                        y: "50vh"
                      } : { opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        x: 0,
                        y: 0
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        duration: isNew ? 1.2 : 0.5,
                        type: "spring",
                        bounce: 0.3
                      }}
                      className={`
                        absolute px-4 py-2 rounded-full
                        ${isCluster ? 'bg-accent/10 border border-accent/20' : 'bg-muted/50 border border-border/50'}
                        ${isNew ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}
                        shadow-sm hover:shadow-md transition-shadow cursor-default
                        max-w-[200px] md:max-w-[280px]
                      `}
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: isNew ? 50 : 10
                      }}
                    >
                      <span className="text-xs md:text-sm font-medium line-clamp-2">
                        {displayText}
                      </span>
                      {isCluster && idx === 0 && items.length > 1 && (
                        <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                          {items.length}
                        </span>
                      )}
                    </motion.div>
                  );
                });
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Centered CTA - floating above the cloud */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center px-6 pointer-events-auto"
          >
            <div className="bg-background/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-serif mb-4">
                What's your favourite<br />
                <span className="italic text-accent">work of fiction?</span>
              </h1>
              
              <p className="text-muted-foreground text-base md:text-lg mb-6">
                Share the stories that shaped you. Watch them join the cloud of narratives we all carry with us.
              </p>

              <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="The Great Gatsby, 1984, Pride and Prejudice..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isSubmitting}
                  className="h-12 md:h-14 pr-14 text-base md:text-lg rounded-full border-2 border-accent/20 focus:border-accent transition-colors bg-background"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 rounded-full bg-accent hover:bg-accent/90"
                >
                  {isSubmitting ? (
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
                  ) : (
                    <Send className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </Button>
              </form>

              {favorites.length === 0 && (
                <p className="text-muted-foreground text-sm italic mt-6">
                  Be the first to share your favorite fiction...
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <div className="relative z-40">
        <Footer />
      </div>
    </div>
  );
}