import { useRef, useState, useEffect } from "react";
import { Plus } from "lucide-react";
import lightAsset from "@/assets/notion-mock/light.png.asset.json";
import darkAsset from "@/assets/notion-mock/dark.png.asset.json";

export interface Hotspot {
  id: string;
  /** Pin position on the base image, percentages (0–100) from top-left. */
  x: number;
  y: number;
  label: string;
  /** Optional overlay screenshot revealed on hover (CDN URL). */
  overlaySrc?: string;
  /** Overlay top-left position on the mock, percentages (0–100). */
  overlayX?: number;
  overlayY?: number;
  /** Overlay width as a percentage of the mock width. */
  overlayWidth?: number;
}

interface Props {
  theme: "dark" | "light";
  className?: string;
  hotspots?: Hotspot[];
}

/**
 * Inverted Notion workspace mock.
 * - In light app theme, shows the DARK workspace (contrast).
 * - In dark app theme, shows the LIGHT workspace.
 * Interactions: subtle 3D parallax tilt on mouse-move + soft cursor-tracked
 * highlight. Optional hotspots reveal overlay screenshots that inherit the
 * same 3D transform. Disabled for touch + prefers-reduced-motion.
 */
export function NotionWorkspaceMock({ theme, className = "", hotspots = [] }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Light app theme → dark workspace image (and vice versa).
  const src = theme === "dark" ? lightAsset.url : darkAsset.url;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    setInteractive(!reduced && !touch);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const el = wrapRef.current;
    const inner = innerRef.current;
    const glow = glowRef.current;
    if (!el || !inner) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1
    const py = (e.clientY - rect.top) / rect.height;   // 0..1
    const rx = (0.5 - py) * 6;   // tilt up/down deg
    const ry = (px - 0.5) * 8;   // tilt left/right deg
    inner.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (glow) {
      glow.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, hsl(var(--accent) / 0.18), transparent 60%)`;
      glow.style.opacity = "1";
    }
  };

  const onLeave = () => {
    const inner = innerRef.current;
    const glow = glowRef.current;
    if (inner) inner.style.transform = "perspective(1400px) rotateX(0) rotateY(0)";
    if (glow) glow.style.opacity = "0";
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative mx-auto w-full max-w-5xl ${className}`}
      style={{ perspective: "1400px" }}
    >
      {/* soft ambient shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 bottom-0 h-24 translate-y-6 rounded-[40px] blur-2xl"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(0,0,0,0.28), transparent 70%)" }}
      />

      <div
        ref={innerRef}
        className="relative rounded-2xl will-change-transform transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        <img
          src={src}
          alt="A Notion workspace built by Thread & Stack — central hub for policies, onboarding, and team knowledge."
          loading="eager"
          className="block w-full rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/5"
          draggable={false}
        />

        {/* cursor-tracked highlight */}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 mix-blend-soft-light"
        />

        {/* subtle gloss */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        {/* Overlay screenshots (inherit 3D tilt because they live inside innerRef) */}
        {hotspots.map((h) => {
          const isActive = activeHotspot === h.id;
          if (!h.overlaySrc) return null;
          return (
            <div
              key={`overlay-${h.id}`}
              aria-hidden
              className="pointer-events-none absolute rounded-xl overflow-hidden ring-1 ring-black/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] transition-all duration-500 ease-out"
              style={{
                top: `${h.overlayY ?? 10}%`,
                left: `${h.overlayX ?? 10}%`,
                width: `${h.overlayWidth ?? 50}%`,
                opacity: isActive ? 0.92 : 0,
                transform: `translateZ(60px) translateY(${isActive ? "0" : "8px"}) scale(${isActive ? 1 : 0.98})`,
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={h.overlaySrc}
                alt=""
                className="block w-full"
                draggable={false}
              />
            </div>
          );
        })}

        {/* Hotspot pins (also inside innerRef → inherit the tilt) */}
        {hotspots.map((h) => {
          const isActive = activeHotspot === h.id;
          return (
            <button
              key={`pin-${h.id}`}
              type="button"
              onMouseEnter={() => setActiveHotspot(h.id)}
              onMouseLeave={() => setActiveHotspot((c) => (c === h.id ? null : c))}
              onFocus={() => setActiveHotspot(h.id)}
              onBlur={() => setActiveHotspot((c) => (c === h.id ? null : c))}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${h.y}%`,
                left: `${h.x}%`,
                transform: `translate3d(-50%, -50%, 70px)`,
                transformStyle: "preserve-3d",
              }}
              aria-label={`Reveal ${h.label}`}
            >
              {/* ping ring */}
              <span
                aria-hidden
                className="absolute inset-0 -m-1 animate-ping rounded-full opacity-60"
                style={{ background: "hsl(var(--accent) / 0.45)" }}
              />
              {/* core dot */}
              <span
                className="relative grid h-7 w-7 place-items-center rounded-full border border-white/40 text-white shadow-[0_6px_16px_-4px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent) / 0.7))",
                }}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              {/* label chip */}
              <span
                className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-hairline bg-paper/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-md backdrop-blur transition-all duration-200 ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                }`}
              >
                {h.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
