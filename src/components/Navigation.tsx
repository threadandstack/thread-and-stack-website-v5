import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, Compass, Layers, BookOpen, Rocket } from "lucide-react";
import { ContactDrawer } from "@/components/ContactDrawer";
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
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    { href: "/narratives-strategy", label: "Narratives & Strategy Services" },
    { href: "/notion-systems", label: "Notion & Systems Consultancy" },
  ];

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

          {/* Desktop pill nav */}
          <div className="hidden md:flex items-center gap-1 bg-background/90 backdrop-blur-md rounded-full px-2 py-1.5 shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-border/30">
            <NavItem href="/about" label="About" icon={User} onClick={() => trackNavClick('About', 'header')} />
            <NavItem href="/how-i-work" label="How I Work" icon={Compass} onClick={() => trackNavClick('How I Work', 'header')} />

            <DropdownMenu>
              <DropdownMenuTrigger className={`group flex items-center gap-0 ${navLinkClass} ${defaultLinkColor} pl-4 pr-4 py-2 rounded-full hover:bg-muted transition-all`}>
                <span className="w-0 h-5 flex items-center justify-center overflow-hidden transition-all duration-300 opacity-0 scale-75 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:mr-1.5">
                  <Layers className="w-4 h-4 shrink-0" />
                </span>
                Services
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-background border border-border z-50 min-w-[280px] rounded-xl">
                {services.map((s) => (
                  <DropdownMenuItem key={s.href} asChild>
                    <a href={s.href} className="cursor-pointer" onClick={() => trackNavClick(s.label, 'header')}>{s.label}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavItem href="/blog" label="Journal" icon={BookOpen} onClick={() => trackNavClick('Journal', 'header')} />

            <Button size="sm" className="group bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-5 ml-1 not-italic font-sans text-sm" onClick={() => { trackCtaClick('Get Started', 'header'); setIsContactOpen(true); }}>
              <span className="w-0 h-5 flex items-center justify-center overflow-hidden transition-all duration-300 opacity-0 scale-75 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:mr-1.5">
                <Rocket className="w-4 h-4 shrink-0" />
              </span>
              Get Started
            </Button>
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
          <div className="flex items-center justify-between bg-background/95 backdrop-blur-md rounded-full px-4 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-border/30">
            <a href="/" className="block relative" onMouseEnter={() => setIsLogoHovered(true)} onMouseLeave={() => setIsLogoHovered(false)}>
              <img src={GreyStacked} alt="Thread & Stack" className="h-8 md:h-10 w-auto transition-opacity duration-500" style={{ opacity: isLogoHovered ? 0 : 1 }} />
              <img src={IndigoStacked} alt="" className="h-8 md:h-10 w-auto absolute inset-0 transition-opacity duration-500" style={{ opacity: isLogoHovered ? 1 : 0 }} />
            </a>

            <div className="hidden md:flex items-center gap-1">
              <NavItem href="/about" label="About" icon={User} onClick={() => trackNavClick('About', 'floating')} />
              <NavItem href="/how-i-work" label="How I Work" icon={Compass} onClick={() => trackNavClick('How I Work', 'floating')} />

              <DropdownMenu>
                <DropdownMenuTrigger className={`group flex items-center gap-0 ${navLinkClass} ${defaultLinkColor} pl-4 pr-4 py-2 rounded-full hover:bg-muted transition-all`}>
                  <span className="w-0 h-5 flex items-center justify-center overflow-hidden transition-all duration-300 opacity-0 scale-75 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:mr-1.5">
                    <Layers className="w-4 h-4 shrink-0" />
                  </span>
                  Services <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border border-border z-50 min-w-[280px] rounded-xl">
                  {services.map((s) => (
                    <DropdownMenuItem key={s.href} asChild>
                      <a href={s.href} className="cursor-pointer" onClick={() => trackNavClick(s.label, 'floating')}>{s.label}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <NavItem href="/blog" label="Journal" icon={BookOpen} onClick={() => trackNavClick('Journal', 'floating')} />

              <Button size="sm" className="group bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-5 ml-1 not-italic font-sans text-sm" onClick={() => { trackCtaClick('Get Started', 'floating-nav'); setIsContactOpen(true); }}>
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
            <a href="/about" className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors not-italic" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </a>
            <a href="/how-i-work" className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors not-italic" onClick={() => setIsMobileMenuOpen(false)}>
              How I Work
            </a>

            <div className="border-t border-border/50 pt-4">
              <p className="text-xs text-muted-foreground mb-3 not-italic font-sans">Services</p>
              {services.map((s) => (
                <a key={s.href} href={s.href} className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors pl-4 not-italic" onClick={() => setIsMobileMenuOpen(false)}>
                  {s.label}
                </a>
              ))}
            </div>

            <div className="border-t border-border/50 pt-4">
              <a href="/blog" className="block py-3 text-lg font-sans text-foreground/80 hover:text-foreground transition-colors not-italic" onClick={() => setIsMobileMenuOpen(false)}>
                Journal
              </a>
            </div>

            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full mt-4 font-sans not-italic" asChild>
              <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>Get Started</a>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
