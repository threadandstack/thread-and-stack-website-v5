import { ReactNode, CSSProperties } from "react";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /** Max rotateY in degrees (horizontal). Default 8. */
  maxX?: number;
  /** Max rotateX in degrees (vertical). Default 6. */
  maxY?: number;
  style?: CSSProperties;
}

/**
 * Wraps children in a perspective container that tilts in 3D
 * following the mouse, matching the home-draft2 Hero interaction.
 */
export function Tilt3D({
  children,
  className = "",
  maxX = 8,
  maxY = 6,
  style,
}: Tilt3DProps) {
  return (
    <div
      className={className}
      style={{
        perspective: "1400px",
        ["--g-tx" as never]: "0deg",
        ["--g-ty" as never]: "0deg",
        ...style,
      }}
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const tx = (px - 0.5) * 2 * maxX;
        const ty = (0.5 - py) * 2 * maxY;
        el.style.setProperty("--g-tx", `${tx}deg`);
        el.style.setProperty("--g-ty", `${ty}deg`);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.setProperty("--g-tx", `0deg`);
        el.style.setProperty("--g-ty", `0deg`);
      }}
    >
      <div
        className="h-full w-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{
          transform:
            "rotateX(var(--g-ty, 0deg)) rotateY(var(--g-tx, 0deg))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
