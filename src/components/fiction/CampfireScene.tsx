import { motion } from "framer-motion";
import campfireGif from "@/assets/campfire.gif";
import treesImage from "@/assets/trees-silhouette.png";

// Generate smoke particles
const SmokeParticle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute w-3 h-3 rounded-full"
    style={{ 
      left: `calc(50% + ${x}px)`,
      background: 'radial-gradient(circle, hsla(0, 0%, 80%, 0.4), transparent 70%)'
    }}
    initial={{ y: 0, opacity: 0.5, scale: 0.5 }}
    animate={{ 
      y: -120, 
      opacity: 0, 
      scale: 2,
      x: [0, x * 0.5, x * -0.3, x * 0.2]
    }}
    transition={{
      duration: 4,
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

      {/* Ambient fire glow - large soft glow behind everything */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 z-20 pointer-events-none">
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
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 z-30">
        {/* Smoke particles - rise above fire */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-16 z-40">
          <SmokeParticle delay={0} x={-8} />
          <SmokeParticle delay={0.6} x={5} />
          <SmokeParticle delay={1.2} x={-12} />
          <SmokeParticle delay={1.8} x={8} />
          <SmokeParticle delay={2.4} x={-3} />
          <SmokeParticle delay={3} x={6} />
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
