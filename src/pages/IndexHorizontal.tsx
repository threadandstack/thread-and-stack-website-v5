import { useEffect, useRef, useState, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Palette, Cog, Zap, Clock, Target, Layers, Users, Repeat, ChevronLeft, ChevronRight } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";
import heroImage from "@/assets/hero-heading.webp";
import heroImageMobile from "@/assets/photos/shoreditch/brendan-33.webp";
import brendanCafe from "@/assets/brendan-cafe-landscape.webp";
import brendanPostits from "@/assets/brendan-postits-landscape.webp";
import notionAdmin from "@/assets/notion-certified-admin.webp";
import notionAdvanced from "@/assets/notion-advanced.webp";
import notionWorkflows from "@/assets/notion-workflows.webp";
import notionEssentials from "@/assets/notion-essentials.webp";
import notionConsultingPartner from "@/assets/notion-consulting-partner.webp";
import notionServiceSpecialist from "@/assets/notion-service-specialist.webp";
import notionHeroPhoto from "@/assets/notion-certified-hero.webp";
import notionAmbassadorBlack from "@/assets/notion-ambassador-black.webp";
import { trackCtaClick } from "@/hooks/useAnalytics";

const PANEL_WIDTH = 1200; // px width per content section
const TOTAL_WIDTH = PANEL_WIDTH * 3; // Creative + Hero + Notion

