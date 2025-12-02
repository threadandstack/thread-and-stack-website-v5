import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { FAQ } from "@/components/FAQ";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const quoteFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phase_one: z.string().min(1, "Please select a Phase 1 option"),
  phase_two: z.string().min(1, "Please select a Phase 2 option"),
  phase_three: z.string().min(1, "Please select a Phase 3 option"),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

const Workshops = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phase_one: "",
      phase_two: "",
      phase_three: "",
    },
  });

  const handleQuoteSubmit = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("workshop_quote_requests")
        .insert([{
          name: values.name,
          email: values.email,
          phase_one: values.phase_one,
          phase_two: values.phase_two,
          phase_three: values.phase_three,
        }]);

      if (error) throw error;

      // Sync to Notion (fire and forget)
      const workshopMessage = [
        values.phase_one && `Phase 1: ${values.phase_one}`,
        values.phase_two && `Phase 2: ${values.phase_two}`,
        values.phase_three && `Phase 3: ${values.phase_three}`,
      ].filter(Boolean).join('\n');

      supabase.functions.invoke('sync-lead-to-notion', {
        body: {
          name: values.name,
          email: values.email,
          message: workshopMessage || 'Workshop quote request',
          source: 'workshop-quote'
        }
      }).catch(err => console.error('Notion sync error:', err));

      toast({
        title: "Quote request submitted!",
        description: "I'll review your selections and be in touch soon to discuss your workshop.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or email me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roiPoints = [
    {
      title: "Clarity over Confusion",
      description: "Stop guessing. We replace internal debates and assumptions with hard evidence—whether that's internal pain points or external customer truths."
    },
    {
      title: "Alignment over Arguments",
      description: "Silos kill brands. This process forces consensus. Your product, marketing, and sales teams will finally agree on the problem and the solution."
    },
    {
      title: "Momentum over Stagnation",
      description: "Strategy often dies in email chains. By condensing the decision-making into a sprint, we do 3 months of alignment work in 2 days."
    },
    {
      title: "Confidence over Risk",
      description: "Launching a brand refresh is expensive. Testing your positioning before you build the assets is the cheapest insurance policy you can buy."
    }
  ];

  const phases = [
    {
      phase: "Phase 1: Discovery",
      description: "We can't solve what we don't understand. We start by listening.",
      options: [
        { name: "The Pulse Check", price: "+£500", details: "Questionnaire to 5 key individuals, reviewed ahead of workshop" },
        { name: "The Deep Dive", price: "+£1.5k", details: "Questionnaire + 5x Pre-Workshop Pain Confession Sessions (1:1 interviews)" },
        { name: "The Market View", price: "+£3k", details: "Questionnaire + 5x Customer Interviews (speaking directly to your audience)" }
      ]
    },
    {
      phase: "Phase 2: The Workshop",
      description: "The crucible. We get in a room (virtual or physical) and do the work.",
      options: [
        { name: "Diagnostic", price: "+£1k", details: "Half Day (3 Hours) - Diagnosis & Alignment" },
        { name: "Strategy Session", price: "+£2k", details: "Full Day (6 Hours) - Diagnose + Solution" },
        { name: "The Sprint", price: "+£4k", details: "2-Day Sprint - Day 1: Diagnose + Solution, Day 2: Activation Proposal" }
      ]
    },
    {
      phase: "Phase 3: The Output",
      description: "Don't let the energy die in the room. Get a roadmap.",
      options: [
        { name: "The Summary", price: "+£750", details: "10-15 slides capturing key findings & next steps (48hr turnaround)" },
        { name: "The Playbook", price: "+£2k", details: "25-35 page strategic report with frameworks, principles, and roadmap" },
        { name: "The Pitch", price: "+£4k", details: "Everything in the Playbook + 2 Pitch Building Sessions" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-24 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-accent font-semibold mb-2">A Modular Strategy System for Purpose-Driven Brands</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Brand Connection Workshops
            </h1>
            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-accent mb-6">
              <p className="text-lg text-muted-foreground">
                Most brand strategy is a black box. You pay a fortune, wait three months, and get a PDF that gathers dust.
              </p>
              <p className="text-lg text-muted-foreground mt-3 font-semibold">
                This is different.
              </p>
              <p className="text-lg text-muted-foreground mt-2">
                It's a modular, co-created workshop system designed to fix the disconnect between your brand and your audience...on your terms.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <p className="text-lg mb-4 font-semibold">Total investment: From £2k (lean sprint) to £11k (comprehensive overhaul)</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              <a href="/#contact" className="flex items-center">
                Book a Scoping Call
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Outcome: ROI & Value</h2>
              <p className="text-lg text-muted-foreground mb-8">
                It's not just a workshop. It's an accelerator.
              </p>
              <div className="space-y-4">
                {roiPoints.map((point, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                    <p className="text-muted-foreground">{point.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-secondary/10 rounded-lg p-6 mt-6 border-l-4 border-accent">
                <p className="text-xl font-semibold text-muted-foreground">
                  "Grow not just faster, but truer."
                </p>
                <p className="text-muted-foreground mt-3">
                  This process ensures your growth is rooted in the reality of your value, not just the trends of the market.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">The Deliverable</h2>
              <p className="text-lg text-muted-foreground">
                You don't just leave with "good vibes." You leave with a Playbook—a toolkit of pricing, messaging, and behaviour that you can implement immediately.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">The Philosophy: Connection is Engineered</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Great brands don't just "happen." They are the result of asking deep questions, rigorous diagnosis, strategic storytelling and intentional content.
              </p>
              <p className="text-lg text-muted-foreground mb-4">This workshop series is designed to:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-lg">Unearth the truth about where you stand with your audience</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-lg">Diagnose the disconnect using behavioural psychology and brand frameworks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-lg">Build a roadmap that bridges the gap between who you are and who they need you to be</span>
                </li>
              </ul>
              
              <div className="bg-secondary/10 rounded-lg p-6 mt-8 border-l-4 border-accent">
                <p className="text-lg text-muted-foreground mb-4">
                  Being both a designer and a strategist means I understand how <span className="italic">aesthetic judgement</span> and strategic thinking work together—how a strong visual system supports your narrative, how <span className="italic">asset development</span> flows from positioning, how design decisions either reinforce or undermine what you're trying to say.
                </p>
                <p className="text-lg text-muted-foreground">
                  These workshops integrate your brand's story, your founder's intent—and the foundations of your business, your values—into a <span className="italic">visual identity</span>, <span className="italic">creative direction</span>, and design plays that echo your positioning—ensuring what you build feels cohesive, true, and ready to live in the world.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Build Your Own Roadmap</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Strategy shouldn't be one-size-fits-all. I've broken the process down into three distinct phases. You choose the depth (and the price) for each phase. Mix and match to build the workshop that fits your budget and your burning questions.
              </p>
              
              <div className="space-y-8">
                {phases.map((phase, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-8">
                    <h3 className="text-2xl font-semibold mb-3">{phase.phase}</h3>
                    <p className="text-muted-foreground mb-6">{phase.description}</p>
                    <div className="space-y-4">
                      {phase.options.map((option, optIndex) => (
                        <div key={optIndex} className="bg-secondary/10 rounded-lg p-4 border-l-4 border-accent">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{option.name}</h4>
                            <span className="text-accent font-semibold">{option.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{option.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Build Your Quote</h2>
              <p className="text-muted-foreground mb-8">
                Select your preferred option for each phase below. I'll receive your selections and reach out to discuss your specific needs and provide a detailed quote.
              </p>
              
              <form onSubmit={form.handleSubmit(handleQuoteSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      {...form.register("name")}
                      className="bg-background"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...form.register("email")}
                      className="bg-background"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phase_one">Phase 1: Discovery</Label>
                    <Select
                      onValueChange={(value) => form.setValue("phase_one", value)}
                      value={form.watch("phase_one")}
                    >
                      <SelectTrigger id="phase_one" className="bg-background">
                        <SelectValue placeholder="Select your Phase 1 option" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {phases[0].options.map((option, idx) => (
                          <SelectItem key={idx} value={option.name}>
                            {option.name} ({option.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.phase_one && (
                      <p className="text-sm text-destructive">{form.formState.errors.phase_one.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phase_two">Phase 2: The Workshop</Label>
                    <Select
                      onValueChange={(value) => form.setValue("phase_two", value)}
                      value={form.watch("phase_two")}
                    >
                      <SelectTrigger id="phase_two" className="bg-background">
                        <SelectValue placeholder="Select your Phase 2 option" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {phases[1].options.map((option, idx) => (
                          <SelectItem key={idx} value={option.name}>
                            {option.name} ({option.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.phase_two && (
                      <p className="text-sm text-destructive">{form.formState.errors.phase_two.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phase_three">Phase 3: The Output</Label>
                    <Select
                      onValueChange={(value) => form.setValue("phase_three", value)}
                      value={form.watch("phase_three")}
                    >
                      <SelectTrigger id="phase_three" className="bg-background">
                        <SelectValue placeholder="Select your Phase 3 option" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {phases[2].options.map((option, idx) => (
                          <SelectItem key={idx} value={option.name}>
                            {option.name} ({option.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.phase_three && (
                      <p className="text-sm text-destructive">{form.formState.errors.phase_three.message}</p>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Detailed Quote"}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-border text-center">
                <p className="text-muted-foreground mb-4">
                  Or prefer to discuss directly?
                </p>
                <Button size="lg" variant="outline" className="group" asChild>
                  <a href="/#contact">
                    Book a Scoping Call
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={[
        {
          question: "What are Brand Connection Workshops?",
          answer: "A modular, co-created workshop system designed to fix the disconnect between your brand and your audience. Unlike traditional brand strategy (black box, wait three months, get a PDF that gathers dust), this is transparent, collaborative, and built on your terms. You choose the depth and price for each phase: Discovery, Workshop, and Output."
        },
        {
          question: "How does the modular structure work?",
          answer: "The workshops are broken into three distinct phases, each with multiple options. Phase 1 (Discovery) ranges from £500-£3k, Phase 2 (The Workshop) from £1k-£4k, and Phase 3 (The Output) from £750-£4k. You mix and match to build the workshop that fits your budget and your burning questions. Total investment typically ranges from £2k (lean sprint) to £11k (comprehensive overhaul)."
        },
        {
          question: "Who should attend these workshops?",
          answer: "Purpose-driven brands facing the fundamental question: 'How do we scale the mission without losing the magic?' Typically teams of 5-30 people in scale-up mode, nonprofits repositioning, or established organizations needing brand alignment across siloed teams. The workshops work best with cross-functional representation: product, marketing, sales, and leadership."
        },
        {
          question: "What's the actual ROI of these workshops?",
          answer: "Four key outcomes: Clarity over Confusion (replace internal debates with hard evidence), Alignment over Arguments (force cross-functional consensus), Momentum over Stagnation (3 months of alignment work in 2 days), and Confidence over Risk (test positioning before building expensive assets). Think of it as the cheapest insurance policy you can buy before a brand refresh."
        },
        {
          question: "What makes this different from typical brand strategy?",
          answer: "Traditional brand strategy is often opaque and disconnected from implementation. This workshop system is collaborative, transparent, and built for immediate action. You don't just get insights - you get frameworks, principles, roadmaps, and trained teams ready to execute. The philosophy: great brands don't just 'happen,' they're the result of deep listening, rigorous diagnosis, and strategic storytelling."
        },
        {
          question: "How do I get started?",
          answer: "Use the quote builder on this page to select your preferred options for each phase, or book a scoping call to discuss your specific needs. I'll review your selections and reach out to provide a detailed quote tailored to your situation. No obligation, just clarity on what this would look like for you."
        },
        {
          question: "How does this relate to Thread & Stack's broader work?",
          answer: "The Brand Connection Workshops address the clarity and positioning side of our work - untangling the mess between what you mean and what you're actually saying. They complement our systems work (like Thread AI Mentorship Sprint) and longer-term engagements (Fractional Strategy and Deep Engagement). The core philosophy remains: grow not just faster, but truer."
        }
      ]} />
      <Footer />
    </div>
  );
};

export default Workshops;