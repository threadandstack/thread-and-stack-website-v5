import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { WhatWeDo } from "@/components/WhatWeDo";
import { WhoItsFor } from "@/components/WhoItsFor";
import { HowWeWork } from "@/components/HowWeWork";
import { OffersGrid } from "@/components/OffersGrid";
import { Testimonials } from "@/components/Testimonials";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { VerticalThreadWeave } from "@/components/VerticalThreadWeave";

const Index = () => {
  return (
    <main className="min-h-screen relative">
      <VerticalThreadWeave />
      <Navigation />
      <Hero />
      <div id="what-we-do"><WhatWeDo /></div>
      <div id="who-its-for"><WhoItsFor /></div>
      <div id="how-we-work"><HowWeWork /></div>
      <div id="offers"><OffersGrid /></div>
      <FeaturedProjects />
      <Testimonials />
      <div id="about"><About /></div>
      <Contact />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Index;
