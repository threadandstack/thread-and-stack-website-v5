import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, X, Send, Check, Linkedin } from "lucide-react";
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
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import BlackStacked from "@/assets/logos/Black_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import BrSignature from "@/assets/proposal/br-signature.png";
import BrendanAvatar from "@/assets/brendan-avatar.webp";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const testimonials = [
  { headline: "Genuinely transformative", quote: "This Notion Mentorship sprint has been genuinely transformative for me. In just a few weeks, I significantly upped my productivity and efficiency — not just in how much I get done, but in how clearly I can show the value of my work.", author: "Jasmine Stone", role: "Marketing Manager", color: "#1340E8" },
  { headline: "Hire Brendan, you won't regret it!", quote: "Brendan is like a Swiss army knife when it comes to marketing — strategic and hands-on. He helped me build a system that actually works for The IMMA Collective. I've now got real peace of mind, a clear vision for the business, and marketing that feels properly joined up.", author: "Lilli Graf", role: "Founder, The IMMA Collective", color: "#FF6200" },
  { headline: "Brendan does great work!", quote: "Brendan did a terrific and patient job of untangling my Notion ineptitude. I'm saving time already with the new cleaned up format.", author: "Lucian James", role: "Client", color: "#DC2626" },
  { headline: "More progress in months than a year", quote: "Brendan has been a dream. His support totally invigorated us. We've made more progress in the last couple of months than we had in the previous year.", author: "Alex Aggidis", role: "Head of Marketing, Fundraising Everywhere", color: "#E11D8F" },
  { headline: "Tenacious and exceptional", quote: "Brendan is one of the most tenacious marketers I've met, fast to action plans with exceptional follow through to get the job done.", author: "Courtney Evans", role: "CEO, Funraisin", color: "#1340E8" },
  { headline: "A safe pair of hands", quote: "Brendan is smart. He gets it quickly. He's a very safe pair of hands.", author: "Gary O'Donnell", role: "Operations Director, Dentsu Aegis", color: "#FF6200" },
  { headline: "Big thinking, sharp strategy", quote: "Brendan constantly combined big thinking and strategic expertise to propose innovative new ideas for guiding content development — aligning deep research and analysis with project objectives and KPIs.", author: "Chris Mejaski", role: "Content Strategist, eBay", color: "#DC2626" },
  { headline: "Built trust, boosted efficiency", quote: "Brendan quickly built trust among our DE/UK stakeholders, boosting marketing efficiency through creative strategy and consulting, and spearheading cross-functional collaboration across global marketing teams.", author: "Xania Khan", role: "Head of Content Strategy, eBay", color: "#E11D8F" },
  { headline: "Trends before anyone else", quote: "Brendan's extensive industry experience and knowledge of the latest marketing trends — before anyone else — makes every campaign feel exciting and innovative. His commitment and passion for delivering meaningful change, powered by tech, is inspiring.", author: "Matthew Ivo", role: "Marketing colleague", color: "#1340E8" },
];

/* ---------------------------- Reply Drawer ---------------------------- */

const INTENT_OPTIONS = [
  { value: "phase-a", label: "Yes — start with Phase A" },
  { value: "phase-ab", label: "Yes — full Phase A+B" },
  { value: "questions", label: "We have a few questions" },
  { value: "call", label: "Let's schedule a call" },
] as const;

type Intent = typeof INTENT_OPTIONS[number]["value"];

const replySchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().max(2000).optional(),
});

