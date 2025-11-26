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
      <Hero />
      <WhatWeDo />
      <WhoItsFor />
      <HowWeWork />
      <OffersGrid />
      <About />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
