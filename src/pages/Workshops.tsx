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
import { ContactDrawer } from "@/components/ContactDrawer";

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
  const [contactOpen, setContactOpen] = useState(false);
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
      description: "Stop guessing. We replace internal debates and assumptions with hard evidence, whether that's internal pain points or external customer truths."
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
      phase: "Phase 1",
      title: "Discovery",
      description: "We listen before we leap.",
      options: [
        { name: "The Pulse Check", price: "+£500" },
        { name: "The Deep Dive", price: "+£1.5k" },
        { name: "The Market View", price: "+£3k" }
      ]
    },
    {
      phase: "Phase 2",
      title: "The Workshop",
      description: "We get in a room and do the work.",
      options: [
        { name: "Diagnostic", price: "+£1k" },
        { name: "Strategy Session", price: "+£2k" },
        { name: "The Sprint", price: "+£4k" }
      ]
    },
    {
      phase: "Phase 3",
      title: "The Output",
      description: "You leave with a roadmap, not just notes.",
      options: [
        { name: "The Summary", price: "+£750" },
        { name: "The Playbook", price: "+£2k" },
        { name: "The Pitch", price: "+£4k" }
      ]
    }
  ];

  const phaseDetails = [
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
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="workshops" />

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
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 group"
              onClick={() => setContactOpen(true)}
            >
              Book a Scoping Call
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
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
                You don't just leave with "good vibes." You leave with a Playbook: a toolkit of pricing, messaging, and behaviour that you can implement immediately.
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
                  Being both a designer and a strategist means I understand how <span className="italic">aesthetic judgement</span> and strategic thinking work together: how a strong visual system supports your narrative, how <span className="italic">asset development</span> flows from positioning, how design decisions either reinforce or undermine what you're trying to say.
                </p>
                <p className="text-lg text-muted-foreground">
                  These workshops integrate your brand's story, your founder's intent, and the foundations of your business, your values, into a <span className="italic">visual identity</span>, <span className="italic">creative direction</span>, and design plays that echo your positioning. What you build feels cohesive, true, and ready to live in the world.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Build Your Workshop - Indigo Background */}
      <section className="py-24 px-6 bg-indigo text-indigo-foreground">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">Build Your Workshop</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {phases.map((phase, index) => (
              <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-4 md:p-6 flex flex-col">
                <div className="text-white/70 font-mono text-sm font-semibold mb-1">{phase.phase}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-1 text-white">{phase.title}</h3>
                <p className="text-white/60 text-sm mb-4">{phase.description}</p>
                <ul className="space-y-2 flex-1">
                  {phase.options.map((option, optIndex) => (
                    <li key={optIndex} className="flex justify-between items-center text-sm">
                      <span className="text-white/80">{option.name}</span>
                      <span className="text-white font-semibold">{option.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Build Your Quote</h2>
            <p className="text-white/80 mb-8">
              Select your preferred option for each phase below. I'll receive your selections and reach out to discuss your specific needs and provide a detailed quote.
            </p>
            
            <form onSubmit={form.handleSubmit(handleQuoteSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    {...form.register("name")}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-300">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...form.register("email")}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-300">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phase_one" className="text-white">Phase 1: Discovery</Label>
                  <Select
                    onValueChange={(value) => form.setValue("phase_one", value)}
                    value={form.watch("phase_one")}
                  >
                    <SelectTrigger id="phase_one" className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select your Phase 1 option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {phaseDetails[0].options.map((option, idx) => (
                        <SelectItem key={idx} value={option.name}>
                          {option.name} ({option.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.phase_one && (
                    <p className="text-sm text-red-300">{form.formState.errors.phase_one.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phase_two" className="text-white">Phase 2: The Workshop</Label>
                  <Select
                    onValueChange={(value) => form.setValue("phase_two", value)}
                    value={form.watch("phase_two")}
                  >
                    <SelectTrigger id="phase_two" className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select your Phase 2 option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {phaseDetails[1].options.map((option, idx) => (
                        <SelectItem key={idx} value={option.name}>
                          {option.name} ({option.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.phase_two && (
                    <p className="text-sm text-red-300">{form.formState.errors.phase_two.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phase_three" className="text-white">Phase 3: The Output</Label>
                  <Select
                    onValueChange={(value) => form.setValue("phase_three", value)}
                    value={form.watch("phase_three")}
                  >
                    <SelectTrigger id="phase_three" className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select your Phase 3 option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {phaseDetails[2].options.map((option, idx) => (
                        <SelectItem key={idx} value={option.name}>
                          {option.name} ({option.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.phase_three && (
                    <p className="text-sm text-red-300">{form.formState.errors.phase_three.message}</p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-white text-indigo hover:bg-white/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Request Quote"}
                <ArrowRight className="ml-2" />
              </Button>
            </form>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-lg p-8 text-center mt-8">
            <h2 className="text-2xl mb-4 font-light text-white">Want to discuss before committing?</h2>
            <p className="text-white/80 mb-6">
              Book a scoping call to talk through your challenges and see if this is the right fit.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-indigo hover:bg-white/90 group"
              onClick={() => setContactOpen(true)}
            >
              Book a Scoping Call
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <FAQ items={[
        {
          question: "How long does a full workshop engagement take?",
          answer: "From first call to final deliverable, expect 2-6 weeks depending on the options you choose. The workshop itself is 1-2 days, but we build in time for discovery beforehand and documentation afterwards."
        },
        {
          question: "Can I do this remotely?",
          answer: "Yes. While in-person workshops have their benefits, we've refined a virtual format that works beautifully. Most clients choose remote delivery for convenience and cost savings."
        },
        {
          question: "What size team should participate?",
          answer: "Ideal workshop size is 4-8 people. Too few and you miss diverse perspectives; too many and decision-making gets slow. We can advise on who should be in the room."
        },
        {
          question: "What if we only need one phase?",
          answer: "That's fine. The modular structure means you can pick exactly what you need. Some clients just want discovery, others jump straight to the workshop. We'll help you decide what makes sense."
        }
      ]} />
      <Footer />
    </div>
  );
};

export default Workshops;
