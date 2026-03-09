import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { PillButton } from "@/components/ui/pill-button";
import { Compass, Rocket, Bot, Shield } from "lucide-react";
import brendanPhoto from "@/assets/brendan-graffiti-portrait.jpg";
import brendanStreet from "@/assets/photos/shoreditch/brendan-26.jpg";
import notionAdmin from "@/assets/notion-certified-admin.png";
import notionAdvanced from "@/assets/notion-advanced.png";
import notionWorkflows from "@/assets/notion-workflows.png";
import notionEssentials from "@/assets/notion-essentials.png";
import notionAmbassadorBlack from "@/assets/notion-ambassador-black.png";

const AboutPage = () => {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-24 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl mb-8 font-light">
                About Thread&nbsp;&amp;&nbsp;Stack
              </h1>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-3xl font-light not-italic">
                  I'm Brendan, founder of Thread&nbsp;&amp;&nbsp;Stack.
                </p>
                <p>
                  I've spent 12+ years in brand and marketing across global consumer brands, international consultancies, creative agencies, disruptive tech, ambitious start-ups and nonprofits.
                </p>
                <p>
                  Now I focus that experience on one thing: helping purpose-led teams turn messy marketing into clear narratives and practical workflows they can sustain.
                </p>
              </div>
              <div className="mt-8">
                <PillButton variant="outline" size="lg" icon={Compass} asChild>
                  <a href="/how-i-work">Learn How I Work</a>
                </PillButton>
              </div>
            </div>
            <div className="relative">
              <img
                src={brendanPhoto}
                alt="Brendan - Thread & Stack founder"
                className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto object-cover aspect-[3/4]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Qualifications — 2-column cards */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Notion */}
            <div className="bg-card rounded-2xl p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-semibold italic">Notion Certified</h2>
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
                <h2 className="text-2xl font-semibold italic">Fluent in AI Frameworks</h2>
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

      {/* Background & Experience */}
      <section className="py-24 px-6 bg-accent text-accent-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <div className="md:col-span-3 space-y-6">
              <h2 className="text-3xl font-light not-italic">Background &amp; Experience</h2>
              <div className="space-y-4 text-lg leading-relaxed opacity-90">
                <p>
                  I studied Media, Communications &amp; Culture and Philosophy at Keele University, a combination that wasn't common at the time. Media Communications were dismissed as a "Mickey Mouse degree," and Philosophy was seen as a waste of time. I chose it because I saw the impact these two subjects could have together. Now, these disciplines underpin our modern world.
                </p>
                <p>
                  That golden thread, following the ethics and impact of communications and culture, took me on a path working with a really wide range of clients and products. From international consultancies like Dentsu B2B working with some of the biggest brands in the world, to Global Content Strategy Lead at eBay developing strategy with worldwide impact.
                </p>
                <p>
                  At agencies like Funraisin, Lightful, Scoota, and Aqueduct (now Flipside), I got front-row seats to best UX, CX and Accessibility practices. Among them are enterprise brands, to small nonprofits. Hollywood movies to more local consumer insurance ads. A huge range of products, missions and audiences over quite a few agencies.
                </p>
                <p className="font-light not-italic">
                  Now I focus on one thing: helping purpose-led teams protect what matters while building brands that actually grow. I've seen the impact the wrong approach can have on great teams — the problem is always clarity. Strategic positioning paired with strong design craft. That's where I can help.
                </p>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <img
                src={brendanStreet}
                alt="Brendan walking through Shoreditch street art"
                className="rounded-2xl w-full h-auto object-cover shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>

          <div className="mt-16 text-center">
            <PillButton size="lg" variant="dark" icon={Rocket} asChild>
              <a href="/#contact">Let's Work Together</a>
            </PillButton>
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
            question: "What's the core problem Thread & Stack solves?",
            answer:
              "The creative tax - the cognitive load of admin, chaos, and context-switching that drags you away from meaningful creative and strategic work. It's the pile-up between intention and execution: tabs, documents, and half-finished drafts between what you mean to say and what actually ships. I help teams untangle the mess, connect the dots, and keep their best ideas moving.",
          },
          {
            question: "What's unique about Thread & Stack's approach?",
            answer:
              "I work at the intersection of brand strategy, creative direction, and systems design - protecting both your brand integrity and your team's creative energy. Being both a designer and a strategist is rare. It means I understand how aesthetic judgement and strategic thinking work together - how visual identity supports narrative, how asset development flows from positioning, how design decisions reinforce or undermine messaging. I create invisible scaffolding that reduces friction and cognitive load without adding more processes. The result: brands that feel alive, teams that feel spacious, and work that actually ships.",
          },
          {
            question: "What's your background and experience?",
            answer:
              "I studied Media, Communications & Culture and Philosophy at Keele University - disciplines that now underpin our modern world. I've worked across international consultancies (Dentsu B2B), global brands (eBay), creative agencies (Funraisin, Lightful, Scoota, Aqueduct/Flipside), enterprise to small nonprofits, Hollywood to local ads, tech giants to energy companies. A huge range of products, missions, and audiences taught me one thing: the problem is always clarity.",
          },
          {
            question: "How does Thread & Stack use AI?",
            answer:
              "AI is a second brain and operations partner in the background - never a replacement for human creativity or judgment. My Thread AI Philosophy centers on creative empowerment: you feel more capable and confident (not automated), your brand voice remains authentically yours, and AI reduces cognitive load so your calendar feels spacious instead of suffocating. AI gives back time, attention, and voice.",
          },
        ]}
      />

      <Footer />
    </main>
  );
};

export default AboutPage;
