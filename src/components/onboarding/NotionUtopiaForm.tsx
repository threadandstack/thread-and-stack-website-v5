import { useState } from "react";
import { Loader2, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { z } from "zod";

import { PillButton } from "@/components/ui/pill-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const outcomeOptions = [
  "One place to see what's due this week (across all projects)",
  "Simple task capture and prioritisation (low friction)",
  "Project tracking with clear phases and ownership",
  "Work with subcontractors/clients without paying for loads of seats",
  "Better meeting notes → actions → follow-up",
  "A lightweight CRM for clients and partners",
  "A hub for templates docs and "how we work"",
  "Voice-to-text workflows that actually stick",
  "AI that's useful because knowledge is structured",
] as const;

const workStyleOptions = [
  "Mostly on mobile",
  "Mostly on laptop/desktop",
  "I work best from my calendar",
  "I do lots of voice notes / dictation",
  "I avoid admin time unless it's dead simple",
  "I need a visual overview (boards/timelines)",
  "I need a tight list view (today/this week)",
] as const;

const currentToolOptions = [
  "Google Calendar",
  "Gmail",
  "Slack",
  "Zoom / Meet",
  "Asana",
  "ClickUp",
  "Trello",
  "Airtable",
  "Docs/Sheets/Drive",
  "Paper notebook / whiteboard",
  "Other",
] as const;

const activeProjectOptions = ["1–3", "4–7", "8–12", "13+"] as const;

const accessNeedsOptions = [
  "Just me",
  "Me + 1–2 collaborators",
  "Me + rotating subcontractors",
  "Me + clients + subcontractors",
] as const;

const voicePriorityOptions = ["Nice-to-have", "Important", "Critical (if it's fiddly I won't use it)"] as const;

const integrationOptions = [
  "Google Calendar",
  "Gmail",
  "Slack",
  "Zoom/Meet transcripts",
  "Drive files",
  "Proposal/invoicing tool",
  "None / happy to replace things",
  "Other",
] as const;

