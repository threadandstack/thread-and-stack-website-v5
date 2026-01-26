import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export function BookLoadingIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <motion.div
      animate={{ 
        rotateY: [0, 180, 360],
      }}
      transition={{ 
        duration: 1.2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <BookOpen className={className} />
    </motion.div>
  );
}
