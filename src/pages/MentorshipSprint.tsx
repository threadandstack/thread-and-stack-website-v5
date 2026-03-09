import { PillButton } from "@/components/ui/pill-button";
import { Check, Rocket } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FAQ } from "@/components/FAQ";

const MentorshipSprint = () => {
  const outcomes = [
    "5-10 hours back each week through AI-enabled workflows",
    "A custom productivity system built for your actual role and tools",
    "Confidence using AI without second-guessing or quality drops",
    "Better creative output by focusing on work that matters",
    "A competitive edge that positions you for whatever comes next"
  ];

  const structure = [
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

  const faqs = [
    {
      q: "Is this just another ChatGPT course?",
      a: "No. This is about building a complete productivity system tailored to your role, tools, and goals. ChatGPT might be one tool we use, but this is about the whole workflow, not just prompts."
    },
    {
      q: "What if my company blocks AI tools?",
      a: "We'll work with whatever your reality is. Many corporate environments have restrictions, and we can adapt. I've worked with clients navigating IT approval processes and Microsoft ecosystems."
    },
    {
      q: "I'm not technical - will I be able to do this?",
      a: "Yes. This isn't about being technical. It's about being willing to learn and experiment. If you can use a search engine and follow instructions, you can do this."
    },
    {
      q: "What if I don't have time for homework?",
      a: "This works best when you can dedicate 2-3 hours per week between sessions. If you're completely underwater right now, it might be worth waiting for a calmer moment."
    },
    {
      q: "What happens after the 6 weeks?",
      a: "You'll have a working system and the skills to maintain it. Some clients book occasional Clarity Sessions for ongoing support, but you'll be self-sufficient by the end."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-24 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-accent font-semibold mb-2">A 6-Week Intensive for Purpose-Driven Marketers</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Thread AI Mentorship Sprint
            </h1>
            <p className="text-2xl text-muted-foreground text-balance">
              Transform how you work with AI - without losing your creative edge.
            </p>
          </div>

          <div className="bg-secondary/10 rounded-lg p-8 mb-12 border-l-4 border-accent">
            <h3 className="text-xl font-semibold mb-3">About Thread AI</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Thread AI is my philosophy for working with AI as a marketing professional:
            </p>
            <p className="text-lg text-muted-foreground mb-2">
              <strong>Human-centered. Tool-agnostic. Creativity-first.</strong>
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>→ You stay in control. AI handles mechanical tasks, you handle creative decisions.</li>
              <li>→ Works in any ecosystem - Microsoft, Google, Notion, or browser-only. The principles transfer regardless of tools.</li>
              <li>→ AI frees up mental bandwidth for the creative, strategic work that actually moves the needle.</li>
            </ul>
            <p className="text-lg text-muted-foreground mt-4 font-semibold">
              It's about unlocking time, not replacing thinking.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <p className="text-lg mb-4 font-semibold">Investment: From £1k</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              <a href="/#contact" className="flex items-center">
                Book Engagement Call
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Who this is for</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Purpose-driven marketers who want to implement AI into their workflow without sacrificing quality or creativity.
              </p>
              <p className="text-lg text-muted-foreground">
                The plan is to amplify what you already do well - not replace your creative input. We want to free up mental space for the strategic, contributive work that actually matters.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">The Outcome</h2>
              <p className="text-lg text-muted-foreground mb-6">
                After 6 weeks, you'll work smarter, not harder. And you'll have the systems to prove it.
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

      <FAQ items={[
        {
          question: "What is the Thread AI Mentorship Sprint?",
          answer: "A 6-week intensive 1:1 program where we build AI-supported workflows tailored to your actual tools, role, and values. This isn't another generic ChatGPT course - it's about building a complete productivity system that gives you back 5-10 hours per week while protecting your creative edge."
        },
        {
          question: "Is this just another ChatGPT course?",
          answer: "No. This is about building a complete productivity system tailored to your role, tools, and goals. ChatGPT might be one tool we use, but this is about the whole workflow - not just prompts. We focus on human-centered AI: you stay in control, AI handles mechanical tasks, and you handle creative decisions."
        },
        {
          question: "What if my company blocks AI tools?",
          answer: "We'll work with whatever your reality is. Many corporate environments have restrictions, and we can adapt. The principles transfer regardless of tools - whether you're working in Microsoft, Google, Notion, or browser-only environments. I've worked with clients navigating IT approval processes and enterprise ecosystems successfully."
        },
        {
          question: "I'm not technical - will I be able to do this?",
          answer: "Yes. This isn't about being technical. It's about being willing to learn and experiment. If you can use a search engine and follow instructions, you can do this. The focus is on practical workflows that reduce your cognitive load, not complex technical implementations."
        },
        {
          question: "What time commitment is required?",
          answer: "You'll need to dedicate 2-3 hours per week between our sessions for implementation and experimentation. This works best when you can carve out focused time to build new habits. If you're completely underwater right now, it might be worth waiting for a calmer moment to get the full value."
        },
        {
          question: "What happens after the 6 weeks?",
          answer: "You'll have a working system and the skills to maintain it independently. Some clients book occasional Clarity Sessions for ongoing support or optimization, but you'll be self-sufficient by the end of the sprint. The goal is to build sustainable systems that outlive our engagement."
        },
        {
          question: "How does this fit with Thread & Stack's overall approach?",
          answer: "The Thread AI Mentorship Sprint embodies our core philosophy: reducing the creative tax (cognitive load from admin and chaos) so you can focus on meaningful work. AI becomes your second brain and operations partner in the background - giving back time, attention, and voice while protecting your judgment and creativity."
        }
      ]} />
      <Footer />
    </div>
  );
};

export default MentorshipSprint;
