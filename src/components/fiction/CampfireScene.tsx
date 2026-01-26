import { motion } from "framer-motion";
import campfireImage from "@/assets/campfire-pixel.png";

// SVG tree silhouette paths - varied tree shapes
const TREE_PATHS = [
  // Pine tree 1 - tall
  "M20 100 L30 60 L25 65 L35 30 L30 35 L40 0 L50 35 L45 30 L55 65 L50 60 L60 100 Z",
  // Pine tree 2 - medium
  "M15 100 L25 55 L20 60 L30 25 L40 60 L35 55 L45 100 Z",
  // Pine tree 3 - wide
  "M10 100 L20 70 L15 75 L25 45 L20 50 L30 20 L35 10 L40 20 L50 50 L45 45 L55 75 L50 70 L60 100 Z",
  // Pine tree 4 - small
  "M20 100 L30 50 L40 100 Z M25 50 L30 25 L35 50 Z",
];

// Generate smoke particles
const SmokeParticle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-white/20"
    style={{ left: `calc(50% + ${x}px)` }}
    initial={{ y: 0, opacity: 0.4, scale: 0.5 }}
    animate={{ 
      y: -80, 
      opacity: 0, 
      scale: 1.5,
      x: [0, x * 0.5, x * -0.3, x * 0.2]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  />
);

export function CampfireScene() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '180px' }}>
      {/* Dark gradient overlay at top for smooth blend */}
      <div 
        className="absolute inset-x-0 top-0 h-20 z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, hsl(234, 50%, 8%))'
        }}
      />
      
      {/* Night sky ground - dark blue/black */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'hsl(234, 50%, 8%)' }}
      />

      {/* Repeating tree silhouettes */}
      <div className="absolute inset-x-0 bottom-0 h-full flex items-end justify-center">
        <svg 
          viewBox="0 0 1200 120" 
          className="w-full h-32 absolute bottom-0"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Generate repeating trees across the width */}
          {Array.from({ length: 20 }).map((_, i) => {
            const treeIndex = i % TREE_PATHS.length;
            const xOffset = i * 60 - 30;
            const scale = 0.8 + (i % 3) * 0.15;
            const yOffset = (i % 2) * 10;
            
            return (
              <g 
                key={i} 
                transform={`translate(${xOffset}, ${yOffset}) scale(${scale})`}
              >
                <path
                  d={TREE_PATHS[treeIndex]}
                  fill="hsl(234, 40%, 5%)"
                  opacity={0.9 - (i % 3) * 0.1}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Campfire container - centered */}
      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 z-20">
        {/* Smoke particles */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24">
          <SmokeParticle delay={0} x={-5} />
          <SmokeParticle delay={0.5} x={3} />
          <SmokeParticle delay={1} x={-8} />
          <SmokeParticle delay={1.5} x={6} />
          <SmokeParticle delay={2} x={-2} />
          <SmokeParticle delay={2.5} x={4} />
        </div>

        {/* Fire glow effect */}
        <div 
          className="absolute left-1/2 bottom-4 -translate-x-1/2 w-32 h-16 rounded-full blur-xl"
          style={{
            background: 'radial-gradient(ellipse, hsla(30, 100%, 50%, 0.4), transparent 70%)'
          }}
        />
        
        {/* Animated fire flicker glow */}
        <motion.div
          className="absolute left-1/2 bottom-6 -translate-x-1/2 w-24 h-12 rounded-full blur-lg"
          style={{
            background: 'radial-gradient(ellipse, hsla(40, 100%, 60%, 0.5), transparent 70%)'
          }}
          animate={{
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0.5, 0.7, 0.4, 0.6, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Campfire image with subtle animation */}
        <motion.img
          src={campfireImage}
          alt="Pixelated campfire"
          className="w-20 h-20 object-contain relative z-10"
          style={{ imageRendering: 'pixelated' }}
          animate={{
            scale: [1, 1.02, 0.98, 1.01, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Ground line */}
      <div 
        className="absolute inset-x-0 bottom-0 h-2"
        style={{ backgroundColor: 'hsl(234, 30%, 4%)' }}
      />
    </div>
  );
}
