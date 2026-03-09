import { PillButton } from "@/components/ui/pill-button";
import { Check, Rocket } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FAQ } from "@/components/FAQ";

const ClaritySessions = () => {
  const focusAreas = [
    {
      title: "Strategy & Creative Direction",
      examples: [
        '"I\'m stuck on this positioning statement."',
        '"Does this visual direction actually fit our brand?"',
        '"I have too many campaign ideas; which one is the winner?"',
        '"Our brand feels inconsistent across channels. Help me diagnose it."'
      ]
    },
    {
      title: "Systems & Workflow Design",
      examples: [
        '"My workspace is a mess. Where do I start?"',
        '"How do I build a content system that doesn\'t suck?"',
        '"Show me how to use AI for [specific creative task]."'
      ]
    }
  ];

  const outputs = [
    "The Recording: Full video/audio of the session so you don't have to take frantic notes",
    "The Summary: Thread AI transcription and summary of key decisions",
    "The Action Plan: A bulleted list of exactly what you need to do next"
  ];

  const faqItems = [
    {
      question: "What is a Clarity Session?",
      answer: "Exactly what it sounds like - a focused 60-minute session where we tackle whatever's stuck. Could be messaging that's not landing, a positioning problem you can't solve, an AI workflow you want to build but don't know where to start, or just a second opinion on a big decision. No long-term commitment, no drawn-out process. You book a slot, we get it sorted, you move forward."
    },
    {
      question: "How is this different from regular consulting?",
      answer: "Traditional consulting often requires multi-week commitments, discovery processes, and large retainers. Clarity Sessions are designed for speed and focus - one hour, one problem, solved. You get immediate strategic input without the overhead. Think of it as rapid strategic intervention for when you need to unblock something specific right now."
    },
    {
      question: "What kind of problems can we solve in one hour?",
      answer: "Anything that's creating a bottleneck in your marketing, strategy, or creative work. Common focuses include: positioning statements that aren't landing, campaign angles that need validation, visual identity diagnosis and creative direction decisions, Notion workspace organization, AI workflow design for creative tasks, messaging clarity, brand consistency issues, offer refinement, or strategic prioritization when you have too many ideas. If it's keeping you stuck, whether strategy or creative, we can likely tackle it."
    },
    {
      question: "What do I get after the session?",
      answer: "You get three things: The Recording (full video/audio so you don't need to take frantic notes), The Summary (Thread AI transcription and summary of key decisions), and The Action Plan (a bulleted list of exactly what you need to do next). You leave with clarity and an immediate path forward."
    },
    {
      question: "Do I need to prepare anything?",
      answer: "Send me your notes, context, or brief in advance and I'll review them before we meet. This ensures we hit the ground running and maximize our hour together. The more context you can share upfront, the deeper we can go during the session."
    },
    {
      question: "What if I need ongoing support after the session?",
      answer: "Many clients start with a Clarity Session and then move to other offerings if they need more comprehensive support - like the Thread AI Mentorship Sprint for ongoing workflow development, or Fractional Strategy for regular strategic partnership. But there's no obligation. The session stands alone as a complete deliverable."
    },
    {
      question: "How does Thread & Stack's AI Philosophy apply here?",
      answer: "If we're building AI workflows in the session, they'll follow my Thread AI philosophy: AI as a second brain and operations partner in the background, never replacing your creativity or judgment. The goal is to reduce cognitive load and give you back time, attention, and voice - not to automate away your decision-making."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-24 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-accent mb-2 not-italic">Rapid Strategic Intervention</p>
            <h1 className="text-5xl md:text-6xl mb-6 text-balance font-light">
              Clarity Sessions
            </h1>
            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-accent mb-6">
              <p className="text-lg text-muted-foreground">
                Sometimes you don't need a 6-week sprint. Sometimes you just need 60 minutes to unblock a specific problem, validate a decision, or get a second brain on a messy situation.
              </p>
            </div>
          </div>

          <div className="bg-card border-2 thread-border p-8 mb-12">
            <h3 className="text-2xl font-semibold mb-3">The Offer</h3>
            <p className="text-xl mb-4">One Hour. One Problem. Solved.</p>
            <p className="text-lg text-muted-foreground mb-4">
              A focused, high-intensity consulting session designed to clear the fog and give you an immediate path forward.
            </p>
            <p className="text-lg mb-2 not-italic"><strong>Price:</strong> £300 (VAT incl.)</p>
            <p className="text-lg mb-4 not-italic"><strong>Format:</strong> 60 Minutes (Virtual) + Recording + Action Plan</p>
            <p className="text-sm text-muted-foreground mb-6 italic">Send me your notes in advance, and I'll go over them beforehand.</p>
            <PillButton size="lg" icon={Rocket}>
              <a href="/#contact" className="flex items-center">
                Book a Clarity Session
              </a>
            </PillButton>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl mb-6 font-light">What we can solve in an hour</h2>
              <p className="text-lg text-muted-foreground mb-6">
                This isn't a "chat." We get straight to work. Common focuses include:
              </p>
              <div className="space-y-6">
                {focusAreas.map((area, index) => (
                  <div key={index} className="bg-card border-2 thread-border p-6">
                    <h3 className="text-xl font-semibold mb-4">{area.title}</h3>
                    <ul className="space-y-2">
                      {area.examples.map((example, exIndex) => (
                        <li key={exIndex} className="text-muted-foreground pl-4 border-l-2 border-accent/30">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl mb-6 font-light">The Output</h2>
              <p className="text-lg text-muted-foreground mb-6">
                You don't just get a call. You get an asset.
              </p>
              <div className="bg-muted/30 border-2 thread-border p-8">
                <ul className="space-y-3">
                  {outputs.map((output, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span className="text-lg">{output}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-card border-2 thread-border p-8 text-center">
              <h2 className="text-2xl mb-4 font-light">Ready to unblock?</h2>
              <p className="text-muted-foreground mb-6">
                Let's tackle your challenge together and get you clarity fast.
              </p>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group border thread-border not-italic">
                <a href="/#contact" className="flex items-center">
                  Book a Clarity Session
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
      <Footer />
    </div>
  );
};

export default ClaritySessions;
