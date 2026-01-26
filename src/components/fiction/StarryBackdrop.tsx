import { useMemo } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: "white" | "indigo";
}

export function StarryBackdrop() {
  const stars = useMemo(() => {
    const starArray: Star[] = [];
    const starCount = 120;
    
    for (let i = 0; i < starCount; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        // Pixel-style stars: small integer sizes (2-4px)
        size: Math.floor(Math.random() * 3) + 2,
        opacity: Math.random() * 0.6 + 0.3,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 3,
        // Mix of white and indigo stars
        color: Math.random() > 0.4 ? "white" : "indigo",
      });
    }
    return starArray;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Night sky gradient: deep indigo to lighter blue */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            hsl(234 89% 8%) 0%,
            hsl(234 70% 15%) 30%,
            hsl(234 50% 25%) 60%,
            hsl(220 60% 35%) 85%,
            hsl(210 50% 45%) 100%
          )`
        }}
      />
      
      {/* Subtle radial glow overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse at 50% 30%,
            hsla(234 89% 50% / 0.15) 0%,
            transparent 60%
          )`
        }}
      />
      
      {/* Pixel stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.color === "white" 
              ? `hsla(0 0% 100% / ${star.opacity})`
              : `hsla(234 89% 70% / ${star.opacity})`,
            // Pixel/crisp edges - no border-radius
            imageRendering: "pixelated",
          }}
          animate={{
            opacity: [star.opacity * 0.4, star.opacity, star.opacity * 0.4],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Larger accent stars (still pixel-style) */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`big-star-${i}`}
          className="absolute"
          style={{
            left: `${10 + (i * 12) + Math.random() * 5}%`,
            top: `${15 + Math.random() * 60}%`,
            width: 4,
            height: 4,
            backgroundColor: i % 2 === 0 
              ? "hsla(0 0% 100% / 0.9)"
              : "hsla(234 89% 75% / 0.8)",
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              "0 0 0px hsla(234 89% 70% / 0)",
              "0 0 8px hsla(234 89% 70% / 0.5)",
              "0 0 0px hsla(234 89% 70% / 0)",
            ],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
