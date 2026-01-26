import { motion } from "framer-motion";
import { useHoldToDrag } from "@/hooks/useHoldToDrag";
import { useRef, useCallback, useState } from "react";

interface FictionCloudItemProps {
  id: string;
  displayText: string;
  clusterKey: string;
  isNew: boolean;
  count: number;
  position: { x: number; y: number };
  genreColor?: string; // HSL color from constellation
  spiralIndex?: number; // Position in spiral for z-index layering
  onClick: () => void;
  onPositionChange?: (id: string, newPosition: { x: number; y: number }) => void;
}

// Generate a deterministic rotation based on ID (-8° to +8°)
const getRotationFromId = (id: string): number => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ((hash % 17) - 8); // Range: -8 to +8 degrees
};


// Parse HSL color and generate celestial styling for book pills
// White fill with colored outline and glow effect
const getGenreBasedColors = (genreColor?: string) => {
  if (!genreColor) {
    // Fallback for uncategorized items - subtle indigo glow
    return {
      background: `hsla(0, 0%, 100%, 0.95)`,
      text: `hsl(234, 50%, 20%)`,
      border: `hsl(234, 70%, 70%)`,
      glow: `0 0 12px hsla(234, 70%, 70%, 0.5), 0 0 24px hsla(234, 70%, 70%, 0.3)`,
    };
  }
  
  // Parse the HSL color: hsl(hue, saturation%, lightness%)
  const match = genreColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) {
    return {
      background: `hsla(0, 0%, 100%, 0.95)`,
      text: `hsl(234, 50%, 20%)`,
      border: `hsl(234, 70%, 70%)`,
      glow: `0 0 12px hsla(234, 70%, 70%, 0.5), 0 0 24px hsla(234, 70%, 70%, 0.3)`,
    };
  }
  
  const hue = parseInt(match[1]);
  const saturation = parseInt(match[2]);
  
  // Celestial styling: white fill, colored outline, colored glow
  return {
    background: `hsla(0, 0%, 100%, 0.95)`,
    text: `hsl(${hue}, ${Math.min(saturation + 20, 90)}%, 25%)`,
    border: `hsl(${hue}, ${saturation}%, 65%)`,
    glow: `0 0 10px hsla(${hue}, ${saturation}%, 70%, 0.6), 0 0 20px hsla(${hue}, ${saturation}%, 70%, 0.35), 0 0 30px hsla(0, 0%, 100%, 0.2)`,
  };
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

// Scale pills based on popularity - less popular = smaller
// Popular books stay full size, new entries are compact
const getPopularityScale = (count: number): number => {
  if (count >= 5) return 1;        // Very popular - full size
  if (count >= 3) return 0.92;     // Popular - slightly smaller
  if (count >= 2) return 0.85;     // Some votes - smaller
  return 0.78;                      // New entry - compact
};

// Get float animation class based on vertical position (parallax effect)
// Items higher on screen float slower (distant), items lower float faster (closer)
const getFloatClass = (yPosition: number): string => {
  if (yPosition < 35) {
    return 'animate-float-slow'; // Top zone - slow, dreamy
  } else if (yPosition < 65) {
    return 'animate-float-medium'; // Middle zone - moderate
  } else {
    return 'animate-float-fast'; // Bottom zone - faster, closer feel
  }
};

