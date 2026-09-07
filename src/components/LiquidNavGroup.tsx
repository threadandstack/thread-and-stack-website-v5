import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

type IconProps = { className?: string };

export type LiquidNavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<IconProps>;
  onClick?: () => void;
};

type Rect = { x: number; y: number; width: number; height: number };

/** Lead droplet: quick, lands with a hint of overshoot */
const LEAD = { type: "spring" as const, stiffness: 520, damping: 30, mass: 0.8 };
/** Middle droplet */
const MID = { type: "spring" as const, stiffness: 170, damping: 26, mass: 1.2 };
/** Tail droplet: slow, so a thick neck of liquid drags behind */
const TRAIL = { type: "spring" as const, stiffness: 70, damping: 20, mass: 1.6 };

const isCurrent = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Navigation links sharing one gooey liquid indicator: a dark blob rests on the
 * current page and pours across to whichever link is hovered, stretching as it
 * travels. Icons still reveal on hover.
 */
export const LiquidNavGroup = ({ items }: { items: readonly LiquidNavItem[] }) => {
  const { pathname } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const base = container.getBoundingClientRect();
    const next: Record<string, Rect> = {};
    for (const item of items) {
      const el = itemRefs.current[item.href];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next[item.href] = {
        x: r.left - base.left,
        y: r.top - base.top,
        width: r.width,
        height: r.height,
      };
    }
    setRects(next);
  }, [items]);

  useLayoutEffect(() => {
    measure();
    // labels grow as the icon reveals, so re-measure through that transition
    const timers = [80, 180, 320].map((ms) => window.setTimeout(measure, ms));
    return () => timers.forEach(window.clearTimeout);
  }, [measure, hovered]);

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

  const activeHref = items.find((i) => isCurrent(pathname, i.href))?.href ?? null;
  const target = hovered ?? activeHref;
  const targetRect = target ? rects[target] : undefined;
  const visible = Boolean(targetRect);

  const blobStyle = (rect: Rect) => ({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    opacity: 1,
  });

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1"
      onMouseLeave={() => setHovered(null)}
    >
      {/* liquid indicator layer, behind the labels */}
      <div className="pointer-events-none absolute inset-0 z-0 [filter:url(#nav-goo)]">
        {targetRect && visible && (
          <>
            <motion.span
              className="absolute left-0 top-0 rounded-full bg-foreground"
              initial={{ opacity: 0 }}
              animate={blobStyle(targetRect)}
              transition={TRAIL}
            />
            <motion.span
              className="absolute left-0 top-0 rounded-full bg-foreground"
              initial={{ opacity: 0 }}
              animate={blobStyle(targetRect)}
              transition={MID}
            />
            <motion.span
              className="absolute left-0 top-0 rounded-full bg-foreground"
              initial={{ opacity: 0 }}
              animate={blobStyle(targetRect)}
              transition={LEAD}
            />
          </>
        )}
      </div>

      {items.map(({ href, label, Icon, onClick }) => {
        const lit = target === href;
        return (
          <a
            key={href}
            href={href}
            ref={(el) => {
              itemRefs.current[href] = el;
            }}
            onClick={onClick}
            onMouseEnter={() => setHovered(href)}
            onFocus={() => setHovered(href)}
            className={`group relative z-10 flex items-center gap-0 rounded-full px-4 py-2 font-sans text-sm not-italic transition-colors duration-200 ${
              lit ? "text-background" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            <span className="flex h-5 w-0 scale-75 items-center justify-center overflow-hidden opacity-0 transition-all duration-300 group-hover:mr-1.5 group-hover:w-5 group-hover:scale-100 group-hover:opacity-100">
              <Icon className="h-4 w-4 shrink-0" />
            </span>
            {label}
          </a>
        );
      })}

      {/* gooey filter so the droplets stretch and merge as they travel */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id="nav-goo">
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
