import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, Clock } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FAQ } from "@/components/FAQ";
import { ContactDrawer } from "@/components/ContactDrawer";

const SessionsAndSprints = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  const clarityFocusAreas = [
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

  const clarityOutputs = [
    "The Recording: Full video/audio of the session so you don't have to take frantic notes",
    "The Summary: Thread AI transcription and summary of key decisions",
    "The Action Plan: A bulleted list of exactly what you need to do next"
  ];

  const sprintOutcomes = [
    "5-10 hours back each week through AI-enabled workflows",
    "A custom productivity system built for your actual role and tools",
    "Confidence using AI without second-guessing or quality drops",
    "Better creative output by focusing on work that matters",
    "A competitive edge that positions you for whatever comes next"
  ];

  const sprintStructure = [
    {
      week: "Week 1-2",
      title: "Foundation & Setup",
      description: "We map your current workflow, identify pain points, and start building your custom system. You stay in control; AI handles mechanical tasks."
    },
    {
      week: "Week 3-4",
      title: "Implementation & Integration",
      description: "We implement AI workflows tailored to your tools (Microsoft, Google, Notion, or browser-only). The principles transfer regardless of your ecosystem."
    },
    {
      week: "Week 5-6",
      title: "Refinement & Mastery",
      description: "We refine your system, troubleshoot friction points, and build sustainable habits. You'll work smarter, not harder."
    }
  ];

  const faqItems = [
    {
      question: "What is a Clarity Session?",
      answer: "Exactly what it sounds like - a focused 60-minute session where we tackle whatever's stuck. Could be messaging that's not landing, a positioning problem you can't solve, an AI workflow you want to build but don't know where to start, or just a second opinion on a big decision. No long-term commitment, no drawn-out process. You book a slot, we get it sorted, you move forward."
    },
    {
      question: "What is the Thread AI Sprint?",
      answer: "A 6-week intensive 1:1 program where we build AI-supported workflows tailored to your actual tools, role, and values. This isn't another generic ChatGPT course - it's about building a complete productivity system that gives you back 5-10 hours per week while protecting your creative edge."
    },
    {
      question: "How do I know which one I need?",
      answer: "If you have a specific problem that's blocking you right now - a positioning statement, creative direction decision, or workflow question - start with a Clarity Session. If you want to fundamentally change how you work with AI and build sustainable systems over time, the Sprint is better. Many clients start with a Clarity Session to test the fit, then move to a Sprint."
    },
    {
      question: "What kind of problems can we solve in one hour?",
      answer: "Anything that's creating a bottleneck in your marketing, strategy, or creative work. Common focuses include: positioning statements that aren't landing, campaign angles that need validation, visual identity diagnosis and creative direction decisions, Notion workspace organization, AI workflow design for creative tasks, messaging clarity, brand consistency issues, offer refinement, or strategic prioritization when you have too many ideas."
    },
    {
      question: "Is the Sprint just another ChatGPT course?",
      answer: "No. This is about building a complete productivity system tailored to your role, tools, and goals. ChatGPT might be one tool we use, but this is about the whole workflow - not just prompts. We focus on human-centered AI: you stay in control, AI handles mechanical tasks, and you handle creative decisions."
    },
    {
      question: "What if my company blocks AI tools?",
      answer: "We'll work with whatever your reality is. Many corporate environments have restrictions, and we can adapt. The principles transfer regardless of tools - whether you're working in Microsoft, Google, Notion, or browser-only environments."
    },
    {
      question: "What happens after the session or sprint?",
      answer: "Clarity Sessions stand alone as complete deliverables - you leave with a recording, summary, and action plan. After a Sprint, you'll have a working system and the skills to maintain it independently. Some clients book occasional Clarity Sessions for ongoing support, but you'll be self-sufficient."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="sessions-sprints" />

      {/* Clarity Sessions Section */}
      <section className="py-24 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-accent mb-2 not-italic">Focused Strategic Support</p>
            <h1 className="text-5xl md:text-6xl mb-6 text-balance font-light">
              Sessions & Sprints
            </h1>
            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-accent mb-6">
              <p className="text-lg text-muted-foreground">
                Two ways to get unstuck and build momentum. One-hour Clarity Sessions for rapid intervention, or six-week Sprints to transform how you work with AI.
              </p>
            </div>
          </div>

          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-light">Clarity Sessions</h2>
                <p className="text-accent">Rapid Strategic Intervention</p>
              </div>
            </div>

            <div className="bg-card border-2 thread-border p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-3">The Offer</h3>
              <p className="text-xl mb-4">One Hour. One Problem. Solved.</p>
              <p className="text-lg text-muted-foreground mb-4">
                A focused, high-intensity consulting session designed to clear the fog and give you an immediate path forward. Sometimes you don't need a 6-week sprint. Sometimes you just need 60 minutes to unblock a specific problem, validate a decision, or get a second brain on a messy situation.
              </p>
              <p className="text-lg mb-2 not-italic"><strong>Price:</strong> £300 (VAT incl.)</p>
              <p className="text-lg mb-4 not-italic"><strong>Format:</strong> 60 Minutes (Virtual) + Recording + Action Plan</p>
              <p className="text-sm text-muted-foreground mb-6 italic">Send me your notes in advance, and I'll go over them beforehand.</p>
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 group border thread-border not-italic"
                onClick={() => setContactOpen(true)}
              >
                Book a Clarity Session
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl mb-4 font-light">What we can solve in an hour</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  This isn't a "chat." We get straight to work. Common focuses include:
                </p>
                <div className="space-y-4">
                  {clarityFocusAreas.map((area, index) => (
                    <div key={index} className="bg-card border-2 thread-border p-6">
                      <h4 className="text-xl font-semibold mb-3">{area.title}</h4>
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
                <h3 className="text-2xl mb-4 font-light">The Output</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  You don't just get a call. You get an asset.
                </p>
                <div className="bg-muted/30 border-2 thread-border p-6">
                  <ul className="space-y-3">
                    {clarityOutputs.map((output, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                        <span className="text-lg">{output}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thread AI Sprint Section - Indigo Background */}
      <section id="thread-ai" className="py-24 px-6 bg-indigo text-indigo-foreground scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-light text-white">Thread AI Sprint</h2>
              <p className="text-white/80">A 6-Week Intensive for Purpose-Driven Marketers</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-8 mb-8 border-l-4 border-white/30">
            <h3 className="text-xl font-semibold mb-3 text-white">About Thread AI</h3>
            <p className="text-lg text-white/90 mb-4">
              Thread AI is my philosophy for working with AI as a marketing professional:
            </p>
            <p className="text-lg text-white/90 mb-2">
              <strong>Human-centered. Tool-agnostic. Creativity-first.</strong>
            </p>
            <ul className="space-y-2 text-white/80">
              <li>→ You stay in control. AI handles mechanical tasks, you handle creative decisions.</li>
              <li>→ Works in any ecosystem - Microsoft, Google, Notion, or browser-only. The principles transfer regardless of tools.</li>
              <li>→ AI frees up mental bandwidth for the creative, strategic work that actually moves the needle.</li>
            </ul>
            <p className="text-lg text-white/90 mt-4 font-semibold">
              It's about unlocking time, not replacing thinking.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-8 mb-8">
            <p className="text-lg mb-4 font-semibold text-white">Investment: From £1k</p>
            <Button 
              size="lg" 
              className="bg-white text-indigo hover:bg-white/90 group"
              onClick={() => setContactOpen(true)}
            >
              Book Engagement Call
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-light mb-6 text-white">Sprint Structure</h3>
              <div className="space-y-4">
                {sprintStructure.map((item, index) => (
                  <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-6">
                    <div className="text-white/70 font-mono text-sm font-semibold mb-2">
                      {item.week}
                    </div>
                    <h4 className="text-xl font-semibold mb-2 text-white">{item.title}</h4>
                    <p className="text-white/80">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-light mb-6 text-white">What you leave with</h3>
              <div className="bg-white/10 rounded-lg p-8">
                <ul className="space-y-3">
                  {sprintOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                      <span className="text-lg text-white/90">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-8 text-center mt-12">
            <h2 className="text-2xl mb-4 font-light text-white">Ready to get unstuck?</h2>
            <p className="text-white/80 mb-6">
              Whether you need a focused hour or a transformative six weeks, let's find the right fit.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-indigo hover:bg-white/90 group"
              onClick={() => setContactOpen(true)}
            >
              Start a Conversation
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
      <Footer />
    </div>
  );
};

export default SessionsAndSprints;
