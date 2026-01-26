import { motion } from "framer-motion";
import campfireGif from "@/assets/campfire.gif";
import treesImage from "@/assets/trees-silhouette.png";

// Generate smoke particles that rise high up the page
const SmokeParticle = ({ delay, x, size = 3 }: { delay: number; x: number; size?: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{ 
      left: `calc(50% + ${x}px)`,
      width: size * 4,
      height: size * 4,
      background: 'radial-gradient(circle, hsla(0, 0%, 80%, 0.3), transparent 70%)'
    }}
    initial={{ y: 0, opacity: 0.4, scale: 0.5 }}
    animate={{ 
      y: '-80vh', 
      opacity: [0.4, 0.3, 0.2, 0],
      scale: [0.5, 1.5, 2.5, 3],
      x: [0, x * 2, x * -1.5, x * 3, x * -0.5]
    }}
    transition={{
      duration: 12,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  />
);

// Smaller, faster smoke for variety
const SmallSmokeParticle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{ 
      left: `calc(50% + ${x}px)`,
      width: 8,
      height: 8,
      background: 'radial-gradient(circle, hsla(0, 0%, 90%, 0.25), transparent 70%)'
    }}
    initial={{ y: 0, opacity: 0.3, scale: 0.3 }}
    animate={{ 
      y: '-60vh', 
      opacity: [0.3, 0.2, 0.1, 0],
      scale: [0.3, 1, 1.8, 2.5],
      x: [0, x * 1.5, x * -1, x * 2]
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  />
);

export function CampfireScene() {
  return (
    <div className="relative w-full" style={{ height: '120px', marginBottom: '-1px' }}>
      {/* Transparent container - stars show through */}
      
      {/* Tree silhouettes layer - tiling image with transparent background */}
      <div 
        className="absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none"
        style={{
          backgroundImage: `url(${treesImage})`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom center',
          backgroundSize: 'auto 100%',
        }}
      />

      {/* Ambient fire glow - behind campfire GIF */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 z-5 pointer-events-none">
        {/* Outer warm glow */}
        <motion.div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-64 h-40 rounded-full"
          style={{
            background: 'radial-gradient(ellipse 100% 80% at 50% 100%, hsla(25, 100%, 50%, 0.25), hsla(40, 100%, 55%, 0.15) 40%, transparent 70%)',
            filter: 'blur(20px)'
          }}
          animate={{
            scale: [1, 1.05, 0.98, 1.02, 1],
            opacity: [0.8, 1, 0.75, 0.9, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Inner bright glow */}
        <motion.div
          className="absolute left-1/2 bottom-2 -translate-x-1/2 w-32 h-20 rounded-full"
          style={{
            background: 'radial-gradient(ellipse 100% 70% at 50% 100%, hsla(35, 100%, 60%, 0.5), hsla(45, 100%, 50%, 0.3) 50%, transparent 80%)',
            filter: 'blur(12px)'
          }}
          animate={{
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0.6, 0.8, 0.5, 0.7, 0.6]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Campfire container - centered, above glow */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 z-20">
        {/* Smoke particles - rise high up to the CTA box */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 z-40 overflow-visible">
          {/* Large slow-rising smoke puffs */}
          <SmokeParticle delay={0} x={-10} size={4} />
          <SmokeParticle delay={1.5} x={8} size={3} />
          <SmokeParticle delay={3} x={-5} size={5} />
          <SmokeParticle delay={4.5} x={12} size={3} />
          <SmokeParticle delay={6} x={-15} size={4} />
          <SmokeParticle delay={7.5} x={5} size={4} />
          <SmokeParticle delay={9} x={-8} size={3} />
          <SmokeParticle delay={10.5} x={10} size={5} />
          
          {/* Smaller faster smoke for variety */}
          <SmallSmokeParticle delay={0.5} x={-6} />
          <SmallSmokeParticle delay={2} x={10} />
          <SmallSmokeParticle delay={3.5} x={-12} />
          <SmallSmokeParticle delay={5} x={4} />
          <SmallSmokeParticle delay={6.5} x={-3} />
          <SmallSmokeParticle delay={8} x={8} />
        </div>

        {/* Campfire GIF - smaller to match trees */}
        <img
          src={campfireGif}
          alt="Pixelated campfire"
          className="w-12 h-12 object-contain relative"
          style={{ 
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 6px hsla(35, 100%, 50%, 0.5))'
          }}
        />
      </div>

    </div>
  );
}
