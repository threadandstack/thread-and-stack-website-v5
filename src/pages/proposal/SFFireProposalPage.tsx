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
import SFFireLogo from "@/assets/proposal/sf-property-fire-prevention-logo.gif";
import SFFireLogoDark from "@/assets/proposal/sf-property-fire-prevention-logo-dark.png";
import BrSignature from "@/assets/proposal/br-signature.png";
import BrendanAvatar from "@/assets/brendan-avatar.webp";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import IconNotion from "@/assets/proposal/icons/notion.png";
import IconNotionAI from "@/assets/proposal/icons/notion-ai.png";
import IconLassie from "@/assets/proposal/icons/lassie.png";
import IconZapier from "@/assets/proposal/icons/zapier.svg";
import IconFormLink from "@/assets/proposal/icons/form-link.svg";

const testimonials = [
  { headline: "Genuinely transformative", quote: "This Notion Mentorship sprint has been genuinely transformative for me. In just a few weeks, I significantly upped my productivity and efficiency — not just in how much I get done, but in how clearly I can show the value of my work.", author: "Jasmine Stone", role: "Marketing Manager", color: "#1340E8" },
  { headline: "Hire Brendan, you won't regret it!", quote: "Brendan is like a Swiss army knife when it comes to marketing — strategic and hands-on. He helped me build a system that actually works for The IMMA Collective. I've now got real peace of mind, a clear vision for the business, and marketing that feels properly joined up.", author: "Lilli Graf", role: "Founder, The IMMA Collective", color: "#FF6200" },
  { headline: "Brendan does great work!", quote: "Brendan did a terrific and patient job of untangling my Notion ineptitude. I'm saving time already with the new cleaned up format.", author: "Lucian James", role: "Client", color: "#DC2626" },
  { headline: "More progress in months than a year", quote: "Brendan has been a dream. His support totally invigorated us. We've made more progress in the last couple of months than we had in the previous year.", author: "Alex Aggidis", role: "Head of Marketing, Everywhere+", color: "#E11D8F" },
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
  <motion.p {...fadeUp} className="font-sans text-[16.5px] md:text-[17px] leading-[1.8] text-foreground/85 mb-6 font-normal">
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
    className="my-12 md:my-16 not-italic font-sans text-[18px] md:text-[20px] leading-[1.7] text-muted-foreground bg-muted/30 border-l-4 border-accent pl-6 pr-6 py-6 rounded-r-lg text-balance"
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
          <img src={SFFireLogoDark} alt="SF Property Fire Prevention" className="h-24 sm:h-24 md:h-28 w-auto" />
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
              Thank you for your time last week. And to Carol and Joe, who I haven't met yet, hello.
            </p>

            <p>
              What follows is my version of a proposal. It's tailored to you specifically, and in truth it's
              closer to a working plan than a pitch document.
            </p>

            <p>
              I want to say something about the call before I get into it. You came to that conversation
              having already done the thinking. You knew what the problem was, you knew what had caused it,
              and you knew what needed to happen. Your self-awareness made the conversation genuinely useful
              rather than just exploratory, and it's meant I can be specific for you in this proposal.
            </p>

            <p>
              You described SF Property Fire Prevention as a twenty year-long partnership of three. Yourself,
              Carol and Joe working together so closely that your collective instincts became the system
              itself. Putting it plainly - what I'm proposing is the closest thing to a translation of that
              into something the next generation of your team can use.
            </p>

            <p>
              Carol will be a cornerstone of this. From what you described, Carol's gift for taking something
              complex and making it orderly, and holding it that way, is going to be vital. That's not a
              common thing. It's exactly what a system like this needs to take root properly.
            </p>

            <p>
              In the document ahead, I'll also detail my philosophy around your technology stack. But the
              shorthand is: Notion doesn't get a free pass just because that's how you found me. The
              philosophy is rooted in your goals, and while Notion does feel like the right solution for this
              path forward - I will always prioritise your actual desired goals and outcomes (what I think of
              as your "thread").
            </p>

            <p>Share it with Carol. I'm here when you're ready.</p>

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
    document.title = "Proposal · SF Property Fire Prevention · Thread & Stack";

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
              <img src={SFFireLogo} alt="SF Property Fire Prevention" className="h-20 sm:h-20 md:h-24 w-auto" />
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

            {/* 01 - The problem */}
            <section>
              <SectionHead
                num="01"
                eyebrow="The problem"
                rotate={-0.4}
                title={<>SF Property Fire Prevention has outgrown its current way of <Hl>working.</Hl></>}
              />

              <PullQuote rotate={-0.4}>
                "I've got to have it so that I'm never in this position again where the system needs to be
                out front. Because I'm <Hl shift={-2}>the system</Hl> right now and I've now become the
                weakest link."
                <footer className="mt-4 not-italic font-sans text-[12px] tracking-[0.18em] uppercase text-muted-foreground">
                  Stephen Hart · Discovery Call · May 2026
                </footer>
              </PullQuote>

              <P>
                Stephen, for 20 years the system has been you, Carol, and Joe. Three people
                with deep expertise, complete trust in one another, and a speed that comes from knowing the
                work in your bones. A restaurant kitchen job that used to take eight hours takes three, skill
                became instinct, instinct became your system. But now the business is at an inflection point.
              </P>

              <P>
                You have stepped back from field work. Two new hires are in place. The next stage, scaling to
                two full crews, moving out of the home, creating a business that holds value beyond its
                founder, depends on one thing going right first: the knowledge that lives in your heads needs
                to come out of your heads and into a system.
              </P>

              <P>
                Procedures exist on paper and in memory. Checklists live in monthly folders. The caustic
                bottle incident and the security situation that left Joe in an unjust position are not stories
                about individual errors. They are stories about what happens when a business that runs on
                experience brings in people who don't have it yet. Joe is on every job, every night, catching
                the things that get missed because repetition is not the same as documentation - and your
                business needs both.
              </P>
            </section>

            <Rule />

            {/* 02 - The solve */}
            <section>
              <SectionHead
                num="02"
                eyebrow="The solve"
                rotate={0.3}
                title={<>A knowledge lake for <Hl shift={-1}>SF Property Fire Prevention.</Hl></>}
              />
              <P>
                <em>You can learn more about <a href="https://threadandstack.notion.site/The-Intentional-Tool-Stack-3678863b87d4815a8f72c285e27b320b?pvs=74" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-accent hover:text-accent/80 transition-colors">Thread &amp; Stack's approach to building technology stacks for
                company knowledge management</a>, but for you, this is achievable almost entirely within Notion.</em>
              </P>
              <P>
                Every piece of operational knowledge your business runs on, the procedures, the checklists,
                the safety protocols, the customer records, the job history, will live in a single connected
                system. Not a folder on a desktop. Not a paper monthly system. Not in anyone's head. In one
                place that anyone on the team can access, at the level they need, from wherever they are.
              </P>
              <P>
                That system is built in Notion. Notion excels at this kind of knowledge architecture.
                Flexible enough to hold your operational complexity, simple enough for a crew member to use
                on a phone between jobs, and open enough to connect to other tools where they genuinely add
                value.
              </P>
              <P>The knowledge lake works across four layers.</P>

              <ul className="mt-8 space-y-5">
                {[
                  {
                    icon: IconNotion,
                    title: "The workspace - the single source of truth.",
                    body: "Training modules, onboarding stages, job records, customer data, safety checklists, compliance tracking. Structured, searchable, and accessible from any device.",
                  },
                  {
                    icon: IconLassie,
                    title: "The knowledge layer - Notion AI sits across the workspace.",
                    body: "Anyone on the team can ask a question in plain language and get an answer. Carol doesn't need to know where things are stored. Joe can check a procedure mid-job without calling you.",
                  },
                  {
                    icon: IconFormLink,
                    title: "The field interface - crew members update jobs from the phone in their pocket.",
                    body: "No Notion account required. Photos uploaded, job completion confirmed, incidents reported. The data flows in automatically.",
                  },
                  {
                    icon: IconZapier,
                    title: "The background layer - automations that run quietly.",
                    body: "Job due reminders. Training stage progressions. QC alerts for Joe when a new hire's first solo job is ready for review.",
                  },
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

            {/* 03 - What changes */}
            <section>
              <SectionHead
                num="03"
                eyebrow="What changes"
                rotate={-0.3}
                title={<>Five things that <Hl>change.</Hl></>}
              />

              <H3>01 - The team works from one place</H3>
              <P>
                For 20 years the three of you have operated on instinct, each knowing your role without
                needing to be told. That dynamic is the business's greatest strength and this build honours
                it rather than disrupts it. You have a clear view of jobs, staff progress, and the state of
                the business. Carol runs scheduling, customer records, and documentation from a single
                organised system rather than paper folders. Joe oversees field operations and crew progress
                without needing to be physically present at every step. The same knowledge base, three
                different ways of working with it.
              </P>

              <H3>02 - Carol gets a control centre</H3>
              <P>
                Carol's ability to take something complex, make it orderly, and hold it that way is not a
                common thing. The current paper folder system works because Carol makes it work. This build
                gives her infrastructure that matches how she already thinks. Job records, customer history,
                re-booking cycles, compliance dates, all connected, all in one place. Something she can hand
                to a future hire and trust that it still works.
              </P>

              <H3>03 - Jobs update from the field</H3>
              <P>
                Every job your crew does generates information: what was done, how long it took, what photos
                were taken, whether anything went wrong. Right now that information lives on cameras, on
                paper, and in memory. In this system, crew members submit a simple form from their phone at
                the end of every job. Photos attached. Checklist confirmed. Incident flagged if needed. The
                record is created automatically, linked to the customer, and visible to Joe and Carol without
                anyone having to chase it.
              </P>

              <H3>04 - The crew has structure, not just instructions</H3>
              <P>
                A new hire who has been shown something twice by Joe and told to get on with it is not a
                failure of hiring. It is a failure of system. The training modules in this build give every
                crew member access to the documented procedure for every task, from the phone in their
                pocket, before a job starts and during it if they need to check. The safety incidents that
                have already occurred are a signal and not a one-off. This is the part of the build with the
                most immediate urgency.
              </P>

              <H3>05 - Structure becomes a source of strength</H3>
              <P>
                You stepped back from the field a month ago. The business is at the stage where the next
                move, whether that is two full crews, a dedicated premises, or simply being able to take two
                weeks away without anything breaking, depends on the operational knowledge being somewhere
                other than in your heads. This build doesn't change what SF Property Fire Prevention is. It
                makes what it already is available to everyone who needs it.
              </P>
            </section>

            <Rule />

            {/* 04 - What's included */}
            <section>
              <SectionHead
                num="04"
                eyebrow="What's included"
                rotate={0.3}
                title={<>The build and the data migration, <Hl shift={-1}>together.</Hl></>}
              />
              <P>
                This engagement has two parts before the ongoing cadence begins. The build and the data
                migration happen together and depend on each other. Neither is optional. Once both are
                complete and the system is live, the ongoing cadence takes over.
              </P>

              <H3>Part 1 - The build and data migration</H3>
              <P>
                Each component has a preparation step. Before we build each part I will tell you exactly what
                I need from your side - usually existing procedures, customer records, or examples of how
                things currently work. Carol will likely be the key contact for this. The more organised the
                input, the cleaner the build.
              </P>
              <P>
                Where data already exists in digital form, whether that is a spreadsheet, a shared folder, or
                a CSV export from an existing tool, I will handle the migration and structure it within the
                new system. That is included in the build.
              </P>

              <ul className="mt-8 space-y-5">
                {[
                  {
                    title: "Company Home",
                    body: "The front door to the system. When any of you opens Notion, this is where you land: today's jobs, outstanding actions, staff progress, upcoming re-bookings. Each view is tailored to the person using it. Stephen sees the business. Carol sees the schedule and admin. Joe sees his crew.",
                  },
                  {
                    title: "Task Operating System",
                    body: "How follow-ups, actions, and responsibilities get tracked and completed without living in anyone's head. Deficiency callbacks, certification renewals, training updates, customer follow-ups - anything that needs to happen gets logged, assigned, and tracked. Nothing falls through the gap between a job finishing and the next one starting.",
                  },
                  {
                    title: "Internal Knowledge Base and Training Library",
                    body: "Your procedures, checklists, and safety protocols structured, searchable, and accessible from any device. The training material you built before COVID gets a proper home. Everything a new crew member needs, in the order they need it.",
                  },
                  {
                    title: "Custom Notion AI Assistant",
                    body: "Notion AI configured specifically for SF Property Fire Prevention. The assistant knows your terminology, your workflows, and your procedures. When Joe needs to check a safety protocol on-site, the answer comes from your documentation. When a new crew member asks a question, they get the right answer for your business, not a generic one.",
                  },
                  {
                    title: "Training Sessions",
                    body: "Two hands-on sessions with you, Carol, and Joe. Screen-shared, tested against real scenarios from your own jobs. Every session recorded so Carol can return to it independently.",
                  },
                  {
                    title: "Employee Onboarding System",
                    body: "A stage-gated tracker that moves each new hire through defined stages before they work independently. Joe can see at a glance where each person is. The system replaces memory as the record of who is ready for what.",
                  },
                  {
                    title: "Customer Relationship Management",
                    body: "Every customer SF Property Fire Prevention serves, with their full job history, compliance dates, and re-booking schedule in one place. The paper folder system organised by month is replaced by a database that surfaces the right customer at the right time. When a restaurant's six-month clean is coming due, the system flags it. Carol manages it. Joe references it before a job.",
                  },
                  {
                    title: "Mobile Job Completion",
                    body: "A simple form submitted from the phone at the end of every job. Photos, time on site, checklist confirmation, incident report if needed. No Notion account required for field crew. The record is created automatically and linked to the customer.",
                  },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.015, y: -2 }}
                    className="flex gap-5 items-start bg-card/60 hover:bg-card rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-colors duration-300 cursor-default"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-background flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      <span className="font-serif-pro italic text-lg text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <strong className="font-serif-pro italic text-lg text-primary block mb-1">{item.title}</strong>
                      <span className="text-foreground/75 leading-relaxed">{item.body}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <EditorialTable
                head={["Component", "Included"]}
                rows={[
                  ["Company Home", "✓"],
                  ["Task Operating System", "✓"],
                  ["Internal Knowledge Base and Training Library", "✓"],
                  ["Custom Notion AI Assistant", "✓"],
                  ["Training Sessions (x2, recorded)", "✓"],
                  ["Employee Onboarding System", "✓"],
                  ["Customer Relationship Management", "✓"],
                  ["Mobile Job Completion", "✓"],
                  ["Data migration (from existing digital records)", "✓"],
                  [<strong>Build Total</strong>, <strong>£7,650 (~CA$14,000)</strong>],
                ]}
              />

              <H3>A note on paper-based materials</H3>
              <P>
                You mentioned on our call that a significant amount of SF Property Fire Prevention's
                materials currently sit in paper stacks, folders, and drawers. Carol is probably best placed
                to confirm how much of that is already digital and how much remains paper-based.
              </P>
              <P>
                Materials that are not yet digital will need to be digitised before they can live in the
                system. As I am based in London, physically handling that process is not something I can
                offer, and it is likely not the best use of a senior consultant's time in any case. How to
                approach it practically is a conversation worth having early, and there may be better options
                than either of us doing it manually. I would rather we explore that together than make
                assumptions about the scale of the task.
              </P>

              <H3>A loose timeline</H3>
              <P>
                At our working pace the build typically completes within eight to ten weeks of starting. The
                pace is partly yours: if you need time to review progress or gather materials, that shapes
                the schedule. If you have a specific deadline driving things, a planned next hire or a
                period where you need to step back, talk to me early and we will work out what is possible.
              </P>
            </section>

            <Rule />

            {/* 05 - The ongoing cadence */}
            <section>
              <SectionHead
                num="05"
                eyebrow="Part 2 - The ongoing cadence"
                rotate={-0.3}
                title={<>You will not be handed a complex system and left to <Hl>work it out.</Hl></>}
              />
              <P>
                Most of the real value in a build like this surfaces in the months after launch, not before
                it. New crew members join and need onboarding. Requirements emerge that nobody anticipated on
                paper. Ways of working shift as the team gets comfortable with the system. That is not a sign
                that the build was wrong. It is a sign that the business is actually using it.
              </P>
              <P>
                The ongoing cadence is how we make sure the system keeps working for how SF Property Fire
                Prevention actually operates, not just how it operated when we planned it. You will have
                dedicated and asynchronous access to me each month - time to surface emerging pain points,
                smooth over the new ways of operating, and develop the system as the business develops.
              </P>
              <P>
                The first months are for embedding: making sure you, Carol, Joe, and the crew are using the
                system confidently and that the habits are forming. Once that foundation is solid, the
                sessions shift toward whatever the business needs next.
              </P>
              <EditorialTable
                head={["Monthly cadence", "£900 per month (~CA$1,650)"]}
                rows={[
                  ["Minimum", "Three months post-launch"],
                  ["After that", "Continues for as long as it is useful"],
                ]}
              />
            </section>

            <Rule />

            {/* 06 - At a glance */}
            <section>
              <SectionHead
                num="06"
                eyebrow="At a glance"
                rotate={0.3}
                title={<>The engagement, in <Hl shift={-1}>one view.</Hl></>}
              />
              <EditorialTable
                rows={[
                  [<strong>Client</strong>, "Stephen Hart, SF Property Fire Prevention"],
                  [<strong>Consultant</strong>, "Brendan Rodgers, Thread & Stack"],
                  [<strong>Part 1</strong>, "Build and data migration, all eight components"],
                  [<strong>Build total</strong>, "£7,650 (~CA$14,000)"],
                  [<strong>Paper-based digitisation</strong>, "To be discussed"],
                  [<strong>Part 2</strong>, "Ongoing cadence, £900 (~CA$1,650) per month"],
                  [<strong>Loose timeline</strong>, "8-10 weeks for the build"],
                  [<strong>Deposit</strong>, "Required on signing"],
                  [<strong>Terms</strong>, "No VAT charged to Canadian clients."],
                ]}
              />
            </section>

            <Rule />

            {/* 07 - Flexible payment structures */}
            <section>
              <SectionHead
                num="07"
                eyebrow="Payment"
                rotate={-0.3}
                title={<>Flexible payment <Hl>structures.</Hl></>}
              />
              <P>Two options. Both require a deposit on signing.</P>

              <H3>Option 1 - On completion</H3>
              <P><em>Deposit to begin. Balance on handover.</em></P>
              <EditorialTable
                head={["Milestone", "When", "Amount"]}
                rows={[
                  ["Deposit", "On signing", "£2,000"],
                  ["Build completion", "On handover", "£5,650"],
                  [<strong>Build Total</strong>, "", <strong>£7,650</strong>],
                  ["Monthly cadence · Month 1", "End of month", "£900"],
                  ["Monthly cadence · Month 2", "End of month", "£900"],
                  ["Monthly cadence · Month 3", "End of month", "£900"],
                ]}
              />

              <H3>Option 2 - Monthly programme</H3>
              <P><em>Deposit to begin. Equal monthly payments across the build. No surprises.</em></P>
              <EditorialTable
                head={["Month", "Amount"]}
                rows={[
                  ["Deposit (on signing)", "£1,650"],
                  ["Month 1", "£1,500"],
                  ["Month 2", "£1,500"],
                  ["Month 3", "£1,500"],
                  ["Month 4", "£1,500"],
                  [<strong>Build Total</strong>, <strong>£7,650</strong>],
                ]}
              />
              <p className="font-sans text-[13px] italic text-muted-foreground/80 mt-2">
                Monthly cadence invoiced separately at £900/month from month five.
              </p>
            </section>

            <Rule />

            {/* 08 - To begin */}
            <section>
              <SectionHead
                num="08"
                eyebrow="To begin"
                rotate={0.3}
                title={<>Reply to this proposal with a <Hl shift={-1}>yes.</Hl></>}
              />
              <P>
                I will send you a deposit link and we will get started. Everything else, the kickoff session,
                the materials, the detailed timeline, follows from there.
              </P>
              <P>
                <strong>Brendan Rodgers</strong><br />
                Thread &amp; Stack<br />
                <a href="mailto:br@threadandstack.com" className="text-accent hover:underline">br@threadandstack.com</a><br />
                <a href="https://threadandstack.com" className="text-accent hover:underline">threadandstack.com</a>
              </P>
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
                          <div
                            className="pt-3 pb-3 px-4 -mx-5 -mb-5 mt-auto rounded-b-2xl"
                            style={{ backgroundColor: t.color }}
                          >
                            <div className="font-sans text-[13px] text-white font-semibold">{t.author}</div>
                            <div className="font-sans text-[11px] text-white/80 mt-0.5">{t.role}</div>
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
