import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AIPhilosophy } from "@/components/AIPhilosophy";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import brendanPhoto from "@/assets/brendan-brick.jpeg";
import brendanCollaboration from "@/assets/brendan-collaboration.jpeg";
import brendanWorkshop from "@/assets/brendan-workshop.jpeg";

const AboutPage = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl mb-12 font-light">
            About Thread & Stack
          </h1>
          
          <div className="space-y-16">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="relative">
                <img 
                  src={brendanPhoto} 
                  alt="Brendan - Thread & Stack founder"
                  className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto"
                />
              </div>
              
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-3xl font-light not-italic">
                  I'm Brendan, founder of Thread & Stack.
                </p>
                
                <p>
                  I've spent 12+ years in brand and marketing across global consumer brands, international consultancies, creative agencies, disruptive tech, ambitious start-ups and nonprofits.
                </p>
                
                <p>
                  Now I focus that experience on one thing: helping purpose-led teams turn messy marketing into clear narratives and practical workflows they can sustain.
                </p>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-6 text-lg leading-relaxed border-l-4 border-accent/20 pl-8">
              <h2 className="text-3xl font-light not-italic">The Problem I Solve</h2>
              
              <p>
                Most of the founders and teams I work with are already doing meaningful work. The problem isn't a lack of ideas. It's the gap between what they mean and what they're actually saying and shipping.
              </p>
              
              <p>
                There's a pile-up between intention and execution: tabs, documents, and half-finished drafts between what you want to say and what actually goes out the door.
              </p>
              
              <p>
                I call this the <strong>creative tax</strong>—the cognitive load of admin, chaos surrounding your work, and the context switching that drags you away from meaningful creative and strategic work.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <img 
                src={brendanCollaboration} 
                alt="Brendan collaborating with clients"
                className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto"
              />
              <img 
                src={brendanWorkshop} 
                alt="Brendan leading a workshop"
                className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full h-auto"
              />
            </div>
            
            <div className="prose prose-lg max-w-none space-y-6 text-lg leading-relaxed border-l-4 border-accent/20 pl-8">
              <h2 className="text-3xl font-light not-italic">How I Work</h2>
              
              <p>
                My work sits at the intersection of strategy, clarity and systems—protecting both your brand integrity and your team's creative energy.
              </p>
              
              <p>
                I help you untangle the mess, connect the dots, and keep your best ideas moving. Not by adding more processes, but by creating invisible scaffolding that reduces friction and cognitive load.
              </p>
              
              <p>
                The result? Brands that feel alive, teams that feel spacious, and work that actually ships.
              </p>
            </div>
            
            <div className="bg-accent/5 p-8 rounded-2xl space-y-6">
              <h2 className="text-3xl font-light not-italic">Background & Experience</h2>
              
              <div className="space-y-4 text-lg leading-relaxed">
                <p>
                  I've led brand and marketing at organizations including Nerve Tumours UK (where I led a nationwide rebrand and digital transformation), and worked with clients from eBay to early-stage ethical startups.
                </p>
                
                <p>
                  My experience spans brand strategy, content systems, team workshops, and AI-supported workflows. I've seen what works when teams are under pressure to scale while staying true to their mission.
                </p>
                
                <p className="font-light not-italic">
                  Now I focus on one thing: helping purpose-led teams protect what matters while building brands that actually grow.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-8">
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                asChild
              >
                <a href="/#contact">
                  Let's Work Together
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <AIPhilosophy />
      
      <Footer />
    </main>
  );
};

export default AboutPage;
