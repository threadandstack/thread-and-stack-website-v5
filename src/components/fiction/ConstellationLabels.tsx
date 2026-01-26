import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BookPosition {
  id: string;
  genre: string | null;
  x: number;
  y: number;
}

interface ConstellationLabelsProps {
  genreCounts: Map<string, number>;
  bookPositions: BookPosition[];
  minCount?: number;
  isMobile?: boolean;
}

// Genre curve configurations - different curve shapes for variety
const CURVE_VARIANTS = [
  { curve: "M 0 50 Q 75 10 150 50", startOffset: "50%" }, // gentle arc up
  { curve: "M 0 30 Q 75 70 150 35", startOffset: "50%" }, // gentle arc down
  { curve: "M 0 40 Q 50 15 100 40 Q 150 65 150 40", startOffset: "50%" }, // wave
];

export function ConstellationLabels({ 
  genreCounts, 
  bookPositions, 
  minCount = 3,
  isMobile = false 
}: ConstellationLabelsProps) {
  // Calculate centroid positions for each genre based on book positions
  const genreCentroids = useMemo(() => {
    const centroids = new Map<string, { x: number; y: number; count: number }>();
    
    bookPositions.forEach(book => {
      if (!book.genre) return;
      
      const existing = centroids.get(book.genre);
      if (existing) {
        centroids.set(book.genre, {
          x: existing.x + book.x,
          y: existing.y + book.y,
          count: existing.count + 1
        });
      } else {
        centroids.set(book.genre, { x: book.x, y: book.y, count: 1 });
      }
    });
    
    // Convert sums to averages
    centroids.forEach((value, key) => {
      centroids.set(key, {
        x: value.x / value.count,
        y: value.y / value.count,
        count: value.count
      });
    });
    
    return centroids;
  }, [bookPositions]);
  
  // Filter genres that have enough books to form a constellation
  const activeGenres = useMemo(() => {
    const genres: { 
      name: string; 
      count: number; 
      centroid: { x: number; y: number };
      curveIndex: number;
    }[] = [];
    
    let curveIndex = 0;
    genreCounts.forEach((count, genre) => {
      if (count >= minCount) {
        const centroid = genreCentroids.get(genre);
        if (centroid) {
          genres.push({
            name: genre,
            count,
            centroid: { x: centroid.x, y: centroid.y },
            curveIndex: curveIndex % CURVE_VARIANTS.length
          });
          curveIndex++;
        }
      }
    });
    
    return genres;
  }, [genreCounts, genreCentroids, minCount]);

  if (activeGenres.length === 0) return null;

  // Adjust label position to be slightly above the centroid
  const getLabelPosition = (centroid: { x: number; y: number }, index: number) => {
    // Offset vertically above the cluster, with slight horizontal variation
    const yOffset = isMobile ? -8 : -12;
    const xOffset = (index % 2 === 0 ? -5 : 5);
    
    return {
      x: Math.max(10, Math.min(90, centroid.x + xOffset)),
      y: Math.max(5, Math.min(85, centroid.y + yOffset))
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-5">
      <AnimatePresence>
        {activeGenres.map((genre, index) => {
          const position = getLabelPosition(genre.centroid, index);
          const curveVariant = CURVE_VARIANTS[genre.curveIndex];
          const labelId = `curve-${genre.name.replace(/\s+/g, '-')}-${index}`;
          const glowId = `glow-${genre.name.replace(/\s+/g, '-')}-${index}`;
          
          return (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                delay: index * 0.4,
                ease: "easeOut"
              }}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)"
              }}
            >
              <svg
                viewBox="-10 -10 170 80"
                className={isMobile ? "w-36 h-auto" : "w-48 md:w-56 lg:w-64 h-auto"}
                style={{ overflow: "visible" }}
              >
                <defs>
                  <path
                    id={labelId}
                    d={curveVariant.curve}
                    fill="transparent"
                  />
                  {/* Glow filter */}
                  <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Curved constellation name */}
                <text
                  fill="hsla(0, 0%, 100%, 0.7)"
                  fontSize={isMobile ? "11" : "13"}
                  fontFamily="'Crimson Pro', serif"
                  fontStyle="italic"
                  fontWeight="500"
                  letterSpacing="0.12em"
                  filter={`url(#${glowId})`}
                >
                  <textPath
                    href={`#${labelId}`}
                    startOffset={curveVariant.startOffset}
                    textAnchor="middle"
                  >
                    {genre.name.toUpperCase()}
                  </textPath>
                </text>
                
                {/* Small star decorations */}
                <circle cx="5" cy="45" r="1.5" fill="hsla(0, 0%, 100%, 0.5)" />
                <circle cx="145" cy="40" r="1" fill="hsla(0, 0%, 100%, 0.4)" />
              </svg>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
