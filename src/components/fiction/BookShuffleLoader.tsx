import { motion } from "framer-motion";

interface BookShuffleLoaderProps {
  className?: string;
}

export function BookShuffleLoader({ className }: BookShuffleLoaderProps) {
  const cards = [0, 1, 2, 3, 4];
  
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <div className="relative w-16 h-24">
        {cards.map((index) => (
          <motion.div
            key={index}
            className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20 shadow-sm"
            initial={{ 
              rotateZ: (index - 2) * 8,
              x: (index - 2) * 3,
              y: 0,
              opacity: 0.6
            }}
            animate={{
              rotateZ: [
                (index - 2) * 8,
                (index - 2) * 8 + 15,
                (index - 2) * 8 - 10,
                (index - 2) * 8
              ],
              x: [
                (index - 2) * 3,
                (index - 2) * 3 + 20,
                (index - 2) * 3 - 15,
                (index - 2) * 3
              ],
              y: [
                0,
                -10 - index * 2,
                5,
                0
              ],
              opacity: [0.6, 1, 0.8, 0.6],
              scale: [1, 1.05, 0.98, 1]
            }}
            transition={{
              duration: 2,
              delay: index * 0.15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              zIndex: cards.length - index,
              transformOrigin: "center bottom"
            }}
          >
            {/* Card decorative lines */}
            <div className="absolute inset-2 flex flex-col gap-1.5 pt-3">
              <div className="h-1 w-8 bg-accent/20 rounded-full" />
              <div className="h-1 w-6 bg-accent/15 rounded-full" />
              <div className="flex-1" />
              <div className="h-0.5 w-full bg-accent/10 rounded-full" />
              <div className="h-0.5 w-3/4 bg-accent/10 rounded-full" />
            </div>
          </motion.div>
        ))}
        
        {/* Sparkle effects */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1.5 h-1.5 bg-accent rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, (i - 1) * 30],
              y: [0, -20 - i * 10]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeOut"
            }}
            style={{
              left: "50%",
              top: "30%"
            }}
          />
        ))}
      </div>
    </div>
  );
}
