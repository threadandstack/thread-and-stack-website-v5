import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import workshopImage from "@/assets/brendan-collaboration.jpeg";
import { useEffect, useRef, useState } from "react";

const HowIWorkPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const principles = [
    {
      number: "01",
      title: "Start with your reality",
      description:
        "No generic playbooks or cookie-cutter processes. Every engagement begins with understanding your specific context, ethics, and working style.",
    },
    {
      number: "02",
      title: "Co-create visual and strategic systems",
      description:
        "You're not outsourcing your thinking to a consultant. We collaborate to build positioning, visual identity, and workflows that are genuinely yours, from brand world building to practical implementation.",
    },
    {
      number: "03",
      title: "Hunt decisions and tangible outputs",
      description:
        "Every session delivers clear language, actionable decisions, and concrete deliverables: creative direction, asset development, strategic frameworks. Not vague concepts.",
    },
    {
      number: "04",
      title: "Protect what matters",
      description:
        "We design workflows that reduce friction and cognitive load while preserving human judgement, aesthetic taste, and the creative work you care about.",
    },
    {
      number: "05",
      title: "Design craft meets strategic thinking",
      description:
        "Rare combination of strategic positioning and design execution means your brand doesn't just sound right; it looks and feels right across every touchpoint.",
    },
  ];

  return (
    <main className="min-h-screen">
      <Navigation />

      <section
        ref={sectionRef}
        className={`py-24 px-6 mt-16 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl mb-16 text-balance font-light">
            We start with your reality.
          </h1>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <img
                src={workshopImage}
                alt="Collaborative workshop session"
                className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto"
              />
            </div>

            <div className="order-1 md:order-2 space-y-8">
              {principles.slice(0, 2).map((principle, index) => (
                <div
                  key={index}
                  className="space-y-3 group border-l-4 border-accent/20 pl-6"
                >
                  <div className="text-accent text-sm not-italic font-light">
                    {principle.number}
                  </div>

                  <h3 className="text-2xl md:text-3xl group-hover:text-accent transition-colors font-light not-italic">
                    {principle.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {principles.slice(2).map((principle, index) => (
              <div
                key={index + 2}
                className="space-y-3 group border-l-4 border-accent/20 pl-6"
              >
                <div className="text-accent text-sm not-italic font-light">
                  {principle.number}
                </div>

                <h3 className="text-2xl md:text-3xl group-hover:text-accent transition-colors font-light not-italic">
                  {principle.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed text-lg">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - from About page */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none space-y-6 text-lg leading-relaxed border-l-4 border-accent/20 pl-8">
            <h2 className="text-3xl font-light not-italic">My Approach</h2>

            <p>
              My work sits at the intersection of brand strategy, creative
              direction, and systems design, protecting both your brand
              integrity and your team's creative energy.
            </p>

            <p>
              Being both a designer and a strategist is rare. It means I
              understand how aesthetic judgement and strategic thinking work
              together: how visual identity supports your narrative, how asset
              development flows from positioning, how design decisions either
              reinforce or undermine what you're trying to say.
            </p>

            <p>
              I help you untangle the mess, connect the dots, and keep your best
              ideas moving. Through visual identity, creative direction, and
              brand world building that feels cohesive and true. Not by adding
              more processes, but by creating invisible scaffolding that reduces
              friction and cognitive load.
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6 text-lg leading-relaxed border-l-4 border-accent/20 pl-8 mt-16">
            <h2 className="text-3xl font-light not-italic">AI as a Co-Pilot</h2>

            <p>
              When it comes to AI, I see it as a second brain and operations
              partner in the background, never a replacement for human
              creativity or judgment. My approach centers on creative
              empowerment: helping you feel more capable (not automated),
              ensuring your brand voice remains authentically yours, and using
              AI to reduce cognitive load so your calendar feels spacious
              instead of suffocating. The goal is giving back time, attention,
              and voice.
            </p>

            <p className="font-bold not-italic">
              The result? Brands that feel alive, teams that feel spacious, and
              work that actually ships.
            </p>
          </div>

          <div className="text-center pt-16">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              asChild
            >
              <a href="/#contact">
                Let's Work Together
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HowIWorkPage;
