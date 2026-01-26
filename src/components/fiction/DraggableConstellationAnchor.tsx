import { motion } from "framer-motion";
import { useHoldToDrag } from "@/hooks/useHoldToDrag";
import { useCallback, useRef, useState, useEffect } from "react";

interface DraggableConstellationAnchorProps {
  genre: string;
  position: { x: number; y: number };
  color: string;
  isMobile?: boolean;
  isPulsing?: boolean; // Trigger pulse when new book added
  onPositionChange?: (genre: string, delta: { x: number; y: number }, newPosition: { x: number; y: number }) => void;
}

export function DraggableConstellationAnchor({
  genre,
  position,
  color,
  isMobile = false,
  isPulsing = false,
  onPositionChange
}: DraggableConstellationAnchorProps) {
  const { isDragEnabled, isHolding, handlers, resetDrag } = useHoldToDrag({
    holdDuration: 400,
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showPulse, setShowPulse] = useState(false);
  
  // Trigger pulse animation when isPulsing changes to true
  useEffect(() => {
    if (isPulsing) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isPulsing]);
  
  // Manual drag implementation for immediate response after hold
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    handlers.onPointerDown(e);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  }, [handlers]);
  
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    handlers.onPointerMove(e);
    
    // If drag is enabled, track the offset
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
      
      onPositionChange(genre, { x: deltaXPercent, y: deltaYPercent }, { x: newX, y: newY });
    }
    
    handlers.onPointerUp();
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    dragStartPos.current = null;
  }, [isDragEnabled, genre, position, onPositionChange, handlers]);
  
  const handlePointerCancel = useCallback(() => {
    handlers.onPointerCancel();
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    dragStartPos.current = null;
  }, [handlers]);

  // Convert drag offset to percentage for visual feedback
  const visualOffsetX = isDragging ? (dragOffset.x / window.innerWidth) * 100 : 0;
  const visualOffsetY = isDragging ? (dragOffset.y / window.innerHeight) * 100 : 0;

  const starSize = isMobile ? 20 : 24;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`
        absolute select-none
        ${isDragEnabled ? 'cursor-grabbing z-[100]' : isHolding ? 'cursor-grab z-[60]' : 'cursor-pointer z-[5]'}
      `}
      style={{
        left: `${position.x + visualOffsetX}%`,
        top: `${position.y + visualOffsetY}%`,
        transform: `translate(-50%, -50%) scale(${isDragEnabled ? 1.2 : 1})`,
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        touchAction: 'none',
      }}
    >
      {/* Genre label - positioned ABOVE the star */}
      <span 
        className="absolute text-[10px] md:text-xs font-serif italic font-medium tracking-wider whitespace-nowrap pointer-events-none"
        style={{ 
          color: 'hsla(0, 0%, 100%, 0.8)',
          textShadow: `0 0 10px ${color}`,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: isMobile ? 8 : 10,
        }}
      >
        {genre.toUpperCase()}
      </span>
      
      {/* Star visual - THIS is now at the exact anchor position (center of container) */}
      <div 
        className="relative pointer-events-none"
        style={{
          width: starSize,
          height: starSize,
        }}
      >
        {/* Pulse animation ring - appears when new book added */}
        {showPulse && (
          <motion.div
            className="absolute rounded-full"
            style={{
              border: `2px solid ${color}`,
              top: '50%',
              left: '50%',
            }}
            initial={{ width: 0, height: 0, x: '-50%', y: '-50%', opacity: 1 }}
            animate={{ 
              width: [0, 60, 80], 
              height: [0, 60, 80], 
              opacity: [1, 0.5, 0] 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}
        
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
          className="absolute rounded-full"
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
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-white/60 whitespace-nowrap pointer-events-none"
        >
          Hold...
        </motion.span>
      )}
    </div>
  );
}
