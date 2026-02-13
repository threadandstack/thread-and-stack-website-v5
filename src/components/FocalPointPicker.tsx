import { useState, useCallback } from "react";

interface FocalPointPickerProps {
  enabled: boolean;
  onToggle: () => void;
  focalPoint: { x: number; y: number };
  onFocalPointChange: (point: { x: number; y: number }) => void;
}

export const FocalPointPicker = ({
  enabled,
  onToggle,
  focalPoint,
  onFocalPointChange,
}: FocalPointPickerProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerEvent = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      onFocalPointChange({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    },
    [onFocalPointChange]
  );

  if (!enabled) {
    return (
      <button
        onClick={onToggle}
        className="absolute top-20 right-4 z-50 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full font-mono hover:bg-black transition-colors"
      >
        ⊕ Set focal point
      </button>
    );
  }

  return (
    <>
      {/* Overlay captures clicks */}
      <div
        className="absolute inset-0 z-40 cursor-crosshair"
        onMouseDown={(e) => {
          setIsDragging(true);
          handlePointerEvent(e);
        }}
        onMouseMove={(e) => {
          if (isDragging) handlePointerEvent(e);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      />

      {/* Crosshair marker */}
      <div
        className="absolute z-50 pointer-events-none"
        style={{
          left: `${focalPoint.x}%`,
          top: `${focalPoint.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Info panel */}
      <div className="absolute top-20 right-4 z-50 bg-black/90 text-white text-xs px-4 py-3 rounded-xl font-mono space-y-2 min-w-[200px]">
        <div className="flex items-center justify-between">
          <span className="text-white/60">Focal Point</span>
          <button
            onClick={onToggle}
            className="text-white/40 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="text-sm font-semibold">
          object-position: {focalPoint.x}% {focalPoint.y}%
        </div>
        <p className="text-white/50 text-[10px] leading-snug">
          Click or drag on the image to set the focal point. Copy the value above into your code when happy.
        </p>
      </div>
    </>
  );
};