const ReplyDrawer = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const [name, setName] = useState("Stephen");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState<Intent>("phase-a");
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
    const source = "sf-fire-proposal";

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
        description: "Thanks — I'll be in touch shortly.",
      });
      setEmail("");
      setMessage("");
      setIntent("phase-a");
      onOpenChange(false);
    } catch (err: any) {
      console.error("SF Fire proposal reply error:", err);
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
            <Label htmlFor="sf-name" className="text-sm text-muted-foreground">Name</Label>
            <Input
              id="sf-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background rounded-lg mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="sf-email" className="text-sm text-muted-foreground">Email *</Label>
            <Input
              id="sf-email"
              type="email"
              placeholder="you@sfpropertyfire.ca"
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
            <Label htmlFor="sf-message" className="text-sm text-muted-foreground">
              Anything to add <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Textarea
              id="sf-message"
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

const P = ({ children }: { children: React.ReactNode }) => (
  <motion.p {...fadeUp} className="font-sans text-[16.5px] md:text-[17px] leading-[1.8] text-foreground/85 mb-6">
    {children}
  </motion.p>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <motion.h3
    {...fadeUp}
    className="font-serif-pro text-[22px] md:text-[26px] italic font-semibold text-foreground mt-12 mb-5 leading-snug"
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

const PullQuote = ({ children, rotate = 0.2 }: { children: React.ReactNode; rotate?: number }) => (
  <motion.blockquote
    {...fadeUp}
    className="my-12 md:my-16 font-serif-pro italic text-[24px] md:text-[32px] leading-[1.35] text-foreground text-balance"
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </motion.blockquote>
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
    <div className="flex-1 flex flex-col items-center justify-start px-6 sm:px-10 md:px-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col items-start text-left">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="self-center flex flex-col sm:flex-row items-center gap-8 sm:gap-14 md:gap-20 mt-14 sm:mt-20 md:mt-24 mb-12 sm:mb-16"
        >
          <img src={WhiteStacked} alt="Thread & Stack" className="h-24 sm:h-24 md:h-28 w-auto" />
          <X aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground/30" strokeWidth={1} />
          <div className="font-serif-pro italic font-semibold text-primary-foreground text-center leading-tight text-2xl sm:text-2xl md:text-3xl max-w-[14ch]">
            SF Property<br />Fire Prevention
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="self-center font-sans text-[10.5px] sm:text-[12px] tracking-[0.28em] uppercase text-primary-foreground/55 mb-8 sm:mb-12 text-center"
        >
          Confidential <span className="text-primary-foreground/25 mx-2">·</span> Proposal{" "}
          <span className="text-primary-foreground/25 mx-2">·</span> May 2026
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

            <p className="text-primary-foreground/90 font-medium">Stephen,</p>

            <p>
              This isn't a pitch document in the way that word usually means something slick and a little
              impersonal. It's closer to a working plan, written after a conversation in which you were honest
              about the gaps in your business in a way that a lot of people aren't. I want to meet that honesty
              with something useful.
            </p>

            <p>
              I run Thread & Stack as a solo practice, deliberately. I work with businesses led by real people —
              people who have built something with their hands and their years and are now asking the right
              questions about how to make it last beyond themselves. I find myself drawn to that work because
              I understand the weight of it. The things you're trying to solve — how to hold something together
              as it grows, how to stop being the single point of failure in the thing you've built — are the
              same problems that make this work worth doing.
            </p>

            <p>
              What I'm going to propose here isn't simply a Notion build. Getting you, Carol, and Joe where you
              want to be will involve a <strong>small, coherent stack of tools</strong> with a clear job for each
              layer. My role is to help you understand what each part does and why it's there, and then to make
              sure the whole thing is genuinely usable rather than just built.
            </p>

            <p>
              That's why, when you work with me, you get a relationship and not a handoff. You'll have
              asynchronous support throughout, the ability to ask questions as they come up, session recordings,
              and documentation that Carol can return to in her own time. It will always be me you're working
              with.
            </p>

            <p>This document sets out a vision, a phasing plan, and clear numbers. Read it with Carol. Come back with questions.</p>

            <img
              src={BrSignature}
              alt="Brendan Rodgers signature"
              className="h-20 sm:h-24 w-auto -ml-2 mt-4 opacity-90"
            />
            <p className="text-primary-foreground/90 font-medium pt-1">Brendan</p>
            <p className="text-primary-foreground/60 text-[13px]">Thread &amp; Stack</p>
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

const SFFireProposalPage = () => {
  const [opened, setOpened] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Proposal — SF Property Fire Prevention · Thread & Stack";

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
              <div className="font-serif-pro italic font-semibold text-foreground text-center leading-tight text-xl sm:text-2xl md:text-2xl max-w-[14ch]">
                SF Property<br />Fire Prevention
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="font-serif-pro text-[36px] sm:text-5xl md:text-6xl italic font-semibold leading-[1.05] tracking-tight text-foreground text-balance mb-8 order-3"
            >
              A working{" "}
              <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>
                plan
              </span>{" "}
              for Stephen, Carol &amp; Joe.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="font-sans text-[14px] sm:text-[15px] text-muted-foreground tracking-wide leading-relaxed order-4"
            >
              <span className="block sm:inline">Prepared for Stephen Hart</span>
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline">By Brendan Rodgers,</span>
              <span className="block sm:inline sm:ml-1">Thread &amp; Stack</span>
            </motion.p>
          </div>
        </header>

        {/* ============== BODY ============== */}
        <article className="px-5 sm:px-8 pb-24">
          <div className="max-w-2xl mx-auto">

            {/* 01 — The problem */}
            <section>
              <SectionHead
                num="01"
                eyebrow="The problem"
                rotate={-0.4}
                title={<>SF Property Fire Prevention has outgrown its current way of <Hl>working.</Hl></>}
              />
              <P>
                For 20 years the system has been Stephen, Carol, and Joe. Three people with deep expertise,
                complete trust in one another, and a speed that comes from knowing the work in their bones. A
                restaurant kitchen job that used to take eight hours takes three. That is what 20 years of
                doing something properly looks like.
              </P>
              <P>
                But the business is at an inflection point. Stephen has stepped back from field work. Two new
                hires are in place. The next stage — scaling to two full crews, moving out of the home, creating
                a business that holds value beyond its founder — depends on one thing going right first:
                <em> the knowledge that lives in Stephen, Carol, and Joe's heads needs to come out of their
                heads and into a system.</em>
              </P>
              <P>
                Right now it hasn't. Training is Joe on every job, every night, catching the things that get
                missed because repetition is not the same as documentation. Procedures exist on paper and in
                memory. Checklists live in monthly folders. The caustic bottle incident and the security
                situation that left Joe in an unjust position are not stories about individual errors. They
                are stories about what happens when a business that runs on experience brings in people who
                don't have it yet.
              </P>

              <PullQuote rotate={-0.4}>
                "I'm the system right now — and I've now become the <Hl shift={-2}>weakest link.</Hl>"
              </PullQuote>

              <P>
                The question you asked about what would break first if you stepped away for two weeks is exactly
                the right question. The answer at the moment is <strong>almost everything</strong>.
              </P>
            </section>

            <Rule />

            {/* 02 — The solve */}
            <section>
              <SectionHead
                num="02"
                eyebrow="The solve"
                rotate={0.3}
                title={<>A coherent operational <Hl shift={-1}>system.</Hl> Not just Notion.</>}
              />
              <P>
                Notion is where the work will live. But getting SF Property Fire Prevention to a place of
                genuine operational independence means building a small, connected stack of tools with a
                clear role for each layer.
              </P>

              <H3>Notion Workspace — the single source of truth</H3>
              <P>
                Training modules, onboarding stages, job records, customer data, safety checklists, compliance
                tracking. Everything that currently lives in folders, on Stephen's desktop, or in the heads of
                three people who have been doing this for two decades. Built mobile-first, so crews can access
                what they need from a phone on-site without needing a Notion account.
              </P>

              <H3>Notion AI — the knowledge layer</H3>
              <P>
                Once the content is in the system, anyone on the team can ask a question in plain language and
                get an answer drawn from the workspace. Carol doesn't need to know where things are stored.
                Joe can check a procedure mid-job without calling Stephen.
              </P>

              <H3>Forms and public web links</H3>
              <P>
                How the field crew interact with the system without requiring full accounts. Job completion
                submitted via a simple mobile form. Photos uploaded. Incident reports filed. The data flows
                in without the cost of additional Notion seats.
              </P>

              <H3>Automations — the reliable background layer</H3>
              <P>
                Job due reminders triggered by the re-booking cycle. Training stage progressions flagged when a
                crew member completes a module. QC alerts for Joe when a new hire's first solo job is ready
                for review.
              </P>

              <P>
                My job across this engagement is to design the architecture, build the system, train the team,
                and make sure it is running before I hand it over. <strong>The technical choices serve the
                people using the system, not the other way around.</strong>
              </P>
            </section>

            <Rule />

            {/* 03 — What changes */}
            <section>
              <SectionHead
                num="03"
                eyebrow="What changes"
                rotate={-0.3}
                title={<>Four things that <Hl>change.</Hl></>}
              />

              <H3>01 — Joe gets his evenings back</H3>
              <P>
                Right now Joe is on every job, every night, covering the gap that a training system would
                otherwise fill. That is not a sustainable position and Stephen knows it. Once the Training
                Content Library is live, new crew members follow documented procedures instead of watching Joe.
                Joe monitors quality through the system rather than being physically present at every step.
                The goal is not to remove Joe from the picture. It is to make his 20 years of expertise
                available to the whole team without requiring him to be in two places at once.
              </P>

              <H3>02 — Carol gets one place to run from</H3>
              <P>
                Carol's recordkeeping is, by Stephen's account, exceptional. An accountant praised it under
                audit conditions. The current paper folder system works because Carol makes it work. The job
                of this build is not to fix Carol. It is to give her infrastructure that is <em>as organised
                as she already is.</em> A single digital system for job records, customer history, re-booking
                cycles, and compliance dates. Something she can hand off to a future hire and trust that it
                still works.
              </P>

              <H3>03 — The crew has structure, not just instructions</H3>
              <P>
                A new hire who has been shown something twice by Joe and told to get on with it is not a
                failure of hiring. It is a failure of system. The mobile-first training modules in this build
                give every crew member access to the documented procedure for every task, from the phone in
                their pocket, before a job starts and during it if they need to check. The safety incidents
                that have already occurred are a signal and not a one-off. <strong>This is the part of the
                build with the most immediate urgency.</strong>
              </P>

              <H3>04 — Stephen gets his business back</H3>
              <P>
                Not from the field. You're already out of the field. From the position of being the only
                person who knows how all the moving parts connect. When the system holds the operational
                knowledge, you can focus on sales, troubleshooting, and the conversations that move the
                business forward. And when the time comes — whether that is scaling to a second full crew,
                stepping further back, or eventually making the business something that could be sold or
                handed on — the system is what makes that possible. A business that runs without its founder
                is worth more than one that doesn't. This build is part of that longer story.
              </P>

              <PullQuote rotate={0.3}>
                Take what's in their heads, and put it into a system that <Hl shift={-2}>holds.</Hl>
              </PullQuote>
            </section>

            <Rule />

            {/* 04 — The phases */}
            <section>
              <SectionHead
                num="04"
                eyebrow="The phases"
                rotate={0.3}
                title={<>Two phases. <Hl shift={-1}>Start where it hurts most.</Hl></>}
              />
              <P>
                The build is structured in two phases. <strong>Phase A</strong> addresses the burning platform.
                <strong> Phase B</strong> builds the operational layer that makes the whole thing
                system-dependent. You can start with Phase A and confirm Phase B once you have seen it working.
                That is the approach I would recommend.
              </P>

              <H3>Phase A — The training system</H3>
              <P>
                The immediate priority. Joe's burnout risk, the safety incidents, two new hires working
                without proper onboarding. This phase resolves all three.
              </P>
              <EditorialTable
                head={["Phase", "Work", "Blocks", "Cost"]}
                rows={[
                  ["0 · Discovery", "Scoping call (complete), proposal, alignment with Carol", "1.5", "£675"],
                  ["1 · Architecture", "Training system design, onboarding workflow, mobile form structure", "1.5", "£675"],
                  ["2 · Core Build", "Training Content Library (procedures, checklists, safety protocols), Employee Onboarding Tracker (stage-gated progress), Mobile Job Completion Form (photos, time, incidents — public link, no Notion account required)", "3.5", "£1,575"],
                  ["3 · Training", "Two sessions with Stephen, Carol, and Joe. Screen-shared, hands-on, tested against real scenarios from your own jobs. All sessions recorded.", "2", "£900"],
                  [<strong>Phase A Total</strong>, "", <strong>8.5 blocks</strong>, <strong>£3,825<br /><span className="text-muted-foreground font-normal">(~CA$7,000)</span></strong>],
                ]}
              />

              <H3>Phase A + B — The full operational build</H3>
              <P>
                Everything above, plus the layer that gives the whole business a single place to run from.
              </P>
              <EditorialTable
                head={["Phase", "Work", "Blocks", "Cost"]}
                rows={[
                  ["Phase A", "Training system (as above)", "8.5", "£3,825"],
                  ["2b · Core Build", "Customer Database (contact info, job history, compliance dates, re-booking cycles), Job Records Database (replaces the paper folder system, linked to customers), QC Dashboard for Joe", "4", "£1,800"],
                  ["Complexity", "Mobile-first views and content migration preparation", "1.5", "£675"],
                  [<strong>Full Build Total</strong>, "", <strong>14 blocks</strong>, <strong>£6,300<br /><span className="text-muted-foreground font-normal">(~CA$11,500)</span></strong>],
                ]}
              />
            </section>

            <Rule />

            {/* 05 — Monthly support */}
            <section>
              <SectionHead
                num="05"
                eyebrow="Monthly support"
                rotate={-0.3}
                title={<>A full day a month, <Hl>delivered properly.</Hl></>}
              />
              <P>
                Every client gets a support arrangement that fits the reality of what remote delivery actually
                requires.
              </P>
              <P>
                For Stephen, Carol, and Joe, that means <strong>a full day per month delivered across two
                focused sessions</strong>, with asynchronous support between them. Every session is recorded.
                Every working session produces documentation or written guidance that Carol can return to
                independently, in her own time.
              </P>
              <P>
                The first two months are for adoption, adjustment, and the questions that always surface once
                a system goes live. From month three onwards the sessions shift toward optimisation and
                whatever the business needs next.
              </P>
              <EditorialTable
                rows={[
                  [<strong>Monthly support</strong>, <strong>£900 / month <span className="text-muted-foreground font-normal">(~CA$1,650)</span></strong>],
                  [<strong>Minimum</strong>, "Three months post-launch. No lock-in beyond that."],
                ]}
              />
            </section>

            <Rule />

            {/* 06 — Payment */}
            <section>
              <SectionHead
                num="06"
                eyebrow="Payment"
                rotate={0.3}
                title={<>Two ways to <Hl shift={-1}>structure it.</Hl></>}
              />
              <P>Both require a deposit on signing.</P>

              <H3>Option 1 — Per phase</H3>
              <P>
                Start with Phase A. Invoiced at completion of each phase. If you proceed to Phase B, it is
                scoped and invoiced as a second engagement on the same terms.
              </P>
              <EditorialTable
                head={["Milestone", "When", "Amount"]}
                rows={[
                  ["Deposit", "On signing", "£1,000"],
                  ["Phase A completion", "On handover", "£2,825"],
                  [<strong>Phase A Total</strong>, "", <strong>£3,825</strong>],
                  ["Support · Month 1", "End of month", "£900"],
                  ["Support · Month 2", "End of month", "£900"],
                  ["Support · Month 3", "End of month", "£900"],
                ]}
              />

              <H3>Option 2 — Monthly programme</H3>
              <P>
                Commit to the full Phase A+B build from the start. Equal payments, no surprises.
              </P>
              <EditorialTable
                head={["Month", "Amount"]}
                rows={[
                  ["Deposit (on signing)", "£1,500"],
                  ["Month 1", "£1,200"],
                  ["Month 2", "£1,200"],
                  ["Month 3", "£1,200"],
                  ["Month 4", "£1,200"],
                  [<strong>Phase A+B Total</strong>, <strong>£6,300</strong>],
                ]}
              />
              <p className="font-sans text-[13px] text-muted-foreground/80 mt-2">
                Monthly support invoiced separately at £900/month from month five.
              </p>
            </section>

            <Rule />

            {/* 07 — At a glance */}
            <section>
              <SectionHead
                num="07"
                eyebrow="At a glance"
                rotate={-0.3}
                title={<>The engagement, in <Hl>one view.</Hl></>}
              />
              <EditorialTable
                rows={[
                  [<strong>Client</strong>, "Stephen Hart, SF Property Fire Prevention"],
                  [<strong>Consultant</strong>, "Brendan Rodgers, Thread & Stack"],
                  [<strong>Rate</strong>, "£450 per half-day block"],
                  [<strong>Phase A</strong>, "Training system — 8.5 blocks"],
                  [<strong>Phase A+B</strong>, "Full operational build — 14 blocks"],
                  [<strong>Phase A total</strong>, "£3,825 (~CA$7,000)"],
                  [<strong>Phase A+B total</strong>, "£6,300 (~CA$11,500)"],
                  [<strong>Monthly support</strong>, "£900 (~CA$1,650) per month"],
                  [<strong>Deposit</strong>, "Required on signing for both options"],
                  [<strong>Terms</strong>, "No VAT charged to Canadian clients."],
                ]}
              />
            </section>

            <Rule />

            {/* 08 — What we need from you */}
            <section>
              <SectionHead
                num="08"
                eyebrow="To begin"
                rotate={0.3}
                title={<>What I need from <Hl shift={-1}>you.</Hl></>}
              />
              <BulletList
                items={[
                  <>A reply from Stephen and Carol confirming which phase and which payment option.</>,
                  <>A sample of existing training materials, procedures, or checklists (scanned or photographed is fine) so I can assess what is already usable.</>,
                  <>An example of Carol's current paper job record or after-service report, so I understand what the database needs to capture.</>,
                  <>A rough sense of timing: is there a next hire coming, or a period where you need to step back? That shapes the sequencing.</>,
                ]}
              />
            </section>

            <Rule />

            {/* 09 — Business card */}
            <section>
              <motion.div {...fadeUp} className="mx-auto max-w-xl">
                <div className="mb-6 text-center font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-accent">
                  Next
                </div>
                <h2
                  className="font-serif-pro text-[28px] sm:text-[34px] md:text-[40px] italic font-bold leading-[1.1] tracking-tight text-foreground text-balance mb-10 text-center"
                  style={{ transform: "rotate(-0.3deg)" }}
                >
                  Read it with Carol. Come back with{" "}
                  <span className="inline-block text-accent" style={{ transform: "translateY(1px)" }}>
                    questions
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
                          +44 7913 566551
                        </a>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <button
                        onClick={() => setReplyOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-sans text-sm hover:bg-accent/90 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Reply to begin
                      </button>
                      <a
                        href="mailto:br@brendanrodgers.uk?subject=SF%20Property%20Fire%20Prevention%20Proposal%20%E2%80%94%20Reply&body=Hi%20Brendan%2C%0A%0A"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card/40 text-foreground font-sans text-sm hover:bg-card/70 transition-colors"
                      >
                        Email directly
                      </a>
                      <a
                        href="https://www.linkedin.com/in/rodgersbrendan/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card/40 text-foreground font-sans text-sm hover:bg-card/70 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trust-building testimonials carousel */}
              <motion.div {...fadeUp} className="mx-auto max-w-4xl mt-14 sm:mt-16">
                <div className="text-center font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-accent mb-5">
                  Kind words
                </div>
                <Carousel
                  opts={{ align: "start", loop: true, dragFree: true }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-3">
                    {testimonials.map((t, i) => (
                      <CarouselItem
                        key={i}
                        className="pl-3 basis-[85%] sm:basis-1/2 lg:basis-1/3"
                      >
                        <div className="h-full rounded-2xl border border-border bg-card/40 shadow-[0_2px_24px_-12px_rgba(0,0,0,0.12)] p-5 flex flex-col">
                          <p className="font-serif-pro italic text-[15px] leading-snug text-foreground mb-3">
                            "{t.headline}"
                          </p>
                          <p className="font-sans text-[13px] leading-relaxed text-foreground/75 mb-4 flex-1">
                            {t.quote}
                          </p>
                          <div className="pt-3 border-t border-border/60">
                            <div className="font-sans text-[13px] text-foreground">{t.author}</div>
                            <div className="font-sans text-[11px] text-muted-foreground mt-0.5">{t.role}</div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden sm:block">
                    <CarouselPrevious className="-left-4" />
                    <CarouselNext className="-right-4" />
                  </div>
                </Carousel>
              </motion.div>

              <motion.div {...fadeUp} className="mx-auto max-w-xl mt-12 sm:mt-16">
                <div>
                  <div className="text-center font-sans text-[12px] tracking-[0.22em] uppercase text-muted-foreground/70 mb-5">
                    Notion Credentials
                  </div>
                  <img
                    src={NotionBadges}
                    alt="Notion certification badges — Academy Essentials, Workflows, Advanced, AI, Certified Admin, Service Specialist, and Consulting Partner"
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
                Prepared for SF Property Fire Prevention · May 2026
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

export default SFFireProposalPage;
