import { useMemo } from "react";
import { motion } from "framer-motion";

interface BookPosition {
  id: string;
  genre: string | null;
  x: number;
  y: number;
}

interface ConstellationLinesProps {
  genreAnchors: Map<string, { x: number; y: number }>;
  bookPositions: BookPosition[];
  minCount?: number;
  isMobile?: boolean;
}

export function ConstellationLines({ 
  genreAnchors, 
  bookPositions, 
  minCount = 3,
  isMobile = false 
}: ConstellationLinesProps) {
  // Group books by genre and filter to genres with enough books
  const genreBookGroups = useMemo(() => {
    const groups = new Map<string, BookPosition[]>();
    
    bookPositions.forEach(book => {
      if (!book.genre) return;
      const existing = groups.get(book.genre) || [];
      existing.push(book);
      groups.set(book.genre, existing);
    });
    
    // Filter to genres with enough books
    const filtered = new Map<string, BookPosition[]>();
    groups.forEach((books, genre) => {
      if (books.length >= minCount) {
        filtered.set(genre, books);
      }
    });
    
    return filtered;
  }, [bookPositions, minCount]);

  // Generate a stable color for each genre
  const getGenreColor = (genre: string): string => {
    const hash = genre.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  };

  if (genreBookGroups.size === 0) return null;

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-[4]"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Glow filter for the lines */}
        <filter id="constellation-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Star glow filter */}
        <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {Array.from(genreBookGroups.entries()).map(([genre, books], genreIndex) => {
        const anchor = genreAnchors.get(genre);
        if (!anchor) return null;
        
        const color = getGenreColor(genre);

        return (
          <g key={genre}>
            {/* Lines from anchor to each book */}
            {books.map((book, bookIndex) => (
              <motion.line
                key={`line-${book.id}`}
                x1={`${anchor.x}%`}
                y1={`${anchor.y}%`}
                x2={`${book.x}%`}
                y2={`${book.y}%`}
                stroke={color}
                strokeWidth={isMobile ? 0.5 : 0.75}
                strokeOpacity={0.4}
                strokeDasharray="4 4"
                filter="url(#constellation-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ 
                  duration: 1.5, 
                  delay: genreIndex * 0.3 + bookIndex * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Glowing anchor dot (constellation star) */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: genreIndex * 0.3,
                type: "spring",
                bounce: 0.4
              }}
            >
              {/* Outer glow */}
              <circle
                cx={`${anchor.x}%`}
                cy={`${anchor.y}%`}
                r={isMobile ? 8 : 10}
                fill={color}
                opacity={0.2}
                filter="url(#star-glow)"
              />
              
              {/* Inner bright core */}
              <circle
                cx={`${anchor.x}%`}
                cy={`${anchor.y}%`}
                r={isMobile ? 3 : 4}
                fill="white"
                opacity={0.9}
                filter="url(#star-glow)"
              />
              
              {/* Static ring */}
              <circle
                cx={`${anchor.x}%`}
                cy={`${anchor.y}%`}
                r={isMobile ? 5 : 6}
                fill="none"
                stroke={color}
                strokeWidth={1}
                opacity={0.4}
              />
            </motion.g>

            {/* Genre label - curved text above the star */}
            <motion.text
              x={`${anchor.x}%`}
              y={`${anchor.y - (isMobile ? 4 : 5)}%`}
              textAnchor="middle"
              fill="hsla(0, 0%, 100%, 0.8)"
              fontSize={isMobile ? 10 : 12}
              fontFamily="'Crimson Pro', serif"
              fontStyle="italic"
              fontWeight="500"
              letterSpacing="0.1em"
              filter="url(#constellation-glow)"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: genreIndex * 0.3 + 0.5,
                ease: "easeOut"
              }}
            >
              {genre.toUpperCase()}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}
