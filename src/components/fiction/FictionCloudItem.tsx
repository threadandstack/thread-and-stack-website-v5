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
  const duration = 5 + (Math.abs(hash) % 4);
  const delay = (Math.abs(hash * 2) % 20) / 10;
  // Keep the float subtle so it can't re-introduce overlaps after positions are resolved.
  const yAmount = 3 + (Math.abs(hash * 3) % 4);
  
  return { duration, delay, yAmount };
};

// Calculate color based on vertical position for contrast against gradient
const getPositionBasedColors = (yPercent: number) => {
  const normalized = Math.max(0, Math.min(100, yPercent)) / 100;
  
  if (normalized < 0.35) {
    return {
      background: `hsla(0, 0%, 100%, 0.95)`,
      text: `hsl(234, 50%, 20%)`,
      border: `hsla(234, 50%, 70%, 0.5)`,
    };
  } else if (normalized < 0.55) {
    return {
      background: `hsla(234, 40%, 92%, 0.92)`,
      text: `hsl(234, 50%, 25%)`,
      border: `hsla(234, 50%, 60%, 0.4)`,
    };
  } else if (normalized < 0.75) {
    return {
      background: `hsla(234, 50%, 35%, 0.9)`,
      text: `hsl(0, 0%, 95%)`,
      border: `hsla(234, 40%, 50%, 0.5)`,
    };
  } else {
    return {
      background: `hsla(234, 60%, 22%, 0.95)`,
      text: `hsl(0, 0%, 98%)`,
      border: `hsla(234, 50%, 40%, 0.6)`,
    };
  }
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
  const colors = getPositionBasedColors(position.y);

  return (
    <motion.button
      key={id}
      initial={isNew ? { 
        opacity: 0, 
        scale: 0.5,
        x: "-50%",
        y: "-50%"
      } : { 
        opacity: 0, 
        scale: 0.8,
        x: "-50%",
        y: "-50%"
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: "-50%",
        y: "-50%",
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        opacity: { duration: 0.5 },
        scale: { duration: isNew ? 0.8 : 0.4, type: "spring", bounce: 0.3 },
      }}
      onClick={onClick}
      className={`
        absolute px-4 py-2 rounded-full text-left
        ${isNew ? 'ring-2 ring-accent ring-offset-2 ring-offset-transparent' : ''}
        shadow-md hover:shadow-lg hover:scale-105 transition-shadow cursor-pointer
        max-w-[180px] md:max-w-[240px] whitespace-nowrap
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        zIndex: isNew ? 50 : 10,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.border,
        color: colors.text,
        // Add gentle floating animation via CSS
        animation: `float-${Math.abs(id.charCodeAt(0) % 3)} ${floatAnim.duration}s ease-in-out ${floatAnim.delay}s infinite`,
      }}
    >
      <span className="text-xs md:text-sm font-medium truncate block">
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
