import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  X,
  Send,
  Check,
  Linkedin,
  Rocket,
  ChevronDown,
} from "lucide-react";
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
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import PoindexterBlack from "@/assets/proposal/poindexter-black.png.asset.json";
import PoindexterWhite from "@/assets/proposal/poindexter-white.png.asset.json";
import BrendanAvatar from "@/assets/brendan-avatar.webp";
import { Tilt3D } from "@/components/Tilt3D";
import {
  journeySteps,
  timeline,
  stack,
  connectedSources,
  scopeGroups,
  exclusionsList,
  exclusionsFootnote,
  beforeWeStartList,
  investmentRows,
  paymentScheduleRows,
  paymentScheduleNote,
  subscriptionsIntro,
  subscriptionsList,
  termsMain,
  termsExpandable,
  whatsappCards,
  whatsappReasons,
  whatsappClosing,
  complianceParagraphs,
  successMeasuresIntro,
  successMeasures,
  successMeasuresClosing,
  section09Paragraphs,
  runningAgentsNote,
  lumaNote,
  briefCards,
  atAGlanceRows,
} from "@/content/poindexterProposal";

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
    const source = "poindexter-labs-proposal";

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
      console.error("Poindexter Labs proposal reply error:", err);
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
            <Label htmlFor="pd-name" className="text-sm text-muted-foreground">Name</Label>
            <Input
              id="pd-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background rounded-lg mt-1"
              placeholder="Jocelyn"
              required
            />
          </div>

          <div>
            <Label htmlFor="pd-email" className="text-sm text-muted-foreground">Email *</Label>
            <Input
              id="pd-email"
              type="email"
              placeholder="you@poindexterlabs.com"
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
            <Label htmlFor="pd-message" className="text-sm text-muted-foreground">
              Anything to add <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Textarea
              id="pd-message"
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

/* ---------------------------- Print styles + Accordion ---------------------------- */

const PrintStyles = () => (
  <style>{`
    @media print {
      [data-accordion-panel] { grid-template-rows: 1fr !important; opacity: 1 !important; }
      [data-accordion-panel] > div { overflow: visible !important; }
      [data-accordion-chevron], [data-expand-all], [data-jump-nav], [data-print-hide] { display: none !important; }
    }
  `}</style>
);

