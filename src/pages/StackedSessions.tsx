import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Footer } from "@/components/Footer";

const StackedSessions = () => {
  const problems = [
    "Your positioning feels vague or hard to explain",
    "You're stuck between two directions and need clarity fast",
    "Your messaging doesn't match the work you actually do",
    "You have a systems or workflow tangle that's slowing you down",
    "You need a second pair of eyes on strategy or comms"
  ];

  const process = [
    {
      step: "1",
      title: "Book a session",
      description: "Choose a time that works for you. We'll meet on Zoom."
    },
    {
      step: "2",
      title: "Brief prep",
      description: "You'll share a bit of context before we meet (nothing heavy—just enough to hit the ground running)."
    },
    {
      step: "3",
      title: "60-minute strategic sprint",
      description: "We dig into your challenge, work through decisions together, and create a clear path forward."
    },
    {
      step: "4",
      title: "Leave with clarity",
      description: "You walk away with a decision, an action plan, and language you can use immediately."
    }
  ];

  const faqs = [
    {
      q: "What can we cover in 60 minutes?",
      a: "More than you'd think. These sessions are tightly focused—we're not trying to rebuild your entire brand in an hour. We're making one clear decision or solving one specific problem. Think: refining your positioning statement, untangling a messaging knot, diagnosing a workflow issue, or choosing between strategic options."
    },
    {
      q: "Is this right for my team size?",
      a: "Yes. Stacked Sessions work for solo founders, small teams, and growing organizations. If you have a focused challenge and want strategic clarity fast, this is for you."
    },
    {
      q: "What if I need more than one session?",
      a: "That's fine. Some people book a single session for a specific challenge. Others book a few sessions spaced out over time. You choose what fits."
    },
    {
      q: "What happens after the session?",
      a: "You'll get a short follow-up summary with the key decisions and action steps we discussed. If you want ongoing support, we can talk about the Mentorship Sprint or Workshop options."
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
            <p className="text-accent font-semibold mb-2">60-minute strategic power hours</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Stacked Sessions
            </h1>
            <p className="text-2xl text-muted-foreground text-balance">
              Unblock positioning, refine an offer, diagnose a messy system, or untangle a messaging problem. Fast, focused, strategic.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <p className="text-lg mb-4 font-semibold">Investment: ~£300 per session</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              <a href="/#contact" className="flex items-center">
                Book a Stacked Session
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Who this is for</h2>
              <p className="text-lg text-muted-foreground mb-6">
                You're a founder, creative lead, or operator who needs strategic clarity on a specific challenge—and you need it now. You don't have months for a long engagement. You need focused thinking, a clear decision, and language you can use immediately.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Problems we solve</h2>
              <ul className="space-y-3">
                {problems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <span className="text-lg">{problem}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">How it works</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {process.map((item, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <div className="text-accent font-mono text-sm font-semibold mb-3">
                      Step {item.step}
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
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <span className="text-lg">A clear decision or direction</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <span className="text-lg">Specific language and messaging you can use immediately</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <span className="text-lg">A focused action plan (no overwhelm, just clear next steps)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <span className="text-lg">Follow-up summary of key decisions and actions</span>
                  </li>
                </ul>
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
              <h2 className="text-2xl font-bold mb-4">Ready to unblock something?</h2>
              <p className="text-muted-foreground mb-6">
                Let's tackle your challenge together. Book a Stacked Session and get clarity fast.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
                <a href="/#contact" className="flex items-center">
                  Book Your Session
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

export default StackedSessions;
