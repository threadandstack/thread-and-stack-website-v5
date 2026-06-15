import { useRef, useState, useEffect } from "react";
import lightAsset from "@/assets/notion-mock/light.png.asset.json";
import darkAsset from "@/assets/notion-mock/dark.png.asset.json";

interface Props {
  theme: "dark" | "light";
  className?: string;
}

/**
 * Inverted Notion workspace mock.
 * - In light app theme, shows the DARK workspace (contrast).
 * - In dark app theme, shows the LIGHT workspace.
 * Interactions: subtle 3D parallax tilt on mouse-move + soft cursor-tracked
 * highlight. Both disabled for touch + prefers-reduced-motion.
 */
export function NotionWorkspaceMock({ theme, className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);

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
      </div>
    </div>
  );
}
