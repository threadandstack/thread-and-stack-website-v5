import { motion, PanInfo } from "framer-motion";
import { useHoldToDrag } from "@/hooks/useHoldToDrag";
import { useCallback } from "react";

interface DraggableConstellationAnchorProps {
  genre: string;
  position: { x: number; y: number };
  color: string;
  isMobile?: boolean;
  onPositionChange?: (genre: string, newPosition: { x: number; y: number }) => void;
}

export function DraggableConstellationAnchor({
  genre,
  position,
  color,
  isMobile = false,
  onPositionChange
}: DraggableConstellationAnchorProps) {
  const { isDragEnabled, isHolding, handlers } = useHoldToDrag({
    holdDuration: 400,
  });
  
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!onPositionChange) return;
    
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    const deltaXPercent = (info.offset.x / vw) * 100;
    const deltaYPercent = (info.offset.y / vh) * 100;
    
    const newX = Math.max(5, Math.min(95, position.x + deltaXPercent));
    const newY = Math.max(5, Math.min(95, position.y + deltaYPercent));
    
    onPositionChange(genre, { x: newX, y: newY });
  }, [genre, position, onPositionChange]);

  return (
    <motion.div
      drag={isDragEnabled}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onPointerDown={handlers.onPointerDown}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerCancel}
      animate={{
        scale: isDragEnabled ? 1.2 : 1,
      }}
      transition={{ scale: { duration: 0.2 } }}
      className={`
        absolute flex flex-col items-center
        ${isDragEnabled ? 'cursor-grabbing z-[100]' : isHolding ? 'cursor-grab z-[60]' : 'cursor-pointer z-[5]'}
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        touchAction: isDragEnabled ? 'none' : 'auto',
      }}
    >
      {/* Genre label */}
      <span 
        className="text-[10px] md:text-xs font-serif italic font-medium tracking-wider whitespace-nowrap pointer-events-none select-none"
        style={{ 
          color: 'hsla(0, 0%, 100%, 0.8)',
          textShadow: `0 0 10px ${color}`,
          marginBottom: isMobile ? 4 : 6,
        }}
      >
        {genre.toUpperCase()}
      </span>
      
      {/* Star visual */}
      <div 
        className="relative"
        style={{
          width: isMobile ? 20 : 24,
          height: isMobile ? 20 : 24,
        }}
      >
        {/* Outer glow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: color,
            opacity: 0.3,
            filter: 'blur(6px)',
            transform: 'scale(1.5)',
          }}
        />
        
        {/* Inner core */}
        <div 
          className="absolute rounded-full"
          style={{
            backgroundColor: 'white',
            width: isMobile ? 8 : 10,
            height: isMobile ? 8 : 10,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
          }}
        />
        
        {/* Ring */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            border: `1px solid ${color}`,
            opacity: isDragEnabled ? 0.8 : 0.4,
            width: isMobile ? 14 : 16,
            height: isMobile ? 14 : 16,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      
      {/* Hold indicator */}
      {isHolding && !isDragEnabled && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-5 text-[9px] text-white/60 whitespace-nowrap pointer-events-none"
        >
          Hold...
        </motion.span>
      )}
    </motion.div>
  );
}