/** Simple collapsible section for inline lists. Controlled or uncontrolled. */
const Toggle = ({
  label,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) => {
  const [internal, setInternal] = useState(defaultOpen);
  const open = controlledOpen ?? internal;
  const handle = onToggle ?? (() => setInternal((o) => !o));
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 py-2.5 text-left group"
      >
        <span className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
        <ChevronDown
          data-accordion-chevron
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        data-accordion-panel
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
};



const WelcomeScreen = ({ onOpen }: { onOpen: () => void }) => {
  useEffect(() => {
    const el = document.getElementById("pd-welcome-scroll");
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
        id="pd-welcome-scroll"
        className="flex-1 overflow-y-auto flex flex-col items-center justify-start md:justify-center px-6 sm:px-10 md:px-16 pt-12 sm:pt-16 md:pt-6 pb-6"
      >
        <div className="w-full max-w-2xl flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-14 mb-10"
          >
            <img src={WhiteStacked} alt="Thread & Stack" className="h-16 sm:h-18 md:h-20 w-auto" />
            <X aria-hidden="true" className="w-5 h-5 text-primary-foreground/30" strokeWidth={1} />
            <img
              src={PoindexterWhite.url}
              alt="Poindexter Labs"
              className="h-24 sm:h-28 md:h-32 w-auto object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-sans text-[10.5px] sm:text-[12px] tracking-[0.28em] uppercase text-primary-foreground/55 mb-5"
          >
            Blueprint
            <span className="text-primary-foreground/25 mx-2">·</span>
            Ref: PDL1
            <span className="text-primary-foreground/25 mx-2">·</span>
            23 July 2026
          </motion.div>


          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="font-serif-pro text-3xl sm:text-5xl md:text-6xl italic font-medium leading-[1.05] tracking-tight mb-5 text-balance"
          >
            Delegation you can{" "}
            <span className="inline-block text-gradient-warm" style={{ transform: "translateY(1px)" }}>
              verify.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="font-sans text-[15px] sm:text-[17px] leading-[1.75] text-primary-foreground/80 max-w-xl mb-5"
          >
            An interaction layer that holds your relationship history, answers you in plain English,
            and prompts you when it's missing something. All reachable from Notion on your phone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="font-sans text-[13px] text-primary-foreground/60 mb-6"
          >
            Prepared for Jocelyn D'Arcy, Poindexter Labs
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.15 }}
            className="w-full text-left rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] backdrop-blur-sm p-6 sm:p-8 font-sans text-[15px] sm:text-[16px] leading-[1.8] text-primary-foreground/85 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)] mb-8"
          >
            <p>Dear Jocelyn,</p>
            <p>
              You are carrying somewhere between two and three hundred relationships in working
              memory, and the cost of that isn't only the ones you forget. It's that every new
              introduction arrives with a condition attached: engage now, properly, or lose the
              context permanently. That's a tax on every good thing that happens to you, and it gets
              heavier as Poindexter grows.
            </p>
            <p>
              This blueprint sets out a system built to take that weight off you. Not a database you
              have to remember to visit, because you told me plainly you won't, and you'd be right
              not to. What we're building is an interaction layer: a set of small agents that hold
              your relationship history, answer you in plain English, and prompt you when they're
              missing something, all reachable from the Notion app on your phone. Notion is the
              substrate underneath. What you actually get is delegation you can verify, which is the
              thing that's been missing since Emily.
            </p>
            <p>
              One honest word on WhatsApp, because it mattered to you and it shapes this document.
              I've researched it properly since we spoke, and there is now a supported route. I've
              set out what it would give you and what it would cost further down, and my
              recommendation is that we don't build it in this phase. You're moving the company to
              Slack for ISO reasons anyway, Slack connects to Notion natively, and I'd rather spend
              your budget on the system you'll keep than on a bridge to a channel you're leaving.
              Where the agent can't see, it will ask you, which is the behaviour you described
              wanting in the first place.
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
              Open the blueprint
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

const PoindexterLabsProposalPage = () => {
  const [opened, setOpened] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const socialTitle = "Thread & Stack × Poindexter Labs · Blueprint (PDL1)";
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

  const handleDownload = () =>
    window.open("/proposal/poindexter-labs/print", "_blank", "noopener,noreferrer");

  // Scope accordion state: A open by default; hover expands others (fine pointers only); click pins/unpins
  const [scopePinned, setScopePinned] = useState<boolean[]>(() =>
    scopeGroups.map((_, i) => i === 0)
  );
  const [scopeHover, setScopeHover] = useState<number | null>(null);
  const hoverCloseTimer = useRef<number | null>(null);
  const [finePointer, setFinePointer] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);
  const onScopeEnter = (i: number) => {
    if (!finePointer) return;
    if (hoverCloseTimer.current) {
      window.clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    setScopeHover(i);
  };
  const onScopeLeave = () => {
    if (!finePointer) return;
    if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = window.setTimeout(() => setScopeHover(null), 200);
  };
  const isScopeOpen = (i: number) => scopePinned[i] || scopeHover === i;
  const allScopeOpen = scopePinned.every(Boolean);
  const toggleScope = (i: number) =>
    setScopePinned((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  const setAllScope = (v: boolean) => setScopePinned(scopeGroups.map(() => v));




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
              Blueprint <span className="text-muted-foreground/40 mx-2">·</span> Ref: PDL1{" "}
              <span className="text-muted-foreground/40 mx-2">·</span> 23 July 2026
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-14 mb-12 sm:mb-14 order-2 sm:order-1"
            >
              <img src={BlackStacked} alt="Thread & Stack" className="h-20 sm:h-20 md:h-24 w-auto" />
              <X aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/25" strokeWidth={1} />
              <img
                src={PoindexterBlack.url}
                alt="Poindexter Labs"
                className="h-32 sm:h-36 md:h-40 w-auto object-contain"
              />

            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="font-serif-pro text-[36px] sm:text-5xl md:text-6xl italic font-medium leading-[1.05] tracking-tight text-foreground text-balance mb-8 order-3"
            >
              Delegation you can{" "}
              <span className="inline-block text-gradient-warm" style={{ transform: "translateY(1px)" }}>
                verify.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-sans text-[16px] sm:text-[17px] text-foreground/75 leading-[1.7] max-w-xl mx-auto text-balance mb-6 order-4"
            >
              One relationship system, held in Notion, that consolidates LinkedIn, email, events and
              meeting history into searchable contact records. You reach it by asking, not by browsing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col items-center gap-3 order-5"
            >
              <p className="font-sans text-[13px] sm:text-[14px] text-muted-foreground tracking-wide leading-relaxed">
                Prepared for: Jocelyn D'Arcy
                <span className="hidden sm:inline"> · </span>
                <span className="block sm:inline">23 July 2026 · Ref: PDL1</span>
              </p>
            </motion.div>
          </div>
        </header>

        <PrintStyles />

        {/* ============== AT A GLANCE ============== */}
        <section className="px-5 sm:px-8 pb-6">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-foreground/15 bg-card/60 backdrop-blur p-6 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-5">
                At a glance
              </div>
              <dl className="grid sm:grid-cols-[max-content_1fr] gap-x-8 gap-y-4">
                {[
                  ["What", "A Notion relationship system with agents you reach from your phone. Contacts, activity history, pipelines, and three custom agents."],
                  ["Timeline", "Six to eight weeks to build, then two months of supported adoption included."],
                  ["Investment", "£11,605 net of your diagnostic credit. 40% on signature, then three monthly instalments."],
                  ["From you", "Decisions on tagging and field mapping, access to Attio, LinkedIn, Gmail and Luma, and a signed NDA before anything starts."],
                  ["Not in this phase", "WhatsApp capture, team rollout, the Google Drive restructure, and Attio records older than January 2026."],
                ].map(([k, v]) => (
                  <div key={k as string} className="contents">
                    <dt className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground pt-1 sm:whitespace-nowrap">
                      {k}
                    </dt>
                    <dd className="font-sans text-[15px] leading-[1.65] text-foreground/80 mb-3 sm:mb-0">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 pt-5 border-t border-foreground/10 font-sans text-[13px] text-muted-foreground italic">
                Full read, about twelve minutes. Everything below expands if you want the detail.
              </div>
            </div>

            {/* Jump navigation */}
            <nav data-jump-nav className="mt-6 print:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0 -mx-1 px-1">
                {[
                  ["sec-01", "01 Capability"],
                  ["sec-02", "02 The stack"],
                  ["sec-03", "03 The plan"],
                  ["sec-04", "04 Scope"],
                  ["sec-05", "05 Numbers"],
                  ["sec-06", "06 WhatsApp"],
                  ["sec-07", "07 Compliance"],
                  ["sec-08", "08 Success measures"],
                  ["sec-09", "09 Looking ahead"],
                ].map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="flex-shrink-0 inline-flex items-center rounded-full border border-foreground/15 bg-background/40 px-3 py-1.5 font-sans text-[11.5px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors whitespace-nowrap"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </section>

        {/* ============== BODY ============== */}
        <article className="px-5 sm:px-8 pb-24">
          <div className="max-w-2xl mx-auto">


            {/* 01 — Where things stand */}
            <section id="sec-01">
              <SectionHead
                num="01"
                eyebrow="Where things stand"
                rotate={-0.4}
                title={<>Capability, <Hl>not crisis.</Hl></>}
              />

              <P>
                There is no system to replace. Urgent work lives in your head with full context
                attached, everything else lives in Apple Notes, and relationship intelligence lives
                nowhere at all except memory. Attio has collected 175 meeting transcripts and you
                have never opened the People tab, which is a reasonable response to a CRM whose
                connection strength told you Tim was a weak contact while you messaged him daily.
                You used the part that worked and ignored the part that was misleading you.
              </P>
              <P>
                The failures are specific and you named them: an Octopus Ventures introduction
                sitting unactioned in LinkedIn DMs, a Jack meeting at DeepMind where you couldn't
                recall whether the introduction came from Yvonne or Tilly, an RL post-training
                researcher who registered for the Seoul event and may or may not have attended, so
                you can't follow up without risking looking foolish. Every one of them is the
                predictable result of five channels with no shared spine.
              </P>
              <P>
                This is capability, not crisis. You said it yourself: most things are "now" and this
                one isn't. That's exactly why it's worth building properly.
              </P>

              <motion.div {...fadeUp} className="mt-8">
                <h3 className="font-serif-pro text-[22px] md:text-[26px] italic font-medium text-foreground mb-5 leading-snug">
                  <Hl shift={-1}>The brief.</Hl>
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { word: "One spine", body: "LinkedIn, email, events and meeting history consolidated into searchable contact records tagged by opportunity type and skill." },
                    { word: "Reached by asking", body: "When someone approaches you, you get a summary. When you're about to ask a favour, you get the full log." },
                    { word: "Forget safely", body: "You can forget people safely, then find and reactivate them on purpose. That's the outcome." },
                  ].map((item, i) => (
                    <div key={i} className="rounded-2xl bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                      <div className="font-serif-pro italic text-xl font-medium text-gradient-warm mb-2">{item.word}</div>
                      <p className="font-sans text-[14.5px] leading-[1.7] text-foreground/80">{item.body}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <H3>How this gets used.</H3>
              <P>
                The design principle running through this build: <strong>the system waits to be
                asked.</strong> You were clear on our first call that you don't want alerting or task
                prompts, just accurate records and context when you need them. So the agents are
                invoked rather than ambient. You open Notion on your phone and ask who you know
                working on RL post-training, or what the state of play is with a given investor, and
                you get an answer grounded in your own records.
              </P>
              <P>
                There is one deliberate exception, and it's the one you asked for: when a meeting
                appears in your calendar, the agent speaks first. It gives you the brief, the history
                and the referral source, and where it has no record of the person it asks you how you
                know them. A calendar event is a moment you're already braced for, so a prompt there
                is welcome rather than noise.
              </P>

              <motion.div {...fadeUp} className="mt-6">
                <div className="rounded-2xl border border-dashed border-accent/40 bg-background/40 p-5 sm:p-6">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-2">
                    A note on running agents
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Agents consume credits on your Notion plan, and consumption scales with how much
                    they watch rather than how much they help. Agents that continuously monitor
                    channels are expensive and can slow noticeably at busy periods. Agents that wake
                    on request are cheap and fast. We can agree an appetite for your monthly credit
                    spend and optimise to sit below that. Keep in mind credits can spike; to prevent
                    that, we can take advantage of Notion's built-in agent caps.
                  </p>
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
            <section id="sec-02">
              <SectionHead
                num="02"
                eyebrow="The stack"
                rotate={0.3}
                title={<>Notion does the <Hl>work.</Hl></>}
              />

              <P>
                Everything else has to earn its place, because each external connection is a
                subscription, a dependency and a thing that can break without warning.
              </P>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {stack.map((layer, i) => {
                  const Lucide = layer.lucide;
                  return (
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
                            {Lucide ? (
                              <Lucide className="w-6 h-6 text-foreground/75" />
                            ) : (
                              <img src={layer.icon} alt="" className="w-8 h-8 object-contain" />
                            )}
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
                  );
                })}
              </div>

              <H3>Connected sources.</H3>
              <div className="grid sm:grid-cols-2 gap-3">
                {connectedSources.map((src, i) => {
                  const Lucide = src.lucide;
                  return (
                    <div
                      key={i}
                      className="flex gap-3 items-start rounded-xl border border-foreground/10 bg-foreground/[0.015] p-4"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-background/60 flex items-center justify-center border border-foreground/5">
                        {Lucide ? (
                          <Lucide className="w-4.5 h-4.5 text-muted-foreground" />
                        ) : (
                          <img src={src.icon} alt="" className="w-5 h-5 object-contain" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-sans text-[13.5px] font-semibold text-foreground mb-0.5">
                          {src.title}
                        </div>
                        <p className="font-sans text-[13.5px] leading-[1.55] text-foreground/65">
                          {src.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <motion.div {...fadeUp} className="mt-4">
                <div className="rounded-2xl border border-dashed border-accent/40 bg-background/40 p-5 sm:p-6">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-2">
                    A note on Luma
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Luma's API gives clean programmatic access to registrations and check-ins, and it
                    would keep event data flowing without you thinking about it. It also requires a
                    Luma Plus subscription on the calendar, currently $59 per month billed annually.
                    Given how often you run events, that is likely poor value. Luma's free tier
                    exports a complete guest CSV per event, which imports into Notion in minutes and
                    preserves the registered-versus-attended distinction you actually need, which was
                    the whole point of the Seoul example. My recommendation is CSV per event to begin
                    with, and we revisit the API if your event cadence grows enough to justify the
                    cost. If you already hold Luma Plus for other reasons, we use the API from day
                    one and this decision disappears.
                  </p>
                </div>
              </motion.div>
            </section>

            <Rule />

            {/* 03 — Timeline */}
            <section id="sec-03">
              <SectionHead
                num="03"
                eyebrow="What the next six months look like"
                rotate={0.4}
                title={<>A plan you can <Hl>work to.</Hl></>}
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

            {/* 04 — Scope */}
            <section id="sec-04">
              <SectionHead
                num="04"
                eyebrow="What's in scope"
                rotate={-0.3}
                title={<>Phase 1: <Hl>the build.</Hl></>}
              />

              <P>Everything below is included in the project fee.</P>

              <div data-expand-all className="mt-4 flex justify-end print:hidden">
                <button
                  type="button"
                  onClick={() => setAllScope(!allScopeOpen)}
                  className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {allScopeOpen ? "Collapse all" : "Expand all"}
                </button>
              </div>

              {scopeGroups.map((group, gi) => {
                const [letter, ...rest] = group.label.split(". ");
                const title = rest.join(". ");
                const isOpen = isScopeOpen(gi);
                return (
                  <motion.div
                    key={gi}
                    {...fadeUp}
                    className="mt-6 first:mt-6"
                    onMouseEnter={() => setScopeHover(gi)}
                    onMouseLeave={() => setScopeHover(null)}
                  >
                    <Tilt3D maxX={4} maxY={3}>
                      <div className="relative rounded-3xl bg-card p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-foreground/5 overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-gradient-warm opacity-[0.07] blur-2xl pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => toggleScope(gi)}
                          aria-expanded={isOpen}
                          className="w-full text-left group"
                        >
                          <div className="flex items-start gap-5 sm:gap-7">
                            <div className="shrink-0 font-serif italic text-transparent bg-clip-text bg-gradient-warm text-[52px] sm:text-[72px] leading-[1.1] font-medium tracking-tight pr-2 pb-1">
                              {letter}
                            </div>
                            <div className="flex-1 pt-1 sm:pt-2 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                                  Scope group
                                </div>
                                <ChevronDown
                                  data-accordion-chevron
                                  className={`w-4 h-4 mt-1 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                                />
                              </div>
                              <h3 className="font-serif text-[22px] sm:text-[28px] lg:text-[32px] leading-[1.15] font-medium text-foreground">
                                {title}
                              </h3>
                              <p className="mt-2 font-sans text-[14.5px] leading-[1.6] text-foreground/65">
                                {group.summary}
                              </p>
                            </div>
                          </div>
                        </button>
                        <div
                          data-accordion-panel
                          className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
                            isOpen ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            {group.intro && (
                              <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80 mb-5">
                                {group.intro}
                              </p>
                            )}
                            <BulletList items={group.items} />
                          </div>
                        </div>
                      </div>
                    </Tilt3D>
                  </motion.div>
                );
              })}


              {/* What's not included, and why */}
              <motion.div {...fadeUp} className="mt-14 rounded-2xl border border-clay/30 bg-clay/5 p-5 sm:p-6">
                <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-4">
                  What's not included
                </div>
                <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80 mb-4">
                  Everything below sits outside this phase. Some of it is sequencing. Some of it is a
                  different project wearing a similar coat.
                </p>
                <Toggle label="See the full list">
                  <ul className="space-y-3 list-none pl-0">
                    {[
                      <><strong>Attio contact and company records created before 1 January 2026.</strong> The meeting transcripts come across in full. Older account records are a larger migration and are scoped separately once we've both seen what the export actually contains.</>,
                      <><strong>WhatsApp capture</strong>, for the reasons set out below.</>,
                      <><strong>The Google Drive restructure.</strong> Moving from personal Drive folders to Shared Drives, with 300 people's access to untangle, carries its own risks and deserves its own attention. I'll look at the structure so file links point correctly, and I would recommend doing the restructure, but not inside this build.</>,
                      <><strong>Team rollout.</strong> Shared task management, team meeting notes and multi-person workflows wait until roles settle, as you asked.</>,
                      <><strong>Slack capture</strong>, which becomes worth scoping once your migration completes.</>,
                      <><strong>Automated job-change tracking beyond what enrichment provides.</strong> LinkedIn's own signals are unreliable, and I'd rather not promise accuracy I can't hold.</>,
                      <><strong>Poindexter contractor management.</strong> The 250 Poindexters stay on your platform for now, though the opportunity for integrating the systems is strong.</>,
                    ].map((it, i) => (
                      <li key={i} className="relative pl-6 text-[15.5px] leading-[1.75] text-foreground/80">
                        <span className="absolute left-0 top-[0.7em] w-[7px] h-[7px] rounded-full border-[1.5px] border-clay" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </Toggle>
                <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80 mt-5">
                  Two dependencies worth naming, because they affect timing rather than scope. The
                  build needs <strong>decisions from you at a few specific points</strong>, principally
                  the tagging taxonomy and the field mapping, and you are the only person who can make
                  them. If those stall, the build stalls. And if scope changes materially once we are
                  underway, we'll agree the effect on time and cost in writing before anything moves.
                </p>
              </motion.div>

              {/* What I'll need from Poindexter */}
              <motion.div {...fadeUp} className="mt-8">
                <Tilt3D maxX={4} maxY={3}>
                  <div className="rounded-2xl bg-card p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-gradient-warm mb-3">
                      Before we start
                    </div>
                    <Toggle label="See the list">
                      <ul className="space-y-3 list-none pl-0">
                        {[
                          "The NDA signed on both sides, ahead of anything else.",
                          "Access to your Attio account, to assess the 175 transcripts and confirm export format.",
                          "Sample LinkedIn threads and Gmail correspondence, to confirm the sync scope and how far back to reach.",
                          "Luma export or API access.",
                          "Confirmation of your Notion plan and entitlement.",
                          "A view of your Google Drive structure, so we know whether file linking belongs in this phase or the next.",
                          "Your best current guess at the Slack migration timing, since it determines when channel capture becomes worth scoping.",
                        ].map((it, i) => (
                          <li key={i} className="relative pl-6 text-[15.5px] leading-[1.7] text-foreground/80">
                            <span className="absolute left-0 top-[0.7em] w-[7px] h-[7px] rounded-full border-[1.5px] border-accent" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </Toggle>
                  </div>
                </Tilt3D>
              </motion.div>
            </section>

            <Rule />

            {/* 05 — Investment */}
            <section id="sec-05">
              <SectionHead
                num="05"
                eyebrow="Investment"
                rotate={-0.3}
                title={<>The <Hl>numbers.</Hl></>}
              />

              <EditorialTable
                head={["Item", "Amount"]}
                rows={[
                  ["Relationship system build (6 to 8 week build + 2 month supported adoption)", "£12,000"],
                  [
                    "Diagnostic fee, already paid",
                    <span className="text-gradient-warm font-semibold">–£395 credited</span>,
                  ],
                  [<strong>Net investment</strong>, <strong>£11,605</strong>],
                ]}
              />

              <H3>Payment schedule</H3>
              <EditorialTable
                head={["When", "Amount"]}
                rows={[
                  ["On signature (40% deposit, diagnostic credit applied)", "£4,405"],
                  ["End of month one", "£2,400"],
                  ["End of month two", "£2,400"],
                  ["End of month three", "£2,400"],
                  [<strong>Total</strong>, <strong>£11,605</strong>],
                ]}
              />

              <motion.p {...fadeUp} className="font-sans text-[13.5px] leading-[1.7] text-muted-foreground mt-4">
                The deposit is 40% of the build fee (£4,800) with the £395 diagnostic credit applied.
                Payment completes during supported adoption, so cost tracks alongside delivery rather
                than landing as one sum.
              </motion.p>

              <H3>Subscriptions, billed to you directly</H3>
              <P>
                These are not part of the project fee and are paid to the providers rather than to
                Thread &amp; Stack. Figures are working estimates as of July 2026 and should be
                confirmed before commitment.
              </P>
              <BulletList
                items={[
                  <><strong>Notion.</strong> You mentioned a VC-backed startup entitlement, and I'll send the affiliate signup route as a backup. Plan choice affects which AI features are available, so worth settling early.</>,
                  <><strong>Notion AI and agent consumption.</strong> Charged against your Notion plan. Expect somewhere in the region of £20 to £30 per seat per month once the agents are running, with email volume the largest single driver, since every message an agent reads costs something. This is a figure we can optimise rather than fix. The invoked-not-ambient design keeps it low, targeted sweeps keep it lower, and I'll show you where the levers are during adoption. Worth watching across the first two months rather than treating month one as representative.</>,
                  <><strong>Kondo</strong>, for LinkedIn DM sync, roughly $50 per month.</>,
                  <><strong>Luma.</strong> No cost on the free tier using CSV export per event. The API route requires Luma Plus at $59 per month billed annually, which I would not recommend at your current event frequency.</>,
                  <><strong>Data enrichment</strong>, roughly £40 to £80 per month depending on provider. Cognism is the strongest UK option on compliance, London-based and independently certified, but is priced for enterprise teams and would be poor value for one user. Kaspr, its smaller sibling, is affordable and EU-compliant but weaker on North American data, which is where most of your network sits. Apollo covers your geography better and tracks job changes well, though API access sits on its higher tier. My recommendation is to trial two against a sample of your real contacts during the build and choose on match rate rather than on marketing.</>,
                ]}
              />

              <H3>Terms</H3>
              <BulletList
                items={[
                  <>Thread &amp; Stack Ltd is not currently VAT registered. No VAT is applicable.</>,
                  <>Payment is a 40% deposit on signature with the diagnostic credit applied, then three equal monthly instalments. <strong>15% late charge applies after 30 days.</strong></>,
                ]}
              />
              <Toggle label="Company details, insurance, confidentiality and liability">
                <BulletList
                  items={[
                    <><strong>Company details.</strong> Thread &amp; Stack Ltd, company number 17344201.</>,
                    <><strong>Insurance.</strong> Thread &amp; Stack Ltd carries professional indemnity to £2,000,000 per claim, public and products liability to £1,000,000, and cyber and data cover to £2,000,000. Certificates are available on request for your supplier records.</>,
                    <><strong>Confidentiality.</strong> Thread &amp; Stack can provide a standard mutual non-disclosure agreement at no charge, signed on request and covering both directions. Where Poindexter Labs prefers to use its own agreement, it will be reviewed in good faith. Where a client agreement requires external legal review, for instance where it carries liquidated damages, indemnities or similar provisions, the cost of that review is recharged and agreed in writing before it is incurred. Nothing arrives on an invoice without having been agreed first.</>,
                    <>Thread &amp; Stack Ltd is a <strong>Certified Notion Consulting Partner</strong>, but operates independently of Notion. Notion retains all rights to its own products, and responsibility for its service delivery, uptime, security and product changes sits with Notion. Thread &amp; Stack accepts no liability for the failure, outage or change of Notion's software, or of any other third-party software Poindexter Labs uses.</>,
                    <>Poindexter Labs' licensing, payment and data relationships with Notion and every other provider are held directly between Poindexter Labs and those providers. Thread &amp; Stack is not a party to those agreements.</>,
                  ]}
                />
              </Toggle>
            </section>


            <Rule />

            {/* 06 — WhatsApp research */}
            <section id="sec-06">
              <SectionHead
                num="06"
                eyebrow="The WhatsApp research"
                rotate={0.3}
                title={<>Why WhatsApp isn't <Hl>in this phase.</Hl></>}
              />

              <P>
                You were right that WhatsApp holds your strongest relationships, and right that it's
                the hardest to reach. Here is what I found.
              </P>

              <motion.div {...fadeUp} className="space-y-5">
                <div className="rounded-2xl bg-card p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                    Twilio is the wrong tool
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Twilio, which we discussed on the call, is built for businesses sending large
                    volumes of outbound messages, and registering your number there would require
                    deleting your WhatsApp account first.
                  </p>
                </div>

                <div className="rounded-2xl bg-card p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                    Meta's Coexistence feature does work
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    You would move your existing number from consumer WhatsApp to the free WhatsApp
                    Business app, keeping the number and restoring your history, then connect it to
                    the Cloud API through an approved provider. On connection, Meta delivers your
                    contact list and the previous 180 days of one to one messages, and mirrors every
                    message after that in both directions with no effort from you.{" "}
                    <a
                      href="https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Meta's documentation
                    </a>{" "}
                    covers the full flow.
                  </p>
                </div>

                <div className="rounded-2xl bg-card p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                  <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                    What it can't do
                  </div>
                  <p className="font-sans text-[15.5px] leading-[1.75] text-foreground/80">
                    Group chats never sync, so your contractor community stays invisible. History
                    stops at 180 days. Turning it on permanently disables disappearing messages,
                    view once and live location on your one to one chats. The history transfer is a
                    single attempt inside a 24 hour window.
                  </p>
                </div>
              </motion.div>

              <H3>Why not now, in four points.</H3>
              <BulletList
                items={[
                  <>Your company is moving to Slack, which connects to Notion natively and covers the same need without any of this.</>,
                  <>It requires a provider subscription and a Meta business relationship that neither of us controls.</>,
                  <>It would pull your entire personal life into a CRM pipeline alongside your professional contacts, which is an awkward thing to be doing while you're certifying to ISO 27001.</>,
                  <>It makes the most visible part of your build dependent on steps only you can complete.</>,
                ]}
              />

              <P>
                Where the system has no record, the agent asks you. You described this yourself on
                the call: the prompt appears, you paste or screenshot the context, and the record is
                complete. That takes seconds and it costs nothing.
              </P>
              <P>
                If you still want automated capture after the Slack migration settles, the path is
                documented above and we can scope it then, from a position of knowing what's
                actually left in WhatsApp.
              </P>
            </section>

            <Rule />

            {/* 07 — Data, privacy and compliance */}
            <section id="sec-07">
              <SectionHead
                num="07"
                eyebrow="ISO 27001"
                rotate={-0.3}
                title={<>Data, privacy and <Hl>compliance.</Hl></>}
              />

              <P>
                You are certifying to ISO 27001, so this belongs in the document rather than in a
                footnote.
              </P>
              <P>
                Building this system means processing personal data belonging to several hundred
                people who have not been asked. Under UK GDPR that makes Poindexter Labs the
                controller. The position is defensible and standard for relationship management,
                since these are people you have met, corresponded with or been introduced to, and
                the processing keeps existing records accurate rather than acquiring new contacts.
                It does need to be written down rather than assumed: a lawful basis under legitimate
                interests, a legitimate interests assessment, a retention position, and an entry in
                your record of processing activities. I'll provide a draft of the technical
                description for whoever handles your certification.
              </P>
              <P>
                Enrichment adds a second consideration, since the provider processes contact data on
                your behalf. Whoever we select needs a data processing agreement in place before we
                connect it. I'll confirm certifications as part of the recommendation.
              </P>
              <P>
                Notion's permission model works in your favour here. Access controls what each
                person sees, and Notion AI respects those boundaries, so when the team grows, junior
                members querying the workspace cannot surface what they cannot open.
              </P>
              <P>
                On the supplier side of your certification, Thread &amp; Stack Ltd carries cyber and
                data cover to £2,000,000 alongside professional indemnity, and holds a signed mutual
                NDA with you before any access is granted. Full details sit under Terms above, and
                certificates are available for your supplier file.
              </P>
            </section>

            <Rule />

            {/* 08 — How we'll know it worked */}
            <section id="sec-08">
              <SectionHead
                num="08"
                eyebrow="Success measures"
                rotate={0.3}
                title={<>How we'll know it <Hl>worked.</Hl></>}
              />

              <P>
                We didn't set success measures on the call and the goal, cognitive relief, resists
                measurement. Three checks I'd suggest, reviewed at the end of supported adoption.
              </P>
              <BulletList
                items={[
                  <>You can answer a "who do I know who…" question in under a minute, from your phone, with enough context to act on.</>,
                  <>No contact reaches a meeting without you knowing who introduced you.</>,
                  <>You have reactivated at least one dormant relationship deliberately, because the system surfaced it rather than because you happened to remember.</>,
                ]}
              />
              <P>If those three hold, the system is working. If they don't, we know precisely what to fix.</P>

            </section>

            <Rule />

            {/* 09 — Looking ahead */}
            <section id="sec-09">
              <SectionHead
                num="09"
                eyebrow="Looking ahead"
                rotate={-0.3}
                title={<>What this makes <Hl>possible later.</Hl></>}
              />
              <P>
                Notion's own positioning is <strong>"Where teams and agents build together"</strong>.
                By establishing Notion as the core system, agents as the working layer, and the Notion
                app as your interface, some things open up for when your team settles in: asking
                what's outstanding across the team and getting a straight answer, assigning something
                to Gab or Isaac from your phone and having it tracked without you holding it, team
                meeting notes accumulating into shared context rather than living in individual heads,
                and client and partner conversations captured from Slack into the right records once
                your migration completes.
              </P>
              <P>
                <strong>Importantly: your relationship intelligence can stay private throughout.</strong>{" "}
                The CRM sits in its own permissioned teamspace, and expanding the workspace around it
                doesn't expose it to anyone you don't want it to.
              </P>
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
                  Read this through, and tell me where it's{" "}
                  <span className="inline-block text-gradient-warm" style={{ transform: "translateY(1px)" }}>
                    wrong or thin.
                  </span>
                </h2>
                <p className="font-sans text-[16px] leading-[1.75] text-foreground/80 text-center mb-10 max-w-lg mx-auto">
                  Then a call to walk through the tagging taxonomy, which is the part most worth your
                  input before the build starts. Happy to talk through any part of this.
                </p>

                <div className="mb-8 flex justify-center">
                  <PillButton onClick={() => setReplyOpen(true)} icon={Send}>
                    Reply to this blueprint
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
                          href="mailto:br@brendanrodgers.uk?subject=Poindexter%20Labs%20Blueprint%20(PDL1)%20Reply&body=Hi%20Brendan%2C%0A%0A"
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
              <div className="mt-2 text-[11px] text-muted-foreground/60">
                Prepared for Poindexter Labs · Ref: PDL1 · 23 July 2026
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

export default PoindexterLabsProposalPage;
