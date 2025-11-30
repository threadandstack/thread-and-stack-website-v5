import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

const ClaritySessions = () => {
  const focusAreas = [
    {
      title: "Strategy Unblocking",
      examples: [
        '"I\'m stuck on this positioning statement."',
        '"Does this campaign angle actually make sense?"',
        '"I have too many ideas—which one is the winner?"'
      ]
    },
    {
      title: "Notion / AI Triage",
      examples: [
        '"My workspace is a mess—where do I start?"',
        '"How do I build a CRM that doesn\'t suck?"',
        '"Show me how to use AI for [specific task]."'
      ]
    }
  ];

  const outputs = [
    "The Recording: Full video/audio of the session so you don't have to take frantic notes",
    "The Summary: Thread AI transcription and summary of key decisions",
    "The Action Plan: A bulleted list of exactly what you need to do next"
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <header className="py-6 px-6 border-b-2 thread-border">
        <div className="max-w-6xl mx-auto">
          <a href="/" className="text-2xl hover:text-accent transition-colors font-light">
            Thread & Stack
          </a>
        </div>
      </header>

      <section className="py-24 px-6">
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
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group border thread-border not-italic">
              <a href="/#contact" className="flex items-center">
                Book a Clarity Session
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
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

      <Footer />
    </div>
  );
};

export default ClaritySessions;
