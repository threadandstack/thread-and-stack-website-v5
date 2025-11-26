import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Footer } from "@/components/Footer";

const MentorshipSprint = () => {
  const outcomes = [
    "A 'second brain' system tailored to your work, tools, and ethics",
    "AI workflows that save hours weekly without compromising your judgment",
    "Clear processes for recurring creative and operational tasks",
    "Confidence using AI as a co-pilot, not a crutch",
    "Time and energy back for the work that actually matters"
  ];

  const structure = [
    {
      week: "Week 1",
      title: "Foundation & context",
      description: "We map your current workflows, tools, and pain points. No assumptions—just listening."
    },
    {
      week: "Week 2-3",
      title: "Build your system",
      description: "We design and implement your 'second brain' in Notion (or your preferred tool), tailored to how you actually work."
    },
    {
      week: "Week 4-5",
      title: "AI integration",
      description: "We layer in AI workflows (prompts, automations, ethical guardrails) that fit your context and values."
    },
    {
      week: "Week 6",
      title: "Test, refine, sustain",
      description: "We test everything, troubleshoot friction, and build habits so the system sticks."
    }
  ];

  const faqs = [
    {
      q: "What tools do we use?",
      a: "Primarily Notion, but we adapt to your existing stack. If you use other tools (Airtable, Coda, etc.), we'll work with those. The goal is to meet you where you are, not force you into new software."
    },
    {
      q: "Do I need to be 'good at AI' already?",
      a: "Not at all. This sprint is for people who want to learn AI thoughtfully, not hack their way through generic prompts. We'll build your confidence step by step."
    },
    {
      q: "How much time does this require from me?",
      a: "We meet 1:1 weekly (60 minutes), plus you'll spend a few hours between sessions implementing and testing what we build. Think of it as an investment that pays back in time saved every week after."
    },
    {
      q: "What if my team wants to join?",
      a: "The Sprint is designed for 1:1 work, but we can adapt for small teams (2-3 people). If you have a larger team, the Brand Connection Workshops might be a better fit."
    },
    {
      q: "What happens after the 6 weeks?",
      a: "You'll have a working system and the skills to maintain and evolve it. Some clients book occasional check-in sessions (Stacked Sessions) for ongoing support, but you'll be self-sufficient by the end."
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
            <p className="text-accent font-semibold mb-2">6-week 1:1 mentorship</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Thread AI Mentorship Sprint
            </h1>
            <p className="text-2xl text-muted-foreground text-balance">
              Build a 'second brain' and AI-supported workflows tailored to your real tools, ethics, and working style. Save hours weekly. Protect creative energy.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <p className="text-lg mb-4 font-semibold">Investment varies based on scope</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              <a href="/#contact" className="flex items-center">
                Start the Sprint
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Who this is for</h2>
              <p className="text-lg text-muted-foreground mb-6">
                You're a founder, creative lead, or solo operator drowning in admin, context switching, and recurring tasks. You know AI could help, but you're skeptical of generic hacks and worried about losing your creative judgment.
              </p>
              <p className="text-lg text-muted-foreground">
                This sprint is for people who want to build systems that protect their taste and integrity—not replace them.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">What you'll build</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Over 6 weeks, we'll design and implement a 'second brain'—a personalized system that organizes your work, reduces friction, and integrates AI where it actually makes sense for you.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                No one-size-fits-all templates. No copying someone else's productivity stack. Everything is built around your reality: your tools, your ethics, your working style.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Sprint structure</h2>
              <div className="space-y-4">
                {structure.map((item, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <div className="text-accent font-mono text-sm font-semibold mb-2">
                      {item.week}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
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
              <h2 className="text-3xl font-bold mb-6">Why this works</h2>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Contextual, not generic</h3>
                  <p className="text-muted-foreground">
                    We don't copy templates. We build systems around your actual work, tools, and values.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Human-centered AI</h3>
                  <p className="text-muted-foreground">
                    AI is a co-pilot, not a replacement. We use it to protect your judgment and creative energy, not bypass them.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Sustainable habits</h3>
                  <p className="text-muted-foreground">
                    We build systems you'll actually use and maintain, not impressive setups that fall apart after a week.
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
              <h2 className="text-2xl font-bold mb-4">Ready to build your second brain?</h2>
              <p className="text-muted-foreground mb-6">
                Let's design a system that saves you hours every week and protects your best work.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
                <a href="/#contact" className="flex items-center">
                  Explore the Sprint
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

export default MentorshipSprint;
