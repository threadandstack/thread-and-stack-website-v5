import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/home-draft2/Hero";
import { Logos } from "@/components/home-draft2/Logos";
import { Problem } from "@/components/home-draft2/Problem";
import { Scorecard } from "@/components/home-draft2/Scorecard";
import { Engagements } from "@/components/home-draft2/Engagements";
import { CaseStudy } from "@/components/home-draft2/CaseStudy";
import { Testimonials } from "@/components/home-draft2/Testimonials";
import { FAQ } from "@/components/home-draft2/FAQ";
import { CTA } from "@/components/home-draft2/CTA";

const HomePageDraft2 = () => {
  return (
    <div className="notion-canvas min-h-screen">
      <Navigation variant="image-hero" />
      <main>
        <Hero />
        <Logos />
        <Problem />
        <Scorecard />
        <Engagements />
        <CaseStudy />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default HomePageDraft2;
