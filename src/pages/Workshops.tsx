import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Footer } from "@/components/Footer";

const Workshops = () => {
  const modules = [
    {
      title: "Brand Foundation",
      description: "Clarify your story, values, and positioning. Build a narrative that guides decisions and resonates with the right people."
    },
    {
      title: "Audience & Connection",
      description: "Define who you're for (and who you're not for). Understand what your audience actually needs and how you meet them."
    },
    {
      title: "Messaging & Voice",
      description: "Develop clear, compelling language that reflects your brand and makes it easier to communicate what you do."
    },
    {
      title: "Brand Systems & Behaviour",
      description: "Create decision filters, briefing tools, and practical artefacts so your brand works in day-to-day operations."
    }
  ];

  const outcomes = [
    "Clear positioning and narrative everyone on the team can explain",
    "Defined decision filters for strategy, marketing, and operations",
    "Practical messaging tools and language guidelines",
    "Alignment on audience, values, and how you show up",
    "Artefacts you can use immediately (brand briefs, messaging frameworks, etc.)"
  ];

  const faqs = [
    {
      q: "How long is a workshop?",
      a: "Workshops are modular. A single session typically runs 2-3 hours. Some teams book a full-day intensive, others spread sessions over a few weeks. We'll design the format that fits your schedule and goals."
    },
    {
      q: "Who should attend?",
      a: "Core team members who shape strategy, messaging, and operations. Usually founders, creative leads, and key operators. Smaller teams (3-8 people) tend to get the most value, but we can adapt for larger groups."
    },
    {
      q: "Do we need to have a brand already?",
      a: "Not necessarily. These workshops work for teams building their brand from scratch, teams refining an existing brand, or teams scaling and trying to protect the mission. We meet you where you are."
    },
    {
      q: "What's the difference between this and a Stacked Session?",
      a: "Stacked Sessions are 1:1 and focused on a specific challenge. Workshops are for teams and involve collaborative work to build alignment and shared language. If you're working solo or need quick clarity, book a Stacked Session. If you need team alignment, a workshop is better."
    },
    {
      q: "What happens after the workshop?",
      a: "You'll leave with clear artefacts and next steps. Some teams book follow-up sessions to refine or expand the work. Others take what they've built and run with it. You choose what fits."
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="py-6 px-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <a href="/" className="text-2xl font-bold hover:text-accent transition-colors">
            Thread & Stack
          </a>
        </div>
      </header>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-accent font-semibold mb-2">Modular brand strategy workshops</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Brand Connection Workshops
            </h1>
            <p className="text-2xl text-muted-foreground text-balance">
              Align your team on story, audience, and behaviour. Answer the big question: "How do we scale the mission without losing the magic?"
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <p className="text-lg mb-4 font-semibold">Custom pricing based on team size and scope</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              <a href="/#contact" className="flex items-center">
                Plan a Workshop
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Who this is for</h2>
              <p className="text-lg text-muted-foreground mb-6">
                You're a purpose-led team (2-50 people) who cares about mission, integrity, and impact. You're growing, but you're worried about losing what makes you different. You need clarity on positioning, alignment on strategy, and practical tools to protect the mission as you scale.
              </p>
              <p className="text-lg text-muted-foreground">
                These workshops are for teams who want to do brand work collaboratively, not have it done to them.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">The central question</h2>
              <div className="bg-secondary/10 rounded-lg p-8 border-l-4 border-accent">
                <p className="text-2xl font-semibold text-balance">
                  "How do we scale the mission without losing the magic?"
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Workshop modules</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Workshops are modular. We design the session(s) based on where you are and what you need. Here are the core modules:
              </p>
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                    <p className="text-muted-foreground">{module.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">What you leave with</h2>
              <div className="bg-secondary/10 rounded-lg p-8">
                <ul className="space-y-3">
                  {outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span className="text-lg">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">How it works</h2>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="text-accent font-mono text-sm font-semibold mb-2">Step 1</div>
                  <h3 className="text-xl font-semibold mb-2">Discovery & scoping</h3>
                  <p className="text-muted-foreground">
                    We talk through your challenges, goals, and team context. I'll design a workshop (or series) that fits your needs.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="text-accent font-mono text-sm font-semibold mb-2">Step 2</div>
                  <h3 className="text-xl font-semibold mb-2">Pre-work (optional)</h3>
                  <p className="text-muted-foreground">
                    Some workshops benefit from light pre-work (e.g., a short team survey or audit). Nothing heavy—just enough to make the session more focused.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="text-accent font-mono text-sm font-semibold mb-2">Step 3</div>
                  <h3 className="text-xl font-semibold mb-2">Collaborative workshop</h3>
                  <p className="text-muted-foreground">
                    We work together to build alignment, clarify positioning, and create practical tools. I facilitate; you bring the expertise on your mission and audience.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="text-accent font-mono text-sm font-semibold mb-2">Step 4</div>
                  <h3 className="text-xl font-semibold mb-2">Outputs & follow-up</h3>
                  <p className="text-muted-foreground">
                    You'll leave with clear artefacts (brand briefs, messaging frameworks, decision filters). I'll provide a summary and next steps. If you want ongoing support, we can schedule check-ins.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Common questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-border pb-6 last:border-0">
                    <h3 className="text-xl font-semibold mb-3">{faq.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to align your team?</h2>
              <p className="text-muted-foreground mb-6">
                Let's design a workshop that builds clarity, alignment, and practical tools for your brand.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
                <a href="/#contact" className="flex items-center">
                  Plan Your Workshop
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Workshops;
