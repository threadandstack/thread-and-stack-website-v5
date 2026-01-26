import { motion } from "framer-motion";

interface FictionCloudItemProps {
  id: string;
  displayText: string;
  clusterKey: string;
  isNew: boolean;
  isCluster: boolean;
  clusterCount: number;
  isFirst: boolean;
  position: { x: number; y: number };
  onClick: () => void;
}

// Generate unique float animation parameters for each item
const getFloatAnimation = (id: string) => {
  const hash = id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const duration = 4 + (Math.abs(hash) % 4);
  const delay = (Math.abs(hash * 2) % 20) / 10;
  const yAmount = 8 + (Math.abs(hash * 3) % 8);
  
  return { duration, delay, yAmount };
};

export function FictionCloudItem({
  id,
  displayText,
  isNew,
  isCluster,
  clusterCount,
  isFirst,
  position,
  onClick
}: FictionCloudItemProps) {
  const floatAnim = getFloatAnimation(id);

  return (
    <motion.button
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
        y: [0, -floatAnim.yAmount, 0, floatAnim.yAmount / 2, 0],
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        opacity: { duration: 0.5 },
        scale: { duration: isNew ? 1.2 : 0.5, type: "spring", bounce: 0.3 },
        x: { duration: isNew ? 1.2 : 0.5 },
        y: { 
          duration: floatAnim.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatAnim.delay
        }
      }}
      onClick={onClick}
      className={`
        absolute px-4 py-2 rounded-full text-left
        ${isCluster ? 'bg-accent/10 border border-accent/20' : 'bg-muted/50 border border-border/50'}
        ${isNew ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}
        shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-pointer
        max-w-[200px] md:max-w-[280px]
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isNew ? 50 : 10
      }}
    >
      <span className="text-xs md:text-sm font-medium line-clamp-2">
        {displayText}
      </span>
      {isCluster && isFirst && clusterCount > 1 && (
        <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
          {clusterCount}
        </span>
      )}
    </motion.button>
  );
}
