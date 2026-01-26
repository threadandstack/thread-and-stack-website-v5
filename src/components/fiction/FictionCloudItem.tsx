import { motion } from "framer-motion";

interface FictionCloudItemProps {
  id: string;
  displayText: string;
  clusterKey: string;
  isNew: boolean;
  count: number;
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

// Get badge color based on count - progresses through a spectrum as popularity increases
const getCountBadgeColor = (count: number): { bg: string; text: string } => {
  if (count <= 1) {
    return { bg: '', text: '' }; // No badge
  } else if (count === 2) {
    // Blue - just getting started
    return { bg: 'hsl(217, 91%, 60%)', text: 'hsl(0, 0%, 100%)' };
  } else if (count === 3) {
    // Purple - gaining traction
    return { bg: 'hsl(271, 81%, 56%)', text: 'hsl(0, 0%, 100%)' };
  } else if (count === 4) {
    // Crimson - popular
    return { bg: 'hsl(348, 83%, 47%)', text: 'hsl(0, 0%, 100%)' };
  } else if (count === 5) {
    // Pink - very popular
    return { bg: 'hsl(330, 81%, 60%)', text: 'hsl(0, 0%, 100%)' };
  } else if (count >= 6 && count < 10) {
    // Hot pink/magenta - super popular
    return { bg: 'hsl(322, 93%, 58%)', text: 'hsl(0, 0%, 100%)' };
  } else {
    // Golden yellow - legendary status
    return { bg: 'hsl(45, 93%, 58%)', text: 'hsl(0, 0%, 15%)' };
  }
};

export function FictionCloudItem({
  id,
  displayText,
  isNew,
  count,
  position,
  onClick
}: FictionCloudItemProps) {
  const floatAnim = getFloatAnimation(id);
  const colors = getPositionBasedColors(position.y);
  const badgeColors = getCountBadgeColor(count);
  const showBadge = count > 1;

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
      {showBadge && (
        <span 
          className="absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm"
          style={{
            backgroundColor: badgeColors.bg,
            color: badgeColors.text,
          }}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}
