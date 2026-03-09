import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PillButton } from "@/components/ui/pill-button";
import { ArrowRight, Check, Zap, Clock, Repeat, Rocket, MessageCircle } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";
import { trackCtaClick } from "@/hooks/useAnalytics";
import notionAdmin from "@/assets/notion-certified-admin.png";
import notionAdvanced from "@/assets/notion-advanced.png";
import notionWorkflows from "@/assets/notion-workflows.png";
import notionEssentials from "@/assets/notion-essentials.png";
import notionHeroPhoto from "@/assets/notion-certified-hero.png";
import notionAmbassadorBlack from "@/assets/notion-ambassador-black.png";
import notionAmbassadorWhite from "@/assets/notion-ambassador-white.png";

const NotionSystemsPage = () => {
  const badges = [
    { src: notionAdmin, alt: "Notion Certified Admin" },
    { src: notionAdvanced, alt: "Notion Academy Advanced" },
    { src: notionWorkflows, alt: "Notion Academy Workflows" },
    { src: notionEssentials, alt: "Notion Academy Essentials" },
  ];

  const clarityOutputs = [
    "Full video/audio recording of the session",
    "AI transcription and summary of key decisions",
    "A bulleted action plan — exactly what to do next",
  ];

  const sprintOutcomes = [
    "5-10 hours back each week through AI-enabled workflows",
    "A custom Notion productivity system built for your actual role",
    "Confidence using AI without second-guessing or quality drops",
  ];

  return (
    <main className="min-h-screen relative">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {badges.map((badge, i) => (
                  <img
                    key={i}
                    src={badge.src}
                    alt={badge.alt}
                    className="w-10 h-auto"
                  />
                ))}
              </div>
              <img
                src={notionAmbassadorBlack}
                alt="Notion Official Ambassador"
                className="h-8 w-auto mb-8"
              />

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold italic leading-[1.1] mb-6">
                Notion & Systems{" "}
                <span className="relative inline-block text-accent">
                  Consultancy
                  <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0.3} />
                </span>
              </h1>

              <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
                Certified Notion administration, AI-powered workflow design, and operational systems that cut through the noise. Stop drowning in tabs. Start shipping with confidence.
              </p>

              <PillButton size="lg" icon={Rocket} className="font-semibold" asChild>
                <a href="#contact" onClick={() => trackCtaClick('Book an Intro Call', 'notion-systems-hero')}>
                  Book an Intro Call
                </a>
              </PillButton>
            </div>

            {/* Right: Photo */}
            <div className="relative hidden md:block">
              <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <img
                  src={notionHeroPhoto}
                  alt="Brendan — Notion Certified Admin with all four Notion Academy badges"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clarity Sessions */}
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
                60 minutes to unblock a specific problem, validate a decision, or get a second brain on a messy Notion setup. No long-term commitment required.
              </p>

              <p className="text-xl font-semibold font-sans mb-6">£300 (VAT incl.) · 60 Minutes</p>

              <PillButton icon={Rocket} asChild>
                <a href="#contact" onClick={() => trackCtaClick('Book a Notion Session', 'notion-sessions')}>
                  Book a Session
                </a>
              </PillButton>
            </div>

            <div>
              <h3 className="font-semibold font-sans mb-4">What You Leave With</h3>
              <ul className="space-y-3">
                {clarityOutputs.map((output, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span className="font-sans text-muted-foreground">{output}</span>
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
                Six one-hour mentorship sessions across six weeks. Transform how you work with Notion and AI without losing your creative edge. Build a custom productivity system that gives you back hours each week.
              </p>

              <p className="font-sans opacity-70 text-sm mb-2">
                <strong>Human-centered. Tool-agnostic. Creativity-first.</strong>
              </p>

              <p className="text-xl font-semibold font-sans mt-4 mb-6">£1,500 · 6 × 1hr Sessions</p>

              <PillButton variant="dark" icon={Zap} asChild>
                <a href="#contact" onClick={() => trackCtaClick('Start a Sprint', 'notion-sprint')}>
                  Start a Sprint
                </a>
              </PillButton>
            </div>

            <div>
              <h3 className="font-semibold font-sans mb-4">What You Leave With</h3>
              <ul className="space-y-3">
                {sprintOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-accent-foreground mt-1 flex-shrink-0" />
                    <span className="font-sans opacity-90">{outcome}</span>
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
                Ongoing Notion administration, workflow optimisation, and systems support as an integrated member of your team. I keep your operational backbone healthy so you can focus on the work that matters.
              </p>

              <PillButton icon={MessageCircle} asChild>
                <a href="#contact" onClick={() => trackCtaClick('Discuss Retainer', 'notion-retained')}>
                  Let's Talk
                </a>
              </PillButton>
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

      <Footer />
    </main>
  );
};

export default NotionSystemsPage;