export function FictionCloudItem({
  id,
  displayText,
  isNew,
  count,
  position,
  genreColor,
  spiralIndex = 0,
  onClick,
  onPositionChange
}: FictionCloudItemProps) {
  
  const colors = getGenreBasedColors(genreColor);
  const badgeColors = getCountBadgeColor(count);
  const showBadge = count > 1;
  const popularityScale = getPopularityScale(count);
  const rotation = getRotationFromId(id);
  
  // Z-index based on spiral position - later items layer on top
  const baseZIndex = 10 + spiralIndex;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Float class based on vertical position for parallax effect
  const floatClass = getFloatClass(position.y);
  
  const { isDragEnabled, isHolding, handlers } = useHoldToDrag({
    holdDuration: 400, // 400ms hold to activate drag
  });
  
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsInteracting(true);
    handlers.onPointerDown(e);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  }, [handlers]);
  
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    handlers.onPointerMove(e);
    
    if (isDragEnabled && dragStartPos.current) {
      setIsDragging(true);
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      setDragOffset({ x: dx, y: dy });
    }
  }, [isDragEnabled, handlers]);
  
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const wasDragging = isDragging;
    const wasDragEnabled = isDragEnabled;
    
    // Reset state first
    handlers.onPointerUp();
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    
    if (wasDragEnabled && onPositionChange && dragStartPos.current) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      
      const deltaXPercent = (dx / vw) * 100;
      const deltaYPercent = (dy / vh) * 100;
      
      const newX = Math.max(5, Math.min(95, position.x + deltaXPercent));
      const newY = Math.max(5, Math.min(95, position.y + deltaYPercent));
      
      onPositionChange(id, { x: newX, y: newY });
    } else if (!wasDragging && !wasDragEnabled) {
      // Only trigger click if we didn't drag
      onClick();
    }
    
    // Release interaction state after a brief delay to prevent animation jump
    setTimeout(() => setIsInteracting(false), 50);
    dragStartPos.current = null;
  }, [id, isDragEnabled, isDragging, position, onPositionChange, onClick, handlers]);
  
  const handlePointerCancel = useCallback(() => {
    setIsInteracting(false);
    handlers.onPointerCancel();
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    dragStartPos.current = null;
  }, [handlers]);

  // Convert drag offset to percentage for visual feedback
  const visualOffsetX = isDragging ? (dragOffset.x / window.innerWidth) * 100 : 0;
  const visualOffsetY = isDragging ? (dragOffset.y / window.innerHeight) * 100 : 0;

  return (
    <motion.div
      ref={containerRef}
      key={id}
      initial={isNew ? { 
        opacity: 0, 
        scale: 0.5 * popularityScale,
      } : { 
        opacity: 0, 
        scale: 0.8 * popularityScale,
      }}
      animate={{ 
        opacity: 1, 
        scale: isDragEnabled ? 1.1 * popularityScale : popularityScale,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        opacity: { duration: 0.5 },
        scale: { duration: isNew ? 0.8 : 0.2, type: "spring", bounce: 0.3 },
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`
        absolute px-3 py-1.5 rounded-full text-center select-none whitespace-nowrap
        ${isNew ? 'ring-2 ring-accent ring-offset-2 ring-offset-transparent' : ''}
        ${isDragEnabled ? 'ring-2 ring-white/50 cursor-grabbing' : isHolding ? 'cursor-grab' : 'cursor-pointer'}
        ${!isInteracting && !isDragEnabled && !isHolding ? floatClass : ''}
      `}
      style={{
        left: `${position.x + visualOffsetX}%`,
        top: `${position.y + visualOffsetY}%`,
        transform: `translate(-50%, -50%) rotate(${isDragEnabled ? 0 : rotation}deg)`,
        zIndex: isDragEnabled ? 200 : isNew ? 150 : baseZIndex,
        backgroundColor: colors.background,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: isDragEnabled ? 'hsla(0, 0%, 100%, 0.8)' : colors.border,
        color: colors.text,
        boxShadow: isDragEnabled ? `0 0 20px hsla(0, 0%, 100%, 0.8)` : colors.glow,
        touchAction: 'none',
      }}
    >
      <span className="text-xs font-medium pointer-events-none">
        {displayText}
      </span>
      {showBadge && (
        <span 
          className="absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm pointer-events-none"
          style={{
            backgroundColor: badgeColors.bg,
            color: badgeColors.text,
          }}
        >
          {count}
        </span>
      )}
      {/* Hold indicator */}
      {isHolding && !isDragEnabled && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white/70 whitespace-nowrap pointer-events-none"
        >
          Hold...
        </motion.span>
      )}
    </motion.div>
  );
}
