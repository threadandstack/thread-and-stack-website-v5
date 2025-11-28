import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { WhatWeDo } from "@/components/WhatWeDo";
import { WhoItsFor } from "@/components/WhoItsFor";
import { HowWeWork } from "@/components/HowWeWork";
import { AIPhilosophy } from "@/components/AIPhilosophy";
import { OffersGrid } from "@/components/OffersGrid";
import { Testimonials } from "@/components/Testimonials";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { ThreadWeave } from "@/components/ThreadWeave";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ThreadWeave />
      <div id="what-we-do"><WhatWeDo /></div>
      <ThreadWeave className="rotate-180" />
      <div id="who-its-for"><WhoItsFor /></div>
      <ThreadWeave />
      <div id="how-we-work"><HowWeWork /></div>
      <ThreadWeave className="rotate-180" />
      <AIPhilosophy />
      <ThreadWeave />
      <div id="offers"><OffersGrid /></div>
      <ThreadWeave />
      <FeaturedProjects />
      <ThreadWeave className="rotate-180" />
      <Testimonials />
      <ThreadWeave />
      <div id="about"><About /></div>
      <ThreadWeave className="rotate-180" />
      <Contact />
      <ThreadWeave />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Index;