const IndexHorizontal = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.5); // 0=far left, 0.5=center, 1=far right
  const [isReady, setIsReady] = useState(false);

  // Add noindex
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  // Set initial scroll to center
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    // Center the hero section
    const centerScroll = (container.scrollWidth - container.clientWidth) / 2;
    container.scrollLeft = centerScroll;
    setIsReady(true);
  }, []);

  // Map vertical scroll → horizontal
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.5;
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Track scroll progress
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(container.scrollLeft / maxScroll);
    }
  }, []);

  const scrollToSection = (section: 'creative' | 'hero' | 'notion') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targets = { creative: 0, hero: maxScroll / 2, notion: maxScroll };
    container.scrollTo({ left: targets[section], behavior: 'smooth' });
  };

  const clients = ["eBay", "Dentsu", "IMMA Collective", "BfB Labs", "Mixergy"];

  // Calculate which zone we're roughly in for indicators
  const zone = scrollProgress < 0.3 ? 'creative' : scrollProgress > 0.7 ? 'notion' : 'hero';

  return (
    <div className="h-screen overflow-hidden relative bg-background">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .horizontal-canvas { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <Navigation variant="image-hero" />

      {/* Scroll progress bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button onClick={() => scrollToSection('creative')} className={`text-xs font-sans transition-all duration-300 ${zone === 'creative' ? 'text-accent font-medium' : 'text-muted-foreground/50 hover:text-muted-foreground'}`}>
          Creative
        </button>
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-accent rounded-full transition-all duration-150"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <button onClick={() => scrollToSection('notion')} className={`text-xs font-sans transition-all duration-300 ${zone === 'notion' ? 'text-accent font-medium' : 'text-muted-foreground/50 hover:text-muted-foreground'}`}>
          Notion
        </button>
      </div>

      {/* Direction hints when near center */}
      {zone === 'hero' && isReady && (
        <>
          <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
            <ChevronLeft className="w-5 h-5 text-accent/60" />
            <span className="text-[10px] font-sans text-muted-foreground/40 [writing-mode:vertical-rl] rotate-180">Creative</span>
          </div>
          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
            <ChevronRight className="w-5 h-5 text-accent/60" />
            <span className="text-[10px] font-sans text-muted-foreground/40 [writing-mode:vertical-rl]">Notion</span>
          </div>
        </>
      )}

      {/* Continuous horizontal canvas */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex h-full overflow-x-auto overflow-y-hidden horizontal-canvas hide-scrollbar scroll-smooth"
        style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        {/* ===== LEFT ZONE: Creative Services ===== */}
        <div className="flex-shrink-0 h-full flex items-center" style={{ width: `${PANEL_WIDTH}px` }}>
          <div className="w-full max-w-5xl mx-auto px-12 py-20">
            {/* Creative Hero */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent">
                  <Palette className="w-7 h-7" />
                </div>
                <h2 className="text-5xl md:text-6xl font-semibold italic leading-[1.1] mb-6">
                  Creative{" "}
                  <span className="relative inline-block text-accent">
                    Consultancy
                    <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0.3} />
                  </span>
                </h2>
                <p className="font-sans text-lg text-muted-foreground max-w-xl leading-relaxed mb-4">
                  Brand strategy, fractional marketing, and creative direction for purpose-led founders who need their marketing to actually reach people.
                </p>
                <p className="text-sm font-sans text-accent mb-8">Brand Strategy & Fractional Marketing</p>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl not-italic font-sans font-semibold" asChild>
                  <a href="/workshops" onClick={() => trackCtaClick('Explore Creative Services', 'horizontal-creative')}>
                    Explore Services <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
              <div className="hidden md:block">
                <img src={brendanCafe} alt="Creative strategy" className="rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] w-full h-auto" />
              </div>
            </div>

            {/* Service cards row */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center text-accent"><Users className="w-4 h-4" /></div>
                  <h3 className="text-lg font-semibold italic">Workshops</h3>
                </div>
                <p className="font-sans text-sm text-muted-foreground mb-3">Align your team around story, positioning, and creative direction.</p>
                <p className="text-lg font-semibold font-sans mb-4">From £2,000</p>
                <Button variant="outline" size="sm" className="rounded-xl font-sans w-full" asChild>
                  <a href="/workshops">Learn More <ArrowRight className="ml-1 w-3 h-3" /></a>
                </Button>
              </div>

              <div className="bg-[hsl(var(--accent))] text-accent-foreground rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-accent-foreground/10 rounded-xl flex items-center justify-center"><Target className="w-4 h-4" /></div>
                  <h3 className="text-lg font-semibold italic">Fractional Strategy</h3>
                </div>
                <p className="font-sans text-sm opacity-85 mb-3">Monthly retainer. Senior strategic thinking without the overhead.</p>
                <div className="space-y-1.5 mb-4">
                  {["Core: 2-3 days/mo", "Extended: 4-6 days/mo", "Leadership: 8-10 days/mo"].map((t, i) => (
                    <p key={i} className="text-xs font-sans opacity-70">{t}</p>
                  ))}
                </div>
                <Button className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 rounded-xl font-sans w-full" size="sm" asChild>
                  <a href="/narratives-strategy">Learn More <ArrowRight className="ml-1 w-3 h-3" /></a>
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center text-accent"><Layers className="w-4 h-4" /></div>
                  <h3 className="text-lg font-semibold italic">Deep Engagement</h3>
                </div>
                <p className="font-sans text-sm text-muted-foreground mb-3">Full brand refreshes and strategic overhauls. 2-6 month projects.</p>
                <p className="text-lg font-semibold font-sans mb-4">From £10-25k</p>
                <Button variant="outline" size="sm" className="rounded-xl font-sans w-full" asChild>
                  <a href="/narratives-strategy">Learn More <ArrowRight className="ml-1 w-3 h-3" /></a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CENTER ZONE: Hero ===== */}
        <div className="flex-shrink-0 h-full relative" style={{ width: `${PANEL_WIDTH}px` }}>
          {/* Background image */}
          <div className="absolute inset-0 overflow-hidden">
            <img src={heroImageMobile} alt="Brendan" className="absolute inset-0 w-full h-full object-cover lg:hidden" style={{ objectPosition: '44% 42%' }} />
            <img src={heroImage} alt="Brendan" className="absolute inset-0 w-full h-full object-cover hidden lg:block" style={{ objectPosition: '72% 18%' }} />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative h-full flex items-center justify-center">
            <div className="w-full max-w-lg mx-auto px-6">
              <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-sans font-medium text-accent tracking-wide uppercase">Taking on new clients</span>
                </div>

                <h1 className="font-serif-pro text-4xl md:text-5xl lg:text-6xl font-semibold italic leading-[1.1] tracking-tight mb-6">
                  Stories that{" "}
                  <span className="relative inline-block text-accent">
                    land
                    <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0} animate />
                  </span>
                  .<br />
                  Systems that <span className="text-accent">stick</span>.
                </h1>

                <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  I help purpose-led founders turn messy marketing into{" "}
                  <span className="text-foreground font-medium">clear narratives</span> and{" "}
                  <span className="text-foreground font-medium">practical workflows</span> they can actually sustain.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-7 group rounded-xl not-italic font-sans font-semibold" onClick={() => scrollToSection('creative')}>
                    <Palette className="mr-2 w-4 h-4" />
                    Creative
                    <ArrowLeft className="ml-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-7 rounded-xl hover:bg-foreground hover:text-background not-italic font-sans" onClick={() => scrollToSection('notion')}>
                    Notion
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <Cog className="ml-1 w-4 h-4" />
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs font-sans text-muted-foreground/60 uppercase tracking-wider mb-2">Trusted by teams at</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {clients.map(c => <span key={c} className="text-sm font-sans font-medium text-muted-foreground/50">{c}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT ZONE: Notion & Systems ===== */}
        <div className="flex-shrink-0 h-full flex items-center" style={{ width: `${PANEL_WIDTH}px` }}>
          <div className="w-full max-w-5xl mx-auto px-12 py-20">
            {/* Notion Hero */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {[notionAdmin, notionAdvanced, notionWorkflows, notionEssentials, notionConsultingPartner, notionServiceSpecialist].map((badge, i) => (
                    <img key={i} src={badge} alt="Notion badge" className="w-10 h-auto" />
                  ))}
                </div>
                <img src={notionAmbassadorBlack} alt="Notion Official Ambassador" className="h-8 w-auto mb-8" />
                <h2 className="text-5xl md:text-6xl font-semibold italic leading-[1.1] mb-6">
                  Notion & Systems{" "}
                  <span className="relative inline-block text-accent">
                    Consultancy
                    <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0.3} />
                  </span>
                </h2>
                <p className="font-sans text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
                  Certified Notion administration, AI-powered workflow design, and operational systems that cut through the noise.
                </p>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl not-italic font-sans font-semibold" asChild>
                  <a href="/notion-systems" onClick={() => trackCtaClick('Explore Notion Services', 'horizontal-notion')}>
                    Explore Services <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
              <div className="hidden md:block">
                <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <img src={notionHeroPhoto} alt="Brendan — Notion Certified Admin" className="w-full h-auto" />
                </div>
              </div>
            </div>

            {/* Service cards row */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center text-accent"><Zap className="w-4 h-4" /></div>
                  <h3 className="text-lg font-semibold italic">Sessions</h3>
                </div>
                <p className="font-sans text-sm text-muted-foreground mb-3">60 minutes to unblock a specific problem or validate a decision.</p>
                <p className="text-lg font-semibold font-sans mb-4">£300 · 60 min</p>
                <Button variant="outline" size="sm" className="rounded-xl font-sans w-full" asChild>
                  <a href="/sessions-and-sprints">Book <ArrowRight className="ml-1 w-3 h-3" /></a>
                </Button>
              </div>

              <div className="bg-[hsl(var(--accent))] text-accent-foreground rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-accent-foreground/10 rounded-xl flex items-center justify-center"><Clock className="w-4 h-4" /></div>
                  <h3 className="text-lg font-semibold italic">AI Sprint</h3>
                </div>
                <p className="font-sans text-sm opacity-85 mb-3">Transform how you work with Notion and AI. 6 sessions over 6 weeks.</p>
                <p className="text-lg font-semibold font-sans mb-4">£1,500</p>
                <Button className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 rounded-xl font-sans w-full" size="sm" asChild>
                  <a href="/sessions-and-sprints#sprint">Start <ArrowRight className="ml-1 w-3 h-3" /></a>
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center text-accent"><Repeat className="w-4 h-4" /></div>
                  <h3 className="text-lg font-semibold italic">Retained Support</h3>
                </div>
                <p className="font-sans text-sm text-muted-foreground mb-3">Ongoing Notion admin and workflow optimisation.</p>
                <div className="space-y-1.5 mb-4">
                  <p className="text-xs font-sans text-muted-foreground">Core: from £2k/mo</p>
                  <p className="text-xs font-sans text-muted-foreground">Extended: from £4k/mo</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl font-sans w-full" asChild>
                  <a href="/notion-systems">Let's Talk <ArrowRight className="ml-1 w-3 h-3" /></a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexHorizontal;
