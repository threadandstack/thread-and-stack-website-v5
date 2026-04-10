import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { PillButton } from "@/components/ui/pill-button";
import { Rocket } from "lucide-react";
import heroPhoto from "@/assets/photos/workshop/brendan-23.webp";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ContactDrawer } from "@/components/ContactDrawer";

const fourCs = [
  {
    word: "Connection",
    description:
      "The need to belong, relate, and build trust. AI can scale reach, but it can't manufacture genuine rapport. Connection is where brand loyalty actually lives.",
  },
  {
    word: "Creativity",
    description:
      "The drive to make, shape, and express. AI can generate options, but creative judgment, taste, and the courage to commit to a direction? That's irreplaceably human.",
  },
  {
    word: "Curiosity",
    description:
      "The pull to explore, question, and reframe. AI can retrieve and summarise, but the instinct to ask a better question, or challenge a brief, is what produces breakthrough work.",
  },
  {
    word: "Contribution",
    description:
      "The desire to matter and leave something behind. AI optimises for metrics; humans optimise for meaning. The best brands are built on purpose, not just performance.",
  },
];

const fourDs = [
  {
    letter: "Delegation",
    description:
      "Knowing whether, when, and how to engage AI. Not every task benefits from automation. The skill is in choosing wisely, protecting the work that deserves human attention.",
  },
  {
    letter: "Description",
    description:
      "Articulating goals clearly enough to prompt useful AI behaviour. This is where strategic thinking meets practical fluency — vague inputs produce vague outputs.",
  },
  {
    letter: "Discernment",
    description:
      "Accurately assessing AI outputs. Knowing what's good enough, what needs reworking, and what should be thrown away entirely. This is taste, applied to a new medium.",
  },
  {
    letter: "Diligence",
    description:
      "Taking responsibility for what we do with AI and how we do it. Ethics, transparency, and accountability aren't optional extras — they're the foundation of trust.",
  },
];

const HowIWorkPage = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [fourCsVisible, setFourCsVisible] = useState(false);
  const [fourDsVisible, setFourDsVisible] = useState(false);
  const fourCsRef = useRef<HTMLElement>(null);
  const fourDsRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [location.hash]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === fourCsRef.current) setFourCsVisible(true);
            if (entry.target === fourDsRef.current) setFourDsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (fourCsRef.current) observer.observe(fourCsRef.current);
    if (fourDsRef.current) observer.observe(fourDsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen">
      <Navigation variant="image-hero" />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="how-i-work" />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img
          src={heroPhoto}
          alt="Brendan leading a workshop session"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative h-full max-w-6xl mx-auto px-6 flex items-end pb-12 md:items-center md:pb-0 pt-24">
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 md:p-10 max-w-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <h1 className="text-5xl md:text-6xl mb-6 text-balance font-light">
              My Approach
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              A map to building human connection in the age of AI — and protecting the creativity, judgment, and meaning that no model can replace.
            </p>
          </div>
        </div>
      </section>

      {/* The 4 C's Framework */}
      <section
        ref={fourCsRef}
        className={`py-24 px-6 transition-all duration-1000 ${
          fourCsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-accent text-sm font-light tracking-wide uppercase mb-4">
            The 4 C's Framework
          </p>
          <h2 className="text-4xl md:text-5xl mb-6 text-balance font-light">
            What AI must never replace.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-16">
            As AI becomes more capable, the question isn't <em>what it can do</em> — it's <em>what it should leave alone</em>. These four drives form the foundation of the human condition. They shape how we work, create, and connect. Any AI strategy worth its salt protects them.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {fourCs.map((item, i) => (
              <div
                key={item.word}
                className="p-8 rounded-2xl bg-muted/30 border border-border/30 transition-all duration-500"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <h3 className="text-2xl md:text-3xl font-light mb-3">{item.word}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground mt-12 text-lg leading-relaxed max-w-3xl">
            These aren't abstract ideals. They're the lens through which I evaluate every AI integration, every workflow, and every creative decision. If it diminishes any of the four, it doesn't ship.
          </p>
        </div>
      </section>

      {/* Anthropic's 4D Framework */}
      <section
        id="ai-fluency"
        ref={fourDsRef}
        className={`py-24 px-6 bg-card transition-all duration-1000 ${
          fourDsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-accent text-sm font-light tracking-wide uppercase mb-4">
            Practitioner Perspective
          </p>
          <h2 className="text-4xl md:text-5xl mb-6 text-balance font-light">
            The discipline behind the tools.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
            Knowing <em>what</em> to protect is only half the picture. The other half is knowing how to use AI with skill, intention, and accountability.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-16">
            Anthropic's <strong className="text-foreground font-medium">4D AI Fluency Framework</strong> — developed by Rick Dakan, Joseph Feller, and Anthropic — defines four interconnected competencies for effective, efficient, ethical, and safe AI interaction. It's a framework I've studied, been certified in, and apply across every client engagement.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {fourDs.map((item, i) => (
              <div
                key={item.letter}
                className="p-8 rounded-2xl border border-accent/20 bg-accent/5 transition-all duration-500"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <h3 className="text-2xl md:text-3xl font-light mb-3 text-accent">
                  {item.letter}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-muted/30 border border-border/30">
            <h3 className="text-2xl font-light mb-4">Where the frameworks meet.</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              The 4 C's tell us what to protect. The 4 D's tell us how to operate. Together, they form a complete picture: AI that serves human connection, applied with professional rigour.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This is what separates thoughtful AI adoption from the rush to automate everything. And it's the foundation of every system, workflow, and strategy I build with clients.
            </p>
          </div>

          <p className="text-xs text-muted-foreground/60 mt-8">
            The 4D AI Fluency Framework is © 2025 Rick Dakan, Joseph Feller, and Anthropic, released under CC BY-NC-SA 4.0. Referenced here with attribution.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-accent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-accent-foreground">
            Ready to work with intention?
          </h2>
          <p className="text-lg text-accent-foreground/80 leading-relaxed mb-12">
            Whether you need brand strategy, creative direction, or AI-informed systems that protect what matters — let's talk about what's possible.
          </p>
          <PillButton
            size="lg"
            variant="dark"
            icon={Rocket}
            onClick={() => setContactOpen(true)}
          >
            Let's Work Together
          </PillButton>
        </div>
      </section>

      <FAQ
        items={[
          {
            question: "How does Thread & Stack's AI philosophy translate into services?",
            answer: "The 4 C's and 4 D's frameworks aren't just theory — they inform every engagement. Whether it's a Strategy Session to unblock a positioning challenge, a Fractional Strategy Director retainer for ongoing creative leadership, or a Notion Session to fix a broken workflow, the goal is always the same: protect human creativity and reduce cognitive load.",
          },
          {
            question: "What services does Thread & Stack offer?",
            answer: "We work across two pillars. Narratives & Strategy Services includes Strategy Sessions, Fractional Strategy Director retainers, and Project Engagements for strategic narratives and messaging. Notion & Systems Consultancy includes Notion Sessions, Fractional Automations Director retainers, and System-Build Engagements. Book an intro call to find the right fit.",
          },
          {
            question: "Who is this approach best suited for?",
            answer: "Purpose-led founders and teams who want to integrate AI thoughtfully — not just automate everything. If you care about brand integrity, creative energy, and building systems that serve people rather than the other way around, this is the approach for you.",
          },
        ]}
      />

      <Footer />
    </main>
  );
};

export default HowIWorkPage;
