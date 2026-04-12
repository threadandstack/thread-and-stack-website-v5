import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { z } from "zod";

import { PillButton } from "@/components/ui/pill-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const outcomeOptions = [
  "One place to see what’s due this week (across all projects)",
  "Simple task capture and prioritisation (low friction)",
  "Project tracking with clear phases and ownership",
  "Work with subcontractors/clients without paying for loads of seats",
  "Better meeting notes → actions → follow-up",
  "A lightweight CRM for clients and partners",
  "A hub for templates docs and “how we work”",
  "Voice-to-text workflows that actually stick",
  "AI that’s useful because knowledge is structured",
] as const;

const workStyleOptions = [
  "Mostly on mobile",
  "Mostly on laptop/desktop",
  "I work best from my calendar",
  "I do lots of voice notes / dictation",
  "I avoid admin time unless it’s dead simple",
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

const voicePriorityOptions = ["Nice-to-have", "Important", "Critical (if it’s fiddly I won’t use it)"] as const;

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
        message: "Please name the other tools you’re using.",
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

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-4 border-t border-border pt-6 first:border-0 first:pt-0">
    <div className="space-y-1.5">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? <p className="text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
    {children}
  </section>
);

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

export const NotionUtopiaForm = () => {
  const [values, setValues] = useState<NotionUtopiaFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const setValue = <K extends keyof NotionUtopiaFormValues>(field: K, value: NotionUtopiaFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggleMultiSelect = (field: MultiSelectField, option: string, max?: number) => {
    setIsSubmitted(false);

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
    setIsSubmitted(false);
    setValues((current) => ({
      ...current,
      [field]: current[field] === option ? "" : option,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      const { error } = await supabase.functions.invoke("submit-notion-utopia", {
        body: validation.data,
      });

      if (error) throw error;

      setValues(initialValues);
      setIsSubmitted(true);
      toast({
        title: "Submitted",
        description: "Thanks — your onboarding answers are through.",
      });
    } catch (error) {
      console.error("Notion Utopia form submission error:", error);
      toast({
        title: "Submission failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {isSubmitted ? (
        <div className="mb-6 rounded-2xl border border-border bg-accent/40 p-4 text-sm text-foreground">
          Thanks — we’ve got your answers and can use them to shape the onboarding.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="What are you hoping to get from Notion? (in your own words)">
          <Textarea
            value={values.goals}
            onChange={(event) => setValue("goals", event.target.value)}
            placeholder="Tell us what success looks like for you..."
            className="min-h-32 rounded-2xl bg-background"
          />
        </Section>

        <Section
          title="Which outcomes matter most right now?"
          description="Pick up to 3 so we can prioritise the system around the highest-leverage outcomes first."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {outcomeOptions.map((option) => (
              <ChoiceButton
                key={option}
                label={option}
                selected={values.outcomes.includes(option)}
                onClick={() => toggleMultiSelect("outcomes", option, 3)}
              />
            ))}
          </div>
        </Section>

        <Section
          title="Where does your current setup create the most friction?"
          description="Be specific: what’s the moment you drop the tool and go back to paper?"
        >
          <Textarea
            value={values.friction}
            onChange={(event) => setValue("friction", event.target.value)}
            placeholder="Describe the messy bit..."
            className="min-h-28 rounded-2xl bg-background"
          />
        </Section>

        <Section
          title="What happens if nothing changes?"
          description="What’s the cost — in time, money, missed opportunities, or stress — of staying as you are for the next 3 months?"
        >
          <Textarea
            value={values.noChangeCost}
            onChange={(event) => setValue("noChangeCost", event.target.value)}
            placeholder="What keeps this urgent?"
            className="min-h-28 rounded-2xl bg-background"
          />
        </Section>

        <Section
          title="How do you actually like to work day-to-day?"
          description="Choose what’s true now, not what you wish was true."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {workStyleOptions.map((option) => (
              <ChoiceButton
                key={option}
                label={option}
                selected={values.workStyle.includes(option)}
                onClick={() => toggleMultiSelect("workStyle", option)}
              />
            ))}
          </div>
        </Section>

        <Section title="What are you using today?" description="Even if it’s messy or half-working.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {currentToolOptions.map((option) => (
              <ChoiceButton
                key={option}
                label={option}
                selected={values.currentTools.includes(option)}
                onClick={() => toggleMultiSelect("currentTools", option)}
              />
            ))}
          </div>

          {values.currentTools.includes("Other") ? (
            <div className="space-y-2">
              <Label htmlFor="current-tools-other">Name the other important tools you are using</Label>
              <Input
                id="current-tools-other"
                value={values.currentToolsOther}
                onChange={(event) => setValue("currentToolsOther", event.target.value)}
                placeholder="e.g. Xero, HubSpot, Apple Notes..."
                className="rounded-2xl bg-background"
              />
            </div>
          ) : null}
        </Section>

        <Section title="Roughly how many active projects are you juggling?">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup" aria-label="Active projects">
            {activeProjectOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={values.activeProjects === option}
                onClick={() => setSingleSelect("activeProjects", option)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                  values.activeProjects === option
                    ? "border-primary bg-accent text-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Who needs access to the system?">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="radiogroup" aria-label="Who needs access">
            {accessNeedsOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={values.accessNeeds === option}
                onClick={() => setSingleSelect("accessNeeds", option)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors",
                  values.accessNeeds === option
                    ? "border-primary bg-accent text-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </Section>

        <Section title="How important is voice-to-text for this to work?">
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Voice to text importance">
            {voicePriorityOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={values.voicePriority === option}
                onClick={() => setSingleSelect("voicePriority", option)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors",
                  values.voicePriority === option
                    ? "border-primary bg-accent text-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </Section>

        <Section title="What must Notion play nicely with?" description="Pick the integrations that are non-negotiable.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {integrationOptions.map((option) => (
              <ChoiceButton
                key={option}
                label={option}
                selected={values.integrations.includes(option)}
                onClick={() => toggleMultiSelect("integrations", option)}
              />
            ))}
          </div>

          {values.integrations.includes("Other") ? (
            <div className="space-y-2">
              <Label htmlFor="integrations-other">What other tools should Notion play nicely with?</Label>
              <Input
                id="integrations-other"
                value={values.integrationsOther}
                onChange={(event) => setValue("integrationsOther", event.target.value)}
                placeholder="Tell us the specific tools or platforms"
                className="rounded-2xl bg-background"
              />
            </div>
          ) : null}
        </Section>

        <Section
          title="If this worked brilliantly what would be true 8 weeks from now?"
          description="A few bullet-ish sentences is fine."
        >
          <Textarea
            value={values.eightWeekVision}
            onChange={(event) => setValue("eightWeekVision", event.target.value)}
            placeholder="Describe the ideal future state..."
            className="min-h-28 rounded-2xl bg-background"
          />
        </Section>

        <Section title="What’s your biggest concern about implementing Notion? (in your own words)">
          <Textarea
            value={values.concern}
            onChange={(event) => setValue("concern", event.target.value)}
            placeholder="What feels risky, heavy, or annoying about this?"
            className="min-h-28 rounded-2xl bg-background"
          />
        </Section>

        <Section title="Any other notes you want to add?">
          <Textarea
            value={values.extraNotes}
            onChange={(event) => setValue("extraNotes", event.target.value)}
            placeholder="Anything else we should know before we start shaping this?"
            className="min-h-28 rounded-2xl bg-background"
          />
        </Section>

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-muted-foreground">This rebuilt version submits directly to your onboarding database.</p>
          <PillButton type="submit" size="lg" disabled={isSubmitting} icon={isSubmitting ? Loader2 : Send} className="sm:min-w-56">
            {isSubmitting ? "Sending..." : "Submit onboarding answers"}
          </PillButton>
        </div>
      </form>
    </div>
  );
};