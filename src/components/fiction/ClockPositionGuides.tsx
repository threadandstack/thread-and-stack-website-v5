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

// Clock positions in degrees (0° = 12 o'clock, clockwise)
// Shows guides for 12, 3, 6, 9 positions
const MAIN_CLOCK_ANGLES = [0, 90, 180, 270]; // 12, 3, 6, 9 o'clock

// Map from angle to which position index fills it (based on CLOCK_POSITIONS order)
// CLOCK_POSITIONS = [180, 0, 90, 270, ...] => 6 is idx 0, 12 is idx 1, 3 is idx 2, 9 is idx 3
const ANGLE_TO_FILL_INDEX: Record<number, number> = {
  180: 0, // 6 o'clock - filled by 1st book
  0: 1,   // 12 o'clock - filled by 2nd book
  90: 2,  // 3 o'clock - filled by 3rd book
  270: 3, // 9 o'clock - filled by 4th book
};

export function ClockPositionGuides({ 
  bookCount, 
  color, 
  starSize,
  isMobile = false 
}: ClockPositionGuidesProps) {
  // Only show guides when there are empty main slots (< 4 books)
  if (bookCount >= 4) return null;

  // Radius for guide dots - positioned outside the star ring
  const guideRadius = isMobile ? 28 : 32;
  const dotSize = isMobile ? 4 : 5;

  return (
    <>
      {MAIN_CLOCK_ANGLES.map((angle) => {
        const fillIndex = ANGLE_TO_FILL_INDEX[angle];
        const isFilled = bookCount > fillIndex;
        
        // Don't show dot if position is filled
        if (isFilled) return null;

        // Calculate position (0° = 12 o'clock, above center)
        const angleRad = (angle * Math.PI) / 180;
        const x = Math.sin(angleRad) * guideRadius;
        const y = -Math.cos(angleRad) * guideRadius;

        return (
          <motion.div
            key={angle}
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
                delay: angle / 360, // Stagger animation start
              },
              scale: {
                duration: 0.5,
                delay: 0.3 + (angle / 360) * 0.5,
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
