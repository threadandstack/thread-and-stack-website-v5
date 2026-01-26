import { motion, AnimatePresence } from "framer-motion";

interface AddedCountBadgeProps {
  count: number;
  show: boolean;
}

export function AddedCountBadge({ count, show }: AddedCountBadgeProps) {
  return (
    <AnimatePresence>
      {show && count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="absolute top-2 right-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg z-50"
        >
          +{count} added
        </motion.div>
      )}
    </AnimatePresence>
  );
}
