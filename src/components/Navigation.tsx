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
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    { href: "/clarity-sessions", label: "Clarity Sessions" },
    { href: "/mentorship-sprint", label: "Thread AI Sprint" },
    { href: "/workshops", label: "Brand Connection Workshops" },
    { href: "/fractional-strategy", label: "Fractional Strategy" },
    { href: "/deep-engagement", label: "Deep Engagement" },
  ];

  const mainLinks = [
    { href: "/#what-we-do", label: "What We Do" },
    { href: "/#how-we-work", label: "How We Work" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/#contact", label: "Contact" },
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

          {/* Hero Nav - Desktop Only */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="/blog" 
              className="text-sm text-foreground/80 hover:text-foreground transition-colors not-italic"
            >
              Blog
            </a>
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-foreground/80 hover:text-foreground transition-colors not-italic">
                Services
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border z-50 min-w-[240px]">
                {services.map((service) => (
                  <DropdownMenuItem key={service.href} asChild>
                    <a href={service.href} className="cursor-pointer">
                      {service.label}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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

            {/* Desktop Navigation - Full Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {mainLinks.slice(0, 2).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/80 hover:text-foreground transition-colors not-italic"
                >
                  {link.label}
                </a>
              ))}

              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-foreground/80 hover:text-foreground transition-colors not-italic">
                  Services
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-background border border-border z-50 min-w-[240px]">
                  {services.map((service) => (
                    <DropdownMenuItem key={service.href} asChild>
                      <a href={service.href} className="cursor-pointer">
                        {service.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {mainLinks.slice(2).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/80 hover:text-foreground transition-colors not-italic"
                >
                  {link.label}
                </a>
              ))}

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
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="px-6 py-4 space-y-4">
              {mainLinks.slice(0, 2).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              <div className="border-t border-border/50 pt-4">
                <p className="text-xs text-muted-foreground mb-3 not-italic">Services</p>
                {services.map((service) => (
                  <a
                    key={service.href}
                    href={service.href}
                    className="block py-2 text-sm text-foreground/80 hover:text-foreground transition-colors pl-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {service.label}
                  </a>
                ))}
              </div>

              <div className="border-t border-border/50 pt-4">
                {mainLinks.slice(2).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block py-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <Button 
                size="sm" 
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl mt-4"
                asChild
              >
                <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>Get Started</a>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for floating nav */}
      {isScrolled && <div className="h-16" />}
    </>
  );
};
