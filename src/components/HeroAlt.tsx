import { useRef, useEffect, useState } from "react";
import { PillButton } from "@/components/ui/pill-button";
import { ChevronDown, Rocket, Compass } from "lucide-react";
import { trackCtaClick } from "@/hooks/useAnalytics";
import { FocalPointPicker } from "@/components/FocalPointPicker";
import heroImage from "@/assets/hero-heading.webp";
import heroImageMobile from "@/assets/photos/shoreditch/brendan-33.webp";

const DEV_MODE = import.meta.env.DEV;

export const HeroAlt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [focalPickerEnabled, setFocalPickerEnabled] = useState(false);
  const [focalPoint, setFocalPoint] = useState({ x: 72, y: 18 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 50;
      const fadeEnd = 200;
      const opacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      setScrollOpacity(scrollY < fadeStart ? 1 : opacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clients = ["eBay", "Dentsu", "IMMA Collective", "BfB Labs", "Mixergy"];

  return (
    <section className="relative lg:h-[104vh] lg:min-h-[600px] lg:flex lg:items-center">
      {/* Image container with fixed height and clipping */}
      <div className="relative h-[70vh] md:h-[65vh] lg:absolute lg:inset-0 lg:h-full overflow-hidden">
        <img
          src={heroImageMobile}
          alt="Brendan — Thread & Stack founder"
          className="absolute inset-0 w-full h-full object-cover lg:hidden"
          style={{ objectPosition: `44% 42%` }}
        />
        <img
          src={heroImage}
          alt="Brendan — Thread & Stack founder"
          className="absolute inset-0 w-full h-full object-cover hidden lg:block"
          style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Dev-only focal point picker */}
      {DEV_MODE && (
        <FocalPointPicker
          enabled={focalPickerEnabled}
          onToggle={() => setFocalPickerEnabled(!focalPickerEnabled)}
          focalPoint={focalPoint}
          onFocalPointChange={setFocalPoint}
        />
      )}

      {/* Content card floating on top — overlaps image bottom on mobile */}
      <div className="relative -mt-24 md:-mt-32 lg:mt-0 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-8 lg:pb-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-0 lg:right-0">
        <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 max-w-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          {/* Credibility chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-sans font-medium text-accent tracking-wide uppercase">
              Taking on new clients
            </span>
          </div>

          <h1 className="font-serif-pro text-4xl md:text-5xl lg:text-6xl font-semibold italic leading-[1.1] tracking-tight mb-6">
            Stories that{" "}
            <span className="relative inline-block text-accent">
              land
            </span>
            .
            <br />
            Systems that{" "}
            <span className="text-accent">stick</span>.
          </h1>

          <div ref={ref}>
            <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              I help purpose-led founders turn messy marketing into{" "}
              <span className="text-foreground font-medium">clear narratives</span> and{" "}
              <span className="text-foreground font-medium">practical workflows</span>{" "}
              they can actually sustain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <PillButton size="lg" icon={Rocket} className="font-semibold" asChild>
              <a href="#contact" onClick={() => trackCtaClick('Book an Intro Call', 'hero-alt')}>
                Book an Intro Call
              </a>
            </PillButton>

            <PillButton size="lg" variant="outline" icon={Compass} asChild>
              <a href="/how-i-work" onClick={() => trackCtaClick('How I Work', 'hero-alt')}>
                How I Work
              </a>
            </PillButton>
          </div>

          {/* Social proof strip */}
          <div
            className={`pt-4 border-t border-border/50 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
          >
            <p className="text-xs font-sans text-muted-foreground/60 uppercase tracking-wider mb-2">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {clients.map((client) => (
                <span
                  key={client}
                  className="text-sm font-sans font-medium text-muted-foreground/50"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-300"
        style={{ opacity: scrollOpacity }}
      >
        <ChevronDown className="w-6 h-6 text-accent animate-bounce" strokeWidth={2} />
      </div>
    </section>
  );
};
