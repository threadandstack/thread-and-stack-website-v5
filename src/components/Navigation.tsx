import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, Home, Compass, Layers, BookOpen, Rocket, Sun, Moon } from "lucide-react";
import { ContactDrawer } from "@/components/ContactDrawer";
import { DiagnosticDrawer } from "@/components/home-draft2/DiagnosticDrawer";

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
import BlackStacked from "@/assets/logos/Black_TS_Stacked.svg";
import { trackNavClick, trackCtaClick } from "@/hooks/useAnalytics";

interface NavigationProps {
  variant?: "default" | "dark" | "image-hero";
  hideLogo?: boolean;
  floatingBadge?: React.ReactNode;
  themeToggle?: React.ReactNode;
  ctaGradient?: string;
  logoHoverGradient?: string;
}

export const Navigation = ({ variant = "default", hideLogo = false, floatingBadge, themeToggle, ctaGradient, logoHoverGradient }: NavigationProps) => {
  const isDark = variant === "dark" || variant === "image-hero";
  const isImageHero = variant === "image-hero";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const gradientBtnStyle = {
    backgroundImage: ctaGradient ?? "linear-gradient(95deg, hsl(28 88% 62%), hsl(280 70% 65%))",
  } as const;
  const logoGradientStyle = {
    background: logoHoverGradient ?? "linear-gradient(135deg, hsl(var(--orange)), hsl(var(--violet)))",
  } as const;


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services: { href: string; label: string }[] = [];


  const navLinkClass = "text-sm font-sans transition-all not-italic";
  const defaultLinkColor = "text-foreground/70 hover:text-foreground";

  const NavItem = ({ href, label, icon: Icon, onClick, className = "" }: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; onClick?: () => void; className?: string }) => (
    <a
      href={href}
      className={`group flex items-center gap-0 ${navLinkClass} ${defaultLinkColor} pl-4 pr-4 py-2 rounded-full hover:bg-muted transition-all ${className}`}
      onClick={onClick}
    >
      <span className="w-0 h-5 flex items-center justify-center overflow-hidden transition-all duration-300 opacity-0 scale-75 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:mr-1.5">
        <Icon className="w-4 h-4 shrink-0" />
      </span>
      {label}
    </a>
  );

  return (
    <>
      {/* Hero-level Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-40 py-5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          {hideLogo ? (
            <div />
          ) : (
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
              <div
                aria-hidden
                className="absolute inset-0 h-12 md:h-14 transition-opacity duration-500 pointer-events-none"
                style={{
                  opacity: isLogoHovered ? 1 : 0,
                  background: "linear-gradient(135deg, hsl(var(--orange)), hsl(var(--violet)))",
                  WebkitMaskImage: `url(${isDark ? WhiteStacked : GreyStacked})`,
                  maskImage: `url(${isDark ? WhiteStacked : GreyStacked})`,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskPosition: "left center",
                  maskPosition: "left center",
                }}
              />
            </a>
          )}

          {/* Desktop pill nav */}
          <div className="hidden md:flex items-center gap-3">
            {themeToggle && (
              <div className="flex items-center bg-background/90 backdrop-blur-md rounded-full px-2 py-2 shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-border/30">
                {themeToggle}
              </div>
            )}
            <div className="flex items-center gap-1 bg-background/90 backdrop-blur-md rounded-full px-2 py-1.5 shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-border/30">
            <NavItem href="/" label="Home" icon={Home} onClick={() => trackNavClick('Home', 'header')} />
            <NavItem href="/about" label="About" icon={User} onClick={() => trackNavClick('About', 'header')} />
            <NavItem href="/how-i-work" label="The T&S Way" icon={Compass} onClick={() => trackNavClick('How I Work', 'header')} />

            <NavItem href="/services" label="Services" icon={Layers} onClick={() => trackNavClick('Services', 'header')} />


            <NavItem href="/blog" label="Journal" icon={BookOpen} onClick={() => trackNavClick('Journal', 'header')} />

            <Button size="sm" style={gradientBtnStyle} className="group text-white hover:opacity-90 rounded-full px-5 ml-1 not-italic font-sans text-sm border-0" onClick={() => { trackCtaClick('Get Started', 'header'); setIsDiagnosticOpen(true); }}>
              <span className="w-0 h-5 flex items-center justify-center overflow-hidden transition-all duration-300 opacity-0 scale-75 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:mr-1.5">
                <Rocket className="w-4 h-4 shrink-0" />
              </span>
              Get Started
            </Button>

            </div>
          </div>


          {/* Mobile Menu Button */}
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

      {/* Floating Navigation - pill on scroll */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-3">
            {/* Theme toggle as separate floating pill */}
            {themeToggle && (
              <div className="flex items-center bg-background/95 backdrop-blur-md rounded-full px-2 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-border/30">
                {themeToggle}
              </div>
            )}

            {/* Main nav pill */}
            <div className="flex items-center justify-between bg-background/95 backdrop-blur-md rounded-full px-4 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-border/30">
              <a href="/" className="block relative h-8 md:h-10 aspect-square" onMouseEnter={() => setIsLogoHovered(true)} onMouseLeave={() => setIsLogoHovered(false)}>
                <img src={isDark ? WhiteStacked : BlackStacked} alt="Thread & Stack" className="h-8 md:h-10 w-auto transition-opacity duration-500" style={{ opacity: isLogoHovered ? 0 : 1 }} />
                <div
                  aria-hidden
                  className="absolute inset-0 h-8 md:h-10 transition-opacity duration-500 pointer-events-none"
                  style={{
                    opacity: isLogoHovered ? 1 : 0,
                    background: "linear-gradient(135deg, hsl(var(--orange)), hsl(var(--violet)))",
                    WebkitMaskImage: `url(${isDark ? WhiteStacked : BlackStacked})`,
                    maskImage: `url(${isDark ? WhiteStacked : BlackStacked})`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskPosition: "left center",
                    maskPosition: "left center",
                  }}
                />
              </a>

              {floatingBadge && <div className="ml-2 hidden sm:flex items-center">{floatingBadge}</div>}

              <div className="hidden md:flex items-center gap-1">
                <NavItem href="/about" label="About" icon={User} onClick={() => trackNavClick('About', 'floating')} />
                <NavItem href="/how-i-work" label="The T&S Way" icon={Compass} onClick={() => trackNavClick('How I Work', 'floating')} />

                <NavItem href="/services" label="Services" icon={Layers} onClick={() => trackNavClick('Services', 'floating')} />


                <NavItem href="/blog" label="Journal" icon={BookOpen} onClick={() => trackNavClick('Journal', 'floating')} />

                <Button size="sm" style={gradientBtnStyle} className="group text-white hover:opacity-90 rounded-full px-5 ml-1 not-italic font-sans text-sm border-0" onClick={() => { trackCtaClick('Get Started', 'floating-nav'); setIsDiagnosticOpen(true); }}>
                  <span className="w-0 h-5 flex items-center justify-center overflow-hidden transition-all duration-300 opacity-0 scale-75 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:mr-1.5">
                    <Rocket className="w-4 h-4 shrink-0" />
                  </span>
                  Get Started
                </Button>

              </div>

              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm md:hidden"
          style={{ paddingTop: '80px' }}
        >
          <div className="absolute top-0 right-0 p-6">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X />
            </Button>
          </div>

          <div className="px-6 py-4 space-y-4 overflow-y-auto h-full">
            <a href="/" className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors not-italic" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </a>
            <a href="/about" className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors not-italic" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </a>
            <a href="/how-i-work" className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors not-italic" onClick={() => setIsMobileMenuOpen(false)}>
              The T&S Way
            </a>

            <div className="border-t border-border/50 pt-4">
              <a href="/services" className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors not-italic" onClick={() => setIsMobileMenuOpen(false)}>
                Services
              </a>
            </div>


            <div className="border-t border-border/50 pt-4">
              <a href="/blog" className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors not-italic" onClick={() => setIsMobileMenuOpen(false)}>
                Journal
              </a>
            </div>

            <Button size="lg" style={gradientBtnStyle} className="w-full text-white hover:opacity-90 rounded-full mt-4 font-sans not-italic border-0" onClick={() => { setIsMobileMenuOpen(false); setIsDiagnosticOpen(true); }}>
              Get Started
            </Button>

          </div>
        </div>
      )}

      <ContactDrawer open={isContactOpen} onOpenChange={setIsContactOpen} source="nav-get-started" />
      <DiagnosticDrawer open={isDiagnosticOpen} onOpenChange={setIsDiagnosticOpen} source="nav-get-started" initialMode="intro" theme={isDark ? "dark" : "light"} />

    </>
  );
};
