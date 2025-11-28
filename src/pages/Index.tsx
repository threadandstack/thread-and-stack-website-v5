import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { WhatWeDo } from "@/components/WhatWeDo";
import { WhoItsFor } from "@/components/WhoItsFor";
import { HowWeWork } from "@/components/HowWeWork";
import { OffersGrid } from "@/components/OffersGrid";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <div id="what-we-do"><WhatWeDo /></div>
      <div id="who-its-for"><WhoItsFor /></div>
      <div id="how-we-work"><HowWeWork /></div>
      <div id="offers"><OffersGrid /></div>
      <div id="about"><About /></div>
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
