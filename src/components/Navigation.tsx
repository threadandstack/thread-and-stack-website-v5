import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import IndigoStacked from "@/assets/logos/Indigo_TS_Stacked.svg";
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import { trackNavClick, trackCtaClick } from "@/hooks/useAnalytics";

interface NavigationProps {
  variant?: "default" | "dark" | "image-hero";
}

export const Navigation = ({ variant = "default" }: NavigationProps) => {
  const isDark = variant === "dark" || variant === "image-hero";
  const isImageHero = variant === "image-hero";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    { href: "/workshops", label: "Brand Connection Workshops" },
    { href: "/fractional-deep-engagement", label: "Fractional & Deep Engagement" },
    { href: "/notion-systems", label: "Notion & Systems Consultancy" },
  ];

  return (
    <>
      {/* Hero-level Navigation - Subtle, always visible */}
      <nav className="absolute top-0 left-0 right-0 z-40 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a 
            href="/" 
            className="block relative"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <img 
              src={isDark ? WhiteStacked : GreyStacked}
              alt="Thread & Stack" 
              className="h-12 md:h-14 w-auto transition-opacity duration-500 ease-in-out"
              style={{ opacity: isLogoHovered ? 0 : 1 }}
            />
            <img 
              src={IndigoStacked}
              alt="" 
              className="h-12 md:h-14 w-auto absolute inset-0 transition-opacity duration-500 ease-in-out"
              style={{ opacity: isLogoHovered ? 1 : 0 }}
            />
          </a>

          <div className={`hidden md:flex items-center gap-6 ${isImageHero ? 'bg-background/90 backdrop-blur-sm rounded-full px-6 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]' : 'gap-8'}`}>
            <a 
              href="/about" 
              className={`text-base font-sans transition-colors not-italic ${
                isImageHero ? "text-foreground/80 hover:text-foreground" : isDark ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
              }`}
              onClick={() => trackNavClick('About', 'header')}
            >
              About
            </a>

            <a 
              href="/how-i-work" 
              className={`text-base font-sans transition-colors not-italic ${
                isImageHero ? "text-foreground/80 hover:text-foreground" : isDark ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
              }`}
              onClick={() => trackNavClick('How I Work', 'header')}
            >
              How I Work
            </a>
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 text-base font-sans transition-colors not-italic ${
                isImageHero ? "text-foreground/80 hover:text-foreground" : isDark ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
              }`}>
                Services
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border z-50 min-w-[280px]">
                {services.map((service) => (
                  <DropdownMenuItem key={service.href} asChild>
                    <a href={service.href} className="cursor-pointer" onClick={() => trackNavClick(service.label, 'header')}>
                      {service.label}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <a 
              href="/blog" 
              className={`text-base font-sans transition-colors not-italic ${
                isImageHero ? "text-foreground/80 hover:text-foreground" : isDark ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
              }`}
              onClick={() => trackNavClick('Stacked Behaviours', 'header')}
            >
              Stacked Behaviours
            </a>

            {/* Get Started CTA */}
            <Button 
              size="sm" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl not-italic font-sans"
              asChild
            >
              <a href="/#contact" onClick={() => trackCtaClick('Get Started', 'header')}>Get Started</a>
            </Button>
          </div>

          {/* Mobile Menu Button - Hero */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${isDark ? "text-white hover:bg-white/10" : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Floating Navigation - Appears on scroll */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300 ${
          isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a 
              href="/" 
              className="block relative"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <img 
                src={GreyStacked}
                alt="Thread & Stack" 
                className="h-10 md:h-12 w-auto transition-opacity duration-500 ease-in-out"
                style={{ opacity: isLogoHovered ? 0 : 1 }}
              />
              <img 
                src={IndigoStacked}
                alt="" 
                className="h-10 md:h-12 w-auto absolute inset-0 transition-opacity duration-500 ease-in-out"
                style={{ opacity: isLogoHovered ? 1 : 0 }}
              />
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="/about"
                className="text-base font-sans text-foreground/80 hover:text-foreground transition-colors not-italic"
                onClick={() => trackNavClick('About', 'floating')}
              >
                About
              </a>

              <a
                href="/how-i-work"
                className="text-base font-sans text-foreground/80 hover:text-foreground transition-colors not-italic"
                onClick={() => trackNavClick('How I Work', 'floating')}
              >
                How I Work
              </a>

              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-base font-sans text-foreground/80 hover:text-foreground transition-colors not-italic">
                  Services
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border border-border z-50 min-w-[280px]">
                  {services.map((service) => (
                    <DropdownMenuItem key={service.href} asChild>
                      <a href={service.href} className="cursor-pointer" onClick={() => trackNavClick(service.label, 'floating')}>
                        {service.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <a
                href="/blog"
                className="text-base font-sans text-foreground/80 hover:text-foreground transition-colors not-italic"
                onClick={() => trackNavClick('Stacked Behaviours', 'floating')}
              >
                Stacked Behaviours
              </a>

              <Button 
                size="sm" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl not-italic font-sans"
                asChild
              >
                <a href="/#contact" onClick={() => trackCtaClick('Get Started', 'floating-nav')}>Get Started</a>
              </Button>
            </div>

            {/* Mobile Menu Button - Floating */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Works from any scroll position */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm md:hidden"
          style={{ paddingTop: isScrolled ? '64px' : '80px' }}
        >
          <div className="absolute top-0 right-0 p-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X />
            </Button>
          </div>
          
          <div className="px-6 py-4 space-y-4 overflow-y-auto h-full">
            <a
              href="/about"
              className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/how-i-work"
              className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How I Work
            </a>

            <div className="border-t border-border/50 pt-4">
              <p className="text-xs text-muted-foreground mb-3 not-italic font-sans">Services</p>
              {services.map((service) => (
                <a
                  key={service.href}
                  href={service.href}
                  className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {service.label}
                </a>
              ))}
            </div>

            <div className="border-t border-border/50 pt-4">
              <a
                href="/blog"
                className="block py-3 text-lg font-serif-pro text-foreground/80 hover:text-foreground transition-colors italic"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Stacked Behaviours
              </a>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl mt-4 font-sans"
              asChild
            >
              <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>Get Started</a>
            </Button>
          </div>
        </div>
      )}

      {/* Spacer for floating nav */}
      {isScrolled && <div className="h-16" />}
    </>
  );
};
