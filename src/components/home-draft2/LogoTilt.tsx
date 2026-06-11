import { useEffect, useRef } from "react";
import logoWhite from "@/assets/logos/White_TS_Stacked.svg";
import logoBlack from "@/assets/logos/Black_TS_Stacked.svg";
import logoIndigo from "@/assets/logos/Indigo_TS_Stacked.svg";

interface LogoTiltProps {
  className?: string;
  theme?: "dark" | "light";
}

export function LogoTilt({ className = "h-32 sm:h-44 md:h-56", theme = "dark" }: LogoTiltProps) {
  const logoBase = theme === "light" ? logoBlack : logoWhite;
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Mobile: scroll-driven shrink-and-dock toward the floating nav logo position.
  // No sticky pinning (it conflicts with the fixed nav). No indigo glow on mobile.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let attached = false;
    let startCenterX = 0;
    let startTopAbs = 0;
    let startWidth = 0;
    let startHeight = 0;

    // Floating nav: outer px-6 py-3, inner pill px-4 py-2, logo h-8.
    // Logo top-left lives around (40, 20) on mobile.
    const NAV_LOGO_LEFT = 40;
    const NAV_LOGO_TOP = 20;
    const NAV_LOGO_HEIGHT = 32;
    const RANGE = 280; // px of scroll over which the dock animation completes

    const easeInOut = (p: number) =>
      p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

    const measure = () => {
      const prev = root.style.transform;
      root.style.transform = "";
      const r = root.getBoundingClientRect();
      startCenterX = r.left + r.width / 2;
      startTopAbs = r.top + window.scrollY;
      startWidth = r.width || 1;
      startHeight = r.height || 1;
      root.style.transform = prev;
    };

    const update = () => {
      raf = 0;
      const sy = window.scrollY;
      const rawP = Math.min(Math.max(sy / RANGE, 0), 1);
      const e = easeInOut(rawP);

      const targetScale = NAV_LOGO_HEIGHT / startHeight;
      const scale = 1 + (targetScale - 1) * e;

      // Freeze the dock target once the animation completes, so we don't keep
      // tracking scroll forever (would otherwise escape the hero's clipped box).
      const trackScroll = Math.min(sy, RANGE);
      const naturalLeft = startCenterX - startWidth / 2;
      const naturalTop = startTopAbs - trackScroll;
      const dx = (NAV_LOGO_LEFT - naturalLeft) * e;
      const dy = (NAV_LOGO_TOP - naturalTop) * e;

      // Fade out near the end so the floating nav logo carries the brand.
      const op = rawP < 0.7 ? 1 : Math.max(0, 1 - (rawP - 0.7) / 0.3);

      root.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
      root.style.opacity = String(op);
      root.style.pointerEvents = rawP > 0.5 ? "none" : "";
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      root.style.transform = "";
      root.style.opacity = "";
      measure();
      onScroll();
    };

    const attach = () => {
      if (attached) return;
      attached = true;
      root.style.transformOrigin = "top left";
      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      update();
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      root.style.transform = "";
      root.style.opacity = "";
      root.style.transformOrigin = "";
      root.style.pointerEvents = "";
    };

    const apply = () => {
      if (mqMobile.matches && !mqReduce.matches) attach();
      else detach();
    };

    apply();
    mqMobile.addEventListener("change", apply);
    mqReduce.addEventListener("change", apply);

    return () => {
      mqMobile.removeEventListener("change", apply);
      mqReduce.removeEventListener("change", apply);
      detach();
    };
  }, []);



  return (
    <div
      ref={rootRef}
      className="relative group [perspective:800px] will-change-transform md:cursor-pointer"
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
        ref={innerRef}
        className="relative transition-transform duration-200 ease-out [transform-style:preserve-3d]"
        style={{ transform: "rotateX(var(--ty)) rotateY(var(--tx))" }}
      >
        <img
          src={logoBase}
          alt="Thread & Stack"
          className={`relative w-auto transition-[filter] duration-200 ${className}`}
          style={{
            filter:
              "drop-shadow(calc(var(--sx) * -1) calc(var(--sy) * -1) 10px rgba(0,0,0,0.18)) drop-shadow(var(--sx) var(--sy) 6px rgba(0,0,0,0.22))",
          }}
        />
        {/* Indigo glow + reveal: desktop only (hover-driven). Hidden on mobile. */}
        <img
          src={logoIndigo}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-auto opacity-0 transition-opacity duration-200 pointer-events-none hidden md:block md:group-hover:opacity-100 ${className}`}
          style={{
            WebkitMaskImage:
              "radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)",
            maskImage:
              "radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none blur-xl hidden md:block md:group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle 90px at var(--mx) var(--my), hsl(var(--indigo) / 0.55), transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
