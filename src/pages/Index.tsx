import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroAlt } from "@/components/HeroAlt";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { WhatWeDo } from "@/components/WhatWeDo";
import { WhoItsFor } from "@/components/WhoItsFor";
import { OffersGrid } from "@/components/OffersGrid";
import { Testimonials } from "@/components/Testimonials";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { useScrollDepthTracking } from "@/hooks/useAnalytics";

const Index = () => {
  useEffect(() => {
    const cleanup = useScrollDepthTracking('homepage');
    return cleanup;
  }, []);
  const faqItems = [
    {
      question: "What makes Thread & Stack different from other consultancies?",
      answer: "We combine deep brand strategy with practical systems thinking. While most agencies focus on either creative or operations, we bridge both - helping you build brands that feel alive while creating workflows that protect your creative energy. Our approach integrates AI not as a replacement for human creativity, but as a co-pilot that reduces cognitive load so you can focus on meaningful work."
    },
    {
      question: "Who do you work with?",
      answer: "We work with purpose-led organizations across two main profiles: values-driven founders and small organizations (like B Corps, social enterprises, and nonprofits) who prioritize impact and integrity as they grow, and scaling teams (typically 2-50 people) led by founder-operators who are wearing too many hats and need to cut through unclear positioning and messy operational systems to focus on what matters."
    },
    {
      question: "What's the 'creative tax' you mention?",
      answer: "The creative tax is the cognitive load of admin, chaos, and context-switching that drags you away from meaningful creative and strategic work. It's the pile-up of tabs, documents, and half-finished drafts between what you mean to say and what you actually ship. Our work reduces this tax through clear positioning, practical workflows, and AI-supported systems."
    },
    {
      question: "How do you use AI in your work?",
      answer: "We see AI as a second brain and operations partner in the background - never a replacement for human creativity or judgment. Our AI Philosophy centers on creative empowerment: helping you feel more capable and confident, ensuring your brand voice remains authentically yours, and reducing cognitive load so your calendar feels spacious instead of suffocating. AI gives back time, attention, and voice."
    },
    {
      question: "What are your service offerings?",
      answer: "We offer five core services: Clarity Sessions (60-minute strategic power hours, from £300), Thread AI Mentorship Sprint (6-week 1:1 mentorship, from £1k), Brand Connection Workshops (modular team workshops, from £2k), Fractional Strategy (monthly retainer for ongoing brand and campaign strategy), and Deep Engagement (2-6 month projects for brand refreshes and complete transformations, from £10-25k)."
    },
    {
      question: "How do I get started?",
      answer: "The easiest way to start is with a Clarity Session - a focused 60-minute call where we tackle whatever's stuck. Whether it's messaging that's not landing, a positioning problem, an AI workflow you want to build, or just a second opinion on a big decision, we get it sorted in one session. No long-term commitment required."
    },
    {
      question: "What's the Stacked Behaviours newsletter?",
      answer: "Stacked Behaviours is where I share thoughts on brand, creativity, and the systems that build our businesses. Subscribe and I'll send you monthly signals on building brands that stay true while scaling - covering behavioral strategy, AI in marketing, and honest takes on running a purpose-driven practice."
    }
  ];

  return (
    <main className="min-h-screen relative">
      <ScrollIndicator />
      <Navigation variant="image-hero" />
      <HeroAlt />
      <div id="what-we-do"><WhatWeDo /></div>
      <div id="who-its-for"><WhoItsFor /></div>
      <FeaturedProjects />
      <div id="offers"><OffersGrid /></div>
      <Testimonials />
      <div id="about"><About /></div>
      <Contact />
      <Newsletter />
      <FAQ items={faqItems} />
      <Footer />
    </main>
  );
};

export default Index;
