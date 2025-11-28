import { useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainLinks = [
    { href: "#what-we-do", label: "What We Do" },
    { href: "#who-its-for", label: "Who It's For" },
    { href: "#how-we-work", label: "How We Work" },
    { href: "#offers", label: "Offers" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  const offerLinks = [
    { href: "/stacked-sessions", label: "Stacked Sessions" },
    { href: "/mentorship-sprint", label: "Mentorship Sprint" },
    { href: "/workshops", label: "Workshops" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b thread-border transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-xl font-serif">Thread & Stack</span>
                <span className="ml-2 text-muted-foreground text-sm italic">—</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {mainLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-serif hover:text-accent transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full thread-divider" />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Thread decoration */}
          <div className="thread-divider" />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t thread-border bg-background">
            <div className="px-6 py-4 space-y-3">
              {mainLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-sm font-serif hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="thread-divider my-4" />
              <p className="text-xs italic text-muted-foreground py-2">Service Pages:</p>
              {offerLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className="block py-2 text-sm font-serif hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      {isVisible && <div className="h-16" />}
    </>
  );
};
