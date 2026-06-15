import logoWhite from "@/assets/logos/White_TS_Stacked.svg";
import logoBlack from "@/assets/logos/Black_TS_Stacked.svg";
import logoIndigo from "@/assets/logos/Indigo_TS_Stacked.svg";

interface LogoTiltProps {
  className?: string;
  theme?: "dark" | "light";
  /** Optional override for the base logo (dark theme version). */
  darkSrc?: string;
  /** Optional override for the base logo (light theme version). */
  lightSrc?: string;
  /** Optional override for the indigo overlay. If omitted with custom srcs, an indigo mask of the base is used. */
  indigoSrc?: string;
  alt?: string;
  /** When true, the 3D rotation is driven by parent CSS vars (--g-tx, --g-ty) instead of local mouse. */
  groupTilt?: boolean;
}

export function LogoTilt({
  className = "h-32 sm:h-44 md:h-56",
  theme = "dark",
  darkSrc,
  lightSrc,
  indigoSrc,
  alt = "Thread & Stack",
}: LogoTiltProps) {
  const isCustom = !!(darkSrc || lightSrc);
  const logoBase = theme === "light"
    ? (lightSrc ?? logoBlack)
    : (darkSrc ?? logoWhite);
  const indigoOverlay = indigoSrc ?? (isCustom ? logoBase : logoIndigo);
  const useMaskOverlay = isCustom && !indigoSrc;
  return (
    <div
      className="relative group cursor-pointer [perspective:800px]"
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        const tx = (x - 50) / 6;
        const ty = (50 - y) / 6;
        const sx = (50 - x) / 4;
        const sy = (50 - y) / 4;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
        el.style.setProperty("--tx", `${tx}deg`);
        el.style.setProperty("--ty", `${ty}deg`);
        el.style.setProperty("--sx", `${sx}px`);
        el.style.setProperty("--sy", `${sy}px`);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.setProperty("--tx", `0deg`);
        el.style.setProperty("--ty", `0deg`);
        el.style.setProperty("--sx", `0px`);
        el.style.setProperty("--sy", `0px`);
      }}
      style={{
        ["--mx" as never]: "50%",
        ["--my" as never]: "50%",
        ["--tx" as never]: "0deg",
        ["--ty" as never]: "0deg",
        ["--sx" as never]: "0px",
        ["--sy" as never]: "0px",
      }}
    >
      <div
        className="relative transition-transform duration-200 ease-out [transform-style:preserve-3d]"
        style={{ transform: "rotateX(var(--ty)) rotateY(var(--tx))" }}
      >
        <img
          src={logoBase}
          alt={alt}
          className={`relative w-auto transition-[filter] duration-200 ${className}`}
          style={{
            filter: theme === "dark"
              ? "drop-shadow(calc(var(--sx) * -1) calc(var(--sy) * -1) 10px rgba(0,0,0,0.18)) drop-shadow(var(--sx) var(--sy) 6px rgba(0,0,0,0.22))"
              : "none",
          }}
        />
        {useMaskOverlay ? (
          <div
            aria-hidden="true"
            className={`absolute inset-0 w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${className}`}
            style={{
              backgroundColor: "hsl(var(--indigo))",
              WebkitMaskImage: `url(${logoBase}), radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)`,
              maskImage: `url(${logoBase}), radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)`,
              WebkitMaskRepeat: "no-repeat, no-repeat",
              maskRepeat: "no-repeat, no-repeat",
              WebkitMaskSize: "contain, 100% 100%",
              maskSize: "contain, 100% 100%",
              WebkitMaskPosition: "center, center",
              maskPosition: "center, center",
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
            }}
          />
        ) : (
          <img
            src={indigoOverlay}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${className}`}
            style={{
              WebkitMaskImage:
                "radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)",
              maskImage:
                "radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)",
            }}
          />
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl"
          style={{
            background:
              "radial-gradient(circle 90px at var(--mx) var(--my), hsl(var(--indigo) / 0.55), transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
