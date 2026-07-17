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
import IconClaude from "@/assets/proposal/icons/claude.png";
import IconNotion from "@/assets/proposal/icons/notion.png";
import IconNotionAI from "@/assets/proposal/icons/notion-ai.png";
import IconLassie from "@/assets/proposal/icons/lassie.png";
import IconZapier from "@/assets/proposal/icons/zapier.svg";
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
    className="my-8 overflow-hidden rounded-2xl border border-border bg-card/40 shadow-[0_2px_24px_-12px_rgba(0,0,0,0.08)]"
  >
    <div className="overflow-x-auto">
      <table className="w-full font-sans text-[13.5px] sm:text-[15px] min-w-[420px]">
        {head && (
          <thead>
            <tr className="bg-muted/40">
              {head.map((h, i) => (
                <th
                  key={i}
                  className="text-left px-3 sm:px-5 py-2.5 sm:py-3 font-semibold text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.18em] uppercase text-muted-foreground"
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
                <td key={c} className="px-3 sm:px-5 py-2.5 sm:py-3 align-top text-foreground/85 leading-[1.55] sm:leading-[1.6]">
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

const WelcomeScreen = ({ onOpen }: { onOpen: () => void }) => (
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
    <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 md:px-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-sans text-[10.5px] sm:text-[12px] tracking-[0.28em] uppercase text-primary-foreground/55 mb-8 sm:mb-10"
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
          className="font-serif-pro text-3xl sm:text-5xl md:text-6xl italic font-medium leading-[1.05] tracking-tight mb-8 text-balance"
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
          className="font-sans text-[15px] sm:text-[17px] leading-[1.75] text-primary-foreground/80 max-w-xl mb-10"
        >
          A Notion operations build that gives every team member clarity, runs client onboarding without
          a single point of failure, and gives clients a real window into their own progress.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="font-sans text-[13px] text-primary-foreground/60"
        >
          Prepared for Cali Pilkington &amp; Andrew Gladstone, Summit Network
        </motion.div>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="flex flex-col items-center pb-8 sm:pb-10 bg-primary"
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
  </motion.div>
);

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
      label: "Diagnostic — Complete",
      when: "13 July 2026",
      owner: "Both",
      isLaunch: false,
      isComplete: true,
      note: "Confirmed the current setup, priorities, risks and recommended direction.",
    },
    {
      label: "Build and validation",
      when: "Roughly two months following sign-off",
      owner: "Thread & Stack, with Summit input",
      isLaunch: false,
      isComplete: false,
      note: "Infrastructure, portals, collaboration, agency layer, intelligence and agreed onboarding workflows built and reviewed inside hidden teamspaces.",
    },
    {
      label: "Adoption Day",
      when: "End of build",
      owner: "Both",
      isLaunch: true,
      isComplete: false,
      note: "Planned go-live, team walkthrough and transition into the new working rhythm.",
    },
    {
      label: "Supported adoption",
      when: "Three months following Adoption Day",
      owner: "Thread & Stack and Summit",
      isLaunch: false,
      isComplete: false,
      note: "10 hours per month of hands-on support, refinement and adoption guidance.",
    },
    {
      label: "Ongoing support",
      when: "Month to month thereafter",
      owner: "Thread & Stack",
      isLaunch: false,
      isComplete: false,
      note: "Optional rolling support at £1,000/month (approximately $1,350/month), flexible up or down, no fixed term.",
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
              <div className="font-serif-pro italic text-2xl sm:text-3xl md:text-4xl font-medium text-foreground text-center">
                Summit<br />Network
              </div>
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

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-sans text-[13px] sm:text-[14px] text-muted-foreground tracking-wide leading-relaxed order-5"
            >
              Prepared for: Cali Pilkington &amp; Andrew Gladstone, Summit Network
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline">16 July 2026 · Ref: SN1</span>
            </motion.p>
          </div>
        </header>

        {/* ============== BODY ============== */}
        <article className="px-5 sm:px-8 pb-24">
          <div className="max-w-2xl mx-auto">

            {/* 01 — Built around the way Summit works (letter) */}
            <section>
              <SectionHead
                num="01"
                eyebrow="A note before we begin"
                rotate={-0.4}
                title={<>Built around the way <Hl>Summit</Hl> works.</>}
              />

              <motion.div {...fadeUp} className="mx-auto max-w-[560px]">
                <div className="rounded-2xl bg-card shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8 font-sans text-[16px] leading-[1.8] text-foreground/85 space-y-5">
                  <p>Dear Andrew and Cali,</p>
                  <p>
                    Thank you for the time and detail you've both put into this process, from our first
                    conversations through to the diagnostic and the build specification you shared afterwards.
                    It has given me a clear picture of how Summit works today, where the pressure is building,
                    and what the business needs next.
                  </p>
                  <p>
                    Summit works with young creators who place a high value on strong relationships. They want
                    to feel known by the people looking after them, have an easy way to ask for help, and trust
                    that their personal and financial information is being handled carefully. The system behind
                    the service needs to strengthen those relationships, not make them feel more transactional.
                  </p>
                  <p>
                    The first priority is getting your Notion workspace working properly as a shared operating
                    environment. Everyone should know what they are responsible for, where client information
                    lives, and what needs to happen next, with security and permissions built into the
                    architecture from the beginning.
                  </p>
                  <p>
                    Once that foundation is in place, Notion AI becomes significantly more useful. With Summit's
                    knowledge, meetings, client records and processes held in one connected context, your team
                    can ask better questions, find information faster and use AI in a way that is grounded in
                    how Summit actually operates.
                  </p>
                  <p>
                    From there, we can introduce a knowledge-enabled intelligence layer: Claude, focused agents
                    and repeatable workflows that work from Summit's approved context. We can then connect
                    selected work that begins outside Notion, including website registrations and other agreed
                    systems. The important thing is to build these layers in the right order rather than
                    automate processes before the underlying system has been adopted.
                  </p>
                  <p>
                    This proposal sets out how we'll build that foundation, introduce the intelligence layer
                    and support your team through adoption.
                  </p>
                  <p className="font-serif-pro italic text-lg text-foreground pt-2">Brendan</p>
                </div>
              </motion.div>

              {/* Three-layer maturity visual */}
              <div className="mt-12 space-y-4">
                {[
                  { n: "01", title: "Notion Workspace", body: "The context layer. Clients, agencies, tasks, meetings, agreements, SOPs and responsibilities organised in one permissioned operating environment." },
                  { n: "02", title: "Notion AI", body: "The native intelligence layer. The team can find information, understand context and act on the work held inside the workspace." },
                  { n: "03", title: "Knowledge-enabled intelligence", body: "The applied layer. Claude, custom agents and controlled workflows use Summit's approved context to support specific, repeatable work." },
                ].map((layer, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Tilt3D maxX={5} maxY={4}>
                      <div className="flex gap-5 items-start bg-card rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-full">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                          <span className="font-serif-pro italic text-xl text-gradient-warm font-medium">{layer.n}</span>
                        </div>
                        <div className="flex-1 pt-1">
                          <strong className="font-serif-pro italic font-medium text-lg text-foreground block mb-1">{layer.title}</strong>
                          <span className="text-foreground/75 leading-relaxed">{layer.body}</span>
                        </div>
                      </div>
                    </Tilt3D>
                  </motion.div>
                ))}
              </div>

              {/* Connected workflows bridge */}
              <motion.div {...fadeUp} className="mt-8">
                <div className="rounded-2xl border border-dashed border-accent/40 bg-background/40 p-5 sm:p-6">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-2">
                    Connected workflows
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Once the core system is established, selected information can move between Notion and
                    external systems. Website registrations are included in this build. Broader website,
                    accounting, payment and campaign integrations are a later phase unless explicitly listed
                    in scope.
                  </p>
                </div>
              </motion.div>

              {/* Client priorities */}
              <motion.div {...fadeUp} className="mt-14">
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
            </section>

            <Rule />

            {/* 02 — How we get there */}
            <section>
              <SectionHead
                num="02"
                eyebrow="How we get there"
                rotate={0.3}
                title={<>Diagnostic complete. <Hl shift={-1}>Five moves to go.</Hl></>}
              />

              {/* Completed diagnostic card */}
              <motion.div {...fadeUp} className="mb-8">
                <Tilt3D maxX={5} maxY={4}>
                  <div className="flex gap-5 items-start rounded-2xl p-5 bg-tertiary/10 border border-tertiary/30 shadow-[0_8px_30px_rgba(0,0,0,0.05)] h-full">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-tertiary flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
                      <Check className="w-6 h-6 text-tertiary-foreground" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-tertiary mb-1">
                        Completed — Diagnostic · 13 July 2026
                      </div>
                      <p className="text-foreground/80 leading-relaxed">
                        Thank you for the time and level of detail you provided during and after the
                        diagnostic. It means this recommendation can respond to the way Summit actually
                        works rather than impose a generic CRM structure.
                      </p>
                    </div>
                  </div>
                </Tilt3D>
              </motion.div>

              <ul className="mt-4 space-y-5">
                {[
                  { title: "Infrastructure", body: "Build the permissioned operating foundation: structured client and contact records, teamspaces, personal dashboards, tasks, meetings, agreements, SOPs, prospect pipeline and client-delivery pipeline. Work is built in hidden teamspaces inside the existing workspace so current operations are not disrupted." },
                  { title: "Client-facing portals", body: "Create a private home for each client, with relevant progress, resources, tasks and a simple way to make requests of the Summit team. Each guest sees only the information intentionally shared with them." },
                  { title: "Collaboration", body: "Connect ownership, tasks, meetings, notes and notifications around each client so the team can see what needs to happen next and who is responsible. Introduce Notion Calendar and AI Meeting Notes as part of the working rhythm." },
                  { title: "Agency collaboration portal", body: "Create a permissioned agency CRM and resource layer for agency accounts, contacts, agreements, referral arrangements, call notes and collaboration resources. Summit can grant agency partners access to the information intended for them and revoke that access when a relationship changes. Infloww credential management and agency payment tracking are not included in this phase." },
                  { title: "Onboarding, adoption and support", body: "Connect approved intake and onboarding workflows, prepare the team, run a planned adoption day and provide three months of hands-on launch support at 10 hours per month. After that period, Summit can retain Thread & Stack on a rolling £1,000/month agreement (approximately $1,350/month at the proposal-date exchange rate), with no fixed term." },
                ].map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Tilt3D maxX={5} maxY={4}>
                      <div className="flex gap-5 items-start bg-card rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-full">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                          <span className="font-serif-pro italic text-xl text-gradient-warm font-medium">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="flex-1 pt-1">
                          <strong className="font-serif-pro italic font-medium text-lg text-foreground block mb-1">{step.title}</strong>
                          <span className="text-foreground/75 leading-relaxed">{step.body}</span>
                        </div>
                      </div>
                    </Tilt3D>
                  </motion.li>
                ))}
              </ul>
            </section>

            <Rule />

            {/* 03 — The workspace */}
            <section>
              <SectionHead
                num="03"
                eyebrow="The workspace"
                rotate={0.3}
                title={<>The <Hl>stack</Hl> Summit will run on.</>}
              />
              <P>
                One connected operation, built around Notion as the source of truth. Each layer has a
                defined role: the workspace holds the context, AI helps the team work with it, and
                controlled connections move selected information between systems.
              </P>
              <ul className="mt-8 space-y-5">
                {[
                  { icon: IconNotion, title: "Notion Workspace. The source of truth.", body: "Clients, agencies, agreements, tasks, meetings, SOPs and team knowledge in one place. Each team member has an individual login and a relevant homepage, with access governed through teamspaces, page sharing and permissions." },
                  { icon: IconLassie, title: "Notion AI. The native intelligence layer.", body: "The team can ask questions in plain English and receive answers grounded in the workspace. AI Meeting Notes and call transcripts are linked to the relevant clients and work, subject to the appropriate ownership and access permissions." },
                  { icon: IconClaude, title: "Claude. The strategic co-pilot.", body: "Claude can work from Summit's approved Notion context to help draft communications, reason over pipeline information and pressure-test decisions. Access must be intentional and permissioned; this is not a promise of unrestricted workspace access." },
                  { icon: IconNotionAI, title: "Custom agents. Focused intelligence for Summit.", body: "A small initial layer of purpose-built agents will support agreed repeatable use cases, such as triaging requests, monitoring onboarding progress or surfacing collaboration opportunities. Final agent use cases will be agreed during the build; this does not include an unlimited catalogue of agents." },
                  { icon: IconNotion, title: "Notion Calendar. Time connected to context.", body: "Connect meetings to clients, work and follow-up. Introduce the team to a shared calendar workflow that supports scheduling, preparation and meeting capture. Calendar setup depends on Summit's confirmed provider and permissions." },
                  { icon: IconZapier, title: "Notion Workers. The integration layer.", body: "Use Notion Workers where appropriate for agreed deterministic workflows: receiving website or form events, syncing approved data, triggering updates and giving custom agents reliable tools. Workers are for the integrations explicitly included in this proposal; they do not create an open-ended commitment to connect every third-party platform. Availability, usage and any additional Notion charges depend on Summit's Notion plan and Notion's Worker terms." },
                  { icon: IconZapier, title: "Automations. The repeatable pipes.", body: "Typeform and website registrations create structured records. Signed DocuSign agreements trigger the agreed onboarding tasks and reminders. Additional workflow tools may be used where they are more suitable than native Notion functionality." },
                  { icon: IconNotion, title: "Email and communications. To be confirmed.", body: "We'll confirm Summit's current email environment during setup and recommend the appropriate connection. Any deeper inbox automation will be scoped against the provider, permissions and workflow required." },
                ].map((layer, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Tilt3D maxX={5} maxY={4}>
                      <div className="flex gap-5 items-start bg-card rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-full">
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-background flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                          <img src={layer.icon} alt="" className="w-9 h-9 object-contain" />
                        </div>
                        <div className="flex-1 pt-1">
                          <strong className="font-serif-pro italic font-medium text-lg text-foreground block mb-1">{layer.title}</strong>
                          <span className="text-foreground/75 leading-relaxed">{layer.body}</span>
                        </div>
                      </div>
                    </Tilt3D>
                  </motion.li>
                ))}
              </ul>
            </section>

            <Rule />

            {/* 04 — What's in scope */}
            <section>
              <SectionHead
                num="04"
                eyebrow="What's in scope"
                rotate={-0.3}
                title={<>The full <Hl>scope of work.</Hl></>}
              />

              {[
                {
                  label: "A. Infrastructure and internal operations",
                  items: [
                    <>Configure individual member access and migrate the team away from the shared-login working model. Summit purchases the Notion licences directly.</>,
                    <>Rebuild the current 40+ column Typeform export into structured client and account records.</>,
                    <>Personalised homepages showing each team member's relevant tasks, meetings and week ahead.</>,
                    <>Prospect pipeline: New Leads → Discovery → Decision → Proposal → Signed.</>,
                    <>Client-delivery pipeline: Setup → Onboarding → Active → Maintenance.</>,
                    <>Clear ownership, progress indicators and reminders across signing and onboarding.</>,
                    <>Searchable SOP and team-knowledge library.</>,
                  ],
                },
                {
                  label: "B. Client experience",
                  items: [
                    <>A private client portal for each client using guest access and intentional page sharing.</>,
                    <>Relevant tasks, resources, progress and a dedicated client request area.</>,
                    <>Branded landing tiles designed from the logo and brand materials Summit supplies. These remain simple and replaceable.</>,
                    <>Light-touch QuickBooks and Monarch links and guidance, not deep data integrations.</>,
                  ],
                },
                {
                  label: "C. AI, meetings and intelligence",
                  items: [
                    <>Notion AI introduced as the native interface to Summit's workspace context.</>,
                    <>Notion AI Meeting Notes and call transcription linked to relevant client records with appropriate access.</>,
                    <>Notion Calendar introduced as part of the meeting and follow-up workflow, subject to provider confirmation.</>,
                    <>Claude connected to approved context for agreed strategic use cases.</>,
                    <>A small initial custom agent layer for agreed repeatable workflows.</>,
                  ],
                },
                {
                  label: "D. Intake, agreements and onboarding",
                  items: [
                    <>Restructure the Typeform intake so it feeds the new account model.</>,
                    <>Connect website registration submissions to Notion so they create structured records alongside Typeform intake.</>,
                    <>Tier-based DocuSign routing, including the agreed tax/no-tax variation on Tier 2.</>,
                    <>Agreed tasks and reminders triggered following signature until onboarding is complete.</>,
                    <>Use Notion Workers or another appropriate integration method for the explicitly agreed flows.</>,
                  ],
                },
                {
                  label: "E. Agency collaboration",
                  items: [
                    <>Agency accounts, contacts, agreements, referral percentages and call notes.</>,
                    <>A permissioned partner resource layer with access that Summit can grant and revoke.</>,
                    <>Collaboration tracking kept separate from client delivery work while remaining connected to the relevant relationships.</>,
                  ],
                },
                {
                  label: "F. Adoption and support",
                  items: [
                    <>Planned team adoption day and walkthrough.</>,
                    <>Three months of hands-on launch support at 10 hours per month.</>,
                    <>Support can be delivered through weekly calls, co-working or agreed asynchronous communication.</>,
                    <>Optional rolling support after launch at £1,000/month (approximately $1,350/month), no fixed term.</>,
                  ],
                },
              ].map((group, gi) => (
                <div key={gi}>
                  <H3>{group.label}</H3>
                  <BulletList items={group.items} />
                </div>
              ))}

              {/* Caveats */}
              <motion.div {...fadeUp} className="mt-10 rounded-2xl border border-clay/30 bg-clay/5 p-5 sm:p-6">
                <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-4">
                  Not included in this phase
                </div>
                <ul className="space-y-3 list-none pl-0">
                  {[
                    <>TaxDome remains fully separate, with no Notion integration.</>,
                    <>No deep QuickBooks or Monarch data sync in this phase.</>,
                    <>Infloww credential management and agency payment tracking are deferred until the agency CRM has been adopted.</>,
                    <>Drip campaigns and broader client/agency marketing automation are a later workflow phase.</>,
                    <>The future Lovable + Notion client-facing web application is a separate project.</>,
                    <>The affiliate resource hub is not included.</>,
                    <>Website registration integration is included, but the exact implementation depends on confirmation of the platform behind summitnetwork.net and access to its forms, API or webhooks. If the platform requires a paid third-party connector, that licence is not included unless agreed.</>,
                    <>Summit's email provider and desired email workflow must be confirmed before any inbox integration is scoped.</>,
                    <>Custom agents and Workers are limited to the agreed use cases in this proposal. Further agents, integrations or custom logic will be separately scoped.</>,
                  ].map((it, i) => (
                    <li key={i} className="relative pl-6 text-[15.5px] leading-[1.75] text-foreground/80">
                      <span className="absolute left-0 top-[0.7em] w-[7px] h-[7px] rounded-full border-[1.5px] border-clay" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Security and permissions */}
              <H3>Security and permissions</H3>
              <motion.div {...fadeUp} className="space-y-5">
                <div className="rounded-2xl bg-card p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                    Restricted credential reference area
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    A team-only area can be created using intentional page sharing, teamspace permissions
                    and filtered views for the platform information Summit needs to manage. This is a
                    practical access arrangement, not a replacement for a dedicated password manager or
                    enterprise credential-management platform.
                  </p>
                </div>
                <div className="rounded-2xl bg-card p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                    Notion Enterprise recommendation
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Recommend Notion Enterprise primarily for single sign-on (SSO), giving Summit stronger
                    central control over how team members authenticate. Enterprise also supports stronger
                    governance and audit capabilities, but it does not create native row-level permission
                    enforcement. Enterprise licensing and any SSO implementation are separate decisions and
                    are not included in Thread &amp; Stack's project fee.
                  </p>
                </div>
              </motion.div>
            </section>

            <Rule />

            {/* 05 — Timeline */}
            <section>
              <SectionHead
                num="05"
                eyebrow="Timeline"
                rotate={0.4}
                title={<>From today to <Hl shift={-1}>go-live.</Hl></>}
              />

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
            </section>

            <Rule />

            {/* 06 — Investment */}
            <section>
              <SectionHead
                num="06"
                eyebrow="Investment"
                rotate={-0.3}
                title={<>The <Hl>numbers.</Hl></>}
              />

              <EditorialTable
                head={["Item", "Amount"]}
                rows={[
                  ["Notion operations build (2-month build + 3-month launch support)", "£12,500"],
                  ["Diagnostic fee, already paid", <span className="text-gradient-warm font-semibold">–£395 (credited)</span>],
                  [<strong>Net investment</strong>, <strong>£12,105</strong>],
                  ["Ongoing support after launch", "£1,000/month, rolling, no fixed term"],
                ]}
              />

              <H3>Not included</H3>
              <P>
                Individual Notion member logins for the team, roughly <strong>$1,500/year</strong>, billed
                directly by Notion rather than by Thread &amp; Stack. Worth doing immediately regardless of
                build timing, since it resolves the shared-login notification problem on its own.
              </P>

              <H3>Terms &amp; outstanding items</H3>
              <BulletList
                items={[
                  <>Brendan Rodgers / Thread &amp; Stack is not currently VAT registered. No VAT is applicable.</>,
                  <>Payment is by deposit on signature, then instalments spread across the four-to-five month engagement, so cost tracks alongside delivery rather than landing as one upfront sum. <strong>15% late charge applies after 30 days.</strong></>,
                  <><strong>Outstanding before build starts:</strong> NDA finalised, Dallin's written technical questions on Notion security answered, confirmation of Dallin's role, consultant access to the existing workspace, and confirmation of the website platform behind summitnetwork.net.</>,
                ]}
              />
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
                  Happy to walk through any part of this on a call, Andrew and Cali.
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
              <div className="mt-1 text-[11px] text-muted-foreground/60">
                Prepared for Summit Network · Ref: SN1 · 16 July 2026
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
