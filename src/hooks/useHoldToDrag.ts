import { useState, useRef, useCallback, useEffect } from "react";

interface UseHoldToDragOptions {
  holdDuration?: number; // ms to hold before drag activates
}

interface UseHoldToDragResult {
  isDragEnabled: boolean;
  isHolding: boolean;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
    onPointerMove: (e: React.PointerEvent) => void;
  };
  resetDrag: () => void;
}

export function useHoldToDrag(options: UseHoldToDragOptions = {}): UseHoldToDragResult {
  const { holdDuration = 300 } = options;
  
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  
  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);
  
  const resetDrag = useCallback(() => {
    clearHoldTimer();
    setIsHolding(false);
    setIsDragEnabled(false);
    if (elementRef.current && pointerIdRef.current !== null) {
      try {
        elementRef.current.releasePointerCapture(pointerIdRef.current);
      } catch (e) {
        // Pointer may already be released
      }
    }
    pointerIdRef.current = null;
    elementRef.current = null;
  }, [clearHoldTimer]);
  
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };
    elementRef.current = e.currentTarget as HTMLElement;
    pointerIdRef.current = e.pointerId;
    setIsHolding(true);
    
    // Capture pointer to receive all events even if pointer leaves element
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {
      // Some browsers may not support this
    }
    
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
    }, 50);
    
    if (elementRef.current && pointerIdRef.current !== null) {
      try {
        elementRef.current.releasePointerCapture(pointerIdRef.current);
      } catch (e) {
        // Pointer may already be released
      }
    }
    pointerIdRef.current = null;
  }, [clearHoldTimer]);
  
  const handlePointerCancel = useCallback(() => {
    resetDrag();
  }, [resetDrag]);
  
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    // If user moves too much before hold completes, cancel the hold
    if (isHolding && !isDragEnabled && startPosRef.current) {
      const dx = Math.abs(e.clientX - startPosRef.current.x);
      const dy = Math.abs(e.clientY - startPosRef.current.y);
      // Allow small movement threshold (10px) before canceling
      if (dx > 10 || dy > 10) {
        clearHoldTimer();
        setIsHolding(false);
      }
    }
  }, [isHolding, isDragEnabled, clearHoldTimer]);
  
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
      onPointerMove: handlePointerMove,
    },
    resetDrag,
  };
}
