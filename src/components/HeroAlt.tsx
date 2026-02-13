import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";
import { trackCtaClick } from "@/hooks/useAnalytics";
import { FocalPointPicker } from "@/components/FocalPointPicker";
import heroImage from "@/assets/hero-heading.png";
import heroImageMobile from "@/assets/photos/shoreditch/brendan-33.jpg";

const DEV_MODE = import.meta.env.DEV;

export const HeroAlt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showUnderline, setShowUnderline] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [focalPickerEnabled, setFocalPickerEnabled] = useState(false);
  const [focalPoint, setFocalPoint] = useState({ x: 72, y: 18 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowUnderline(true), 600);
    return () => clearTimeout(timer);
  }, []);

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
    <section className="relative flex items-end lg:items-center mb-24 md:mb-28 lg:mb-0">
      {/* Image container with fixed height and clipping */}
      <div className="absolute inset-0 h-[92vh] md:h-[82vh] lg:h-[104vh] min-h-[400px] overflow-hidden">
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

      {/* Spacer to push content to bottom of image area */}
      <div className="h-[92vh] md:h-[82vh] lg:h-[104vh] min-h-[400px] w-full" />

      {/* Dev-only focal point picker */}
      {DEV_MODE && (
        <FocalPointPicker
          enabled={focalPickerEnabled}
          onToggle={() => setFocalPickerEnabled(!focalPickerEnabled)}
          focalPoint={focalPoint}
          onFocalPointChange={setFocalPoint}
        />
      )}

      {/* Content card floating on top */}
      <div className="absolute bottom-0 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto w-full max-w-6xl mx-auto left-0 right-0 px-4 sm:px-6 translate-y-[30%] lg:translate-y-[-50%]">
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
              {showUnderline && (
                <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0} animate={true} />
              )}
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
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-base px-7 group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] not-italic font-sans font-semibold"
              asChild
            >
              <a href="#contact" onClick={() => trackCtaClick('Book an Intro Call', 'hero-alt')}>
                Book an Intro Call
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-base px-7 rounded-xl hover:bg-foreground hover:text-background not-italic shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-sans"
              asChild
            >
              <a href="/how-i-work" onClick={() => trackCtaClick('How I Work', 'hero-alt')}>
                How I Work
              </a>
            </Button>
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
