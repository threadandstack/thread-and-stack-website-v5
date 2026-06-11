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
  const touchActiveRef = useRef(false);

  // Mobile: scroll-linked tilt + sticky follow within the hero section.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let attached = false;
    let section: HTMLElement | null = null;

    const setVars = (tx: number, ty: number, mx: number, my: number) => {
      if (touchActiveRef.current) return; // touch drag wins
      const sx = (50 - mx) / 4;
      const sy = (50 - my) / 4;
      el.style.setProperty("--mx", `${mx}%`);
      el.style.setProperty("--my", `${my}%`);
      el.style.setProperty("--tx", `${tx}deg`);
      el.style.setProperty("--ty", `${ty}deg`);
      el.style.setProperty("--sx", `${sx}px`);
      el.style.setProperty("--sy", `${sy}px`);
    };

    const update = () => {
      raf = 0;
      if (!section) return;
      const sectionRect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const logoH = el.offsetHeight;
      const topOffset = 72; // distance from viewport top while pinned

      // Follow scroll: translate the logo down as the section scrolls up,
      // keeping it pinned near the top until the section's natural bottom
      // would force it to release.
      const naturalTop = sectionRect.top; // top of section vs viewport
      // How far we'd need to translate the logo so that its top sits at topOffset
      const desired = -naturalTop + topOffset - getInitialOffsetTop();
      // Clamp so it never moves above its original position…
      const minTranslate = 0;
      // …and never escapes the bottom of the section.
      const maxTranslate = Math.max(
        0,
        sectionRect.height - logoH - topOffset - getInitialOffsetTop() - 16
      );
      const translate = Math.min(Math.max(desired, minTranslate), maxTranslate);
      el.style.transform = `translateY(${translate}px)`;

      // Progress 0 → 1 across the hero section.
      const total = Math.max(1, sectionRect.height - vh);
      const scrolled = Math.min(Math.max(-sectionRect.top, 0), total);
      const p = scrolled / total; // 0 at top, 1 at end

      // Map progress to a gentle sweeping tilt + glow position.
      const tx = (p - 0.5) * 16; // ±8°
      const ty = Math.sin(p * Math.PI) * 6; // 0 → +6 → 0
      const mx = 20 + p * 60; // 20% → 80%
      const my = 80 - p * 60; // 80% → 20%
      setVars(tx, ty, mx, my);
    };

    let cachedInitialTop: number | null = null;
    const getInitialOffsetTop = () => {
      if (cachedInitialTop != null) return cachedInitialTop;
      // Distance from section top to the logo's natural top.
      if (!section) return 0;
      const elTop = el.getBoundingClientRect().top - el.style.transform.length * 0; // ignore current transform
      const secTop = section.getBoundingClientRect().top;
      cachedInitialTop = Math.max(0, elTop - secTop - getCurrentTranslate());
      return cachedInitialTop;
    };
    const getCurrentTranslate = () => {
      const m = el.style.transform.match(/translateY\(([-\d.]+)px\)/);
      return m ? parseFloat(m[1]) : 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      cachedInitialTop = null;
      onScroll();
    };

    const reset = () => {
      el.style.transform = "";
      el.style.setProperty("--tx", "0deg");
      el.style.setProperty("--ty", "0deg");
      el.style.setProperty("--sx", "0px");
      el.style.setProperty("--sy", "0px");
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    };

    const attach = () => {
      if (attached) return;
      section = el.closest("section");
      if (!section) return;
      cachedInitialTop = null;
      attached = true;
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
      reset();
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
      className="relative group cursor-pointer [perspective:800px] transition-transform duration-200 ease-out will-change-transform"
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
      onTouchStart={() => {
        touchActiveRef.current = true;
      }}
      onTouchMove={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        const t = e.touches[0];
        if (!t) return;
        const r = el.getBoundingClientRect();
        const x = ((t.clientX - r.left) / r.width) * 100;
        const y = ((t.clientY - r.top) / r.height) * 100;
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
      onTouchEnd={() => {
        // Release back to scroll-driven values on next frame.
        setTimeout(() => {
          touchActiveRef.current = false;
          window.dispatchEvent(new Event("scroll"));
        }, 80);
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
          alt="Thread & Stack"
          className={`relative w-auto transition-[filter] duration-200 ${className}`}
          style={{
            filter:
              "drop-shadow(calc(var(--sx) * -1) calc(var(--sy) * -1) 10px rgba(0,0,0,0.18)) drop-shadow(var(--sx) var(--sy) 6px rgba(0,0,0,0.22))",
          }}
        />
        <img
          src={logoIndigo}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-auto opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 max-md:opacity-100 transition-opacity duration-200 pointer-events-none ${className}`}
          style={{
            WebkitMaskImage:
              "radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)",
            maskImage:
              "radial-gradient(circle 70px at var(--mx) var(--my), rgba(0,0,0,0.95), rgba(0,0,0,0) 75%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 max-md:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl"
          style={{
            background:
              "radial-gradient(circle 90px at var(--mx) var(--my), hsl(var(--indigo) / 0.55), transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
