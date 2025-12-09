import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    { href: "/sessions-and-sprints", label: "Sessions & Sprints" },
    { href: "/workshops", label: "Brand Connection Workshops" },
    { href: "/fractional-deep-engagement", label: "Fractional & Deep Engagement" },
  ];

  return (
    <>
      {/* Hero-level Navigation - Subtle, always visible */}
      <nav className="absolute top-0 left-0 right-0 z-40 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-2xl font-light text-foreground hover:text-accent transition-colors">
            Thread & Stack
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a 
              href="/about" 
              className="text-base text-foreground/80 hover:text-foreground transition-colors not-italic"
            >
              About
            </a>

            <a 
              href="/collective" 
              className="text-base text-foreground/80 hover:text-foreground transition-colors not-italic"
            >
              The Collective
            </a>

            <a 
              href="/how-i-work" 
              className="text-base text-foreground/80 hover:text-foreground transition-colors not-italic"
            >
              How I Work
            </a>
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-base text-foreground/80 hover:text-foreground transition-colors not-italic">
                Services
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border z-50 min-w-[280px]">
                {services.map((service) => (
                  <DropdownMenuItem key={service.href} asChild>
                    <a href={service.href} className="cursor-pointer">
                      {service.label}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <a 
              href="/blog" 
              className="text-base text-foreground/80 hover:text-foreground transition-colors italic"
            >
              Stacked Behaviours
            </a>

            {/* Get Started CTA */}
            <Button 
              size="sm" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl not-italic"
              asChild
            >
              <a href="/#contact">Get Started</a>
            </Button>
          </div>

          {/* Mobile Menu Button - Hero */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
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
            <a href="/" className="text-xl font-light text-foreground hover:text-accent transition-colors">
              Thread & Stack
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="/about"
                className="text-base text-foreground/80 hover:text-foreground transition-colors not-italic"
              >
                About
              </a>

              <a
                href="/collective"
                className="text-base text-foreground/80 hover:text-foreground transition-colors not-italic"
              >
                The Collective
              </a>

              <a
                href="/how-i-work"
                className="text-base text-foreground/80 hover:text-foreground transition-colors not-italic"
              >
                How I Work
              </a>

              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-base text-foreground/80 hover:text-foreground transition-colors not-italic">
                  Services
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border border-border z-50 min-w-[280px]">
                  {services.map((service) => (
                    <DropdownMenuItem key={service.href} asChild>
                      <a href={service.href} className="cursor-pointer">
                        {service.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <a
                href="/blog"
                className="text-base text-foreground/80 hover:text-foreground transition-colors italic"
              >
                Stacked Behaviours
              </a>

              <Button 
                size="sm" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl not-italic"
                asChild
              >
                <a href="/#contact">Get Started</a>
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
              className="block py-3 text-lg text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/collective"
              className="block py-3 text-lg text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              The Collective
            </a>
            <a
              href="/how-i-work"
              className="block py-3 text-lg text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How I Work
            </a>

            <div className="border-t border-border/50 pt-4">
              <p className="text-xs text-muted-foreground mb-3 not-italic">Services</p>
              {services.map((service) => (
                <a
                  key={service.href}
                  href={service.href}
                  className="block py-3 text-lg text-foreground/80 hover:text-foreground transition-colors pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {service.label}
                </a>
              ))}
            </div>

            <div className="border-t border-border/50 pt-4">
              <a
                href="/blog"
                className="block py-3 text-lg text-foreground/80 hover:text-foreground transition-colors italic"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Stacked Behaviours
              </a>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl mt-4"
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
