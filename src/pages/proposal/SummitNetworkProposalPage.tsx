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
      <div className="w-full max-w-2xl flex flex-col items-center text-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-sans text-[10.5px] sm:text-[12px] tracking-[0.28em] uppercase text-primary-foreground/55 mb-6 sm:mb-8"
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
          className="font-serif-pro text-3xl sm:text-5xl md:text-6xl italic font-medium leading-[1.05] tracking-tight mb-6 text-balance"
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
          className="font-sans text-[15px] sm:text-[17px] leading-[1.75] text-primary-foreground/80 max-w-xl mb-8"
        >
          A Notion operations build that gives every team member clarity, runs client onboarding without
          a single point of failure, and gives clients a real window into their own progress.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <span className="font-sans text-[13px] text-primary-foreground/60">
            Prepared for Cali Pilkington &amp; Andrew Gladstone
          </span>
          <img
            src={SummitLogo.url}
            alt="Summit Advisors Group LLC"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15 }}
          className="w-full text-left rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] backdrop-blur-sm p-6 sm:p-8 font-sans text-[15px] sm:text-[16px] leading-[1.8] text-primary-foreground/85 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
        >
          <p>Dear Andrew and Cali,</p>
          <p>
            Thank you for the collaboration so far. Between our first call, the diagnostic session with
            Cali and the build specification that followed it, I've had a clearer look inside Summit
            than most consultants get before a project starts, and it's given me a precise picture of
            how you work today. It's also made the central problem visible: the workspace that served
            a five-person team running on trust has become the thing holding growth back. That's no
            failure of the setup. Summit outgrew it, which is the better problem to have.
          </p>
          <p>
            Summit works with young creators who place a high value on strong relationships. They're
            both bold and vulnerable: high-profile people with large followings, trusting you with
            their financial lives and personal information. They want to feel known by the people
            looking after them, have an easy way to ask for help, and trust that their data is handled
            carefully at every layer of the system. The workspace behind the service has to strengthen
            those relationships, and protection has to be designed into its architecture rather than
            bolted on afterwards.
          </p>
          <p>
            Priority one is getting your Notion workspace working the way Summit works. Everyone
            knows what they're responsible for, client information lives where the whole team can
            find it in seconds, and Notion AI and AI Meeting Notes surface answers and call context
            from inside your own records. This is where my specialism sits: configuring Notion so the
            platform does the remembering, and your team does the relationships.
          </p>
          <p>
            The number one goal underneath all of this is simple: Summit operating confidently and
            smoothly, so the pause on new clients can end. You stopped taking people on because the
            backend couldn't carry more weight. This build is sequenced around reversing that, and
            nothing in it exists for its own sake. If a feature doesn't help your team run clearly or
            help a new client land safely, it waits for a later phase.
          </p>
          <p>
            Cali, your specification deserves a direct word: it's one of the most detailed briefs a
            client has ever handed me, and everything in it is achievable. The craft is in the
            sequencing. The strongest builds establish the collaboration and context layer first,
            then layer automation on top once the team has adopted it, which is the approach Notion
            itself recommends and the one I'd stake this project on. This proposal sets out that
            order: the foundation Summit runs on, then the automation that runs on the foundation.
          </p>
          <p className="font-serif-pro italic text-lg text-primary-foreground pt-1">Brendan</p>
        </motion.div>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.35 }}
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
      label: "Diagnostic. Complete.",
      when: "13 July 2026",
      owner: "Both",
      isLaunch: false,
      isComplete: true,
      note: "Confirmed the current setup, priorities, risks and recommended direction.",
    },
    {
      label: "Proposal signed and start date confirmed",
      when: "On sign-off",
      owner: "Both",
      isLaunch: false,
      isComplete: false,
      note: "We lock the start date and the Adoption Day target.",
    },
    {
      label: "Build in hidden teamspaces alongside your live workspace",
      when: "Roughly two months",
      owner: "Thread & Stack, with Summit input",
      isLaunch: false,
      isComplete: false,
      note: "Internal Workspace, Client Portal and Agency Portal built and reviewed together as they take shape. Nothing your team relies on changes under their feet during the build.",
    },
    {
      label: "Adoption Day",
      when: "End of build",
      owner: "Both",
      isLaunch: true,
      isComplete: false,
      note: "Team walkthrough, structured move into the new workspace, and the beginning of the supported adoption window. This is also the earliest sensible point to reopen client acquisition, because your first new clients come through the new onboarding while I'm still alongside you.",
    },
    {
      label: "Supported adoption",
      when: "Three months following Adoption Day",
      owner: "Thread & Stack and Summit",
      isLaunch: false,
      isComplete: false,
      note: "10 hours per month of hands-on support, refinement and adoption guidance while the system beds in and confidence in operating the new workspace builds.",
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
              <img
                src={SummitLogo.url}
                alt="Summit Advisors Group LLC"
                className="h-7 sm:h-9 w-auto object-contain"
              />
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
                title={<>Built around the way <Hl>Summit</Hl> works.</>}
              />

              {/* Three-layer maturity visual */}
              <div className="mt-12 space-y-4">
                {[
                  { n: "01", title: "Notion Workspace", body: "The context layer. Clients, agencies, tasks, meetings, agreements, SOPs and responsibilities organised in one permissioned operating environment." },
                  { n: "02", title: "Notion AI", body: "The native intelligence layer. The team can find information, understand context and act on the work held inside the workspace." },
                  { n: "03", title: "Automation and integration", body: "The applied layer. Custom agents, Notion Workers integrations, and connections to the systems where work begins outside Notion. Deliberately phased to follow adoption, so automation is built on a system the team already lives in." },
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

              {/* Change management callout */}
              <motion.div {...fadeUp} className="mt-8">
                <div className="rounded-2xl border border-dashed border-accent/40 bg-background/40 p-5 sm:p-6">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-2">
                    A note on change management
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Clients usually come to me for a Notion workspace. What they often underestimate
                    is that they're also on the receiving end of change management. A new system asks
                    your team to change how they work, and helping them make that change well is part
                    of the job, as much as the build itself. It's why supported adoption is written
                    into this project rather than sold as an extra, and why the phases in this
                    proposal walk before they run. A workspace nobody adopts is an expensive page. A
                    workspace the whole team lives in is an operating system.
                  </p>
                </div>
              </motion.div>

              {/* Your specification callout */}
              <motion.div {...fadeUp} className="mt-4">
                <div className="rounded-2xl border border-dashed border-accent/40 bg-background/40 p-5 sm:p-6">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-2">
                    Your specification
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Thank you for the CRM specification, Cali. It's one of the most detailed briefs a
                    client has ever handed me, and it has shaped this proposal directly: the
                    three-portal structure, the tier-based checklists, the Login Vault and the budget
                    flag are all built to your document. Where Notion's newest capabilities open up a
                    better route than the tools available when you wrote it, I'll bring the options
                    to you with a recommendation and the reasoning, and we'll decide together. The
                    goals stay yours. The job is making sure the build behind them is the strongest
                    version Notion can deliver.
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
                title={<>Diagnostic complete. <Hl shift={-1}>Here's the path.</Hl></>}
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

              {/* Completed NDA alignment card */}
              <motion.div {...fadeUp} className="mb-8">
                <Tilt3D maxX={5} maxY={4}>
                  <div className="flex gap-5 items-start rounded-2xl p-5 bg-tertiary/10 border border-tertiary/30 shadow-[0_8px_30px_rgba(0,0,0,0.05)] h-full">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-tertiary flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
                      <Check className="w-6 h-6 text-tertiary-foreground" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-tertiary mb-1">
                        Completed — Aligned on NDA
                      </div>
                      <p className="text-foreground/80 leading-relaxed">
                        We've collaborated in good faith to reach an NDA that supports both parties,
                        and enables this project. This proposal will act as Scope of Work supporting
                        that document.
                      </p>
                    </div>
                  </div>
                </Tilt3D>
              </motion.div>

              <ul className="mt-4 space-y-5">
                {[
                  { title: "This proposal", body: "You are here. Confirm the scope and investment, and we lock a start date and the adoption day target." },
                  { title: "I join your workspace", body: "Added as a consultant inside your existing Notion. Nothing your team relies on changes under their feet." },
                  { title: "Summit OS 2.0 is built alongside you", body: "The Client Portal, Internal Workspace and Agency Portal take shape in hidden teamspaces, reviewed with you as they develop. Your team keeps working exactly as they do today." },
                  { title: "Adoption day, then supported adoption", body: "The team walkthrough, the move into the new workspace, and three months of hands-on support at 10 hours per month while the system beds in. This is also the window where reopening client acquisition makes sense, because your first new clients come through the new onboarding while I'm still alongside you." },
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
                  { icon: IconLassie, title: "Notion AI. The native intelligence layer.", body: "The team can ask questions in plain English and receive answers grounded in the workspace. Configured as part of this build, and it gets sharper as the workspace fills. Availability depends on the Notion plan Summit purchases." },
                  { icon: IconNotionAI, title: "AI Meeting Notes. Calls captured where they belong.", body: "Call transcription and summaries linked to the relevant client records, with the visibility split from your specification: clients see the summary, their action items, the call date and who they spoke with, while transcripts and internal notes stay internal. Recording is started by the team member on the call from the Notion desktop app. No bot joins your meetings and no third-party transcription service sits between your client conversations and your workspace." },
                  { icon: IconNotion, title: "Notion Calendar. Time connected to context.", body: "Connect meetings to clients, work and follow-up. Introduce the team to a shared calendar workflow that supports scheduling, preparation and meeting capture. Calendar setup is subject to confirmation of Summit's calendar and email provider." },
                  { icon: IconNotion, title: "Native automations. The pipes that run onboarding.", body: "Typeform intake and website registrations create structured records. Tier assignment triggers the right checklist and starter to-do list. Signed DocuSign agreements trigger the agreed onboarding tasks and reminders. All built on Notion's native automation tools with no third-party connectors." },
                  { icon: IconNotionWorkers.url, title: "Custom agents and Notion Workers.", phase: "Phase 2", body: "Your specification asks for native Notion tools wherever possible, with Zapier or Make filling the gaps. Since that document was written, Notion has released Workers, its own developer platform for exactly this class of automation. As a Notion Certified Partner, Thread & Stack builds on it directly: no Zapier subscription, no Make scenarios to maintain, no third-party connector holding your client data in transit. Scoped separately once Summit OS 2.0 is live and adopted." },
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
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <strong className="font-serif-pro italic font-medium text-lg text-foreground">{layer.title}</strong>
                            {layer.phase && (
                              <span
                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.18em] uppercase text-white"
                                style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                              >
                                {layer.phase}
                              </span>
                            )}
                          </div>
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
                title={<>Phase 1: the full <Hl>scope of work.</Hl></>}
              />

              {([
                {
                  label: "A. Foundations and the Internal Workspace",
                  items: [
                    <>Individual member access for every team member, retiring the shared-login working model. Summit purchases the Notion licences directly, and this is the one change worth making immediately regardless of build timing, since it resolves the shared-login notification problem on its own.</>,
                    <>Workspace architecture built as focused teamspaces with role-based access: marketing and sales together, operations and finance together, client work separate.</>,
                    <>Personalised homepages: each team member logs in and sees their own tasks, meetings and week ahead, with no manual filtering.</>,
                    <>The master Team Task Database with the views from your specification: My Tasks, All Tasks, By Client, Overdue, and Account Manager tasks.</>,
                    <>A dedicated Account Manager section for the agency side of the business, with the outreach tracker and filtered task views.</>,
                    <>The SOP library, searchable and filterable by department, with version history noted on update.</>,
                    <>Signed team documents, the Company Ideas database, and Employee Responsibilities pages with one sub-page per role.</>,
                  ],
                },
                {
                  label: "B. The CRM",
                  items: [
                    <>The client database rebuilt from the current 40+ column Typeform export into structured client account pages, with the field set from your specification mapped together during the workspace walkthrough. Fields your current Typeform doesn't capture are configured for team entry.</>,
                    <>The tier system: Tier 1, 2 and 3 set per client, driving tier-based checklists that update automatically when a tier is assigned or changed.</>,
                    <>The client to-do list, editable by both team and client, with a tier-appropriate starter list generated automatically on account creation.</>,
                    <>The team task list per client, internal only, linked through to the master task database.</>,
                    <>Private internal notes with the budget flag: when Budget Review Needed is checked, the assigned Client Manager and Owner are notified automatically.</>,
                    <>The prospect pipeline (New Leads → Discovery → Decision → Proposal → Signed) and the client-delivery pipeline (Setup → Onboarding → Active → Maintenance), with clear ownership, progress indicators and reminders across signing and onboarding.</>,
                  ],
                },
                {
                  label: "C. The Client Portal",
                  items: [
                    <>A private portal for each client using guest access and intentional page sharing, which carries no additional Notion licence cost at current pricing. Each client sees only their own pages, tasks, documents, call summaries and checklist.</>,
                    <>The branded tile landing page, built from the logo and template materials Summit supplies, organised into your specified sections: Getting Started, Tax &amp; Accounting, Business Setup, Platform Guides, Tools &amp; Resources. Adding a tile is as simple as uploading an image and pasting a link. No developer needed after the build.</>,
                    <>The partner deals and discount codes section, team-managed and read-only for clients.</>,
                    <>Quick links to TaxDome, QuickBooks and Monarch, with light-touch how-to guidance rather than deep data integrations.</>,
                    <>A dedicated client request area, replacing scattered iMessage requests.</>,
                    <>The documents section per client, where the team uploads signed agreements, LLC formation documents and EIN confirmations for the client to view.</>,
                  ],
                },
                {
                  label: "D. The Agency Portal",
                  items: [
                    <>The Agency Accounts database from your specification: contacts, agreement status, agreed rates with the negotiated-rate approval flag, performance ratings and status.</>,
                    <>Agency Client Placements, linked to both the agency and the client's existing account so the team views everything in one place.</>,
                    <>Agency Applicants and Clients Seeking Placement, each fed by its own Typeform flow with Account Manager notification on submission.</>,
                    <>Payment tracking fields throughout (payment status, last payment date and amount, referral-owed formula) maintained by the team in this phase. Automated payment feeds from Infloww belong to Phase 2.</>,
                    <>A permissioned partner resource layer with access Summit can grant and revoke.</>,
                  ],
                },
                {
                  label: "E. Intelligence: Notion AI and AI Meeting Notes",
                  items: [
                    <>Notion AI enabled and configured as the native interface to Summit's workspace context, so the team can ask questions in plain English and receive answers grounded in Summit's own records. AI feature availability depends on the Notion plan Summit purchases.</>,
                    <>AI Meeting Notes and call transcription linked to the relevant client records with the visibility split from your specification: the client sees the summary, their action items, the call date and who they spoke with; transcripts, internal notes and team action items stay internal.</>,
                    <>Notion Calendar introduced as part of the meeting and follow-up workflow, subject to confirmation of Summit's calendar and email provider.</>,
                  ],
                },
                {
                  label: "F. Onboarding and native automation",
                  intro: "The automations in this phase are the ones the system needs to run itself, all built on Notion's native automation tools with no third-party connectors.",
                  items: [
                    <>Typeform client intake restructured to feed the new account model, creating a structured client record on submission.</>,
                    <>Tier assignment triggering the tier-appropriate checklist and generating the starter to-do list automatically.</>,
                    <>Tier-based DocuSign routing, including the agreed tax/no-tax variation on Tier 2.</>,
                    <>The task cascade on signature, with persistent reminders until onboarding is complete, and Tier 1 assignment notifying the CPA to begin the engagement process.</>,
                    <>Client task submissions notifying the Owner and VP of Operations; client task completion notifying the client.</>,
                    <>Website registration submissions connected to Notion so new sign-ups create structured records alongside the Typeform intake, subject to confirmation of the platform behind summitnetwork.net.</>,
                  ],
                },
                {
                  label: "G. Adoption and support",
                  items: [
                    <>A planned team adoption day and walkthrough at the end of the build.</>,
                    <>Three months of hands-on launch support at 10 hours per month. Hours are used within the month and don't roll over.</>,
                    <>Support delivered through weekly calls, co-working, or agreed async communication, whichever suits Summit.</>,
                    <>Optional rolling support after launch at £1,000/month (approximately $1,350/month), no fixed term, cancellable by either side with 30 days' notice.</>,
                  ],
                },
              ] as Array<{ label: string; intro?: string; items: React.ReactNode[] }>).map((group, gi) => {
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

              {/* What comes after */}
              <motion.div {...fadeUp} className="mt-14">
                <h3 className="font-serif-pro text-[22px] md:text-[26px] italic font-medium text-foreground mb-5 leading-snug">
                  What comes after.
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      label: "Phase 2: Automation and Intelligence",
                      body: "Scoped and quoted separately once Summit OS 2.0 is live and adopted. Candidates drawn directly from your specification: DocuSign auto-attach, so signed client and agency documents download and attach to the right Notion record automatically on envelope completion; a custom agent layer for repeatable workflows such as client request summarisation, escalation handling and onboarding progress monitoring; scheduled client communications, shaped by what drip campaigns mean in practice for Summit; Infloww-fed earnings monitoring and automated referral payment tracking in the Agency Portal; and deeper Typeform integration through Workers where the native connection reaches its limits.",
                    },
                    {
                      label: "Phase 3: The client app",
                      body: "The Lovable + Notion client-facing web application, with Summit OS 2.0 as its backend. A strong second project once the system is live and adopted, and a fraction of the $26,000/year you were previously quoted for a custom app.",
                    },
                  ].map((card, i) => (
                    <Tilt3D key={i} maxX={5} maxY={4}>
                      <div className="rounded-2xl bg-card p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                        <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-3">
                          {card.label}
                        </div>
                        <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                          {card.body}
                        </p>
                      </div>
                    </Tilt3D>
                  ))}
                </div>
              </motion.div>

              {/* Caveats */}
              <motion.div {...fadeUp} className="mt-10 rounded-2xl border border-clay/30 bg-clay/5 p-5 sm:p-6">
                <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-4">
                  Not included in this phase
                </div>
                <ul className="space-y-3 list-none pl-0">
                  {[
                    <>TaxDome remains fully separate, with no Notion integration, in line with the security constraint you and Dallin raised.</>,
                    <>No deep QuickBooks or Monarch data sync. Links and how-to guidance only.</>,
                    <>Infloww-fed payment automation and earnings monitoring: not included in this phase, scoped separately in Phase 2 once the Agency Portal is adopted.</>,
                    <>Drip campaigns and email delivery of any kind: not included in this phase, scoped in Phase 2 once Summit's email provider and the intended workflow are confirmed.</>,
                    <>Custom agents and Workers-built integrations: Phase 2, scoped separately.</>,
                    <>The Lovable + Notion client-facing web application: Phase 3, scoped separately.</>,
                    <>The affiliate resource hub is not included.</>,
                    <>Website registration integration is included in Phase 1, but the exact implementation depends on confirmation of the platform behind summitnetwork.net and access to its forms, API or webhooks. If the platform requires a paid third-party connector, that licence is not included unless agreed.</>,
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
                    Restricted credential storage
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    The Login Vault and the per-client platform credentials section are built using
                    intentional page sharing, teamspace permissions and filtered views, with
                    per-record visibility assigned to named team members and full visibility for the
                    Owner and VP of Operations. Your specification rightly notes that Notion doesn't
                    natively support row-level permissions within a database, so worth being upfront:
                    this is a practical access arrangement built to the strongest pattern Notion
                    supports, documented clearly and trained into the team, and it doesn't replace a
                    dedicated password manager or enterprise credential platform. Full SSNs, card
                    numbers and full bank account numbers are never stored in Notion, in line with
                    your specification. Last four digits only where identification is needed.
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
                eyebrow="The year ahead"
                rotate={0.4}
                title={<>What the next <Hl shift={-1}>twelve months</Hl> look like.</>}
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

              <motion.p {...fadeUp} className="mt-10 font-sans text-[16px] leading-[1.75] text-foreground/80">
                If sign-off lands this month, the shape of the year draws itself: build through
                August and September, adoption day in early October, supported adoption through to
                the end of the year, and Summit starts January on a system built for the size it's
                becoming, with the doors open again.
              </motion.p>
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
                head={["Item", "GBP", "USD equivalent"]}
                rows={[
                  ["Notion operations build (2-month build + 3-month launch support)", "£12,500", "≈ $16,880"],
                  [
                    "Diagnostic fee, already paid",
                    <span className="text-gradient-warm font-semibold">–£395 credited</span>,
                    <span className="text-gradient-warm font-semibold">≈ –$535 credited</span>,
                  ],
                  [<strong>Net investment</strong>, <strong>£12,105</strong>, <strong>≈ $16,345</strong>],
                  ["Ongoing support after launch", "£1,000/month", "≈ $1,350/month"],
                ]}
              />

              <motion.p {...fadeUp} className="font-sans text-[13.5px] leading-[1.7] text-muted-foreground mt-4">
                USD amounts are indicative equivalents based on an exchange rate of approximately
                £1 = $1.3504 on 16 July 2026. Thread &amp; Stack's fees are set in GBP; the final USD
                amount will reflect the applicable exchange rate when invoiced.
              </motion.p>

              <H3>Terms</H3>
              <BulletList
                items={[
                  <>Brendan Rodgers / Thread &amp; Stack is not currently VAT registered. No VAT is applicable.</>,
                  <>Payment is by deposit on signature, then instalments spread across the four-to-five month engagement, so cost tracks alongside delivery rather than landing as one upfront sum. <strong>15% late charge applies after 30 days.</strong></>,
                ]}
              />

              <H3>Not included in project fee</H3>
              <BulletList
                items={[
                  <>Individual Notion member licences for Summit's team, billed directly by Notion. Current working estimate: roughly <strong>$1,500/year</strong>, to be confirmed against plan and headcount.</>,
                  <>Notion Enterprise, Worker credits or other Notion plan add-ons.</>,
                  <>Paid third-party connectors or external software licences unless explicitly agreed.</>,
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
