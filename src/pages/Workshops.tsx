import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Footer } from "@/components/Footer";

const Workshops = () => {
  const roiPoints = [
    {
      title: "Clarity over Confusion",
      description: "Stop guessing. We replace internal debates and assumptions with hard evidence—whether that's internal pain points or external customer truths."
    },
    {
      title: "Alignment over Arguments",
      description: "Silos kill brands. This process forces consensus. Your product, marketing, and sales teams will finally agree on the problem and the solution."
    },
    {
      title: "Momentum over Stagnation",
      description: "Strategy often dies in email chains. By condensing the decision-making into a sprint, we do 3 months of alignment work in 2 days."
    },
    {
      title: "Confidence over Risk",
      description: "Launching a brand refresh is expensive. Testing your positioning before you build the assets is the cheapest insurance policy you can buy."
    }
  ];

  const phases = [
    {
      phase: "Phase 1: Discovery",
      description: "We can't solve what we don't understand. We start by listening.",
      options: [
        { name: "The Pulse Check", price: "+£500", details: "Questionnaire to 5 key individuals, reviewed ahead of workshop" },
        { name: "The Deep Dive", price: "+£1.5k", details: "Questionnaire + 5x Pre-Workshop Pain Confession Sessions (1:1 interviews)" },
        { name: "The Market View", price: "+£3k", details: "Questionnaire + 5x Customer Interviews (speaking directly to your audience)" }
      ]
    },
    {
      phase: "Phase 2: The Workshop",
      description: "The crucible. We get in a room (virtual or physical) and do the work.",
      options: [
        { name: "Diagnostic", price: "+£1k", details: "Half Day (3 Hours) - Diagnosis & Alignment" },
        { name: "Strategy Session", price: "+£2k", details: "Full Day (6 Hours) - Diagnose + Solution" },
        { name: "The Sprint", price: "+£4k", details: "2-Day Sprint - Day 1: Diagnose + Solution, Day 2: Activation Proposal" }
      ]
    },
    {
      phase: "Phase 3: The Output",
      description: "Don't let the energy die in the room. Get a roadmap.",
      options: [
        { name: "The Summary", price: "+£750", details: "10-15 slides capturing key findings & next steps (48hr turnaround)" },
        { name: "The Playbook", price: "+£2k", details: "25-35 page strategic report with frameworks, principles, and roadmap" },
        { name: "The Pitch", price: "+£4k", details: "Everything in the Playbook + 2 Pitch Building Sessions" }
      ]
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
            <p className="text-accent font-semibold mb-2">A Modular Strategy System for Purpose-Driven Brands</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Brand Connection Workshops
            </h1>
            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-accent mb-6">
              <p className="text-lg text-muted-foreground">
                Most brand strategy is a black box. You pay a fortune, wait three months, and get a PDF that gathers dust.
              </p>
              <p className="text-lg text-muted-foreground mt-3 font-semibold">
                This is different.
              </p>
              <p className="text-lg text-muted-foreground mt-2">
                It's a modular, co-created workshop system designed to fix the disconnect between your brand and your audience...on your terms.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <p className="text-lg mb-4 font-semibold">Total investment: From £2k (lean sprint) to £11k (comprehensive overhaul)</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              <a href="/#contact" className="flex items-center">
                Book a Scoping Call
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Outcome: ROI & Value</h2>
              <p className="text-lg text-muted-foreground mb-8">
                It's not just a workshop. It's an accelerator.
              </p>
              <div className="space-y-4">
                {roiPoints.map((point, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                    <p className="text-muted-foreground">{point.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-secondary/10 rounded-lg p-6 mt-6 border-l-4 border-accent">
                <p className="text-xl font-semibold text-muted-foreground">
                  "Grow not just faster, but truer."
                </p>
                <p className="text-muted-foreground mt-3">
                  This process ensures your growth is rooted in the reality of your value, not just the trends of the market.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">The Deliverable</h2>
              <p className="text-lg text-muted-foreground">
                You don't just leave with "good vibes." You leave with a Playbook—a toolkit of pricing, messaging, and behaviour that you can implement immediately.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">The Philosophy: Connection is Engineered</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Great brands don't just "happen." They are the result of deep listening, rigorous diagnosis, and strategic storytelling.
              </p>
              <p className="text-lg text-muted-foreground mb-4">This workshop series is designed to:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-lg">Unearth the truth about where you stand with your audience</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-lg">Diagnose the disconnect using behavioural psychology and brand frameworks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-lg">Build a roadmap that bridges the gap between who you are and who they need you to be</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Build Your Own Roadmap</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Strategy shouldn't be one-size-fits-all. I've broken the process down into three distinct phases. You choose the depth (and the price) for each phase. Mix and match to build the workshop that fits your budget and your burning questions.
              </p>
              
              <div className="space-y-8">
                {phases.map((phase, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-8">
                    <h3 className="text-2xl font-semibold mb-3">{phase.phase}</h3>
                    <p className="text-muted-foreground mb-6">{phase.description}</p>
                    <div className="space-y-4">
                      {phase.options.map((option, optIndex) => (
                        <div key={optIndex} className="bg-secondary/10 rounded-lg p-4 border-l-4 border-accent">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{option.name}</h4>
                            <span className="text-accent font-semibold">{option.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{option.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to build your workshop?</h2>
              <p className="text-muted-foreground mb-6">
                Let's map out the right combination for you.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
                <a href="/#contact" className="flex items-center">
                  Book a Scoping Call
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