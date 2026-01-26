import { useState, useRef, useCallback, useEffect } from "react";

interface UseHoldToDragOptions {
  holdDuration?: number; // ms to hold before drag activates
  onDragEnd?: (delta: { x: number; y: number }) => void;
}

interface UseHoldToDragResult {
  isDragEnabled: boolean;
  isHolding: boolean;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
  };
}

export function useHoldToDrag(options: UseHoldToDragOptions = {}): UseHoldToDragResult {
  const { holdDuration = 300, onDragEnd } = options;
  
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  
  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);
  
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setIsHolding(true);
    
    holdTimerRef.current = setTimeout(() => {
      setIsDragEnabled(true);
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, holdDuration);
  }, [holdDuration]);
  
  const handlePointerUp = useCallback(() => {
    clearHoldTimer();
    setIsHolding(false);
    
    // Small delay before disabling drag to allow dragEnd to fire
    setTimeout(() => {
      setIsDragEnabled(false);
    }, 100);
  }, [clearHoldTimer]);
  
  const handlePointerCancel = useCallback(() => {
    clearHoldTimer();
    setIsHolding(false);
    setIsDragEnabled(false);
  }, [clearHoldTimer]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => clearHoldTimer();
  }, [clearHoldTimer]);
  
  return {
    isDragEnabled,
    isHolding,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  };
}
