import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PillButton } from "@/components/ui/pill-button";
import { ArrowRight, Check, Zap, Clock, Users, Target, Repeat } from "lucide-react";

interface Offer {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  link: string;
  price: string;
  cta: string;
}

interface ServiceDrawerProps {
  offer: Offer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sessions & Sprints Content
const SessionsSprintsContent = () => {
  const clarityOutputs = [
    "The Recording: Full video/audio of the session",
    "The Summary: Thread AI transcription and summary of key decisions",
    "The Action Plan: A bulleted list of exactly what you need to do next"
  ];

  const sprintOutcomes = [
    "5-10 hours back each week through AI-enabled workflows",
    "A custom productivity system built for your actual role and tools",
    "Confidence using AI without second-guessing or quality drops"
  ];

  return (
    <div className="space-y-8">
      {/* Clarity Sessions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-light">Clarity Sessions</h3>
            <p className="text-sm text-accent">Rapid Strategic Intervention</p>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-xl p-6 mb-4">
          <p className="text-xl mb-2 font-semibold">One Hour. One Problem. Solved.</p>
          <p className="text-muted-foreground mb-4">
            Sometimes you don't need a 6-week sprint. Sometimes you just need 60 minutes to unblock a specific problem, validate a decision, or get a second brain on a messy situation.
          </p>
          <p className="text-lg font-medium">£300 (VAT incl.) • 60 Minutes</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">The Output</h4>
          <ul className="space-y-2">
            {clarityOutputs.map((output, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{output}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/30" />

      {/* Thread AI Sprint */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-light">Thread AI Sprint</h3>
            <p className="text-sm text-accent">6-Week Intensive</p>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-xl p-6 mb-4">
          <p className="text-muted-foreground mb-4">
            Transform how you work with AI without losing your creative edge. Build a custom productivity system that gives you back hours each week.
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Human-centered. Tool-agnostic. Creativity-first.</strong>
          </p>
          <p className="text-lg font-medium mt-4">From £1k • 6 Weeks</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">What You Leave With</h4>
          <ul className="space-y-2">
            {sprintOutcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Workshops Content
const WorkshopsContent = () => {
  const phases = [
    { title: "Discovery", desc: "Questionnaires, interviews, or customer research" },
    { title: "Workshop", desc: "Half-day diagnostic to 2-day sprint" },
    { title: "Output", desc: "Summary, strategic playbook, or pitch building" }
  ];

  const outcomes = [
    "Clarity over Confusion: Hard evidence, not assumptions",
    "Alignment over Arguments: Force consensus across teams",
    "Momentum over Stagnation: 3 months of work in 2 days",
    "Visual direction and brand world building foundations"
  ];

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-xl p-6">
        <p className="text-muted-foreground mb-4">
          Most brand strategy is a black box. You pay a fortune, wait three months, and get a PDF that gathers dust. This is different. It's a modular, co-created workshop system designed to fix the disconnect between your brand and your audience...on your terms.
        </p>
        <p className="text-lg font-medium">From £2k • Half-day to 2-day sprints</p>
      </div>

      <div>
        <h4 className="font-semibold mb-3">The Process</h4>
        <div className="space-y-3">
          {phases.map((phase, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-accent font-medium">{idx + 1}.</span>
              <div>
                <p className="font-medium">{phase.title}</p>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">What You Get</h4>
        <ul className="space-y-2">
          {outcomes.map((outcome, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{outcome}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Fractional & Deep Engagement Content
const FractionalDeepContent = () => {
  const fractionalModels = [
    { title: "Core Retainer", commitment: "2-3 days/month", price: "£2-3k/month" },
    { title: "Extended Retainer", commitment: "4-6 days/month", price: "£4-6k/month" },
    { title: "Strategic Leadership", commitment: "8-10 days/month", price: "£8-12k/month" }
  ];

  const projectTypes = [
    { title: "Brand Refresh", duration: "2-3 months", price: "£20-30k" },
    { title: "Positioning Overhaul", duration: "3-4 months", price: "£30-40k" },
    { title: "Complete Transformation", duration: "5-6 months", price: "£45-65k" }
  ];

  return (
    <div className="space-y-8">
      {/* Fractional */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-light">Fractional Strategy</h3>
            <p className="text-sm text-accent">Ongoing Partnership</p>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">
          I work as an integrated member of your team, providing ongoing strategic guidance on brand positioning, campaign development, creative direction, and visual identity systems.
        </p>

        <div className="space-y-2">
          {fractionalModels.map((model, idx) => (
            <div key={idx} className="bg-muted/30 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{model.title}</p>
                <p className="text-xs text-muted-foreground">{model.commitment}</p>
              </div>
              <p className="text-sm font-medium">{model.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/30" />

      {/* Deep Engagement */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-light">Deep Engagement</h3>
            <p className="text-sm text-accent">2-6 Month Projects</p>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Comprehensive strategic and creative projects for organizations ready to commit to transformation. Full brand refreshes, positioning overhauls, or complete marketing system builds.
        </p>

        <div className="space-y-2">
          {projectTypes.map((project, idx) => (
            <div key={idx} className="bg-muted/30 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{project.title}</p>
                <p className="text-xs text-muted-foreground">{project.duration}</p>
              </div>
              <p className="text-sm font-medium">{project.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ServiceDrawer = ({
  offer,
  open,
  onOpenChange,
}: ServiceDrawerProps) => {
  if (!offer) return null;

  const getContent = () => {
    if (offer.link === "/sessions-and-sprints") {
      return <SessionsSprintsContent />;
    }
    if (offer.link === "/workshops") {
      return <WorkshopsContent />;
    }
    if (offer.link === "/narratives-strategy" || offer.link === "/fractional-deep-engagement") {
      return <FractionalDeepContent />;
    }
    return null;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              {offer.icon}
            </div>
            <div>
              <SheetTitle className="text-2xl font-light">
                {offer.title}
              </SheetTitle>
              <p className="text-accent text-sm">
                {offer.tagline}
              </p>
            </div>
          </div>
        </SheetHeader>
        
        <div className="space-y-6">
          {getContent()}
          
          <div className="pt-6 border-t border-border/30">
            <PillButton className="w-full" icon={ArrowRight} asChild>
              <a href={offer.link}>View Full Details</a>
            </PillButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};