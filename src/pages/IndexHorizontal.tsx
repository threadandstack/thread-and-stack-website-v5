import { useEffect, useRef, useState, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Palette, Cog, Zap, Clock, Target, Layers, Users, Calendar, Repeat, ChevronLeft, ChevronRight } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";
import heroImage from "@/assets/hero-heading.png";
import heroImageMobile from "@/assets/photos/shoreditch/brendan-33.jpg";
import brendanCafe from "@/assets/brendan-cafe-landscape.jpg";
import brendanPostits from "@/assets/brendan-postits-landscape.jpg";
import notionAdmin from "@/assets/notion-certified-admin.png";
import notionAdvanced from "@/assets/notion-advanced.png";
import notionWorkflows from "@/assets/notion-workflows.png";
import notionEssentials from "@/assets/notion-essentials.png";
import notionHeroPhoto from "@/assets/notion-certified-hero.png";
import notionAmbassadorBlack from "@/assets/notion-ambassador-black.png";
import { trackCtaClick } from "@/hooks/useAnalytics";

const IndexHorizontal = () => {
  // 0 = Creative (left), 1 = Hero (center), 2 = Notion (right)
  const [activePanel, setActivePanel] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Add noindex
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  // Set initial scroll position to center panel
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Disable smooth scroll for initial positioning
      scrollContainerRef.current.style.scrollBehavior = 'auto';
      scrollContainerRef.current.scrollLeft = window.innerWidth;
      // Re-enable smooth scroll
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.scrollBehavior = 'smooth';
        }
      }, 50);
    }
  }, []);

  // Intercept scroll wheel → horizontal navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      let target = e.target as HTMLElement | null;
      let shouldScrollVertically = false;
      
      while (target && target !== container) {
        const style = window.getComputedStyle(target);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          const atTop = target.scrollTop <= 0;
          const atBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <= 1;
          
          if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
            shouldScrollVertically = true;
            break;
          }
        }
        target = target.parentElement;
      }

      if (!shouldScrollVertically && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
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

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const windowWidth = window.innerWidth;
    const panel = Math.round(scrollLeft / windowWidth);
    if (panel !== activePanel) {
      setActivePanel(panel);
    }
  }, [activePanel]);

  const scrollToPanel = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: index * window.innerWidth, behavior: 'smooth' });
    }
  };

  const panelLabels = ['Creative Services', 'Home', 'Notion & Systems'];
  const clients = ["eBay", "Dentsu", "IMMA Collective", "BfB Labs", "Mixergy"];

  return (
    <div className="h-screen overflow-hidden relative bg-background">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <Navigation variant="image-hero" />

      {/* Panel indicator dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        {panelLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => scrollToPanel(i)}
            className={`group flex items-center gap-2 transition-all duration-500`}
          >
            <span className={`block rounded-full transition-all duration-500 ${
              activePanel === i 
                ? 'w-8 h-3 bg-accent' 
                : 'w-3 h-3 bg-foreground/20 hover:bg-foreground/40'
            }`} />
            <span className={`text-xs font-sans transition-all duration-300 whitespace-nowrap ${
              activePanel === i ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-60 text-muted-foreground'
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Direction hints */}
      {activePanel === 1 && (
        <>
          <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
            <ChevronLeft className="w-6 h-6 text-accent" />
            <span className="text-xs font-sans text-muted-foreground writing-mode-vertical [writing-mode:vertical-rl] rotate-180">
              Creative
            </span>
          </div>
          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
            <ChevronRight className="w-6 h-6 text-accent" />
            <span className="text-xs font-sans text-muted-foreground [writing-mode:vertical-rl]">
              Notion
            </span>
          </div>
        </>
      )}

      {/* Scroll direction hint on center */}
      {activePanel === 1 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none">
          <p className="text-xs font-sans text-muted-foreground/60 animate-fade-in">
            Scroll sideways or use trackpad
          </p>
        </div>
      )}

      {/* Three panels in a horizontal strip */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* ===== PANEL 0: Creative Services (Left) ===== */}
        <div className="w-screen h-screen overflow-y-auto flex-shrink-0 snap-center">
          <div className="min-h-screen">
            {/* Creative Hero */}
            <section className="pt-28 pb-16 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent">
                      <Palette className="w-7 h-7" />
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold italic leading-[1.1] mb-6">
                      Creative{" "}
                      <span className="relative inline-block text-accent">
                        Consultancy
                        {activePanel === 0 && <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0.3} />}
                      </span>
                    </h1>
                    <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-4">
                      Brand strategy, fractional marketing, and creative direction for purpose-led founders who need their marketing to actually reach people.
                    </p>
                    <p className="font-sans text-sm text-accent mb-8">Brand Strategy & Fractional Marketing</p>
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl not-italic font-sans font-semibold"
                      asChild
                    >
                      <a href="/workshops" onClick={() => trackCtaClick('Explore Creative Services', 'horizontal-creative')}>
                        Explore Services
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <img src={brendanCafe} alt="Creative strategy" className="rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] w-full h-auto" />
                  </div>
                </div>
              </div>
            </section>

            {/* Workshops */}
            <section className="py-20 px-6 bg-card">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-semibold italic">Brand Connection Workshops</h2>
                        <p className="text-sm font-sans text-accent">Modular & Team-Based</p>
                      </div>
                    </div>
                    <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                      Modular team workshops that align everyone around story, positioning, and creative direction. Build shared language and strategic clarity in one focused engagement.
                    </p>
                    <p className="text-xl font-semibold font-sans mb-6">From £2,000</p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl not-italic font-sans" asChild>
                      <a href="/workshops">
                        Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold font-sans mb-4">Workshop Outcomes</h3>
                    <ul className="space-y-3">
                      {["Aligned team narrative and brand positioning", "Clear creative direction and visual identity framework", "Actionable roadmap for implementation"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                          <span className="font-sans text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Fractional Strategy */}
            <section className="py-20 px-6 bg-[hsl(var(--accent))] text-accent-foreground">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-accent-foreground/10 rounded-xl flex items-center justify-center text-accent-foreground">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-semibold italic">Fractional Strategy</h2>
                        <p className="text-sm font-sans opacity-80">Ongoing Partnership</p>
                      </div>
                    </div>
                    <p className="font-sans opacity-90 leading-relaxed mb-4">
                      Monthly retainer for ongoing brand and campaign strategy. Senior strategic thinking without the overhead of a full-time hire. I work as an embedded part of your team.
                    </p>
                    <div className="space-y-3 mb-6">
                      {[
                        { title: "Core Retainer", desc: "2-3 days/month" },
                        { title: "Extended Retainer", desc: "4-6 days/month" },
                        { title: "Strategic Leadership", desc: "8-10 days/month" },
                      ].map((tier, idx) => (
                        <div key={idx} className="bg-accent-foreground/10 rounded-xl p-3 flex justify-between items-center">
                          <div>
                            <p className="font-sans font-medium">{tier.title}</p>
                            <p className="text-sm font-sans opacity-70">{tier.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 group rounded-xl not-italic font-sans" asChild>
                      <a href="/fractional-deep-engagement">
                        Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold font-sans mb-4">What You Get</h3>
                    <ul className="space-y-3">
                      {[
                        "Senior strategic thinking on demand",
                        "Campaign strategy and creative direction",
                        "Brand positioning and messaging support",
                        "Quarterly strategic reviews",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-accent-foreground mt-1 flex-shrink-0" />
                          <span className="font-sans opacity-90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Deep Engagement */}
            <section className="py-20 px-6 bg-card">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold italic">Deep Engagement</h2>
                    <p className="text-sm font-sans text-accent">2-6 Month Projects</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                      Full brand refreshes, complete narrative transformations, and strategic overhauls. For organizations ready for meaningful change — not surface-level polish.
                    </p>
                    <p className="text-xl font-semibold font-sans mb-6">From £10-25k</p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl not-italic font-sans" asChild>
                      <a href="/fractional-deep-engagement">
                        Start a Conversation <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold font-sans mb-4">Engagement Includes</h3>
                    <ul className="space-y-3">
                      {[
                        "Discovery and strategic audit",
                        "Brand positioning and narrative development",
                        "Visual identity and creative direction",
                        "Implementation roadmap and team handover",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                          <span className="font-sans text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Back to center CTA */}
            <section className="py-16 px-6 text-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl font-sans"
                onClick={() => { setActivePanel(1); setIsTransitioning(true); setTimeout(() => setIsTransitioning(false), 800); }}
              >
                <ArrowRight className="mr-2 w-4 h-4 rotate-180" />
                Back to Home
              </Button>
            </section>
          </div>
        </div>

        {/* ===== PANEL 1: Hero (Center) ===== */}
        <div className="w-screen h-screen flex-shrink-0 relative">
          {/* Background image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroImageMobile}
              alt="Brendan — Thread & Stack founder"
              className="absolute inset-0 w-full h-full object-cover lg:hidden"
              style={{ objectPosition: '44% 42%' }}
            />
            <img
              src={heroImage}
              alt="Brendan — Thread & Stack founder"
              className="absolute inset-0 w-full h-full object-cover hidden lg:block"
              style={{ objectPosition: '72% 18%' }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Hero content */}
          <div className="relative h-full flex items-center">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
              <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 max-w-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
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
                    {activePanel === 1 && <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0} animate />}
                  </span>
                  .
                  <br />
                  Systems that{" "}
                  <span className="text-accent">stick</span>.
                </h1>

                <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  I help purpose-led founders turn messy marketing into{" "}
                  <span className="text-foreground font-medium">clear narratives</span> and{" "}
                  <span className="text-foreground font-medium">practical workflows</span>{" "}
                  they can actually sustain.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-base px-7 group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] not-italic font-sans font-semibold"
                    onClick={() => { setActivePanel(0); setIsTransitioning(true); setTimeout(() => setIsTransitioning(false), 800); }}
                  >
                    <Palette className="mr-2 w-4 h-4" />
                    Creative Services
                    <ArrowLeft className="ml-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-7 rounded-xl hover:bg-foreground hover:text-background not-italic shadow-[0_2px_8px_rgba(0,0,0,0.04)] font-sans"
                    onClick={() => { setActivePanel(2); setIsTransitioning(true); setTimeout(() => setIsTransitioning(false), 800); }}
                  >
                    Notion & Systems
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <Cog className="ml-1 w-4 h-4" />
                  </Button>
                </div>

                {/* Social proof */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs font-sans text-muted-foreground/60 uppercase tracking-wider mb-2">
                    Trusted by teams at
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {clients.map(client => (
                      <span key={client} className="text-sm font-sans font-medium text-muted-foreground/50">
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PANEL 2: Notion & Systems (Right) ===== */}
        <div className="w-screen h-screen overflow-y-auto flex-shrink-0">
          <div className="min-h-screen">
            {/* Notion Hero */}
            <section className="pt-28 pb-16 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {[notionAdmin, notionAdvanced, notionWorkflows, notionEssentials].map((badge, i) => (
                        <img key={i} src={badge} alt="Notion badge" className="w-10 h-auto" />
                      ))}
                    </div>
                    <img src={notionAmbassadorBlack} alt="Notion Official Ambassador" className="h-8 w-auto mb-8" />

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold italic leading-[1.1] mb-6">
                      Notion & Systems{" "}
                      <span className="relative inline-block text-accent">
                        Consultancy
                        {activePanel === 2 && <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0.3} />}
                      </span>
                    </h1>
                    <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
                      Certified Notion administration, AI-powered workflow design, and operational systems that cut through the noise. Stop drowning in tabs. Start shipping with confidence.
                    </p>
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl not-italic font-sans font-semibold"
                      asChild
                    >
                      <a href="/notion-systems" onClick={() => trackCtaClick('Explore Notion Services', 'horizontal-notion')}>
                        Explore Services
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                  <div className="relative hidden md:block">
                    <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                      <img src={notionHeroPhoto} alt="Brendan — Notion Certified Admin" className="w-full h-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Notion Sessions */}
            <section className="py-20 px-6 bg-card">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-semibold italic">Notion Sessions</h2>
                        <p className="text-sm font-sans text-accent">Rapid Intervention</p>
                      </div>
                    </div>
                    <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                      60 minutes to unblock a specific problem, validate a decision, or get a second brain on a messy Notion setup.
                    </p>
                    <p className="text-xl font-semibold font-sans mb-6">£300 (VAT incl.) · 60 Minutes</p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl not-italic font-sans" asChild>
                      <a href="/sessions-and-sprints">
                        Book a Session <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold font-sans mb-4">What You Leave With</h3>
                    <ul className="space-y-3">
                      {["Full video/audio recording of the session", "AI transcription and summary of key decisions", "A bulleted action plan — exactly what to do next"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                          <span className="font-sans text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Notion AI Sprint */}
            <section className="py-20 px-6 bg-[hsl(var(--accent))] text-accent-foreground">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-accent-foreground/10 rounded-xl flex items-center justify-center text-accent-foreground">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-semibold italic">Notion AI Mentorship Sprint</h2>
                        <p className="text-sm font-sans opacity-80">6 × 1-Hour Sessions Over 6 Weeks</p>
                      </div>
                    </div>
                    <p className="font-sans opacity-90 leading-relaxed mb-4">
                      Transform how you work with Notion and AI without losing your creative edge. Build a custom productivity system that gives you back hours each week.
                    </p>
                    <p className="text-xl font-semibold font-sans mt-4 mb-6">£1,500 · 6 × 1hr Sessions</p>
                    <Button className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 group rounded-xl not-italic font-sans" asChild>
                      <a href="/sessions-and-sprints#sprint">
                        Start a Sprint <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold font-sans mb-4">What You Leave With</h3>
                    <ul className="space-y-3">
                      {["5-10 hours back each week through AI-enabled workflows", "A custom Notion productivity system built for your actual role", "Confidence using AI without second-guessing or quality drops"].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-accent-foreground mt-1 flex-shrink-0" />
                          <span className="font-sans opacity-90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Retained Support */}
            <section className="py-20 px-6 bg-card">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold italic">Retained Systems Support</h2>
                    <p className="text-sm font-sans text-accent">Ongoing Partnership</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div>
                    <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                      Ongoing Notion administration, workflow optimisation, and systems support as an integrated member of your team.
                    </p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl not-italic font-sans" asChild>
                      <a href="/notion-systems">
                        Let's Talk <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "Core Support", commitment: "2-3 days/month", price: "From £2k/month" },
                      { title: "Extended Support", commitment: "4-6 days/month", price: "From £4k/month" },
                    ].map((tier, idx) => (
                      <div key={idx} className="bg-muted/30 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <p className="font-sans font-medium">{tier.title}</p>
                          <p className="text-sm font-sans text-muted-foreground">{tier.commitment}</p>
                        </div>
                        <p className="text-sm font-sans font-medium">{tier.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Back to center */}
            <section className="py-16 px-6 text-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl font-sans"
                onClick={() => { setActivePanel(1); setIsTransitioning(true); setTimeout(() => setIsTransitioning(false), 800); }}
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexHorizontal;
