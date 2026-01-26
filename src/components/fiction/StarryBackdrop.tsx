import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface FlyingBird {
  id: number;
  startY: number;
  direction: "left" | "right";
  duration: number;
  size: number;
}

// Pixel bird silhouette component
const PixelBird = ({ size, flipped }: { size: number; flipped?: boolean }) => (
  <svg
    width={size}
    height={size * 0.6}
    viewBox="0 0 16 10"
    style={{ 
      imageRendering: 'pixelated',
      transform: flipped ? 'scaleX(-1)' : undefined
    }}
  >
    {/* Simple pixel bird shape - classic "M" flying bird */}
    <rect x="0" y="4" width="2" height="2" fill="currentColor" />
    <rect x="2" y="2" width="2" height="2" fill="currentColor" />
    <rect x="4" y="0" width="2" height="2" fill="currentColor" />
    <rect x="6" y="2" width="2" height="2" fill="currentColor" />
    <rect x="8" y="4" width="2" height="2" fill="currentColor" />
    <rect x="10" y="2" width="2" height="2" fill="currentColor" />
    <rect x="12" y="0" width="2" height="2" fill="currentColor" />
    <rect x="14" y="2" width="2" height="2" fill="currentColor" />
  </svg>
);

// Animated flying bird component
const FlyingBirdAnimation = ({ bird, onComplete }: { bird: FlyingBird; onComplete: () => void }) => {
  const isLeftToRight = bird.direction === "right";
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: `${bird.startY}%`,
        color: 'hsla(234, 30%, 20%, 0.7)',
      }}
      initial={{ 
        x: isLeftToRight ? '-10vw' : '110vw',
        y: 0
      }}
      animate={{ 
        x: isLeftToRight ? '110vw' : '-10vw',
        y: [0, -15, 5, -10, 0, -8, 3, -5, 0]
      }}
      transition={{
        duration: bird.duration,
        ease: "linear",
        y: {
          duration: bird.duration,
          ease: "easeInOut",
          times: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1]
        }
      }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        animate={{ scaleY: [1, 0.6, 1, 0.7, 1] }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <PixelBird size={bird.size} flipped={!isLeftToRight} />
      </motion.div>
    </motion.div>
  );
};

export function StarryBackdrop() {
  const [birds, setBirds] = useState<FlyingBird[]>([]);
  const [birdIdCounter, setBirdIdCounter] = useState(0);

  const stars = useMemo(() => {
    const starArray: Star[] = [];
    const starCount = 120;
    
    for (let i = 0; i < starCount; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.floor(Math.random() * 3) + 2,
        opacity: Math.random() * 0.6 + 0.3,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 3,
        color: Math.random() > 0.4 ? "white" : "indigo",
      });
    }
    return starArray;
  }, []);

  // Spawn birds periodically
  useEffect(() => {
    const spawnBird = () => {
      const newBird: FlyingBird = {
        id: birdIdCounter,
        startY: 10 + Math.random() * 40, // Top 50% of screen
        direction: Math.random() > 0.5 ? "left" : "right",
        duration: 15 + Math.random() * 10, // 15-25 seconds to cross
        size: 20 + Math.random() * 16, // 20-36px
      };
      setBirds(prev => [...prev, newBird]);
      setBirdIdCounter(prev => prev + 1);
    };

    // Initial bird after 3 seconds
    const initialTimeout = setTimeout(spawnBird, 3000);

    // Spawn birds every 8-15 seconds
    const interval = setInterval(() => {
      spawnBird();
    }, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [birdIdCounter]);

  const removeBird = (id: number) => {
    setBirds(prev => prev.filter(bird => bird.id !== id));
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Night sky gradient */}
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
      
      {/* Larger accent stars */}
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

      {/* Flying pixel birds */}
      <AnimatePresence>
        {birds.map((bird) => (
          <FlyingBirdAnimation
            key={bird.id}
            bird={bird}
            onComplete={() => removeBird(bird.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
