import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";
import { trackCtaClick } from "@/hooks/useAnalytics";
import heroImage from "@/assets/photos/shoreditch/brendan-34.jpg";
import notionAdmin from "@/assets/notion-certified-admin.png";
import notionAdvanced from "@/assets/notion-advanced.png";
import notionWorkflows from "@/assets/notion-workflows.png";
import notionEssentials from "@/assets/notion-essentials.png";

export const HeroAlt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showUnderline, setShowUnderline] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
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

  const clients = ["eBay", "Dentsu", "Funraisin", "Mixergy"];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden px-6 py-20 md:py-24">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8 max-w-xl">
            {/* Credibility chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-sans font-medium text-accent tracking-wide uppercase">
                Taking on new clients
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif-pro text-4xl md:text-5xl lg:text-6xl font-semibold italic leading-[1.1] tracking-tight">
                Stories that{" "}
                <span className="relative inline-block text-accent">
                  land
                  {showUnderline && (
                    <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0} animate={true} />
                  )}
                </span>
                .
                <br className="md:hidden" />
                Systems that{" "}
                <span className="text-accent">stick</span>.
              </h1>
            </div>

            <div ref={ref} className="space-y-4">
              <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                I help purpose-led founders turn messy marketing into{" "}
                <span className="text-foreground font-medium">clear narratives</span> and{" "}
                <span className="text-foreground font-medium">practical workflows</span>{" "}
                they can actually sustain.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
              className={`pt-6 border-t border-border/50 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
            >
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs font-sans text-muted-foreground/60 uppercase tracking-wider mb-3">
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
                <div className="hidden sm:flex items-center gap-1.5 border-l border-border/50 pl-6">
                  {[notionAdmin, notionAdvanced, notionWorkflows, notionEssentials].map((badge, i) => (
                    <img
                      key={i}
                      src={badge}
                      alt="Notion certification badge"
                      className="w-8 h-auto opacity-70 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Photo */}
          <div className="relative hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] aspect-[4/5]">
              <img
                src={heroImage}
                alt="Brendan — Thread & Stack founder"
                className="w-full h-full object-cover object-top"
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
            </div>

            {/* Floating testimonial card */}
            <div
              className={`absolute -bottom-4 -left-8 bg-card rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border/50 p-4 max-w-[260px] transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-4"
              }`}
              style={{ transitionDelay: isVisible ? "800ms" : "0ms" }}
            >
              <p className="text-sm font-sans text-foreground/80 leading-relaxed italic">
                "Brendan has been a dream. We've made more progress in two months than in the previous year."
              </p>
              <p className="text-xs font-sans text-muted-foreground mt-2">
                Alex Aggidis · Fundraising Everywhere
              </p>
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
