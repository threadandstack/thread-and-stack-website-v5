import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PillButton } from "@/components/ui/pill-button";
import { Rocket } from "lucide-react";
import workshopImage from "@/assets/brendan-collaboration.jpeg";
import heroPhoto from "@/assets/photos/workshop/brendan-23.jpg";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ContactDrawer } from "@/components/ContactDrawer";

const HowIWorkPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [realityVisible, setRealityVisible] = useState(false);
  const [aiVisible, setAiVisible] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const realityRef = useRef<HTMLElement>(null);
  const aiRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Handle hash scroll on page load
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === sectionRef.current) setIsVisible(true);
            if (entry.target === realityRef.current) setRealityVisible(true);
            if (entry.target === aiRef.current) setAiVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (realityRef.current) observer.observe(realityRef.current);
    if (aiRef.current) observer.observe(aiRef.current);

    return () => observer.disconnect();
  }, []);

  const fourCs = [
    { word: "Creativity", description: "The drive to make, shape, and express." },
    { word: "Connection", description: "The need to belong and relate to others." },
    { word: "Curiosity", description: "The pull to explore, question, and understand." },
    { word: "Contribution", description: "The desire to matter and leave something behind." },
  ];

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
      <Navigation variant="image-hero" />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="how-i-work" />

      {/* Hero - full bleed image with overlaid card */}
      <section className="relative h-[80vh] min-h-[560px] overflow-hidden">
        {/* Background image with slight dark overlay for depth */}
        <img
          src={heroPhoto}
          alt="Brendan leading a workshop session"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        {/* Content card floating on top, with top padding to clear nav */}
        <div className="relative h-full max-w-6xl mx-auto px-6 flex items-end pb-12 md:items-center md:pb-0 pt-24">
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 md:p-10 max-w-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <h1 className="text-5xl md:text-6xl mb-6 text-balance font-light">
              My Approach
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              I believe four fundamental drives form the basis of the human condition. They shape how we work, create, and connect with others.
            </p>
          </div>
        </div>
      </section>

      {/* Four C's */}
      <section
        ref={sectionRef}
        className={`py-16 px-6 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {fourCs.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-muted/30 border border-border/30"
              >
                <h3 className="text-2xl md:text-3xl font-light mb-2">{item.word}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
            These aren't just abstract ideas. They're the lens through which I approach every engagement, ensuring that the work we do together honours what makes you human.
          </p>
        </div>
      </section>

      {/* We Start With Your Reality Section */}
      <section
        ref={realityRef}
        className={`py-24 px-6 bg-muted/30 transition-all duration-1000 ${
          realityVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl mb-16 text-balance font-light">
            We start with your reality.
          </h2>

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

      {/* Thread AI Philosophy Section - Purple Background */}
      <section
        id="thread-ai-philosophy"
        ref={aiRef}
        className={`py-24 px-6 bg-accent scroll-mt-24 transition-all duration-1000 ${
          aiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl mb-8 text-balance font-light text-accent-foreground">
            The Thread AI Philosophy
          </h2>

          <p className="text-accent-foreground/70 text-sm mb-8 italic">
            Particularly relevant for those exploring{" "}
            <a
              href="/sessions-and-sprints#thread-ai"
              className="underline hover:text-accent-foreground transition-colors"
            >
              Thread AI Sprints
            </a>
          </p>

          <div className="prose prose-lg max-w-none space-y-6 text-lg leading-relaxed text-accent-foreground">
            <p>
              When it comes to AI, I see it as a second brain and operations partner in the background, never a replacement for human creativity or judgment.
            </p>

            <p>
              My approach centers on creative empowerment: helping you feel more capable (not automated), ensuring your brand voice remains authentically yours, and using AI to reduce cognitive load so your calendar feels spacious instead of suffocating.
            </p>

            <div className="my-12 py-8 border-t border-b border-accent-foreground/20">
              <p className="text-xl font-light mb-6">
                The four pillars of the human condition: Connection, Creativity, Curiosity, and Contribution, must be protected from AI oversupport.
              </p>
              <p className="text-accent-foreground/80">
                We want to prevent human skill atrophy just as much as we want to deliver true connection. AI should give back time, attention, and voice, not replace the meaningful work only you can do.
              </p>
            </div>

            <p className="font-medium">
              The result? Brands that feel alive, teams that feel spacious, and work that actually ships.
            </p>
          </div>

          <div className="text-center pt-16">
            <PillButton
              size="lg"
              variant="dark"
              icon={Rocket}
              onClick={() => setContactOpen(true)}
            >
              Let's Work Together
            </PillButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HowIWorkPage;
