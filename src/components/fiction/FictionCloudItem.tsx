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
  onClick: () => void;
  onPositionChange?: (id: string, newPosition: { x: number; y: number }) => void;
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
  onClick,
  onPositionChange
}: FictionCloudItemProps) {
  const floatAnim = getFloatAnimation(id);
  const colors = getPositionBasedColors(position.y);
  const badgeColors = getCountBadgeColor(count);
  const showBadge = count > 1;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const { isDragEnabled, isHolding, handlers } = useHoldToDrag({
    holdDuration: 400, // 400ms hold to activate drag
  });
  
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
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
    if (isDragEnabled && onPositionChange && dragStartPos.current) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      
      const deltaXPercent = (dx / vw) * 100;
      const deltaYPercent = (dy / vh) * 100;
      
      const newX = Math.max(5, Math.min(95, position.x + deltaXPercent));
      const newY = Math.max(5, Math.min(95, position.y + deltaYPercent));
      
      onPositionChange(id, { x: newX, y: newY });
    } else if (!isDragging && !isDragEnabled) {
      // Only trigger click if we didn't drag
      onClick();
    }
    
    handlers.onPointerUp();
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    dragStartPos.current = null;
  }, [id, isDragEnabled, isDragging, position, onPositionChange, onClick, handlers]);
  
  const handlePointerCancel = useCallback(() => {
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
        scale: 0.5,
      } : { 
        opacity: 0, 
        scale: 0.8,
      }}
      animate={{ 
        opacity: 1, 
        scale: isDragEnabled ? 1.1 : 1,
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
        absolute px-4 py-2 rounded-full text-left select-none
        ${isNew ? 'ring-2 ring-accent ring-offset-2 ring-offset-transparent' : ''}
        ${isDragEnabled ? 'ring-2 ring-white/50 cursor-grabbing' : isHolding ? 'cursor-grab' : 'cursor-pointer'}
        shadow-md hover:shadow-lg transition-shadow
        max-w-[180px] md:max-w-[240px] whitespace-nowrap
      `}
      style={{
        left: `${position.x + visualOffsetX}%`,
        top: `${position.y + visualOffsetY}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isDragEnabled ? 100 : isNew ? 50 : 10,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: isDragEnabled ? 'hsla(0, 0%, 100%, 0.6)' : colors.border,
        color: colors.text,
        touchAction: 'none',
        // Pause float animation while dragging or holding
        animation: isDragEnabled || isHolding || isDragging ? 'none' : `float-${Math.abs(id.charCodeAt(0) % 3)} ${floatAnim.duration}s ease-in-out ${floatAnim.delay}s infinite`,
      }}
    >
      <span className="text-xs md:text-sm font-medium truncate block pointer-events-none">
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
