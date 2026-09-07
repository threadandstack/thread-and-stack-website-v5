import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type IconProps = { className?: string };

export type FilterOption = {
  key: string;
  label: string;
  Icon?: React.ComponentType<IconProps> | null;
};

type Rect = { x: number; y: number; width: number; height: number };

/** Lead droplet: quick, lands with a hint of overshoot */
const LEAD = { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.9 };
/** Middle droplet */
const MID = { type: "spring" as const, stiffness: 260, damping: 30, mass: 1 };
/** Tail droplet: slower, so a neck of liquid drags behind (but stays connected) */
const TRAIL = { type: "spring" as const, stiffness: 170, damping: 28, mass: 1.1 };

/**
 * Journal category picker with a gooey liquid indicator: a droplet flows
 * between pills on hover (warm gradient), stretching as it travels, and the
 * chosen pill stays filled with a solid dark blob.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const base = container.getBoundingClientRect();
    const next: Record<string, Rect> = {};
    for (const option of options) {
      const el = pillRefs.current[option.key];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next[option.key] = {
        x: r.left - base.left,
        y: r.top - base.top,
        width: r.width,
        height: r.height,
      };
    }
    setRects(next);
  }, [options]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const activeRect = rects[active as string];
  const hoverRect = hovered ? rects[hovered] : undefined;

  const blobStyle = (rect: Rect) => ({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    opacity: 1,
  });

  const startStyle = (rect: Rect) => ({ ...blobStyle(rect), opacity: 0.9 });

  return (
    <div
      ref={containerRef}
      className="relative mb-12 flex flex-wrap justify-center gap-2"
      onMouseLeave={() => setHovered(null)}
    >
      {/* resting pill surfaces, below the liquid layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {options.map((f) => {
          const rect = rects[f.key];
          if (!rect) return null;
          return (
            <span
              key={`rest-${f.key}`}
              className="absolute left-0 top-0 rounded-full bg-muted"
              style={{
                transform: `translate(${rect.x}px, ${rect.y}px)`,
                width: rect.width,
                height: rect.height,
              }}
            />
          );
        })}
      </div>

      {/* gooey indicator layer sits above the resting pills, below the labels */}
      <div className="pointer-events-none absolute inset-0 z-10 [filter:url(#pill-goo)]">
        {/* resting ink on the chosen pill: never travels back, just sits */}
        {activeRect && (
          <motion.span
            className="absolute left-0 top-0 rounded-full bg-foreground"
            initial={false}
            animate={blobStyle(activeRect)}
            transition={LEAD}
          />
        )}

        {/* travelling ink: pours out of the chosen pill, fades where it lands */}
        <AnimatePresence>
          {hoverRect && hovered !== (active as string) && (
            <motion.span
              key="traveller"
              className="absolute left-0 top-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
            >
              {[TRAIL, MID, LEAD].map((spring, i) => (
                <motion.span
                  key={i}
                  className="absolute left-0 top-0 rounded-full bg-foreground"
                  initial={startStyle(activeRect ?? hoverRect)}
                  animate={blobStyle(hoverRect)}
                  transition={spring}
                />
              ))}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {options.map((f) => {
          const rect = rects[f.key];
          if (!rect) return null;
          return (
            <span
              key={`rest-${f.key}`}
              className="absolute left-0 top-0 rounded-full bg-muted"
              style={{
                transform: `translate(${rect.x}px, ${rect.y}px)`,
                width: rect.width,
                height: rect.height,
              }}
            />
          );
        })}
      </div>

      {/* gooey indicator layer sits above the resting pills, below the labels */}
      <div className="pointer-events-none absolute inset-0 z-10 [filter:url(#pill-goo)]">
        {activeRect && (
          <motion.span
            className="absolute left-0 top-0 rounded-full bg-foreground"
            initial={false}
            animate={blobStyle(activeRect)}
            transition={SETTLE}
          />
        )}
        {targetRect && (
          <>
            <motion.span
              className="absolute left-0 top-0 rounded-full bg-foreground"
              initial={false}
              animate={blobStyle(targetRect)}
              transition={TRAIL}
            />
            <motion.span
              className="absolute left-0 top-0 rounded-full bg-foreground"
              initial={false}
              animate={blobStyle(targetRect)}
              transition={MID}
            />
            <motion.span
              className="absolute left-0 top-0 rounded-full bg-foreground"
              initial={false}
              animate={blobStyle(targetRect)}
              transition={LEAD}
            />
          </>
        )}
      </div>

      {options.map((f) => {
        const isActive = active === f.key;
        const isLit = isActive || hovered === f.key;

        return (
          <button
            key={f.key}
            ref={(el) => {
              pillRefs.current[f.key] = el;
            }}
            type="button"
            onClick={() => onSelect(f.key as T)}
            onMouseEnter={() => setHovered(f.key)}
            onFocus={() => setHovered(f.key)}
            aria-pressed={isActive}
            className="relative z-20 flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          >
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

      {/* gooey filter so the droplets stretch and merge as they travel */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id="pill-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12"
              result="goo"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
