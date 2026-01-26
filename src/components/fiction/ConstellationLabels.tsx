import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConstellationLabelsProps {
  genreCounts: Map<string, number>;
  minCount?: number; // Minimum books needed for a constellation to appear
}

// Genre to visual configuration mapping
const GENRE_CONFIG: Record<string, { 
  curve: string; // SVG path for the text to follow
  viewBox: string;
  x: number; // Position as percentage
  y: number;
  textAnchor: "start" | "middle" | "end";
}> = {
  "Epic Fantasy": {
    curve: "M 10 80 Q 100 20 190 80",
    viewBox: "0 0 200 100",
    x: 8, y: 18,
    textAnchor: "start"
  },
  "Science Fiction": {
    curve: "M 10 20 Q 100 90 190 30",
    viewBox: "0 0 200 100",
    x: 85, y: 15,
    textAnchor: "end"
  },
  "Literary Classics": {
    curve: "M 20 70 Q 100 30 180 70",
    viewBox: "0 0 200 100",
    x: 12, y: 75,
    textAnchor: "start"
  },
  "Dystopian Tales": {
    curve: "M 10 30 Q 100 80 190 40",
    viewBox: "0 0 200 100",
    x: 82, y: 72,
    textAnchor: "end"
  },
  "Mystery & Thriller": {
    curve: "M 20 60 Q 100 20 180 55",
    viewBox: "0 0 200 100",
    x: 5, y: 45,
    textAnchor: "start"
  },
  "Romance & Drama": {
    curve: "M 10 40 Q 100 80 190 45",
    viewBox: "0 0 200 100",
    x: 88, y: 42,
    textAnchor: "end"
  },
  "Horror & Gothic": {
    curve: "M 20 50 Q 100 90 180 50",
    viewBox: "0 0 200 100",
    x: 6, y: 58,
    textAnchor: "start"
  },
  "Children's Adventures": {
    curve: "M 10 65 Q 100 30 190 60",
    viewBox: "0 0 200 100",
    x: 78, y: 55,
    textAnchor: "end"
  },
  "Historical Fiction": {
    curve: "M 20 35 Q 100 70 180 40",
    viewBox: "0 0 200 100",
    x: 10, y: 85,
    textAnchor: "start"
  },
  "Contemporary Fiction": {
    curve: "M 10 55 Q 100 20 190 50",
    viewBox: "0 0 200 100",
    x: 75, y: 88,
    textAnchor: "end"
  }
};

export function ConstellationLabels({ genreCounts, minCount = 3 }: ConstellationLabelsProps) {
  // Filter genres that have enough books to form a constellation
  const activeGenres = useMemo(() => {
    const genres: { name: string; count: number; config: typeof GENRE_CONFIG[string] }[] = [];
    
    genreCounts.forEach((count, genre) => {
      if (count >= minCount && GENRE_CONFIG[genre]) {
        genres.push({
          name: genre,
          count,
          config: GENRE_CONFIG[genre]
        });
      }
    });
    
    return genres;
  }, [genreCounts, minCount]);

  if (activeGenres.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
      <AnimatePresence>
        {activeGenres.map((genre, index) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 1.2, 
              delay: index * 0.3,
              ease: "easeOut"
            }}
            className="absolute"
            style={{
              left: `${genre.config.x}%`,
              top: `${genre.config.y}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            <svg
              viewBox={genre.config.viewBox}
              className="w-48 md:w-64 lg:w-80 h-auto"
              style={{ overflow: "visible" }}
            >
              <defs>
                <path
                  id={`curve-${genre.name.replace(/\s+/g, '-')}`}
                  d={genre.config.curve}
                  fill="transparent"
                />
                {/* Glow filter */}
                <filter id={`glow-${genre.name.replace(/\s+/g, '-')}`}>
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Curved constellation name */}
              <text
                fill="hsla(0, 0%, 100%, 0.6)"
                fontSize="14"
                fontFamily="'Crimson Pro', serif"
                fontStyle="italic"
                fontWeight="400"
                letterSpacing="0.15em"
                filter={`url(#glow-${genre.name.replace(/\s+/g, '-')})`}
              >
                <textPath
                  href={`#curve-${genre.name.replace(/\s+/g, '-')}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {genre.name.toUpperCase()}
                </textPath>
              </text>
              
              {/* Small star decorations at curve ends */}
              <circle cx="15" cy="65" r="1.5" fill="hsla(0, 0%, 100%, 0.4)" />
              <circle cx="185" cy="60" r="1" fill="hsla(0, 0%, 100%, 0.3)" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
