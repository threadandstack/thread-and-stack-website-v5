import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, Anchor, X, Send, Check } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { trackContactFormSubmit } from "@/hooks/useAnalytics";
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import BlackStacked from "@/assets/logos/Black_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import LssLogoWhite from "@/assets/proposal/lss-logo-white.webp";
import LssLogoBlack from "@/assets/proposal/lss-logo-black.png";
import BrSignature from "@/assets/proposal/br-signature.png";
import BrendanAvatar from "@/assets/brendan-avatar.webp";
import IconClaude from "@/assets/proposal/icons/claude.png";
import IconNotion from "@/assets/proposal/icons/notion.png";
import IconNotionAI from "@/assets/proposal/icons/notion-ai.png";
import IconLassie from "@/assets/proposal/icons/lassie.png";
import IconZapier from "@/assets/proposal/icons/zapier.svg";

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
  const [name, setName] = useState("Ruaraidh");
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
    const source = "lss-proposal";

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
        description: "Thanks Ruaraidh — I'll be in touch shortly.",
      });
      setEmail("");
      setMessage("");
      setIntent("yes");
      onOpenChange(false);
    } catch (err: any) {
      console.error("LSS proposal reply error:", err);
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
          <SheetTitle className="font-serif-pro text-2xl italic font-semibold">Reply to begin</SheetTitle>
        </SheetHeader>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
          A short note straight to Brendan. Pick what fits — adjust anything you need to.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="lss-name" className="text-sm text-muted-foreground">Name</Label>
            <Input
              id="lss-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background rounded-lg mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="lss-email" className="text-sm text-muted-foreground">Email *</Label>
            <Input
              id="lss-email"
              type="email"
              placeholder="you@lss.co.uk"
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
            <Label htmlFor="lss-message" className="text-sm text-muted-foreground">
              Anything to add <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Textarea
              id="lss-message"
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

/** Inline accent word with subtle baseline-shift (brand-book treatment). */
const Hl = ({ children, shift = 1 }: { children: React.ReactNode; shift?: number }) => (
  <span className="inline-block text-accent" style={{ transform: `translateY(${shift}px)` }}>
    {children}
  </span>
);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

// Editorial section header — brand-book numbered style (big accent numeral + slight rotation)
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
        <span className="font-serif-pro text-3xl md:text-5xl font-light italic text-accent leading-none flex-shrink-0">
          {num}
        </span>
      )}
      <h2
        className="font-serif-pro text-[30px] sm:text-4xl md:text-[42px] italic font-bold leading-[1.1] tracking-tight text-foreground text-balance"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {title}
      </h2>
    </div>
  </motion.div>
);

// Prose paragraph
const P = ({ children }: { children: React.ReactNode }) => (
  <motion.p {...fadeUp} className="font-sans text-[16.5px] md:text-[17px] leading-[1.8] text-foreground/85 mb-6">
    {children}
  </motion.p>
);

// Subsection heading (h3) – smaller italic serif
const H3 = ({ children }: { children: React.ReactNode }) => (
  <motion.h3
    {...fadeUp}
    className="font-serif-pro text-[22px] md:text-[26px] italic font-semibold text-foreground mt-12 mb-5 leading-snug"
  >
    {children}
  </motion.h3>
);

// Bulleted list with indigo ring bullets (matches blog-content style)
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

// Quiet horizontal rule
const Rule = () => (
  <div className="my-20 md:my-28 flex justify-center">
    <span className="h-px w-16 bg-border" />
  </div>
);

// Editorial pull quote — rotated, brand-book style
const PullQuote = ({ children, rotate = 0.2 }: { children: React.ReactNode; rotate?: number }) => (
  <motion.blockquote
    {...fadeUp}
    className="my-12 md:my-16 font-serif-pro italic text-[24px] md:text-[32px] leading-[1.35] text-foreground text-balance"
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </motion.blockquote>
);

