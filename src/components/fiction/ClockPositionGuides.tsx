import { motion } from "framer-motion";

interface ClockPositionGuidesProps {
  /** Number of books currently in this constellation */
  bookCount: number;
  /** Color for the guide dots (genre color) */
  color: string;
  /** Size of the star container */
  starSize: number;
  /** Whether on mobile */
  isMobile?: boolean;
}

// Mobile clock positions prioritize BELOW the star (where there's more room)
// Shows guides for primary positions: 6, 5, 7, 4, 8 (all below/sides)
const MOBILE_GUIDE_POSITIONS = [
  { angle: 180, label: "6" },  // Directly below - 1st book
  { angle: 150, label: "5" },  // Below-right - 2nd book
  { angle: 210, label: "7" },  // Below-left - 3rd book
  { angle: 120, label: "4" },  // Right-lower - 4th book
];

// Desktop shows traditional 12/3/6/9 positions
const DESKTOP_GUIDE_POSITIONS = [
  { angle: 180, label: "6" },  // Below - 1st book
  { angle: 0, label: "12" },   // Above - 2nd book
  { angle: 90, label: "3" },   // Right - 3rd book
  { angle: 270, label: "9" },  // Left - 4th book
];

export function ClockPositionGuides({ 
  bookCount, 
  color, 
  starSize,
  isMobile = false 
}: ClockPositionGuidesProps) {
  const guidePositions = isMobile ? MOBILE_GUIDE_POSITIONS : DESKTOP_GUIDE_POSITIONS;
  
  // Only show guides when there are empty slots (< 4 books)
  if (bookCount >= 4) return null;

  // Radius for guide dots - positioned outside the star ring
  const guideRadius = isMobile ? 28 : 32;
  const dotSize = isMobile ? 4 : 5;

  return (
    <>
      {guidePositions.map((pos, index) => {
        // Don't show dot if this position is already filled
        if (bookCount > index) return null;

        // Calculate position (0° = 12 o'clock, above center)
        const angleRad = (pos.angle * Math.PI) / 180;
        const x = Math.sin(angleRad) * guideRadius;
        const y = -Math.cos(angleRad) * guideRadius;

        return (
          <motion.div
            key={pos.angle}
            className="absolute rounded-full pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.15, 0.3, 0.15], 
              scale: 1 
            }}
            transition={{
              opacity: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.2, // Stagger animation start
              },
              scale: {
                duration: 0.5,
                delay: 0.3 + index * 0.1,
              },
            }}
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}`,
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          />
        );
      })}
    </>
  );
}
