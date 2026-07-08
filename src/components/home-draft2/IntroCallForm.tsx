import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { trackContactFormSubmit } from "@/hooks/useAnalytics";
import { NotionCalendarEmbed } from "@/components/booking/NotionCalendarEmbed";

const REVENUE_BANDS = [
  "Pre-revenue",
  "< £100k",
  "£100k – £500k",
  "£500k – £1M",
  "£1M – £5M",
  "£5M – £25M",
  "£25M+",
] as const;

const EMPLOYEE_BANDS = [
  "Just me",
  "2 – 5",
  "6 – 10",
  "11 – 25",
  "26 – 50",
  "51 – 200",
  "201 – 500",
  "501 – 1,000",
  "1,000+",
] as const;

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Please enter a valid email").max(255),
  jobRole: z.string().trim().min(1, "Job role is required").max(120),
  companyName: z.string().trim().min(1, "Company name is required").max(160),
  companyWebsite: z
    .string()
    .trim()
    .min(1, "Company website is required")
    .max(255),
  annualRevenue: z.string().min(1, "Please select a revenue band"),
  employees: z.string().min(1, "Please select a headcount band"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm consent so I can be in touch." }),
  }),
});

interface IntroCallFormProps {
  source?: string;
  onSuccess?: () => void;
  compact?: boolean;
  /** Extra text appended to the lead message (e.g. scorecard report). */
  extraMessage?: string;
  /** Extra structured data added to the Notion sync payload's `extra` object. */
  extraContext?: Record<string, unknown>;
  /** Overrides the default submit button label. */
  submitLabel?: string;
}

export function IntroCallForm({
  source = "intro-call",
  onSuccess,
  compact = false,
  extraMessage,
  extraContext,
  submitLabel,
}: IntroCallFormProps) {

  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobRole: "",
    companyName: "",
    companyWebsite: "",
    annualRevenue: "",
    employees: "",
    consent: false,
    honeypot: "",
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (form.honeypot) return; // silent bot reject

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Almost there",
        description: parsed.error.errors[0]?.message ?? "Please check the form",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const leadId = crypto.randomUUID();
      const params = new URLSearchParams(window.location.search);
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      const cleanEmail = form.email.trim();

      const messageLines = [
        `[${form.jobRole.trim()} at ${form.companyName.trim()}]`,
        `Website: ${form.companyWebsite.trim()}`,
        `Annual revenue: ${form.annualRevenue}`,
        `Employees: ${form.employees}`,
        "",
        "Requested a free introductory call.",
      ];
      const fullMessage = extraMessage
        ? `${messageLines.join("\n")}\n\n---\n${extraMessage}`
        : messageLines.join("\n");


      const { error } = await supabase.from("leads").insert({
        id: leadId,
        name: fullName,
        email: cleanEmail,
        message: fullMessage,
        source,
      });
      if (error) throw error;

      trackContactFormSubmit(source);

      // Fire-and-forget: Notion sync + visitor email + admin email
      supabase.functions
        .invoke("sync-lead-to-notion", {
          body: {
            name: fullName,
            email: cleanEmail,
            message: fullMessage,
            source,
            utmSource: params.get("utm_source") ?? "",
            utmMedium: params.get("utm_medium") ?? "",
            utmCampaign: params.get("utm_campaign") ?? "",
            extra: {
              firstName: form.firstName.trim(),
              lastName: form.lastName.trim(),
              jobRole: form.jobRole.trim(),
              companyName: form.companyName.trim(),
              companyWebsite: form.companyWebsite.trim(),
              annualRevenue: form.annualRevenue,
              employees: form.employees,
              type: "intro-call",
              ...(extraContext ?? {}),

            },
          },
        })
        .catch((err) => console.error("Notion sync error:", err));

      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "lead-visitor-confirmation",
            recipientEmail: cleanEmail,
            idempotencyKey: `lead-visitor-${leadId}`,
            templateData: { name: form.firstName.trim() || fullName },
          },
        })
        .catch((err) => console.error("Visitor email error:", err));

      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "lead-admin-notification",
            idempotencyKey: `lead-admin-${leadId}`,
            templateData: {
              name: fullName,
              email: cleanEmail,
              source,
              message: fullMessage,
              submittedAt: new Date().toISOString(),
            },
          },
        })
        .catch((err) => console.error("Admin email error:", err));

      setDone(true);
      toast({
        title: "Thanks — request received.",
        description: "I'll be in touch within one working day to confirm a time.",
      });
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast({ title: "Couldn't submit", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-hairline bg-card p-6 text-card-foreground">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-indigo" />
            <div className="space-y-1">
              <p className="font-sans text-lg font-semibold">Details received — now pick a time.</p>
              <p className="text-sm text-muted-foreground">
                Grab a 30-minute slot below. You'll get a calendar invite straight
                away, and a confirmation email is on its way.
              </p>
            </div>
          </div>
        </div>
        <NotionCalendarEmbed
          url="https://calendar.notion.so/meet/threadandstack/30min-intro"
          title="Book your intro call"
          meta="30 minutes • free, no obligation"
          cta="Pick a time"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-5"}>
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={form.honeypot}
        onChange={(e) => update("honeypot", e.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="intro-first">First name *</Label>
          <Input
            id="intro-first"
            required
            maxLength={80}
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="intro-last">Last name *</Label>
          <Input
            id="intro-last"
            required
            maxLength={80}
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="intro-email">Email *</Label>
        <Input
          id="intro-email"
          type="email"
          required
          maxLength={255}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="intro-role">Job role *</Label>
        <Input
          id="intro-role"
          required
          maxLength={120}
          placeholder="e.g. Founder, Head of Marketing"
          value={form.jobRole}
          onChange={(e) => update("jobRole", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="intro-company">Company name *</Label>
          <Input
            id="intro-company"
            required
            maxLength={160}
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="intro-website">Company website *</Label>
          <Input
            id="intro-website"
            required
            maxLength={255}
            placeholder="https://"
            value={form.companyWebsite}
            onChange={(e) => update("companyWebsite", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="intro-revenue">Annual revenue *</Label>
          <select
            id="intro-revenue"
            required
            value={form.annualRevenue}
            onChange={(e) => update("annualRevenue", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select a band</option>
            {REVENUE_BANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="intro-employees">Number of employees *</Label>
          <select
            id="intro-employees"
            required
            value={form.employees}
            onChange={(e) => update("employees", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select a band</option>
            {EMPLOYEE_BANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-1">
        <Checkbox
          id="intro-consent"
          checked={form.consent}
          onCheckedChange={(v) => update("consent", v === true)}
        />
        <Label
          htmlFor="intro-consent"
          className="text-xs font-normal leading-relaxed text-muted-foreground sm:text-sm"
        >
          I'm happy for Brendan to contact me about my booking and how he can
          help. See the{" "}
          <a href="/privacy" target="_blank" className="underline">
            privacy policy
          </a>
          .
        </Label>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="group h-12 w-full text-accent-foreground transition-transform hover:-translate-y-px"
        style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Request an intro call
            <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
              <ArrowRight className="h-4 w-4 shrink-0" />
            </span>
          </>
        )}
      </Button>

      <p className="inline-flex w-full items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3 w-3" /> Your details are kept private. No newsletters, no spam.
      </p>
    </form>
  );
}
