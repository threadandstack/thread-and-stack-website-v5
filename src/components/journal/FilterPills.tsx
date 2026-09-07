import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

type IconProps = { className?: string };

export type FilterOption = {
  key: string;
  label: string;
  Icon?: ((props: IconProps) => JSX.Element) | null;
};

/** Liquid spring: overshoots slightly so the blob feels like it pours across */
const FLUID = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.9 };

/**
 * Journal category picker. A single dark blob travels between pills on hover
 * and settles/fills the pill that is selected, with a soft ripple on click.
 */
export const FilterPills = <T extends string>({
  options,
  active,
  onSelect,
}: {
  options: readonly FilterOption[];
  active: T;
  onSelect: (key: T) => void;
}) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const lit = hovered ?? active;

  return (
    <LayoutGroup id="journal-filters">
      <div
        className="mb-12 flex flex-wrap justify-center gap-2 [filter:url(#pill-goo)]"
        onMouseLeave={() => setHovered(null)}
      >
        {options.map((f) => {
          const isActive = active === f.key;
          const isLit = lit === f.key;

          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onSelect(f.key as T)}
              onMouseEnter={() => setHovered(f.key)}
              onFocus={() => setHovered(f.key)}
              aria-pressed={isActive}
              className="relative isolate flex items-center gap-2 rounded-full px-4 py-2 text-sm"
            >
              {/* resting surface */}
              <span className="absolute inset-0 -z-20 rounded-full bg-muted" />

              {/* the travelling blob */}
              {isLit && (
                <motion.span
                  layoutId="filter-blob"
                  transition={FLUID}
                  className={`absolute inset-0 -z-10 rounded-full bg-foreground ${
                    isActive ? "" : "opacity-70"
                  }`}
                />
              )}

              {/* fill ripple when a pill is chosen */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    key={`ripple-${f.key}`}
                    initial={{ scale: 0.4, opacity: 0.45 }}
                    animate={{ scale: 1.35, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-foreground"
                  />
                )}
              </AnimatePresence>

              <span
                className={`relative flex items-center gap-2 transition-colors duration-200 ${
                  isLit ? "text-background" : "text-muted-foreground"
                }`}
              >
                {f.Icon && <f.Icon className="h-4 w-4" />}
                {f.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* gooey filter so the blob stretches and merges as it travels */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id="pill-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </LayoutGroup>
  );
};