const optionalText = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`);

const notionUtopiaSchema = z
  .object({
    goals: z.string().trim().min(1, "Please describe what you want from Notion.").max(1200),
    outcomes: z.array(z.enum(outcomeOptions)).max(3, "Pick up to 3 outcomes."),
    friction: optionalText(4000),
    noChangeCost: optionalText(4000),
    workStyle: z.array(z.enum(workStyleOptions)),
    currentTools: z.array(z.enum(currentToolOptions)),
    currentToolsOther: optionalText(500),
    activeProjects: z.union([z.enum(activeProjectOptions), z.literal("")]),
    accessNeeds: z.union([z.enum(accessNeedsOptions), z.literal("")]),
    voicePriority: z.union([z.enum(voicePriorityOptions), z.literal("")]),
    integrations: z.array(z.enum(integrationOptions)),
    integrationsOther: optionalText(500),
    eightWeekVision: optionalText(4000),
    concern: optionalText(4000),
    extraNotes: optionalText(4000),
  })
  .superRefine((value, ctx) => {
    if (value.currentTools.includes("Other") && !value.currentToolsOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please name the other tools you're using.",
        path: ["currentToolsOther"],
      });
    }

    if (value.integrations.includes("Other") && !value.integrationsOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please name the other tools Notion should work with.",
        path: ["integrationsOther"],
      });
    }
  });

type NotionUtopiaFormValues = z.infer<typeof notionUtopiaSchema>;
type MultiSelectField = "outcomes" | "workStyle" | "currentTools" | "integrations";
type SingleSelectField = "activeProjects" | "accessNeeds" | "voicePriority";

const initialValues: NotionUtopiaFormValues = {
  goals: "",
  outcomes: [],
  friction: "",
  noChangeCost: "",
  workStyle: [],
  currentTools: [],
  currentToolsOther: "",
  activeProjects: "",
  accessNeeds: "",
  voicePriority: "",
  integrations: [],
  integrationsOther: "",
  eightWeekVision: "",
  concern: "",
  extraNotes: "",
};

const ChoiceButton = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={cn(
      "rounded-2xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors",
      selected
        ? "border-primary bg-accent text-foreground"
        : "border-border bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground",
    )}
  >
    {label}
  </button>
);

interface StepConfig {
  title: string;
  description?: string;
  required?: boolean;
}

const STEPS: StepConfig[] = [
  { title: "What are you hoping to get from Notion? (in your own words)", required: true },
  { title: "Which outcomes matter most right now?", description: "Pick up to 3 so we can prioritise the system around the highest-leverage outcomes first." },
  { title: "Where does your current setup create the most friction?", description: "Be specific: what's the moment you drop the tool and go back to paper?" },
  { title: "What happens if nothing changes?", description: "What's the cost — in time, money, missed opportunities, or stress — of staying as you are for the next 3 months?" },
  { title: "How do you actually like to work day-to-day?", description: "Choose what's true now, not what you wish was true." },
  { title: "What are you using today?", description: "Even if it's messy or half-working." },
  { title: "Roughly how many active projects are you juggling?" },
  { title: "Who needs access to the system?" },
  { title: "How important is voice-to-text for this to work?" },
  { title: "What must Notion play nicely with?", description: "Pick the integrations that are non-negotiable." },
  { title: "If this worked brilliantly what would be true 8 weeks from now?", description: "A few bullet-ish sentences is fine." },
  { title: "What's your biggest concern about implementing Notion? (in your own words)" },
  { title: "Any other notes you want to add?" },
];

const TOTAL_STEPS = STEPS.length;

export const NotionUtopiaForm = () => {
  const [values, setValues] = useState<NotionUtopiaFormValues>(initialValues);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const isFirstStep = currentStep === 0;

  const setValue = <K extends keyof NotionUtopiaFormValues>(field: K, value: NotionUtopiaFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggleMultiSelect = (field: MultiSelectField, option: string, max?: number) => {
    setValues((current) => {
      const currentValues = current[field] as string[];
      const selected = currentValues.includes(option);

      if (!selected && max && currentValues.length >= max) {
        toast({
          title: "Selection limit reached",
          description: `You can choose up to ${max} options here.`,
          variant: "destructive",
        });
        return current;
      }

      const nextValues = selected ? currentValues.filter((item) => item !== option) : [...currentValues, option];

      return {
        ...current,
        [field]: nextValues,
        ...(field === "currentTools" && !nextValues.includes("Other") ? { currentToolsOther: "" } : {}),
        ...(field === "integrations" && !nextValues.includes("Other") ? { integrationsOther: "" } : {}),
      };
    });
  };

  const setSingleSelect = (field: SingleSelectField, option: string) => {
    setValues((current) => ({
      ...current,
      [field]: current[field] === option ? "" : option,
    }));
  };

  const canProceed = (): boolean => {
    if (currentStep === 0 && !values.goals.trim()) return false;
    return true;
  };

  const goNext = () => {
    if (!canProceed()) {
      toast({ title: "Required", description: "Please fill in this question before continuing.", variant: "destructive" });
      return;
    }
    if (!isLastStep) setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLastStep) { goNext(); return; }

    setIsSubmitting(true);
    const validation = notionUtopiaSchema.safeParse(values);

    if (!validation.success) {
      toast({
        title: "A couple of details need fixing",
        description: validation.error.issues[0]?.message ?? "Please review your answers and try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("submit-notion-utopia", { body: validation.data });
      if (error) throw error;

      setValues(initialValues);
      setIsSubmitted(true);
      toast({ title: "Submitted", description: "Thanks — your onboarding answers are through." });
    } catch (error) {
      console.error("Notion Utopia form submission error:", error);
      toast({ title: "Submission failed", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Textarea
            value={values.goals}
            onChange={(e) => setValue("goals", e.target.value)}
            placeholder="Tell us what success looks like for you..."
            className="min-h-32 rounded-2xl bg-background"
            autoFocus
          />
        );
      case 1:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {outcomeOptions.map((option) => (
              <ChoiceButton key={option} label={option} selected={values.outcomes.includes(option)} onClick={() => toggleMultiSelect("outcomes", option, 3)} />
            ))}
          </div>
        );
      case 2:
        return (
          <Textarea value={values.friction} onChange={(e) => setValue("friction", e.target.value)} placeholder="Describe the messy bit..." className="min-h-28 rounded-2xl bg-background" autoFocus />
        );
      case 3:
        return (
          <Textarea value={values.noChangeCost} onChange={(e) => setValue("noChangeCost", e.target.value)} placeholder="What keeps this urgent?" className="min-h-28 rounded-2xl bg-background" autoFocus />
        );
      case 4:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {workStyleOptions.map((option) => (
              <ChoiceButton key={option} label={option} selected={values.workStyle.includes(option)} onClick={() => toggleMultiSelect("workStyle", option)} />
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {currentToolOptions.map((option) => (
                <ChoiceButton key={option} label={option} selected={values.currentTools.includes(option)} onClick={() => toggleMultiSelect("currentTools", option)} />
              ))}
            </div>
            {values.currentTools.includes("Other") && (
              <div className="space-y-2">
                <Label htmlFor="current-tools-other">Name the other important tools you are using</Label>
                <Input id="current-tools-other" value={values.currentToolsOther} onChange={(e) => setValue("currentToolsOther", e.target.value)} placeholder="e.g. Xero, HubSpot, Apple Notes..." className="rounded-2xl bg-background" />
              </div>
            )}
          </div>
        );
      case 6:
        return (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup">
            {activeProjectOptions.map((option) => (
              <button key={option} type="button" role="radio" aria-checked={values.activeProjects === option} onClick={() => setSingleSelect("activeProjects", option)}
                className={cn("rounded-2xl border px-4 py-3 text-left text-sm transition-colors", values.activeProjects === option ? "border-primary bg-accent text-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground")}
              >{option}</button>
            ))}
          </div>
        );
      case 7:
        return (
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
            {accessNeedsOptions.map((option) => (
              <button key={option} type="button" role="radio" aria-checked={values.accessNeeds === option} onClick={() => setSingleSelect("accessNeeds", option)}
                className={cn("rounded-2xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors", values.accessNeeds === option ? "border-primary bg-accent text-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground")}
              >{option}</button>
            ))}
          </div>
        );
      case 8:
        return (
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup">
            {voicePriorityOptions.map((option) => (
              <button key={option} type="button" role="radio" aria-checked={values.voicePriority === option} onClick={() => setSingleSelect("voicePriority", option)}
                className={cn("rounded-2xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors", values.voicePriority === option ? "border-primary bg-accent text-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground")}
              >{option}</button>
            ))}
          </div>
        );
      case 9:
        return (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {integrationOptions.map((option) => (
                <ChoiceButton key={option} label={option} selected={values.integrations.includes(option)} onClick={() => toggleMultiSelect("integrations", option)} />
              ))}
            </div>
            {values.integrations.includes("Other") && (
              <div className="space-y-2">
                <Label htmlFor="integrations-other">What other tools should Notion play nicely with?</Label>
                <Input id="integrations-other" value={values.integrationsOther} onChange={(e) => setValue("integrationsOther", e.target.value)} placeholder="Tell us the specific tools or platforms" className="rounded-2xl bg-background" />
              </div>
            )}
          </div>
        );
      case 10:
        return (
          <Textarea value={values.eightWeekVision} onChange={(e) => setValue("eightWeekVision", e.target.value)} placeholder="Describe the ideal future state..." className="min-h-28 rounded-2xl bg-background" autoFocus />
        );
      case 11:
        return (
          <Textarea value={values.concern} onChange={(e) => setValue("concern", e.target.value)} placeholder="What feels risky, heavy, or annoying about this?" className="min-h-28 rounded-2xl bg-background" autoFocus />
        );
      case 12:
        return (
          <Textarea value={values.extraNotes} onChange={(e) => setValue("extraNotes", e.target.value)} placeholder="Anything else we should know before we start shaping this?" className="min-h-28 rounded-2xl bg-background" autoFocus />
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-accent/40 p-6 text-center text-foreground">
          <p className="text-lg font-medium">Thanks — we've got your answers!</p>
          <p className="mt-2 text-sm text-muted-foreground">We'll use them to shape your onboarding.</p>
        </div>
      </div>
    );
  }

  const step = STEPS[currentStep];

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress */}
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {currentStep + 1} of {TOTAL_STEPS}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="mb-8 h-2" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question header */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{step.title}</h2>
          {step.description && <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>}
        </div>

        {/* Step content */}
        <div className="min-h-[200px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-border pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstStep}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
              isFirstStep
                ? "cursor-not-allowed text-muted-foreground/40"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {isLastStep ? (
            <PillButton type="submit" size="lg" disabled={isSubmitting} icon={isSubmitting ? Loader2 : Send} className="min-w-48">
              {isSubmitting ? "Sending..." : "Submit"}
            </PillButton>
          ) : (
            <PillButton type="button" onClick={goNext} size="lg" icon={ChevronRight} className="min-w-48">
              Continue
            </PillButton>
          )}
        </div>
      </form>
    </div>
  );
};
