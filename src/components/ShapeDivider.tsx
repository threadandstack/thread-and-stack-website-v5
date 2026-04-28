/**
 * Fluid SVG "wave" dividers used to soften transitions between page sections.
 *
 * Place inside a `relative overflow-hidden` section. The divider paints the
 * NEIGHBOURING section's colour as a wave on top of the current section.
 *
 * Example — an indigo section sitting between two background-coloured sections:
 *   <section className="relative bg-indigo overflow-hidden">
 *     <ShapeDivider position="top" fillClassName="fill-background" />
 *     ...content...
 *     <ShapeDivider position="bottom" fillClassName="fill-background" />
 *   </section>
 */
type ShapeDividerProps = {
  position: "top" | "bottom";
  /** Tailwind class that sets the SVG fill, e.g. "fill-background" */
  fillClassName: string;
  /** Height of the wave in pixels (defaults responsive) */
  className?: string;
};

export const ShapeDivider = ({
  position,
  fillClassName,
  className = "",
}: ShapeDividerProps) => {
  const isTop = position === "top";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${
        isTop ? "top-0" : "bottom-0"
      } leading-[0] z-10 ${className}`}
      style={{ transform: isTop ? "none" : "rotate(180deg)" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block w-full h-[60px] md:h-[90px] lg:h-[110px]"
      >
        <path
          className={fillClassName}
          d="M0,64 C180,112 360,16 540,40 C720,64 900,112 1080,96 C1260,80 1380,48 1440,32 L1440,0 L0,0 Z"
        />
      </svg>
    </div>
  );
};
