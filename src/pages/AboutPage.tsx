import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AIPhilosophy } from "@/components/AIPhilosophy";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import brendanPhoto from "@/assets/brendan-graffiti-portrait.jpg";
import brendanCollaboration from "@/assets/brendan-collaboration.jpeg";
import brendanWorkshop from "@/assets/brendan-workshop.jpeg";
import brendanStreet from "@/assets/photos/shoreditch/brendan-26.jpg";
import brendanGeometric from "@/assets/photos/shoreditch/brendan-30.jpg";
import brendanPostits from "@/assets/brendan-postits.jpeg";
const AboutPage = () => {
  return <main className="min-h-screen">
      <Navigation />
      
      {/* Hero - full-width image with overlay */}
      <section className="pt-24 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl mb-8 font-light">
                About Thread & Stack
              </h1>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-3xl font-light not-italic">I'm Brendan, founder of Thread & Stack.</p>
                <p>
                  I've spent 12+ years in brand and marketing across global consumer brands, international consultancies, creative agencies, disruptive tech, ambitious start-ups and nonprofits.
                </p>
                <p>
                  Now I focus that experience on one thing: helping purpose-led teams turn messy marketing into clear narratives and practical workflows they can sustain.
                </p>
              </div>
            </div>
            <div className="relative">
              <img src={brendanPhoto} alt="Brendan - Thread & Stack founder" className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto object-cover aspect-[3/4]" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem I Solve - card layout */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-card p-10 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h2 className="text-3xl font-light not-italic mb-6">The Problem I Solve</h2>
              <div className="space-y-4 text-lg leading-relaxed">
                <p>
                  Most of the founders and teams I work with are already doing meaningful work. The problem isn't a lack of ideas. It's the gap between what they mean and what they're actually saying, showing, and shipping.
                </p>
                <p>
                  There's a pile-up between intention and execution: disconnected visual identity, inconsistent creative direction, tabs full of half-finished drafts, and brand guidelines that don't match what's going out the door.
                </p>
                <p>
                  I call this the <strong>creative tax</strong>: the cognitive load of admin, chaos surrounding your creative work, the context switching between strategy and execution, and the lack of design craft tying it all together. It drags you away from the meaningful creative and strategic work that actually moves the needle.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <img src={brendanGeometric} alt="Brendan against geometric street art" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Image strip */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <img src={brendanCollaboration} alt="Brendan collaborating with clients" className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-64 object-cover" />
            <img src={brendanWorkshop} alt="Brendan leading a workshop" className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-64 object-cover" />
            <img src={brendanPostits} alt="Workshop post-it notes and strategy" className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-64 object-cover" />
          </div>
        </div>
      </section>

      {/* How I Work link */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl"
            asChild
          >
            <a href="/how-i-work">
              Learn How I Work
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Background & Experience - card with image */}
      <section className="py-24 px-6 bg-accent text-accent-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <div className="md:col-span-3 space-y-6">
              <h2 className="text-3xl font-light not-italic">Background & Experience</h2>
              <div className="space-y-4 text-lg leading-relaxed opacity-90">
                <p>
                  I studied Media, Communications & Culture and Philosophy at Keele University, a combination that wasn't common at the time. Media Communications were dismissed as a "Mickey Mouse degree," and Philosophy was seen as a waste of time. I chose it because I saw the impact these two subjects could have together. Now, these disciplines underpin our modern world.
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
              <img src={brendanStreet} alt="Brendan walking through Shoreditch street art" className="rounded-2xl w-full h-auto object-cover shadow-[0_4px_16px_rgba(0,0,0,0.12)]" />
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]" asChild>
              <a href="/#contact">
                Let's Work Together
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      <FAQ items={[{
      question: "Who is Brendan and what is Thread & Stack?",
      answer: "I'm Brendan, founder of Thread & Stack - a brand and systems consultancy for purpose-led founders and teams. With 12+ years across global consumer brands, consultancies, creative agencies, tech, startups, and nonprofits, I focus on one thing: helping purpose-led teams turn messy marketing into clear narratives and practical workflows they can sustain."
    }, {
      question: "What's the core problem Thread & Stack solves?",
      answer: "The creative tax - the cognitive load of admin, chaos, and context-switching that drags you away from meaningful creative and strategic work. It's the pile-up between intention and execution: tabs, documents, and half-finished drafts between what you mean to say and what actually ships. I help teams untangle the mess, connect the dots, and keep their best ideas moving."
    }, {
      question: "What's unique about Thread & Stack's approach?",
      answer: "I work at the intersection of brand strategy, creative direction, and systems design - protecting both your brand integrity and your team's creative energy. Being both a designer and a strategist is rare. It means I understand how aesthetic judgement and strategic thinking work together - how visual identity supports narrative, how asset development flows from positioning, how design decisions reinforce or undermine messaging. I create invisible scaffolding that reduces friction and cognitive load without adding more processes. The result: brands that feel alive, teams that feel spacious, and work that actually ships."
    }, {
      question: "What's your background and experience?",
      answer: "I studied Media, Communications & Culture and Philosophy at Keele University - disciplines that now underpin our modern world. I've worked across international consultancies (Dentsu B2B), global brands (eBay), creative agencies (Funraisin, Lightful, Scoota, Aqueduct/Flipside), enterprise to small nonprofits, Hollywood to local ads, tech giants to energy companies. A huge range of products, missions, and audiences taught me one thing: the problem is always clarity."
    }, {
      question: "What services does Thread & Stack offer?",
      answer: "Five core offerings: Clarity Sessions (60-min strategic and creative interventions, from £300), Thread AI Mentorship Sprint (6-week AI workflow building, from £1k), Brand Connection Workshops (modular team strategy with visual direction, from £2k), Fractional Strategy (monthly retainer for ongoing strategic and creative partnership including brand positioning, creative direction, and asset development), and Deep Engagement (2-6 month transformation projects including visual identity development and brand world building, from £10-25k). Each addresses different needs across the strategy-to-execution spectrum."
    }, {
      question: "How does Thread & Stack use AI?",
      answer: "AI is a second brain and operations partner in the background - never a replacement for human creativity or judgment. My Thread AI Philosophy centers on creative empowerment: you feel more capable and confident (not automated), your brand voice remains authentically yours, and AI reduces cognitive load so your calendar feels spacious instead of suffocating. AI gives back time, attention, and voice."
    }, {
      question: "Who are Thread & Stack's ideal clients?",
      answer: "Purpose-led organizations across two main profiles: values-driven founders and small organizations (like B Corps, social enterprises, and nonprofits) who prioritize impact and integrity as they grow, and scaling teams (typically 2-50 people) led by founder-operators who are wearing too many hats and need to cut through unclear positioning and messy operational systems. If you're doing meaningful work but struggling with the gap between intention and execution, we should talk."
    }]} />
      
      <Footer />
    </main>;
};
export default AboutPage;