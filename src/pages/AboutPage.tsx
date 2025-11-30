import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AIPhilosophy } from "@/components/AIPhilosophy";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";
import { HandDrawnArrowRight } from "@/components/icons/HandDrawnIcons";
import brendanPhoto from "@/assets/brendan-brick.jpeg";
import brendanCollaboration from "@/assets/brendan-collaboration.jpeg";
import brendanWorkshop from "@/assets/brendan-workshop.jpeg";

const AboutPage = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="py-24 px-6 mt-16">
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
                  I studied Media, Communications & Culture and Philosophy at Keele University—a combination that wasn't common at the time. Media Communications were dismissed as a "Mickey Mouse degree," and Philosophy was seen as a waste of time. I chose it because I saw the impact these two subjects could have together. Now, these disciplines underpin our modern world.
                </p>
                
                <p>
                  That golden thread—following the ethics and impact of communications and culture—took me on a path working with a really wide range of clients and products. From international consultancies like Dentsu B2B working with some of the biggest brands in the world, to Global Content Strategy Lead at eBay developing strategy with worldwide impact.
                </p>
                
                <p>
                  At agencies like Funraisin, Lightful, Scoota, and Aqueduct (now Flipside)—I got front-row seats to best UX, CX and Accessibility practices. Among them are enterprise brands, to small nonprofits. Hollywood movies to more local consumer insurance ads. Creative tech giants promoting their sustainability impact to energy giants, shifting their business narrative. Football teams, supermarkets, big tech, small tech, gaming, beauty, gambling, banks, social enterprises, nonprofits, global energy giants and digital paperless solutions. A huge range of products, missions and audiences over quite a few agencies.
                </p>
                
                <p className="font-light not-italic">
                  Now I focus on one thing: helping purpose-led teams protect what matters while building brands that actually grow. I've seen the impact the wrong approach can have on great teams - be they lean and nimble growth machines, or enterprise level powerhouses - the problem is always clarity. That's where I can help.
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
                  <HandDrawnArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <AIPhilosophy />
      
      <FAQ items={[
        {
          question: "Who is Brendan and what is Thread & Stack?",
          answer: "I'm Brendan, founder of Thread & Stack - a brand and systems consultancy for purpose-led founders and teams. With 12+ years across global consumer brands, consultancies, creative agencies, tech, startups, and nonprofits, I focus on one thing: helping purpose-led teams turn messy marketing into clear narratives and practical workflows they can sustain."
        },
        {
          question: "What's the core problem Thread & Stack solves?",
          answer: "The creative tax - the cognitive load of admin, chaos, and context-switching that drags you away from meaningful creative and strategic work. It's the pile-up between intention and execution: tabs, documents, and half-finished drafts between what you mean to say and what actually ships. I help teams untangle the mess, connect the dots, and keep their best ideas moving."
        },
        {
          question: "What's unique about Thread & Stack's approach?",
          answer: "I work at the intersection of strategy, clarity, and systems - protecting both your brand integrity and your team's creative energy. Unlike agencies focused on either creative or operations, I bridge both. I create invisible scaffolding that reduces friction and cognitive load without adding more processes. The result: brands that feel alive, teams that feel spacious, and work that actually ships."
        },
        {
          question: "What's your background and experience?",
          answer: "I studied Media, Communications & Culture and Philosophy at Keele University - disciplines that now underpin our modern world. I've worked across international consultancies (Dentsu B2B), global brands (eBay), creative agencies (Funraisin, Lightful, Scoota, Aqueduct/Flipside), enterprise to small nonprofits, Hollywood to local ads, tech giants to energy companies. A huge range of products, missions, and audiences taught me one thing: the problem is always clarity."
        },
        {
          question: "What services does Thread & Stack offer?",
          answer: "Five core offerings: Clarity Sessions (60-min strategic power hours, from £300), Thread AI Mentorship Sprint (6-week AI workflow building, from £1k), Brand Connection Workshops (modular team strategy, from £2k), Fractional Strategy (monthly retainer for ongoing partnership), and Deep Engagement (2-6 month transformation projects, from £10-25k). Each addresses different needs across the clarity-to-execution spectrum."
        },
        {
          question: "How does Thread & Stack use AI?",
          answer: "AI is a second brain and operations partner in the background - never a replacement for human creativity or judgment. My Thread AI Philosophy centers on creative empowerment: you feel more capable and confident (not automated), your brand voice remains authentically yours, and AI reduces cognitive load so your calendar feels spacious instead of suffocating. AI gives back time, attention, and voice."
        },
        {
          question: "Who are Thread & Stack's ideal clients?",
          answer: "Purpose-led organizations across two main profiles: values-driven founders and small organizations (like B Corps, social enterprises, and nonprofits) who prioritize impact and integrity as they grow, and scaling teams (typically 2-50 people) led by founder-operators who are wearing too many hats and need to cut through unclear positioning and messy operational systems. If you're doing meaningful work but struggling with the gap between intention and execution, we should talk."
        }
      ]} />
      
      <Footer />
    </main>
  );
};

export default AboutPage;
