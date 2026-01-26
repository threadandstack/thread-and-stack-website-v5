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
  // Keep the float subtle so it can't re-introduce overlaps after positions are resolved.
  const yAmount = 2 + (Math.abs(hash * 3) % 3);
  
  return { duration, delay, yAmount };
};

// Calculate color based on vertical position for contrast against gradient
// Top of page = darker gradient, so need high contrast (white bg or very light)
// Bottom of page = lighter gradient, so use navy bg with white text
const getPositionBasedColors = (yPercent: number) => {
  // Normalize y to 0-1 range (0 = top, 1 = bottom)
  const normalized = Math.max(0, Math.min(100, yPercent)) / 100;
  
  // Top items (0-40%): Light/white backgrounds for contrast against dark sky
  // Bottom items (60-100%): Navy backgrounds with light text
  
  if (normalized < 0.35) {
    // Top zone: white/very light backgrounds, dark text
    return {
      background: `hsla(0, 0%, 100%, 0.95)`,
      text: `hsl(234, 50%, 20%)`,
      border: `hsla(234, 50%, 70%, 0.5)`,
    };
  } else if (normalized < 0.55) {
    // Middle-upper zone: slightly tinted
    return {
      background: `hsla(234, 40%, 92%, 0.92)`,
      text: `hsl(234, 50%, 25%)`,
      border: `hsla(234, 50%, 60%, 0.4)`,
    };
  } else if (normalized < 0.75) {
    // Middle-lower zone: transitional navy-ish
    return {
      background: `hsla(234, 50%, 35%, 0.9)`,
      text: `hsl(0, 0%, 95%)`,
      border: `hsla(234, 40%, 50%, 0.5)`,
    };
  } else {
    // Bottom zone: deep navy with white text
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
      layout
      layoutId={id}
      initial={isNew ? { 
        opacity: 0, 
        scale: 0.5,
        left: "50%",
        top: "50%"
      } : { opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        left: `${position.x}%`,
        top: `${position.y}%`,
        y: [0, -floatAnim.yAmount, 0, floatAnim.yAmount / 2, 0],
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        opacity: { duration: 0.5 },
        scale: { duration: isNew ? 1.2 : 0.5, type: "spring", bounce: 0.3 },
        left: { duration: 0.8, type: "spring", bounce: 0.2 },
        top: { duration: 0.8, type: "spring", bounce: 0.2 },
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
        ${isNew ? 'ring-2 ring-accent ring-offset-2 ring-offset-transparent' : ''}
        shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer
        max-w-[180px] md:max-w-[240px] whitespace-nowrap
      `}
      style={{
        transform: 'translate(-50%, -50%)',
        zIndex: isNew ? 50 : 10,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.border,
        color: colors.text,
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