// Editorial table — soft card, brand-book treatment
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
    <table className="w-full font-sans text-[14.5px] md:text-[15px]">
      {head && (
        <thead>
          <tr className="bg-muted/40">
            {head.map((h, i) => (
              <th
                key={i}
                className="text-left px-4 md:px-5 py-3 font-semibold text-[11px] tracking-[0.18em] uppercase text-muted-foreground"
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
              <td key={c} className="px-4 md:px-5 py-3 align-top text-foreground/85 leading-[1.6]">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </motion.div>
);

// Price strike → new (brand-book pink/blue treatment, kept subtle)
const Price = ({ was, now }: { was: string; now: string }) => (
  <span className="whitespace-nowrap">
    <span className="line-through text-muted-foreground/60 mr-2">{was}</span>
    <span className="text-accent font-semibold">{now}</span>
  </span>
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
    <div className="flex-1 flex flex-col items-center justify-start px-6 sm:px-10 md:px-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col items-start text-left">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="self-center order-1 sm:order-2 font-sans text-[10.5px] sm:text-[12px] tracking-[0.28em] uppercase text-primary-foreground/55 mt-14 sm:mt-0 mb-8 sm:mb-12 text-center"
        >
          Confidential <span className="text-primary-foreground/25 mx-2">·</span> Proposal{" "}
          <span className="text-primary-foreground/25 mx-2">·</span> May 2026
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="self-center order-2 sm:order-1 flex flex-col sm:flex-row items-center gap-8 sm:gap-14 md:gap-20 sm:mt-20 md:mt-24 mb-12 sm:mb-16"
        >
          <img src={WhiteStacked} alt="Thread & Stack" className="h-24 sm:h-24 md:h-28 w-auto" />
          <X aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground/30" strokeWidth={1} />
          <img src={LssLogoWhite} alt="London School of Sailing" className="h-24 sm:h-24 md:h-28 w-auto" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="font-serif-pro text-3xl sm:text-4xl md:text-5xl italic font-semibold leading-[1.05] tracking-tight mb-8 sm:mb-10 max-w-3xl"
        >
          A Note from Brendan
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0 }}
          className="max-w-xl text-left mb-8 sm:mb-10"
        >
          <div className="font-sans text-sm sm:text-[15px] leading-[1.75] text-primary-foreground/80 space-y-4">

            <p className="text-primary-foreground/90 font-medium">Ruaraidh,</p>

            <p>
              This proposal is my way of showing you, clearly and honestly, what we can do together for LSS. It's not designed as a simple pitch, but as a tailored vision for you, and how we can work to build your ops to become truly supportive.
            </p>

            <p>
              There is a lot of love, hope, sweat and determination in The London School of Sailing. I was very touched by how our meeting in Peter's shed took place. It reminded me that you, and your new family are part of my own story.
            </p>

            <p>
              My intention is to help LSS reach a place of <strong>stable, systematised operational strength</strong>. This system will hold steady no matter how many new team members, new customers, or new friends arrive to join LSS's own voyage.
            </p>

            <p>
              Therefore, I'm taking a decision to reduce all my rates by <strong>20% for you specifically, permanently</strong>. I'm also going to propose a few options with a <strong>flexible payment framework</strong> within this doc. I've also built out clarity on how the change in tech stack can also drive savings.
            </p>

            <p>
              We can also keep talking it through if you'd like. After all, price would be a daft reason to find myself not supporting someone so close to the family. I'm a friend in your camp already, and I'd rather get you kitted out.
            </p>

            <p>
              The good news is that both Squarespace and FreeAgent have working APIs, which means we can work a lot of the optimisation you're after into the third phase of the engagement.
            </p>

            <p>So give this a read. It's probably best to grab a brew or a cup of coffee and a comfy seat.</p>

            <p>Let me know what you think.</p>

            <img
              src={BrSignature}
              alt="Brendan Rodgers signature"
              className="h-20 sm:h-24 w-auto -ml-2 mt-4 opacity-90"
            />
            <p className="text-primary-foreground/90 font-medium pt-1">Brendan</p>
          </div>
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

const LSSProposalPage = () => {
  const [opened, setOpened] = useState(false);
  

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Proposal — London School of Sailing · Thread & Stack";

    const metaRobots = document.createElement("meta");
    metaRobots.name = "robots";
    metaRobots.content = "noindex, nofollow";
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaRobots);
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
              Confidential <span className="text-muted-foreground/40 mx-2">·</span> Proposal{" "}
              <span className="text-muted-foreground/40 mx-2">·</span> May 2026
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 md:gap-20 mb-12 sm:mb-14 order-2 sm:order-1"
            >
              <img src={BlackStacked} alt="Thread & Stack" className="h-20 sm:h-20 md:h-24 w-auto" />
              <X aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/25" strokeWidth={1} />
              <img src={LssLogoBlack} alt="London School of Sailing" className="h-20 sm:h-20 md:h-24 w-auto" />
            </motion.div>


            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="font-serif-pro text-[36px] sm:text-5xl md:text-6xl italic font-semibold leading-[1.05] tracking-tight text-foreground text-balance mb-8 order-3"
            >
              A{" "}
              <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>
                vision
              </span>{" "}
              for the London School of Sailing.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="font-sans text-[14px] sm:text-[15px] text-muted-foreground tracking-wide leading-relaxed order-4"
            >
              <span className="block sm:inline">Prepared for Ruaraidh Plummer</span>
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline">By Brendan Rodgers,</span>
              <span className="block sm:inline sm:ml-1">Thread &amp; Stack</span>
            </motion.p>
          </div>
        </header>

        {/* ============== BODY ============== */}
        <article className="px-5 sm:px-8 pb-24">
          <div className="max-w-2xl mx-auto">
            {/* (legacy intro removed — replaced by new section 01 below) */}


            {/* 01 — The problem */}
            <section>
              <SectionHead
                num="01"
                eyebrow="The problem"
                rotate={-0.4}
                title={<>LSS has grown faster than its <Hl>systems.</Hl></>}
              />
              <P>
                Same client volume in two quarters as your entire first year. Three to four hundred WhatsApp
                notifications a day. Inbox Zero hit once in six months, at three hundred unread. Monday too slow
                to load. Customer data in Monday, comms in Gmail and WhatsApp, event details in Squarespace,
                accounts in FreeAgent — all of it separate, none of it talking, <em>all of it routing through you</em>.
              </P>
              <P>
                <strong>The tools that got you here are now costing you more than they're worth.</strong> Not just
                in money. In time, in cognitive load, in the mental overhead of holding it all together
                personally. The business is thriving. The infrastructure needs an update.
              </P>
            </section>

            <Rule />

            {/* 02 — Walls and dams to lakes and rivers */}
            <section>
              <SectionHead
                num="02"
                eyebrow="The philosophy"
                rotate={0.3}
                title={<>From walls and dams to <Hl shift={-1}>lakes and rivers.</Hl></>}
              />
              <P>
                Most software is designed to make leaving difficult. Over time, the tools you pay for become the
                walls around your business — not yours to move, not yours to connect, often training on your data
                in the process.
              </P>
              <P>
                The approach here is different. We build around a <strong>knowledge lake that LSS owns
                entirely</strong>, where every tool earns its place and none of them hold you hostage.
              </P>

              <motion.p {...fadeUp} className="font-sans text-sm mt-2 mb-6">
                <a
                  href="https://threadandstack.notion.site/The-Intentional-Tool-Stack-3678863b87d4815a8f72c285e27b320b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent hover:underline underline-offset-4"
                >
                  Read the full Intentional Tool Stack methodology
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </motion.p>

              <PullQuote rotate={-0.4}>
                Own the lake. Let the <Hl shift={-2}>rivers</Hl> come and go.
              </PullQuote>
            </section>

            <Rule />

            {/* 03 — The solve: LSS OS */}
            <section>
              <SectionHead
                num="03"
                eyebrow="The solve"
                rotate={-0.3}
                title={<><Hl>LSS OS</Hl> — a five-layer system.</>}
              />
              <P>
                One coherent operation, replacing the fragmentation. Each layer connects to the same knowledge
                base. Each one is replaceable if something better comes along.
              </P>
              <ul className="mt-8 space-y-5">
                {[
                  { icon: IconClaude, title: "Claude — your co-founder assistant.", body: "Connected to all Notion context. Reads and edits Notion directly. Knows LSS's history, priorities and how you think. Claude Pro includes Claude Code — the tool used to build and maintain the system. One subscription, two roles." },
                  { icon: IconNotion, title: "Notion Workspace — the single source of truth.", body: "Customer records, event history, procedures, team knowledge. Staff find answers without asking you. New people onboard from the system itself." },
                  { icon: IconLassie, title: "Notion AI — the knowledge layer.", body: "Anyone on the team asks a question in plain English and gets an answer from the workspace. Sharon, James, a new skipper, a future hire. No training required." },
                  { icon: IconNotionAI, title: "Custom agents — purpose-built AI tools.", body: "Lassie handles first-line enquiries. Booking intelligence surfaces patterns. They reason over context — not just follow rules." },
                  { icon: IconZapier, title: "Automations — the pipes.", body: "Booking confirmed, joining instructions sent. Payment due, reminder raised, FreeAgent invoice created. Event in Notion, product pushed to Squarespace. Dumb, reliable, running quietly in the background." },
                ].map((layer, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-5 items-start bg-card/60 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-background flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      <img src={layer.icon} alt="" className="w-9 h-9 object-contain" />
                    </div>
                    <div className="flex-1 pt-1">
                      <strong className="font-serif-pro italic text-lg text-primary block mb-1">{layer.title}</strong>
                      <span className="text-foreground/75 leading-relaxed">{layer.body}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </section>

            <Rule />

            {/* 04 — Four things that change */}
            <section>
              <SectionHead
                num="04"
                eyebrow="What changes"
                rotate={0.4}
                title={<>Four things that <Hl shift={-1}>change.</Hl></>}
              />

              <H3>1) Fewer interruptions</H3>
              <P>
                Three to four hundred WhatsApp notifications a day is a tax, not a strategy. The business needs
                an intentional front door.
              </P>
              <BulletList
                items={[
                  <>Lassie handles first-line enquiries — availability, pricing, how to book — in LSS's voice, from the knowledge base.</>,
                  <>Enquiries that need a human arrive with context already attached.</>,
                  <>Notion Mail triages Gmail — client comms surfaced, everything else filtered.</>,
                  <>The forwarding loop between you and Sharon breaks.</>,
                ]}
              />

              <H3>2) One place the business runs from</H3>
              <P>A CRM that replaces Monday and a daily view for every person on the team.</P>
              <BulletList
                items={[
                  <><strong>Contacts</strong>, bookings, enquiry pipeline, customer history — all in one place.</>,
                  <><strong>Your view:</strong> priorities, decisions, the week ahead, cash flow.</>,
                  <><strong>Sharon's view:</strong> active bookings, customers needing follow-up, this week's events.</>,
                  <><strong>James's view:</strong> event schedule, skipper assignments, logistics.</>,
                  <><strong>Joining instructions and skipper packs</strong> as guest pages — clean, no login required.</>,
                  <><strong>FreeAgent invoice</strong> raised automatically when a booking is confirmed.</>,
                  <><strong>Squarespace event integration</strong> — investigated in Phase 1, built where the API allows.</>,
                ]}
              />

              <H3>3) Voyages that run themselves</H3>
              <P>Every customer gets the same experience, every time, without anyone chasing.</P>
              <BulletList
                items={[
                  <><strong>Booking confirmed</strong> — right information sent automatically.</>,
                  <><strong>Payment reminder</strong> at the six- to eight-week mark.</>,
                  <><strong>Joining instructions</strong> two weeks before departure, no manual send.</>,
                  <><strong>Post-voyage message:</strong> thank you, review request, seed for the next trip.</>,
                  <><strong>Voyage Records:</strong> crew manifest, pre-sail checks, skipper sign-off, incident log — works offline, syncs when signal returns.</>,
                  <><strong>Legal protection built in</strong> — given the active solicitor claim, a documented paper trail is due diligence, not a nice-to-have.</>,
                ]}
              />

              <H3>4) A business that learns from itself</H3>
              <P>The CRM becomes a place you learn from, not just a place you log things.</P>
              <BulletList
                items={[
                  <>Which events are most profitable?</>,
                  <>Which customers return, and what brings them back?</>,
                  <>Which enquiry types convert and which don't?</>,
                  <><strong>Post-event upsell prompts</strong> triggered automatically.</>,
                  <><strong>Cross-reference knowledge</strong> for strategic evaluation.</>,
                  <><strong>Content pipeline:</strong> Ruaraidh's expertise turned into blog posts, newsletter, social — voice notes or bullet points in, publishable content out.</>,
                ]}
              />
              <PullQuote rotate={-0.4}>
                A tight ship, and the <Hl shift={-2}>system proves it.</Hl>
              </PullQuote>
            </section>

            <Rule />

            {/* 05 — Practical realities (new stack) */}
            <section>
              <SectionHead
                num="05"
                eyebrow="Practical realities"
                rotate={-0.3}
                title={<>The new stack: <Hl>~£82/month.</Hl></>}
              />
              <P>
                This is not a chatbot subscription. It is base infrastructure for a business that thinks, learns
                and runs — with a co-founder-level assistant that knows what you're building and helps you build
                it. Roughly what you currently spend on Monday alone.
              </P>
              <EditorialTable
                head={["Layer", "Tool", "Monthly"]}
                rows={[
                  ["Knowledge lake", "Notion Business — 3 users, AI included", "~£35"],
                  ["Notion AI", "Included in Business plan", "£0 extra"],
                  ["Co-founder assistant", "Claude Pro — Cowork, Projects, Claude Code", "~£16"],
                  ["Custom agents", "Notion AI agents — included", "£0 extra"],
                  ["Automations", "Make or Zapier starter", "~£18"],
                  [<strong>Base total</strong>, "", <strong>~£82/month</strong>],
                ]}
              />
              <P>
                Scaling is linear. Each additional team member: ~£12/month for Notion, ~£16/month for Claude if
                they want the full assistant layer. Everything else stays flat.
              </P>
              <p className="font-sans text-[13px] text-muted-foreground/70 mt-2">
                * All prices illustrative.
              </p>
            </section>

            <Rule />

            {/* 06 — What goes */}
            <section>
              <SectionHead
                num="06"
                eyebrow="And cutting"
                rotate={0.3}
                title={<>What <Hl shift={-1}>goes.</Hl> ~£79+/month back.</>}
              />
              <EditorialTable
                head={["What goes", "Why", "Monthly"]}
                rows={[
                  ["Monday.com", "Walled garden. Data locked in boards. £950/year for 20% utilisation. Slow, expensive, hard to leave.", "~£79"],
                  ["Squarespace transaction fees", "~£15 per £500 booking on top of Stripe's fee. Worth quantifying precisely in Phase 1.", "Variable"],
                ]}
              />
              <P>
                You're not adding cost. You're redirecting existing spend into infrastructure that's genuinely
                connected, and pragmatic, with far higher ROI.
              </P>
              <P>
                <strong>On Gemini.</strong> If it's bundled into your Google Workspace subscription it can't be
                removed and there's no saving. Claude sits alongside it at ~£16/month and does what Gemini
                cannot: maintains context across conversations, connects to the Notion knowledge lake, works
                within the system rather than separately from it.
              </P>
              <p className="font-sans text-[13px] text-muted-foreground/70 mt-2">
                * All prices illustrative.
              </p>
            </section>

            <Rule />

            {/* 07 — The journey */}
            <section>
              <SectionHead
                num="07"
                eyebrow="The journey"
                rotate={-0.4}
                title={<>Three phases, <Hl>shaped</Hl> around you.</>}
              />

              <div className="relative mt-8 pl-6 sm:pl-8">
                {/* Timeline rail — sits under the left edge of the pills */}
                <div
                  aria-hidden
                  className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-accent/40"
                />



                {/* Phase 1 */}
                <div className="relative pb-14">
                  <span className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-bold tracking-[0.18em] uppercase text-accent-foreground">
                    Phase 1 · Discovery
                  </span>
                  <h3 className="mt-4 font-serif text-2xl sm:text-3xl leading-tight">
                    In-person discovery session
                  </h3>
                  <P>
                    <strong>1 session · <Price was="£500" now="£400" /></strong>
                  </P>
                  <P>
                    We've already done some of the work during our session together on Wednesday, so I'm able to
                    reduce this phase from a full day to a single half day. As we sit down together and map out
                    current systems, confirm priorities, and map what the foundation build needs to contain.
                    You'll leave with a shared brief, agreed before anything gets built.
                  </P>
                  <P>
                    <strong>Before the session:</strong> access to Monday, and a short conversation with whoever
                    handles day-to-day admin alongside you.
                  </P>
                </div>

                {/* Phase 2 */}
                <div className="relative pb-14">
                  <span className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-bold tracking-[0.18em] uppercase text-accent-foreground">
                    Phase 2 · Build
                  </span>
                  <h3 className="mt-4 font-serif text-2xl sm:text-3xl leading-tight">
                    Foundation build
                  </h3>
                  <P>
                    <strong>10 sessions · <Price was="£5,000" now="£4,000" /> · split across two months (£2,000/mo)</strong>
                  </P>
                  <BulletList
                    items={[
                      <>CRM replacing Monday — contacts, bookings, enquiry pipeline, customer history.</>,
                      <>Customer journey automations — confirmation, payment reminders, joining instructions, post-voyage follow-up.</>,
                      <>Voyage Records — crew manifest, pre-sail checks, skipper sign-offs, incident log.</>,
                      <>Daily ops dashboard — your view, Sharon's view, James's event schedule.</>,
                      <>Notion Mail — Gmail triage from within the workspace.</>,
                      <>Guest pages — joining instructions and skipper packs, no login required.</>,
                      <>FreeAgent invoice automation — booking confirmed triggers invoice.</>,
                      <>Squarespace event integration — investigated in Phase 1, built where feasible.</>,
                      <>Two onboarding sessions — team working in the system comfortably before handover.</>,
                    ]}
                  />
                </div>

                {/* Phase 3 */}
                <div className="relative">
                  <span className="inline-flex items-center rounded-full bg-accent px-4 py-1 text-xs font-bold tracking-[0.18em] uppercase text-accent-foreground">
                    Phase 3 · Ongoing
                  </span>
                  <h3 className="mt-4 font-serif text-2xl sm:text-3xl leading-tight">
                    Monthly support
                  </h3>
                  <P>
                    <strong>1 half-day session · <Price was="£500" now="£400" /> (3 months minimum)</strong>
                  </P>
                  <P>
                    Retainer operates on a 3-month minimum commitment, but lets you flexibly scale up. Based on your
                    own technical ability, we could use these days as co-building sessions to super-charge value.
                  </P>
                  <BulletList
                    items={[
                      <><strong>Month 1</strong> → sort out any adoption issues.</>,
                      <><strong>Month 2</strong> → identify potential improvements, automations, workflows you'd like to see.</>,
                      <><strong>Month 3</strong> → new agents, refining workflows, ensuring success.</>,
                    ]}
                  />
                </div>
              </div>
            </section>

            <Rule />

            {/* 08 — Flexible payment options */}
            <section>
              <SectionHead
                num="08"
                eyebrow="Flexible payment"
                rotate={0.3}
                title={<>Three ways to <Hl shift={-1}>structure it.</Hl></>}
              />
              <P>
                Same scope, same rate, same outcome — choose what suits your cash flow.
              </P>

              <H3>Option 1 — Per deliverable</H3>
              <P>The most straightforward option. Each payment follows work delivered.</P>
              <EditorialTable
                head={["Milestone", "When", "Amount"]}
                rows={[
                  ["Phase 1 — discovery session", "On booking", "£400"],
                  ["Phase 2 — first half of build", "End of month one", "£2,000"],
                  ["Phase 2 — second half of build", "End of month two", "£2,000"],
                  ["Ongoing — month one", "End of month three", "£400"],
                  ["Ongoing — month two", "End of month four", "£400"],
                  ["Ongoing — month three", "End of month five", "£400"],
                  [<strong>Total</strong>, "", <strong>£5,600</strong>],
                ]}
              />

              <H3>Option 2 — Monthly programme</H3>
              <P>Five equal payments. Predictable, simple, no surprises.</P>
              <EditorialTable
                head={["Month", "Amount"]}
                rows={[
                  ["Month 1", "£1,120"],
                  ["Month 2", "£1,120"],
                  ["Month 3", "£1,120"],
                  ["Month 4", "£1,120"],
                  ["Month 5", "£1,120"],
                  [<strong>Total</strong>, <strong>£5,600</strong>],
                ]}
              />

              <H3>Option 3 — Paid in full</H3>
              <P>The cheapest route — an additional saving of £200 for paying in full, upfront.</P>
              <EditorialTable
                rows={[
                  ["Full engagement, paid upfront", <strong>£5,400</strong>],
                  ["Saving", <span className="text-accent font-semibold">£200</span>],
                ]}
              />

              <P>
                All options cover the same five-month engagement: Phase 1, the full foundation build, and three
                months of ongoing support. By the end, LSS is in a fundamentally different operational place.
              </P>
            </section>

            <Rule />

            {/* 09 — Engagement at a glance */}
            <section>
              <SectionHead
                num="09"
                eyebrow="At a glance"
                rotate={-0.3}
                title={<>The engagement, in <Hl>one view.</Hl></>}
              />
              <EditorialTable
                rows={[
                  [<strong>Client</strong>, "Ruaraidh Plummer, London School of Sailing"],
                  [<strong>Consultant</strong>, "Brendan Rodgers, Thread & Stack"],
                  [<strong>Standard rate</strong>, <span className="line-through text-muted-foreground/60">£500</span>],
                  [<strong>Defined rate</strong>, "£400 per half-day (relationship rate, permanently)"],
                  [<strong>Phase 1</strong>, "In-person discovery session — 1 block"],
                  [<strong>Phase 2</strong>, "Foundation build — ~10 blocks"],
                  [<strong>Ongoing</strong>, "Monthly support block — 1 block/month"],
                  [<strong>Phase 1 total</strong>, "£400"],
                  [<strong>Phase 2 total</strong>, "£4,000"],
                  [<strong>Ongoing</strong>, "£400/month × 3 months"],
                  [<strong>Total (Phase 1 + 2 + 3mo)</strong>, <strong>£5,600</strong>],
                  [<strong>Terms</strong>, "No VAT. No large upfront. Flexible payment schedules available."],
                ]}
              />

            </section>

            <Rule />

            {/* 10 — Business card */}
            <section>
              <motion.div {...fadeUp} className="mx-auto max-w-xl">
                <div className="mb-6 text-center font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-accent">
                  Next
                </div>
                <h2
                  className="font-serif-pro text-[28px] sm:text-[34px] md:text-[40px] italic font-bold leading-[1.1] tracking-tight text-foreground text-balance mb-10 text-center"
                  style={{ transform: "rotate(-0.3deg)" }}
                >
                  If this feels right, let's{" "}
                  <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>
                    begin
                  </span>
                  .
                </h2>

                <div className="rounded-2xl border border-border bg-card/40 shadow-[0_2px_24px_-12px_rgba(0,0,0,0.12)] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <img
                    src={BrendanAvatar}
                    alt="Brendan Rodgers"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="font-serif-pro italic text-2xl font-semibold text-foreground leading-tight">
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
                    <a
                      href="mailto:br@brendanrodgers.uk?subject=LSS%20Proposal%20%E2%80%94%20Reply&body=Hi%20Brendan%2C%0A%0A"
                      className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-sans text-sm hover:bg-accent/90 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Email Brendan
                    </a>
                  </div>
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
                Prepared for London School of Sailing · May 2026
              </div>
            </div>
            <img src={GreyStacked} alt="Thread & Stack" className="h-8 opacity-50 flex-shrink-0" />
          </div>
        </footer>
      </motion.main>
      
    </>
  );
};

export default LSSProposalPage;

