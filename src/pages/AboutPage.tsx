import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { PillButton } from "@/components/ui/pill-button";
import { Rocket, Bot, Shield } from "lucide-react";
import brendanWalking from "@/assets/photos/shoreditch/brendan-27.jpg";
import notionAdmin from "@/assets/notion-certified-admin.png";
import notionAdvanced from "@/assets/notion-advanced.png";
import notionWorkflows from "@/assets/notion-workflows.png";
import notionEssentials from "@/assets/notion-essentials.png";
import notionAmbassadorBlack from "@/assets/notion-ambassador-black.png";

const AboutPage = () => {
  return (
    <main className="min-h-screen">
      <Navigation variant="image-hero" />

      {/* Hero — mobile: stacked photo then text; desktop: full-bleed overlay */}
      {/* Mobile stacked layout */}
      <section className="md:hidden">
        <div className="relative h-[60vh]">
          <img
            src={brendanWalking}
            alt="Brendan walking past street art in Shoreditch"
            className="absolute inset-0 w-full h-full object-cover object-[65%_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <h1 className="absolute bottom-6 left-6 z-10 text-5xl font-light text-white w-[50vw] text-left">
            Background &amp; Experience
          </h1>
        </div>
        <div className="bg-background px-6 pb-10 pt-6 relative z-10">
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              I studied Media, Communications &amp; Culture and Philosophy at Keele University, a combination that wasn't common at the time. Media Communications were dismissed as a "Mickey Mouse degree," and Philosophy was seen as a waste of time. I chose it because I saw the impact these two subjects could have together. Now, these disciplines underpin our modern world.
            </p>
            <p>
              That golden thread, following the ethics and impact of communications and culture, took me on a path working with a really wide range of clients and products. From international consultancies like Dentsu B2B working with some of the biggest brands in the world, to Global Content Strategy Lead at eBay developing strategy with worldwide impact.
            </p>
            <p>
              At agencies like Funraisin, Lightful, Scoota, and Aqueduct (now Flipside), I got front-row seats to best UX, CX and Accessibility practices. Among them are enterprise brands, to small nonprofits. Hollywood movies to more local consumer insurance ads.
            </p>
            <p className="font-medium text-foreground">
              Now I focus on one thing: helping purpose-led teams protect what matters while building brands that actually grow. The problem is always clarity. Strategic positioning paired with strong design craft. That's where I can help.
            </p>
          </div>
          <div className="mt-6">
            <PillButton size="lg" icon={Rocket} asChild>
              <a href="/#contact">Let's Work Together</a>
            </PillButton>
          </div>
        </div>
      </section>

      {/* Desktop full-bleed overlay */}
      <section className="relative hidden md:flex min-h-[90vh] items-end">
        <img
          src={brendanWalking}
          alt="Brendan walking past street art in Shoreditch"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-6 pb-16 pt-32">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-6xl lg:text-7xl font-light text-white mb-8">
              Background &amp; Experience
            </h1>
            <div className="space-y-4 text-lg leading-relaxed text-white/90 max-w-2xl">
              <p>
                I studied Media, Communications &amp; Culture and Philosophy at Keele University, a combination that wasn't common at the time. Media Communications were dismissed as a "Mickey Mouse degree," and Philosophy was seen as a waste of time. I chose it because I saw the impact these two subjects could have together. Now, these disciplines underpin our modern world.
              </p>
              <p>
                That golden thread, following the ethics and impact of communications and culture, took me on a path working with a really wide range of clients and products. From international consultancies like Dentsu B2B working with some of the biggest brands in the world, to Global Content Strategy Lead at eBay developing strategy with worldwide impact.
              </p>
              <p>
                At agencies like Funraisin, Lightful, Scoota, and Aqueduct (now Flipside), I got front-row seats to best UX, CX and Accessibility practices. Among them are enterprise brands, to small nonprofits. Hollywood movies to more local consumer insurance ads.
              </p>
              <p className="font-light text-white">
                Now I focus on one thing: helping purpose-led teams protect what matters while building brands that actually grow. The problem is always clarity. Strategic positioning paired with strong design craft. That's where I can help.
              </p>
            </div>
            <div className="mt-8">
              <PillButton size="lg" variant="dark" icon={Rocket} asChild>
                <a href="/#contact">Let's Work Together</a>
              </PillButton>
            </div>
          </div>
        </div>
      </section>

      {/* More about Brendan — credential cards */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold italic mb-12">
            More about Brendan
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Notion */}
            <div className="bg-card rounded-2xl p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-semibold italic">Notion Certified</h3>
              </div>

              <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                Brendan is a Certified Notion Admin and Official Notion Ambassador — one of a small group globally recognised by Notion for expertise in workspace design, workflow automation, and systems strategy.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <img src={notionAdmin} alt="Notion Certified Admin" className="h-24 w-auto" />
                <img src={notionAdvanced} alt="Notion Academy Advanced" className="h-24 w-auto" />
                <img src={notionWorkflows} alt="Notion Academy Workflows" className="h-24 w-auto" />
                <img src={notionEssentials} alt="Notion Academy Essentials" className="h-24 w-auto" />
              </div>
              <img
                src={notionAmbassadorBlack}
                alt="Notion Official Ambassador"
                className="h-14 w-auto"
              />
            </div>

            {/* AI Fluency */}
            <div className="bg-card rounded-2xl p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-semibold italic">Fluent in AI Frameworks</h3>
              </div>

              <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                Brendan holds Anthropic's AI Fluency &amp; Foundations certificate and Notion's AI Workflows badge. Thread&nbsp;&amp;&nbsp;Stack operates as an AI-first business — integrating AI into strategy, operations, and creative workflows to reduce cognitive load and give teams back time, attention, and voice.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-sans font-medium text-muted-foreground">
                  Anthropic AI Fluency &amp; Foundations
                </span>
                <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-sans font-medium text-muted-foreground">
                  Notion AI Workflows
                </span>
                <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-sans font-medium text-muted-foreground">
                  AI-First Business
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ
        items={[
          {
            question: "Who is Brendan and what is Thread & Stack?",
            answer:
              "I'm Brendan, founder of Thread & Stack - a brand and systems consultancy for purpose-led founders and teams. With 12+ years across global consumer brands, consultancies, creative agencies, tech, startups, and nonprofits, I focus on one thing: helping purpose-led teams turn messy marketing into clear narratives and practical workflows they can sustain.",
          },
          {
            question: "What's unique about Thread & Stack's approach?",
            answer:
              "I work at the intersection of brand strategy, creative direction, and systems design - protecting both your brand integrity and your team's creative energy. Being both a designer and a strategist is rare. It means I understand how aesthetic judgement and strategic thinking work together. I create invisible scaffolding that reduces friction and cognitive load without adding more processes.",
          },
          {
            question: "How does Thread & Stack use AI?",
            answer:
              "AI is a second brain and operations partner in the background - never a replacement for human creativity or judgment. My Thread AI Philosophy centers on creative empowerment: you feel more capable and confident (not automated), your brand voice remains authentically yours, and AI reduces cognitive load so your calendar feels spacious instead of suffocating.",
          },
        ]}
      />

      <Footer />
    </main>
  );
};

export default AboutPage;
