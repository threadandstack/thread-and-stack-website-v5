import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, X, Send, Check, Linkedin, Rocket } from "lucide-react";
import NotionBadges from "@/assets/notion-badges.png";
import { PillButton } from "@/components/ui/pill-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { trackContactFormSubmit } from "@/hooks/useAnalytics";
import BlackStacked from "@/assets/logos/Black_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import BrendanAvatar from "@/assets/brendan-avatar.webp";
import SummitLogo from "@/assets/proposal/summit-advisors-logo.png.asset.json";
import IconNotion from "@/assets/proposal/icons/notion.png";
import IconNotionAI from "@/assets/proposal/icons/notion-ai.png";
import IconLassie from "@/assets/proposal/icons/lassie.png";
import IconNotionWorkers from "@/assets/proposal/icons/notion-workers.png.asset.json";
import IconNotionCalendar from "@/assets/proposal/icons/notion-calendar.svg";
import IconNotionMail from "@/assets/proposal/icons/notion-mail.svg";
import IconMeetingNotes from "@/assets/proposal/icons/notion-meeting-notes.gif.asset.json";
import { Tilt3D } from "@/components/Tilt3D";

/* ---------------------------- Reply Drawer ---------------------------- */

const INTENT_OPTIONS = [
  { value: "yes", label: "Yes, let's begin" },
  { value: "questions", label: "I have a few questions" },
  { value: "call", label: "Let's schedule a call" },
] as const;

type Intent = typeof INTENT_OPTIONS[number]["value"];

const replySchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().max(2000).optional(),
});

const ReplyDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState<Intent>("yes");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    const validation = replySchema.safeParse({
      name: name.trim(),
      email: email.trim(),
      message: message.trim() || undefined,
    });
    if (!validation.success) {
      toast({
        title: "Just a moment",
        description: validation.error.errors[0]?.message || "Please check your input",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const intentLabel = INTENT_OPTIONS.find((o) => o.value === intent)?.label ?? "";
    const fullMessage = [`Intent: ${intentLabel}`, message.trim()].filter(Boolean).join("\n\n");
    const source = "summit-network-proposal";

    try {
      const leadId = crypto.randomUUID();
      const cleanName = name.trim();
      const cleanEmail = email.trim();

      const { error } = await supabase.from("leads").insert({
        id: leadId,
        name: cleanName,
        email: cleanEmail,
        message: fullMessage,
        source,
      });
      if (error) throw error;

      trackContactFormSubmit(source);

      supabase.functions
        .invoke("sync-lead-to-notion", {
          body: { name: cleanName, email: cleanEmail, message: fullMessage, source },
        })
        .catch((err) => console.error("Notion sync error:", err));

      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "lead-visitor-confirmation",
            recipientEmail: cleanEmail,
            idempotencyKey: `lead-visitor-${leadId}`,
            templateData: { name: cleanName },
          },
        })
        .catch((err) => console.error("Visitor email error:", err));

      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "lead-admin-notification",
            idempotencyKey: `lead-admin-${leadId}`,
            templateData: {
              name: cleanName,
              email: cleanEmail,
              source,
              message: fullMessage,
              submittedAt: new Date().toISOString(),
            },
          },
        })
        .catch((err) => console.error("Admin email error:", err));

      toast({
        title: "Reply sent",
        description: "Thanks, I'll be in touch shortly.",
      });
      setEmail("");
      setMessage("");
      setIntent("yes");
      onOpenChange(false);
    } catch (err: any) {
      console.error("Summit Network proposal reply error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or email br@brendanrodgers.uk directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-2">
          <SheetTitle className="font-serif-pro text-2xl italic font-medium">Reply to begin</SheetTitle>
        </SheetHeader>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
          A short note straight to Brendan. Pick what fits. Adjust anything you need to.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="sn-name" className="text-sm text-muted-foreground">Name</Label>
            <Input
              id="sn-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background rounded-lg mt-1"
              placeholder="Cali or Andrew"
              required
            />
          </div>

          <div>
            <Label htmlFor="sn-email" className="text-sm text-muted-foreground">Email *</Label>
            <Input
              id="sn-email"
              type="email"
              placeholder="you@summitnetwork.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background rounded-lg mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">My reply</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {INTENT_OPTIONS.map((opt) => {
                const selected = intent === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIntent(opt.value)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sans transition-all border ${
                      selected
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-background text-muted-foreground border-border hover:border-accent/50"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {intent === "call" && (
            <div className="rounded-xl border border-border bg-background p-4 flex flex-col gap-3">
              <p className="font-sans text-sm text-muted-foreground">
                Pick a slot that works and I'll confirm by email.
              </p>
              <a
                href="https://calendar.notion.so/meet/threadandstack/65kzf4ojy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-sans text-sm hover:bg-accent/90 transition-colors"
              >
                Open calendar
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          )}

          <div>
            <Label htmlFor="sn-message" className="text-sm text-muted-foreground">
              Anything to add <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Textarea
              id="sn-message"
              placeholder="Questions, tweaks, or a couple of dates that work…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-background rounded-lg mt-1 min-h-[110px]"
            />
          </div>

          <div className="absolute -left-[9999px]" aria-hidden="true">
            <Input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <PillButton type="submit" disabled={isSubmitting} className="w-full" icon={Send}>
            {isSubmitting ? "Sending…" : "Send reply"}
          </PillButton>

          <p className="font-sans text-[11px] text-muted-foreground/70 text-center pt-1">
            Goes directly to br@brendanrodgers.uk
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
};

/* ---------------------------- Helpers ---------------------------- */

const Hl = ({ children, shift = 1 }: { children: React.ReactNode; shift?: number }) => (
  <span className="inline-block text-gradient-warm" style={{ transform: `translateY(${shift}px)` }}>
    {children}
  </span>
);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

const SectionHead = ({
  num,
  eyebrow,
  title,
  rotate = -0.3,
}: {
  num?: string;
  eyebrow?: string;
  title: React.ReactNode;
  rotate?: number;
}) => (
  <motion.div {...fadeUp} className="mb-10 md:mb-14">
    {eyebrow && (
      <div className="mb-4 font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground">
        {eyebrow}
      </div>
    )}
    <div className="flex items-baseline gap-4 md:gap-5">
      {num && (
        <span className="font-serif-pro text-3xl md:text-5xl font-light italic text-gradient-warm leading-none flex-shrink-0">
          {num}
        </span>
      )}
      <h2
        className="font-serif-pro text-[30px] sm:text-4xl md:text-[42px] italic font-medium leading-[1.1] tracking-tight text-foreground text-balance"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {title}
      </h2>
    </div>
  </motion.div>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <motion.p {...fadeUp} className="font-sans text-[16.5px] md:text-[17px] leading-[1.8] text-foreground/85 mb-6">
    {children}
  </motion.p>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <motion.h3
    {...fadeUp}
    className="font-serif-pro text-[22px] md:text-[26px] italic font-medium text-foreground mt-12 mb-5 leading-snug"
  >
    {children}
  </motion.h3>
);

const BulletList = ({ items }: { items: React.ReactNode[] }) => (
  <motion.ul {...fadeUp} className="space-y-3 mb-8 list-none pl-0">
    {items.map((it, i) => (
      <li key={i} className="relative pl-6 text-[16.5px] leading-[1.75] text-foreground/85">
        <span className="absolute left-0 top-[0.7em] w-[7px] h-[7px] rounded-full border-[1.5px] border-accent" />
        {it}
      </li>
    ))}
  </motion.ul>
);

const Rule = () => (
  <div className="my-20 md:my-28 flex justify-center">
    <span className="h-px w-16 bg-border" />
  </div>
);

const EditorialTable = ({
  head,
  rows,
}: {
  head?: React.ReactNode[];
  rows: React.ReactNode[][];
}) => (
  <motion.div
    {...fadeUp}
    className="my-8 rounded-2xl border border-border bg-card/40 shadow-[0_2px_24px_-12px_rgba(0,0,0,0.08)]"
  >
    <div className="overflow-x-auto rounded-2xl">
      <table className="w-full table-fixed font-sans text-[12.5px] sm:text-[15px]">
        {head && (
          <thead>
            <tr className="bg-muted/40">
              {head.map((h, i) => (
                <th
                  key={i}
                  className="text-left px-2.5 sm:px-5 py-2 sm:py-3 font-semibold text-[9.5px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-muted-foreground break-words"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-t border-border/60">
              {row.map((cell, c) => (
                <td key={c} className="px-2.5 sm:px-5 py-2 sm:py-3 align-top text-foreground/85 leading-[1.5] sm:leading-[1.6] break-words">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>

);

/* ---------------------------- Welcome ---------------------------- */

const WelcomeScreen = ({ onOpen }: { onOpen: () => void }) => {
  useEffect(() => {
    // Ensure the welcome overlay starts at the top on mobile, where content
    // exceeds the viewport height.
    const el = document.getElementById("sn-welcome-scroll");
    if (el) el.scrollTop = 0;
  }, []);

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        y: "-100%",
        transition: { duration: 1.05, ease: [0.7, 0, 0.3, 1] },
      }}
      className="fixed inset-0 z-[100] flex flex-col bg-primary text-primary-foreground overflow-hidden"
    >
      <div
        id="sn-welcome-scroll"
        className="flex-1 overflow-y-auto flex flex-col items-center justify-start md:justify-center px-6 sm:px-10 md:px-16 pt-12 sm:pt-16 md:pt-6 pb-6"
      >
        <div className="w-full max-w-2xl flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-sans text-[10.5px] sm:text-[12px] tracking-[0.28em] uppercase text-primary-foreground/55 mb-5"
          >
            Project Proposal
            <span className="text-primary-foreground/25 mx-2">·</span>
            Ref: SN1
            <span className="text-primary-foreground/25 mx-2">·</span>
            16 July 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="font-serif-pro text-3xl sm:text-5xl md:text-6xl italic font-medium leading-[1.05] tracking-tight mb-5 text-balance"
          >
            The{" "}
            <span className="inline-block text-gradient-warm" style={{ transform: "translateY(1px)" }}>
              Structure
            </span>{" "}
            Your Growth Has Been Waiting For.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="font-sans text-[15px] sm:text-[17px] leading-[1.75] text-primary-foreground/80 max-w-xl mb-5"
          >
            A Notion operations build that gives every team member clarity, runs client onboarding without
            a single point of failure, and gives clients a real window into their own progress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="font-sans text-[13px] text-primary-foreground/60 mb-6"
          >
            Prepared for Cali Pilkington &amp; Andrew Gladstone
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.15 }}
            className="w-full text-left rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] backdrop-blur-sm p-6 sm:p-8 font-sans text-[15px] sm:text-[16px] leading-[1.8] text-primary-foreground/85 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)] mb-8"
          >
            <p>Dear Andrew and Cali,</p>
            <p>
              Summit works with young creators who place a high value on strong relationships. They're
              both bold and vulnerable: high-profile people with large followings, trusting you with
              their financial lives and personal information. The workspace behind the service has to
              strengthen those relationships, with protection designed into its architecture rather
              than bolted on afterwards.
            </p>
            <p>
              Priority one is getting your Notion workspace working the way Summit works: everyone
              knows what they're responsible for, client information is found in seconds, and Notion
              AI surfaces answers from inside your own records. The goal underneath it all is simple.
              Summit operating confidently and smoothly, so the pause on new clients can end. Nothing
              in this build exists for its own sake: if a feature doesn't help your team run clearly
              or help a new client land safely, it waits for a later phase.
            </p>
            <p className="font-serif-pro italic text-lg text-primary-foreground pt-1">Brendan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.35 }}
            className="flex flex-col items-center pb-4"
          >
            <button
              onClick={onOpen}
              className="group inline-flex items-center gap-3 rounded-full bg-background text-foreground px-7 py-4 font-sans text-sm font-semibold shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Open the proposal
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-primary-foreground/35 mt-4">
              Click to reveal
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------------------- Page ---------------------------- */

const SummitNetworkProposalPage = () => {
  const [opened, setOpened] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const socialTitle = "Thread & Stack × Summit Network · Notion Operations Build (SN1)";
    document.title = socialTitle;

    const tags: HTMLMetaElement[] = [];
    const addMeta = (attr: "name" | "property", key: string, content: string) => {
      const m = document.createElement("meta");
      m.setAttribute(attr, key);
      m.content = content;
      document.head.appendChild(m);
      tags.push(m);
    };
    addMeta("name", "robots", "noindex, nofollow");
    addMeta("property", "og:title", socialTitle);
    addMeta("name", "twitter:title", socialTitle);

    return () => {
      tags.forEach((t) => document.head.removeChild(t));
    };
  }, []);

  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [opened]);

  const handleDownload = () => window.print();

  const timeline = [
    {
      label: "Diagnostic. Complete.",
      when: "13 July 2026",
      owner: "Both",
      isLaunch: false,
      isComplete: true,
      note: "Confirmed the current setup, priorities, risks and recommended direction.",
    },
    {
      label: "Build",
      when: "Roughly two months from sign-off",
      owner: "Thread & Stack, with Summit input",
      isLaunch: false,
      isComplete: false,
      note: "Summit OS 2.0 takes shape in hidden teamspaces. Your team keeps working as they do today, and shapes the system as it develops.",
    },
    {
      label: "Adoption Day",
      when: "End of build",
      owner: "Both",
      isLaunch: true,
      isComplete: false,
      note: "The team walkthrough, the move into the new workspace, and the moment the old working model is retired.",
    },
    {
      label: "Supported adoption",
      when: "The three months that follow",
      owner: "Thread & Stack and Summit",
      isLaunch: false,
      isComplete: false,
      note: "Ten hours a month of hands-on support while the system beds in. This is also the window to reopen client acquisition, with me still alongside you.",
    },
    {
      label: "From there",
      when: "Month to month thereafter",
      owner: "Both",
      isLaunch: false,
      isComplete: false,
      note: "Summit runs on its own system, and from a position of things working we scope Phase 2, the advanced integration layer: Infloww feeds, DocuSign auto-attach, scheduled client communications. Rolling support at £1,000/month covers continued adoption and refinement; new capabilities are scoped separately.",
    },
  ];

  /* ---------- Section 02: unified stepper ---------- */

  const journeySteps: Array<{
    title: string;
    body: string;
    state: "done" | "current" | "upcoming";
  }> = [
    {
      title: "Diagnostic",
      body: "Complete, 13 July 2026. Confirmed the current setup, priorities and direction.",
      state: "done",
    },
    {
      title: "NDA aligned",
      body: "Reached in good faith, and this proposal acts as the Scope of Work supporting it.",
      state: "done",
    },
    {
      title: "This proposal",
      body: "Confirm the scope and investment, and we lock a start date and the adoption day target.",
      state: "current",
    },
    {
      title: "I join your workspace",
      body: "Added as a consultant inside your existing Notion, with access to your current CRM now the NDA is aligned. Everything of value in it is preserved and improved on. Nothing you've built well gets lost.",
      state: "upcoming",
    },
    {
      title: "Summit OS 2.0 is built alongside you",
      body: "The Client Portal, Internal Workspace and Agency Portal take shape in hidden teamspaces while your team keeps working exactly as they do today.",
      state: "upcoming",
    },
    {
      title: "Adoption day, then supported adoption",
      body: "The team walkthrough, the move in, and three months of hands-on support at 10 hours per month. This is also the window to reopen client acquisition, with me still alongside you.",
      state: "upcoming",
    },
  ];

  /* ---------- Section 03: the stack ---------- */

  const stack: Array<{
    icon: string;
    title: string;
    body: string;
    tag?: string;
  }> = [
    {
      icon: IconNotion,
      title: "Notion Workspace",
      body: "One permissioned home for clients, agencies, tasks, meetings, SOPs and knowledge.",
    },
    {
      icon: IconLassie,
      title: "Notion AI",
      body: "Plain-English questions, answers grounded in Summit's own records.",
    },
    {
      icon: IconMeetingNotes.url,
      title: "Notion AI Meeting Notes",
      body: "Calls transcribed and filed against the right client, with client-safe summaries and internal-only transcripts.",
    },
    {
      icon: IconNotionCalendar,
      title: "Notion Calendar",
      body: "Meetings connected to clients, prep and follow-up, subject to confirming Summit's provider.",
    },
    {
      icon: IconNotion,
      title: "Notion automations",
      body: "The native triggers that run intake, tier checklists, DocuSign routing and reminders.",
    },
    {
      icon: IconNotionAI,
      title: "Custom agents",
      body: "Collaborative agents that live in your workspace with you.",
      tag: "Client request agent included",
    },
    {
      icon: IconNotionWorkers.url,
      title: "Notion Workers",
      body: "Bespoke Notion integrations built specifically for you and your tools that arm your workspace.",
      tag: "Lightweight build included",
    },
    {
      icon: IconNotionMail,
      title: "Notion MCP",
      body: "Summit's email and external tools tied into the workspace through Notion's connection layer, confirmed against your provider.",
    },
  ];

  /* ---------- Section 04 groups ---------- */

  const scopeGroups: Array<{ label: string; intro?: string; items: React.ReactNode[] }> = [
    {
      label: "A. Foundations and the Internal Workspace",
      items: [
        <><strong>Individual member access</strong> for every team member, retiring the shared-login model. Summit purchases licences directly; worth doing immediately regardless of build timing.</>,
        <><strong>A visual, tile-like experience</strong> prioritised throughout: card and gallery layouts, kanban boards, buttons and dashboards in place of spreadsheet after spreadsheet, so the workspace feels designed rather than administrated.</>,
        <><strong>Workspace architecture</strong> built as focused teamspaces with role-based access: marketing and sales, operations and finance, client work separate.</>,
        <><strong>Company homepage</strong> carrying Summit's mission, values, company-wide broadcasts and navigation.</>,
        <><strong>Employee handbook and policies</strong>: terms, conditions and internal policies in one findable place, with Employee Responsibilities pages per role.</>,
        <><strong>Personal dashboards</strong>: each team member sees only the tasks, calendars, meeting notes and documents tagged to them. No manual filtering.</>,
        <><strong>Shared calendar and task management</strong>: the master Team Task Database with My Tasks, All Tasks, By Client, Overdue and Account Manager views, plus centralised meetings.</>,
        <><strong>A meetings database</strong> where AI Meeting Notes accumulate into a genuine context layer for the whole team.</>,
        <><strong>Centralised document repository</strong> connected to Summit's Google Drive.</>,
        <><strong>Ops and finance teamspace</strong>: staff management, products and services planning, the SOP library with version history, and the operational source of truth.</>,
        <><strong>Brand kits in Notion</strong>, ready for the team to work from and share.</>,
      ],
    },
    {
      label: "B. The Growth CRM",
      items: [
        <><strong>Customer, company and deal pipeline databases</strong>, rebuilt from the current 40+ column Typeform export into structured account pages. Fields the Typeform doesn't capture are configured for team entry, mapped together in the walkthrough.</>,
        <><strong>Your existing CRM preserved</strong>: with the NDA aligned, I'll work from your current setup, keeping everything of value and improving on it.</>,
        <><strong>The tier system</strong>: Tiers 1 to 3 driving checklists that update automatically when a tier is assigned or changed.</>,
        <><strong>Client to-do lists</strong>, editable by team and client, with a tier-appropriate starter list generated on account creation.</>,
        <><strong>Team task lists per client</strong>, internal only, linked to the master task database.</>,
        <><strong>Private notes with the budget flag</strong>: checking Budget Review Needed notifies the assigned Client Manager and Owner.</>,
        <><strong>Two pipelines</strong>: prospects (New Leads → Discovery → Decision → Proposal → Signed) and delivery (Setup → Onboarding → Active → Maintenance), with ownership, progress and reminders.</>,
      ],
    },
    {
      label: "C. The Client Portal",
      items: [
        <><strong>A dedicated client teamspace</strong> where Summit controls, through permissions, exactly which clients see what. Simple content serving per client, easy to update.</>,
        <><strong>Guest access per client</strong>, at no additional Notion licence cost at current pricing. Each client sees only their own pages, tasks, documents, call summaries and checklist.</>,
        <><strong>Branded tile landing page</strong> in your specified sections: Getting Started, Tax &amp; Accounting, Business Setup, Platform Guides, Tools &amp; Resources. Adding a tile is uploading an image and pasting a link.</>,
        <><strong>Partner deals and quick links</strong>: discount codes, plus light-touch links and guidance for TaxDome, QuickBooks and Monarch.</>,
        <><strong>A client request area</strong>, replacing scattered iMessage requests.</>,
        <><strong>Client-level documents</strong>: a permissioned database per client for signed agreements, LLC formation documents and EIN confirmations.</>,
      ],
    },
    {
      label: "D. The Agency Portal",
      items: [
        <><strong>Agency Accounts</strong>: contacts, agreement status, agreed rates with the negotiated-rate approval flag, performance ratings and status.</>,
        <><strong>Client Placements</strong>, linked to both the agency and the client's account so the team sees everything in one place.</>,
        <><strong>Applicant and placement Typeforms</strong>, each with Account Manager notification on submission.</>,
        <><strong>Payment tracking fields</strong> (status, last payment date and amount, referral-owed formula), maintained by the team in this phase.</>,
        <><strong>A collaborator resource layer</strong>, permissioned so Summit can grant and revoke access.</>,
      ],
    },
    {
      label: "E. Intelligence",
      items: [
        <><strong>Notion AI configured</strong> as the native interface to Summit's context, so plain-English questions return answers grounded in your own records. Feature availability depends on Summit's plan.</>,
        <><strong>AI Meeting Notes</strong> linked to client records with your spec's visibility split: clients see the summary, action items, date and who they spoke with; transcripts and internal notes stay internal.</>,
        <><strong>Notion Calendar</strong> introduced as part of the meeting and follow-up workflow, subject to provider confirmation.</>,
        <><strong>Notion Skills database</strong> set up so the team's ways of working are captured and reusable by Notion AI.</>,
      ],
    },
    {
      label: "F. Onboarding and automation",
      intro: "Native automations only in this phase, no third-party connectors.",
      items: [
        <><strong>Typeform intake</strong> restructured to feed the new account model, creating a structured record on submission.</>,
        <><strong>Tier assignment</strong> triggering the right checklist and starter to-do list automatically.</>,
        <><strong>Tier-based DocuSign routing</strong>, including the agreed tax/no-tax variation on Tier 2.</>,
        <><strong>The task cascade on signature</strong>, with persistent reminders until onboarding is complete, and Tier 1 assignment notifying the CPA.</>,
        <><strong>Client task notifications</strong>: submissions notify the Owner and VP of Operations; completions notify the client.</>,
        <><strong>Website registration submissions</strong> connected to Notion so sign-ups create structured records alongside Typeform intake, subject to platform confirmation.</>,
        <><strong>Custom agent setup and onboarding</strong>: Notion's AI agents configured for Summit, with the team shown how to brief them and put them to work.</>,
        <><strong>A client request agent included</strong>: watching the client portal request areas, so when a client raises a request it is triaged, the right owner is notified, and a first response is drafted for the team to review.</>,
        <><strong>Lightweight Notion Worker builds included</strong> where they clearly add value, such as deeper Typeform intake. Advanced integrations sit in Phase 2.</>,
      ],
    },
    {
      label: "G. Adoption and support",
      items: [
        <><strong>A planned team adoption day</strong> and walkthrough at the end of the build.</>,
        <><strong>Three months of hands-on launch support</strong> at 10 hours per month. Hours used within the month, no rollover.</>,
        <><strong>Flexible delivery</strong> through weekly calls, co-working, or agreed async, whichever suits Summit.</>,
        <><strong>Optional rolling support</strong> after launch at £1,000/month (approximately $1,350/month), no fixed term, cancellable by either side with 30 days' notice. This covers continued adoption, refinement and support of Summit OS 2.0; new capabilities such as drip campaigns or deeper finance integrations are scoped separately as Phase 2.</>,
      ],
    },
  ];

  return (
    <>
      <AnimatePresence>{!opened && <WelcomeScreen onOpen={() => setOpened(true)} />}</AnimatePresence>

      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: opened ? 0.25 : 0 }}
        className="min-h-screen bg-background"
      >
        {/* Download button */}
        <div className="fixed top-4 right-4 z-40 print:hidden">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur border border-border px-4 py-2 text-xs font-sans font-medium text-foreground shadow-sm hover:shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>

        {/* ============== EDITORIAL HEADER ============== */}
        <header className="px-5 sm:px-8 pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-16">
          <div className="max-w-2xl mx-auto text-center flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-sans text-[10.5px] sm:text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-8 sm:mb-10 order-1 sm:order-2"
            >
              Project Proposal <span className="text-muted-foreground/40 mx-2">·</span> Ref: SN1{" "}
              <span className="text-muted-foreground/40 mx-2">·</span> 16 July 2026
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 md:gap-20 mb-12 sm:mb-14 order-2 sm:order-1"
            >
              <img src={BlackStacked} alt="Thread & Stack" className="h-20 sm:h-20 md:h-24 w-auto" />
              <X aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/25" strokeWidth={1} />
              <img
                src={SummitLogo.url}
                alt="Summit Advisors Group LLC"
                className="h-14 sm:h-16 md:h-20 w-auto object-contain"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="font-serif-pro text-[36px] sm:text-5xl md:text-6xl italic font-medium leading-[1.05] tracking-tight text-foreground text-balance mb-8 order-3"
            >
              The{" "}
              <span className="inline-block text-gradient-warm" style={{ transform: "translateY(1px)" }}>
                Structure
              </span>{" "}
              Your Growth Has Been Waiting For.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-sans text-[16px] sm:text-[17px] text-foreground/75 leading-[1.7] max-w-xl mx-auto text-balance mb-6 order-4"
            >
              A Notion operations build that gives every team member clarity, runs client onboarding
              without a single point of failure, and gives clients a real window into their own progress.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col items-center gap-3 order-5"
            >
              <p className="font-sans text-[13px] sm:text-[14px] text-muted-foreground tracking-wide leading-relaxed">
                Prepared for: Cali Pilkington &amp; Andrew Gladstone
                <span className="hidden sm:inline"> · </span>
                <span className="block sm:inline">16 July 2026 · Ref: SN1</span>
              </p>
            </motion.div>
          </div>
        </header>

        {/* ============== BODY ============== */}
        <article className="px-5 sm:px-8 pb-24">
          <div className="max-w-2xl mx-auto">

            {/* 01 — Built around the way Summit works */}
            <section>
              <SectionHead
                num="01"
                eyebrow="A note before we begin"
                rotate={-0.4}
                title={<>Built around <Hl>Summit's clients.</Hl></>}
              />

              {/* Client priorities */}
              <motion.div {...fadeUp} className="mt-4">
                <h3 className="font-serif-pro text-[22px] md:text-[26px] italic font-medium text-foreground mb-5 leading-snug">
                  What Summit's clients need to feel.
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { word: "Known", body: "Strong relationships with a team that understands who they are and what matters to them." },
                    { word: "Supported", body: "A clear, easy way to make requests and see what is happening on their behalf." },
                    { word: "Protected", body: "Security, permissions and responsible access designed into the workspace architecture." },
                  ].map((item, i) => (
                    <div key={i} className="rounded-2xl bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                      <div className="font-serif-pro italic text-xl font-medium text-gradient-warm mb-2">{item.word}</div>
                      <p className="font-sans text-[14.5px] leading-[1.7] text-foreground/80">{item.body}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Journey stepper */}
              <motion.h3
                {...fadeUp}
                className="font-serif-pro text-[22px] md:text-[26px] italic font-medium text-foreground mt-14 mb-5 leading-snug"
              >
                Diagnostic complete. <Hl shift={-1}>Here's the path.</Hl>
              </motion.h3>

              <ul className="mt-4 space-y-5">
                {journeySteps.map((step, i) => {
                  const done = step.state === "done";
                  const current = step.state === "current";
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Tilt3D maxX={5} maxY={4}>
                        <div
                          className={`flex gap-5 items-start rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-full ${
                            done
                              ? "bg-tertiary/10 border border-tertiary/30"
                              : current
                              ? "bg-card border border-accent/40 shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
                              : "bg-card"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${
                              done ? "bg-tertiary" : "bg-background"
                            }`}
                          >
                            {done ? (
                              <Check className="w-6 h-6 text-tertiary-foreground" strokeWidth={2.5} />
                            ) : (
                              <span className="font-sans text-sm font-semibold text-muted-foreground">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <strong className="font-serif-pro italic font-medium text-lg text-foreground">
                                {step.title}
                              </strong>
                              {current && (
                                <span
                                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.18em] uppercase text-white"
                                  style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                                >
                                  You are here
                                </span>
                              )}
                              {done && (
                                <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-tertiary">
                                  Complete
                                </span>
                              )}
                            </div>
                            <span className="text-foreground/75 leading-relaxed">{step.body}</span>
                          </div>
                        </div>
                      </Tilt3D>
                    </motion.li>
                  );
                })}
              </ul>
            </section>

            <Rule />

            {/* 02 — The stack */}
            <section>
              <SectionHead
                num="02"
                eyebrow="The workspace"
                rotate={0.3}
                title={<>The <Hl>stack</Hl> Summit will run on.</>}
              />

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {stack.map((layer, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Tilt3D maxX={5} maxY={4}>
                      <div className="flex gap-4 items-start bg-card rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-full">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                          <img src={layer.icon} alt="" className="w-8 h-8 object-contain" />
                        </div>
                        <div className="flex-1 pt-0.5 min-w-0">
                          <div className="font-serif-pro italic font-medium text-[19px] text-foreground leading-tight mb-1.5">
                            {layer.title}
                          </div>
                          <p className="font-sans text-[14.5px] leading-[1.6] text-foreground/75">
                            {layer.body}
                          </p>
                          {layer.tag && (
                            <div className="mt-2 font-sans text-[10.5px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                              {layer.tag}
                            </div>
                          )}
                        </div>
                      </div>
                    </Tilt3D>
                  </motion.div>
                ))}
              </div>
            </section>

            <Rule />

            {/* 03 — Timeline */}
            <section>
              <SectionHead
                num="03"
                eyebrow="The year ahead"
                rotate={0.4}
                title={<>A plan built around the way <Hl>Summit works.</Hl></>}
              />

              {/* Change management callout */}
              <motion.div {...fadeUp} className="mt-4 mb-10">
                <div className="rounded-2xl border border-dashed border-accent/40 bg-background/40 p-5 sm:p-6">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-2">
                    A note on change management
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Clients usually come to me for a Notion workspace. What they often underestimate is
                    that they're also on the receiving end of change management. Helping your team adopt
                    the new system is part of the job, as much as the build itself. It's why supported
                    adoption is written into this project rather than sold as an extra, and why these
                    phases walk before they run.
                  </p>
                </div>
              </motion.div>

              <div className="relative mt-8 pl-6 sm:pl-8">
                <div
                  aria-hidden
                  className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-accent/40"
                />

                {timeline.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="relative pb-10 last:pb-0"
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold tracking-[0.18em] uppercase ${
                        step.isComplete
                          ? "bg-tertiary text-tertiary-foreground"
                          : step.isLaunch
                          ? "bg-primary text-primary-foreground"
                          : "text-white"
                      }`}
                      style={
                        step.isComplete || step.isLaunch
                          ? undefined
                          : { backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }
                      }
                    >
                      {step.isComplete && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                      {step.isLaunch && <Rocket className="w-3.5 h-3.5" />}
                      {step.label}
                    </span>
                    <h3 className="mt-3 font-serif-pro italic font-medium text-xl sm:text-2xl leading-tight text-foreground">
                      {step.when}
                    </h3>
                    <div className="mt-1 font-sans text-[12px] tracking-[0.16em] uppercase text-muted-foreground">
                      Owner: {step.owner}
                    </div>
                    <p className="mt-3 font-sans text-[16px] leading-[1.75] text-foreground/80">
                      {step.note}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.p {...fadeUp} className="mt-10 font-sans text-[16px] leading-[1.75] text-foreground/80">
                If sign-off lands this month, the shape of the year draws itself: build through
                August and September, adoption day in early October, supported adoption through to
                the end of the year, and Summit starts January on a system built for the size it's
                becoming, with the doors open again.
              </motion.p>
            </section>

            <Rule />

            {/* 04 — Scope */}
            <section>
              <SectionHead
                num="04"
                eyebrow="What's in scope"
                rotate={-0.3}
                title={<>The full <Hl>scope of work.</Hl></>}
              />

              <P>
                Built directly to the specification Cali prepared: the three-portal structure, the
                tier-based checklists, the Login Vault and the budget flag all come from that document.
                Where a newer Notion capability offers a better route, I'll bring the options with a
                recommendation and we'll decide together.
              </P>

              {scopeGroups.map((group, gi) => {
                const [letter, ...rest] = group.label.split(". ");
                const title = rest.join(". ");
                return (
                  <motion.div key={gi} {...fadeUp} className="mt-8 first:mt-10">
                    <Tilt3D maxX={4} maxY={3}>
                      <div className="relative rounded-3xl bg-card p-8 sm:p-10 lg:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-foreground/5 overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-gradient-warm opacity-[0.07] blur-2xl pointer-events-none" />
                        <div className="flex items-start gap-5 sm:gap-7 mb-6 sm:mb-8">
                          <div className="shrink-0 font-serif italic text-transparent bg-clip-text bg-gradient-warm text-[64px] sm:text-[88px] leading-[1.1] font-medium tracking-tight pr-2 pb-1">
                            {letter}
                          </div>
                          <div className="pt-2 sm:pt-4">
                            <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                              Scope group
                            </div>
                            <h3 className="font-serif text-[24px] sm:text-[30px] lg:text-[34px] leading-[1.15] font-medium text-foreground">
                              {title}
                            </h3>
                          </div>
                        </div>
                        {group.intro && (
                          <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80 mb-5">
                            {group.intro}
                          </p>
                        )}
                        <BulletList items={group.items} />
                      </div>
                    </Tilt3D>
                  </motion.div>
                );
              })}

              {/* What's not included, and why */}
              <motion.div {...fadeUp} className="mt-14 rounded-2xl border border-clay/30 bg-clay/5 p-5 sm:p-6">
                <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-4">
                  What's not included, and why
                </div>
                <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80 mb-4">
                  The priority is getting Summit operating fast enough to start accepting new clients
                  again, and adoption is as much a part of that as the build. Taking on too much too
                  fast is the classic way an expensive new workspace fails, so this project is
                  deliberately staged: the foundation first, the deeper machinery once the team is
                  living in it. Everything below is Phase 2 or later, scoped separately once Summit OS
                  2.0 is adopted.
                </p>
                <ul className="space-y-3 list-none pl-0">
                  {[
                    "TaxDome stays fully separate, in line with the security constraint you and Dallin raised.",
                    "Deep QuickBooks or Monarch data sync. Links and guidance only in this phase.",
                    "Infloww-fed payment automation and earnings monitoring.",
                    "Drip campaigns and email delivery of any kind, pending confirmation of Summit's email provider and what the workflow really needs.",
                    "Advanced integrations and further agents beyond the lightweight builds included in this phase: Phase 2, scoped separately.",
                    "A client-facing web application beyond the Notion client portal: out of scope for now.",
                    "The affiliate resource hub is not included.",

                    "Website registration integration is included, but implementation depends on the platform behind summitnetwork.net; any paid third-party connector licence is excluded unless agreed.",
                  ].map((it, i) => (
                    <li key={i} className="relative pl-6 text-[15.5px] leading-[1.75] text-foreground/80">
                      <span className="absolute left-0 top-[0.7em] w-[7px] h-[7px] rounded-full border-[1.5px] border-clay" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* What I'll need from Summit */}
              <motion.div {...fadeUp} className="mt-8">
                <Tilt3D maxX={4} maxY={3}>
                  <div className="rounded-2xl bg-card p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-3">
                      What I'll need from Summit
                    </div>
                    <ul className="space-y-3 list-none pl-0">
                      {[
                        "Access to the existing Notion workspace and current CRM as a consultant.",
                        "Typeform and Google Drive account access.",
                        "A named contact to connect payment services when we reach payment tracking.",
                        "A named internal owner who inherits the workspace from me, assumed to be Cali, to be confirmed.",
                        "Confirmation of Dallin's role on his return, the platform behind summitnetwork.net, and your calendar and email provider.",
                      ].map((it, i) => (
                        <li key={i} className="relative pl-6 text-[15.5px] leading-[1.7] text-foreground/80">
                          <span className="absolute left-0 top-[0.7em] w-[7px] h-[7px] rounded-full border-[1.5px] border-accent" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tilt3D>
              </motion.div>

            </section>



            <Rule />

            {/* 05 — Investment */}
            <section>
              <SectionHead
                num="05"
                eyebrow="Investment"
                rotate={-0.3}
                title={<>The <Hl>numbers.</Hl></>}
              />

              <EditorialTable
                head={["Item", "GBP", "USD equivalent"]}
                rows={[
                  ["Notion operations build (2-month build + 3-month launch support)", "£12,500", "≈ $16,880"],
                  [
                    "Diagnostic fee, already paid",
                    <span className="text-gradient-warm font-semibold">–£395 credited</span>,
                    <span className="text-gradient-warm font-semibold">≈ –$535 credited</span>,
                  ],
                  [<strong>Net investment</strong>, <strong>£12,105</strong>, <strong>≈ $16,345</strong>],
                ]}
              />

              <motion.p {...fadeUp} className="font-sans text-[13.5px] leading-[1.7] text-muted-foreground mt-4">
                USD amounts are indicative equivalents based on an exchange rate of approximately
                £1 = $1.3504 on 16 July 2026. Thread &amp; Stack's fees are set in GBP; the final USD
                amount will reflect the applicable exchange rate when invoiced.
              </motion.p>

              <H3>Payment schedule</H3>
              <EditorialTable
                head={["When", "GBP", "USD equivalent"]}
                rows={[
                  ["On signature (40% deposit, diagnostic credit applied)", "£4,605", "≈ $6,220"],
                  ["End of month one", "£2,500", "≈ $3,375"],
                  ["End of month two", "£2,500", "≈ $3,375"],
                  ["End of month three", "£2,500", "≈ $3,375"],
                  [<strong>Total</strong>, <strong>£12,105</strong>, <strong>≈ $16,345</strong>],
                ]}
              />

              <motion.p {...fadeUp} className="font-sans text-[13.5px] leading-[1.7] text-muted-foreground mt-4">
                The deposit is 40% of the build fee (£5,000) with the £395 diagnostic credit applied. Payment completes during supported adoption, so cost tracks alongside delivery rather than landing as one upfront sum.
              </motion.p>

              <H3>After supported adoption</H3>
              <P>
                Once the three months of supported adoption end, nothing continues automatically. If Summit wants me to stay involved, rolling support is available at £1,000/month (approximately $1,350/month), no fixed term, cancellable by either side with 30 days' notice. It covers continued adoption, refinement and support of Summit OS 2.0; new capabilities such as drip campaigns or deeper finance integrations are scoped separately as Phase 2.
              </P>

              <H3>Terms</H3>
              <BulletList
                items={[
                  <>Thread &amp; Stack Ltd is not currently VAT registered. No VAT is applicable.</>,
                  <>Payment is a 40% deposit on signature with the diagnostic credit applied, then three equal monthly instalments, completing during supported adoption. <strong>15% late charge applies after 30 days.</strong></>,
                  <>Thread &amp; Stack Ltd is a certified Notion consultancy and operates independently of Notion. Notion retains all rights to its own products, and responsibility for Notion's service delivery, uptime, security and product changes sits with Notion. Thread &amp; Stack accepts no liability for the failure, outage or change of Notion's software, or of any other third-party software Summit uses.</>,
                  <>Summit's licensing, payment and data relationships with Notion and every other software provider are held directly between Summit and those providers. Thread &amp; Stack is not a party to those agreements.</>,
                ]}
              />


              <H3>Not included in project fee</H3>
              <BulletList
                items={[
                  <>Individual Notion member licences for Summit's team, billed directly by Notion. Working estimate roughly <strong>$1,500/year</strong>, to be confirmed against plan and headcount.</>,
                  <>Notion Enterprise, Worker credits or other plan add-ons, including any plan upgrade required for Notion AI features.</>,
                  <>Paid third-party connectors or external software licences unless explicitly agreed.</>,
                ]}
              />

            </section>

            <Rule />

            {/* 06 — Disclaimers */}
            <section>
              <SectionHead
                num="06"
                eyebrow="Read before signing"
                rotate={-0.3}
                title={<>Important disclaimers and <Hl>recommendations.</Hl></>}
              />

              <motion.div {...fadeUp} className="space-y-5">
                <div className="rounded-2xl bg-card p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                    Restricted credential storage
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Notion is not a password manager, and I won't pretend otherwise. Notion itself, however, runs enterprise-grade security, independently audited against standards including SOC 2 Type 2 and ISO 27001. You can read <a href="https://www.notion.com/en-us/security" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Notion's security practices</a> for yourself. A dedicated password manager remains the most appropriate way to store and share credentials. What I can build inside Notion is a permission-based database structure for collaborator information sharing: the Login Vault and per-client credential sections, with per-record visibility for named team members and full visibility for the Owner and VP of Operations. Notion doesn't natively support row-level permissions inside a database, so this is a practical access arrangement built to Notion's strongest pattern. Full SSNs, card numbers and full bank account numbers are never stored in Notion; last four digits only where identification is needed.
                  </p>

                </div>
                <div className="rounded-2xl bg-card p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                    Notion Enterprise recommendation
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    I don't normally recommend Notion Enterprise for small teams. Summit is the exception worth considering: you work with a specific clientele and you've experienced specific data security pain points, and Enterprise brings single sign-on and a higher security baseline in return for a higher per-user cost. Worth knowing: SSO implementation adds real complexity, so it sits outside this scope and can be bolted on as a separately priced addition if Summit decides to go that way. Enterprise licensing itself is billed by Notion. Notion publishes its <a href="https://www.notion.com/en-gb/help/enterprise-search-security-and-privacy-practices" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">enterprise security and privacy practices</a> in detail.
                  </p>

                </div>
              </motion.div>
            </section>

            <Rule />

            {/* Sign-off + business card */}
            <section>
              <motion.div {...fadeUp} className="mx-auto max-w-xl">
                <div className="mb-6 text-center font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm">
                  Next
                </div>
                <h2
                  className="font-serif-pro text-[28px] sm:text-[34px] md:text-[40px] italic font-medium leading-[1.1] tracking-tight text-foreground text-balance mb-6 text-center"
                  style={{ transform: "rotate(-0.3deg)" }}
                >
                  Let's build the{" "}
                  <span className="inline-block text-gradient-warm" style={{ transform: "translateY(1px)" }}>
                    structure
                  </span>{" "}
                  your growth has been waiting for.
                </h2>
                <p className="font-sans text-[16px] leading-[1.75] text-foreground/80 text-center mb-10 max-w-lg mx-auto">
                  Happy to walk through any part of this with you, Andrew and Cali.
                </p>

                <div className="mb-8 flex justify-center">
                  <PillButton onClick={() => setReplyOpen(true)} icon={Send}>
                    Reply to this proposal
                  </PillButton>
                </div>

                <Tilt3D maxX={5} maxY={4}>
                  <div className="rounded-2xl bg-card shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img
                      src={BrendanAvatar}
                      alt="Brendan Rodgers"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <div className="font-serif-pro italic text-2xl font-medium text-foreground leading-tight">
                        Brendan Rodgers
                      </div>
                      <div className="font-sans text-[13px] tracking-[0.18em] uppercase text-muted-foreground mt-1">
                        Thread &amp; Stack
                      </div>
                      <div className="mt-4 space-y-1.5 font-sans text-[15px] text-foreground/85">
                        <div>
                          <a href="mailto:br@brendanrodgers.uk" className="text-accent hover:underline">
                            br@brendanrodgers.uk
                          </a>
                        </div>
                        <div>
                          <a href="tel:+447913566551" className="hover:text-accent transition-colors">
                            07913 566551
                          </a>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <a
                          href="mailto:br@brendanrodgers.uk?subject=Summit%20Network%20Proposal%20(SN1)%20Reply&body=Hi%20Brendan%2C%0A%0A"
                          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-sans text-sm font-medium transition-all hover:-translate-y-px"
                          style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                        >
                          <Send className="w-4 h-4" />
                          Email Brendan
                        </a>
                        <a
                          href="https://www.linkedin.com/in/rodgersbrendan/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-clay/50 text-foreground font-sans text-sm hover:border-clay transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          Connect on LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                </Tilt3D>

                <div className="mt-12 sm:mt-16">
                  <div className="text-center font-sans text-[12px] tracking-[0.22em] uppercase text-muted-foreground/70 mb-5">
                    Notion Credentials
                  </div>
                  <img
                    src={NotionBadges}
                    alt="Notion certification badges: Academy Essentials, Workflows, Advanced, AI, Certified Admin, Service Specialist, and Consulting Partner"
                    className="w-full max-w-2xl mx-auto h-auto"
                  />
                </div>
              </motion.div>
            </section>
          </div>
        </article>

        {/* ============== Footer ============== */}
        <footer className="px-5 sm:px-8 py-12 border-t border-border">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="font-sans text-[13px] text-muted-foreground leading-[1.6]">
              Brendan Rodgers ·{" "}
              <a href="https://threadandstack.com/" className="text-accent hover:underline">
                threadandstack.com
              </a>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground/60">
                <span>Prepared for</span>
                <img
                  src={SummitLogo.url}
                  alt="Summit Advisors Group LLC"
                  className="h-4 w-auto object-contain"
                />
                <span>· Ref: SN1 · 16 July 2026</span>
              </div>
            </div>
            <img src={GreyStacked} alt="Thread & Stack" className="h-8 opacity-50 flex-shrink-0" />
          </div>
        </footer>
      </motion.main>

      <ReplyDrawer open={replyOpen} onOpenChange={setReplyOpen} />
    </>
  );
};

export default SummitNetworkProposalPage;
