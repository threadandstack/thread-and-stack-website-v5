import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  Shield,
  CreditCard,
  Sparkles,
  Anchor,
  Wrench,
  Repeat,
  LayoutGrid,
  Compass,
  X,
} from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import BlackStacked from "@/assets/logos/Black_TS_Stacked.svg";
import IndigoStacked from "@/assets/logos/Indigo_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import LssLogoWhite from "@/assets/proposal/lss-logo-white.webp";
import BrSignature from "@/assets/proposal/br-signature.png";

/* ---------------------------- Content ---------------------------- */

const PHASE1_ITEMS = [
  "A focused half-day with you in person — walking your current stack together (Monday boards, Google Drive, Squarespace, the tools around them).",
  "A short conversation with Sharon where possible, so her workflow is captured before it gets systematised.",
  "A written scope document for the Foundation build that you can read, mark up, and approve before anything gets built.",
];

const PHASE2_MODULES = [
  { title: "CRM — replacing Monday entirely", desc: "Contacts, enquiries, and bookings in a single pipeline. Clear stages, visible follow-ups, nothing falling through the gaps." },
  { title: "Customer journey automations", desc: "Booking reminders, final payment prompts at 6–8 weeks, joining instructions 1–2 weeks before the event, post-event review and upsell. The things that currently sit on your shoulders, running on their own." },
  { title: "Voyage Records", desc: "Per-trip crew manifest, dietary requirements and allergies (GDPR-handled), next of kin, RYA qualification, pre-sail checklist, skipper sign-off, post-sail incident log. A safety-critical record that runs whether anyone remembers to chase it or not." },
  { title: "Daily operations dashboard", desc: "One view when you wake up: upcoming events, unresponded enquiries, overdue tasks, outstanding payments, skipper assignments. A clear task list for Sharon. James's event schedule and boat logistics in one place." },
  { title: "Notion Mail for email triage", desc: "Gmail inbox managed from inside the system. Client comms surfaced, junk filtered, and Sharon working from a structured inbox view rather than waiting on a forward from you." },
  { title: "Guest pages for joining instructions", desc: "Clean, templated pages replacing the current Monday public links. No login required for clients. Skipper packs accessible to contractors without needing a paid seat." },
  { title: "Two onboarding sessions", desc: "You and Sharon (or whoever is available) working in the system comfortably before handover. Recorded for James and anyone who joins later." },
];

const ONGOING_USES = [
  "Lassie — your AI front line on WhatsApp and email, handling repeat questions before they reach you.",
  "Event-to-Squarespace automation — create an event in the system, publish it as a product on the site.",
  "A content pipeline turning your expertise into blog, newsletter, and social posts with minimal friction.",
  "System architecture for the members portal you've sketched out for Spring 2027.",
];

const STACK_ROWS = [
  { tool: "Notion Business", status: "Replace Monday", notes: "~£425/year for 3 users vs £950/year on Monday. AI Agents and full AI features included." },
  { tool: "Google Workspace", status: "Keep", notes: "Non-negotiable. Gmail, Calendar, Drive as fallback. Notion Mail sits on top of Gmail rather than replacing it." },
  { tool: "Claude Pro", status: "Replace Gemini", notes: "Roughly the same monthly cost. Projects hold context across conversations — solves the frustration you flagged directly." },
  { tool: "Squarespace", status: "Keep (check plan)", notes: "Worth confirming your current plan. Business plan adds a 3% transaction fee on top of Stripe's 2.9% — on a £500 sailing event that's ~£30 per booking. Core (~£22/month) removes the Squarespace fee." },
  { tool: "Stripe", status: "Keep", notes: "Works. Amex fees are painful but that's Stripe, not the stack." },
  { tool: "FreeAgent", status: "Keep", notes: "Free tier, VAT filing, year-end. Leave it alone." },
];

const NEXT_STEPS = [
  "Reply to confirm you're happy with the shape of this and we'll book Phase 1.",
  "Send through read-only access to Monday and Google Drive before the session — that lets us walk the real stack together rather than describing it.",
  "Flag a couple of windows where Sharon might be available for a short conversation, if her health allows it. If not, we'll work from what you can describe.",
  "Check which Squarespace plan you're currently on, and whether the Gemini subscription is bundled into Workspace or charged separately.",
];

const SECURITY_ROWS = [
  { title: "Data residency", detail: "Your workspace runs on Notion's infrastructure with EU-region hosting available. Your data stays in the region you choose and doesn't move across regions." },
  { title: "GDPR & sensitive crew data", detail: "Dietary, medical, and next-of-kin information sits in dedicated databases with restricted access. Skipper and contractor views surface only what's needed for the trip." },
  { title: "Voyage Records as evidence", detail: "Pre-sail checks, briefings, and skipper sign-off are timestamped on the record itself. Exportable if you ever need to hand them to an insurer or a solicitor." },
  { title: "Workspace ownership", detail: "The system is built inside an LSS-owned Notion workspace from day one. You hold the keys. If we ever stop working together, nothing has to move." },
];

const INVESTMENT_ROWS = [
  { title: "Phase 1 — Mapping session", when: "Invoiced on booking", amount: "£400" },
  { title: "Phase 2 — Foundation build (1/2)", when: "End of month one", amount: "£2,000" },
  { title: "Phase 2 — Foundation build (2/2)", when: "End of month two", amount: "£2,000" },
  { title: "Ongoing — monthly support", when: "Begins after handover, cancel anytime", amount: "£400/mo" },
];

/* ---------------------------- Helpers ---------------------------- */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const SectionHeader = ({
  num,
  eyebrow,
  title,
  intro,
}: {
  num: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
}) => (
  <motion.div {...fadeUp} className="mb-10 md:mb-14 max-w-3xl">
    <div className="flex items-center gap-3 mb-4">
      <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-accent uppercase">{num}</span>
      <span className="h-px flex-1 bg-border" />
      <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</span>
    </div>
    <h2 className="font-serif-pro text-3xl sm:text-4xl md:text-5xl italic font-semibold leading-[1.1] tracking-tight text-foreground">
      {title}
    </h2>
    {intro && (
      <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed mt-5">
        {intro}
      </p>
    )}
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
    {/* Centre: dual lockup */}
    <div className="flex-1 flex flex-col items-center justify-start px-6 sm:px-10 md:px-16 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col items-start text-left">
      {/* Logos */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="self-center flex items-center gap-10 sm:gap-14 md:gap-20 mt-16 sm:mt-20 md:mt-24 mb-12 sm:mb-16"
      >
        <img
          src={WhiteStacked}
          alt="Thread & Stack"
          className="h-20 sm:h-24 md:h-28 w-auto"
        />
        <X
          aria-hidden="true"
          className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground/30"
          strokeWidth={1}
        />
        <img
          src={LssLogoWhite}
          alt="London School of Sailing"
          className="h-20 sm:h-24 md:h-28 w-auto"
        />
      </motion.div>

      {/* Meta line */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="self-center font-sans text-[11px] sm:text-[12px] tracking-[0.28em] uppercase text-primary-foreground/55 mb-10 sm:mb-12"
      >
        Confidential <span className="text-primary-foreground/25 mx-2">·</span> Proposal <span className="text-primary-foreground/25 mx-2">·</span> May 2026
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55 }}
        className="font-serif-pro text-3xl sm:text-4xl md:text-5xl italic font-semibold leading-[1.05] tracking-tight mb-8 sm:mb-10 max-w-3xl"
      >
        A vision for LSS.
      </motion.h1>

      {/* Intro Letter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.0 }}
        className="max-w-xl text-left mb-8 sm:mb-10"
      >
        <div className="font-sans text-sm sm:text-[15px] leading-[1.75] text-primary-foreground/80 space-y-4">
          <p className="text-primary-foreground/90 font-medium">Ruaraidh,</p>

          <p>
            This proposal is not a pitch. It's a <strong>vision document</strong>. This is my way of showing you, clearly and honestly, what we can do together for LSS.
          </p>

          <p>
            There is a lot of love, hope, sweat and determination in your business. I was very touched by how our meeting in Peter's shed took place. Not only did you share with me some sensitive context, but it reminded me that you, and your new family are part of my own story. So I'm going to start us off from a different footing than we left on:
          </p>

          <p>
            My intention is to help LSS reach a place of <strong>stable, systematised operational strength</strong> - that is tailored to you, and LSS's needs. This system will hold steady no matter how many new team members, new customers, or new friends arrive to join the LSS's own voyage.
          </p>

          <ul className="space-y-2 my-2 ml-0 pl-0 list-none">
            <li className="flex items-start gap-3">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary-foreground/40 flex-shrink-0" />
              <span>I'm reducing all my rates by <strong>20% for you, permanently</strong>.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary-foreground/40 flex-shrink-0" />
              <span>I'm also going to propose a few options, with a <strong>flexible project framework</strong> within this vision doc.</span>
            </li>
          </ul>

          <p>
            Putting it bluntly, we can also keep talking it through until it works for you. Price would be a daft reason to find myself not helping you. I'm a friend in your camp already, and I'd rather get you kitted out, the way I know you should be.
          </p>

          <p>
            So give this a read (probably best to grab a cup of tea or a beer),
          </p>

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

    {/* CTA */}
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

  // Lock body scroll while welcome screen is open
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
      <AnimatePresence>
        {!opened && <WelcomeScreen onOpen={() => setOpened(true)} />}
      </AnimatePresence>

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

        {/* ============== HERO ============== */}
        <section className="relative bg-primary text-primary-foreground">
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-24 md:pt-32 md:pb-36">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex items-center gap-4 mb-10"
            >
              <img src={WhiteStacked} alt="Thread & Stack" className="h-12" />
              <span className="h-10 w-px bg-primary-foreground/20" />
              <img src={LssLogoWhite} alt="London School of Sailing" className="h-12" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-[11px] font-semibold tracking-[0.28em] uppercase text-primary-foreground/55 mb-6"
            >
              Project Proposal
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="font-serif-pro text-[44px] sm:text-6xl md:text-7xl italic font-bold leading-[1.02] tracking-tight mb-6 max-w-4xl"
            >
              LSS is ready for it's own OS.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-sans text-base sm:text-lg md:text-xl text-primary-foreground/75 leading-relaxed max-w-2xl"
            >
              LSS OS is the operational backbone that underpins everything that
              matters.
              <br />
              <br />
              The system centralises vital internal knowledge (customer data,
              marketing and sales playbooks, growth plans, saftey procedures),
              and allows easier collaboration, delegation, and automation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="mt-12 pt-8 border-t border-primary-foreground/15 flex flex-wrap gap-x-10 gap-y-3 text-xs sm:text-[13px] font-sans text-primary-foreground/60 tracking-wide"
            >
              <div>
                <span className="text-primary-foreground/35 mr-2 uppercase tracking-[0.18em] text-[10px]">Prepared for</span>
                Ruaraidh Plummer
              </div>
              <div>
                <span className="text-primary-foreground/35 mr-2 uppercase tracking-[0.18em] text-[10px]">By</span>
                Brendan Rodgers, Thread &amp; Stack
              </div>
              <div>
                <span className="text-primary-foreground/35 mr-2 uppercase tracking-[0.18em] text-[10px]">Date</span>
                May 2026
              </div>
            </motion.div>
          </div>
          {/* Crisp hard edge — no fade */}
        </section>

        {/* ============== 01 What we're solving ============== */}
        <section className="px-5 sm:px-8 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              num="01"
              eyebrow="What we're solving"
              title={<>The work is bigger than the <em className="not-italic" style={{ fontStyle: "italic", color: "hsl(var(--accent))" }}>tools</em>.</>}
            />
            <div className="grid md:grid-cols-2 gap-5 md:gap-6">
              <motion.div
                {...fadeUp}
                className="bg-card rounded-3xl p-7 md:p-9 shadow-[var(--shadow-soft)] border border-border/50"
              >
                <p className="font-sans text-[15.5px] leading-[1.7] text-foreground">
                  You're running the same client volume today as the school did in a full year five years ago, on a tool stack that's fragmented, expensive, and slower than the work demands. The communication load — 300–400 WhatsApp notifications a day, an inbox that fights you — is the surface.
                </p>
              </motion.div>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-muted rounded-3xl p-7 md:p-9 border border-border/50"
              >
                <p className="font-sans text-[15.5px] leading-[1.7] text-foreground">
                  Underneath it, Monday is failing as the system of record and the everyday machinery of bookings, joining instructions, and crew manifests is held together by you and Sharon personally. The brief is to build a system that runs cleanly through the season — and that <strong>keeps</strong> running on days when Sharon can give four hours, on days when she can't, and on days when you're on the water.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============== 02 Phase 1 ============== */}
        <section className="px-5 sm:px-8 py-20 md:py-28 bg-muted/40">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              num="02"
              eyebrow="Phase 1"
              title={<>An in-person mapping session, before anything gets built.</>}
              intro={
                <>
                  <strong className="text-foreground">1 block · £400 · invoiced on booking.</strong> A focused half-day together so the Foundation build is shaped to what's really happening — not to what a brief assumes.
                </>
              }
            />

            <div className="grid md:grid-cols-[1.1fr_1fr] gap-6 md:gap-8 items-start">
              <motion.div
                {...fadeUp}
                className="bg-background rounded-3xl p-7 md:p-9 shadow-[var(--shadow-soft)] border border-border/50"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-pro italic text-xl font-semibold">What this gives you</h3>
                </div>
                <ul className="flex flex-col gap-4">
                  {PHASE1_ITEMS.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14.5px] text-foreground leading-[1.6]">
                      <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#FFFBEA] rounded-3xl p-7 md:p-9 border-l-[3px] border-[#E5A800]"
              >
                <div className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a6a00] mb-3">
                  Why this matters
                </div>
                <p className="font-sans text-[14.5px] text-[#5a4500] leading-[1.7]">
                  Phase 1 is the gate. The Foundation build doesn't start until you've seen and agreed exactly what it contains. No surprise scope, no surprise invoice.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============== 03 Phase 2 ============== */}
        <section className="px-5 sm:px-8 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              num="03"
              eyebrow="Phase 2 — Foundation"
              title={<>Seven modules. One coherent system.</>}
              intro={
                <>
                  <strong className="text-foreground">~10 blocks · £4,000 · paid in two halves.</strong> The transfer of LSS's operational infrastructure into a single coherent system in Notion. Phase 1 confirms the exact shape — based on what we've already discussed, the core looks like this.
                </>
              }
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PHASE2_MODULES.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="group bg-card rounded-3xl p-6 md:p-7 shadow-[var(--shadow-soft)] border border-border/50 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.10)] transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="font-sans text-[11px] font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0"
                      style={{ background: "#FF620015", color: "#FF6200" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif-pro italic text-[18px] font-semibold leading-tight text-foreground">
                      {m.title}
                    </h3>
                  </div>
                  <p className="font-sans text-[13.5px] text-muted-foreground leading-[1.65]">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 04 Voyage Records ============== */}
        <section className="px-5 sm:px-8 py-20 md:py-28 bg-primary text-primary-foreground relative">

          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="mb-10 md:mb-14 max-w-3xl">
              <div className="flex items-center gap-3 mb-4 text-primary-foreground/60">
                <span className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: "#FF6200" }}>04</span>
                <span className="h-px flex-1 bg-primary-foreground/15" />
                <span className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase">Voyage Records</span>
              </div>
              <h2 className="font-serif-pro text-3xl sm:text-4xl md:text-5xl italic font-semibold leading-[1.1] tracking-tight">
                Safety, RYA, and the active claim.
              </h2>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-primary-foreground/5 backdrop-blur rounded-3xl p-7 md:p-10 border border-primary-foreground/10"
            >
              <div className="flex items-center gap-3 mb-5" style={{ color: "#FF6200" }}>
                <Shield className="w-5 h-5" />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em]">A paper trail that runs itself</span>
              </div>
              <div className="space-y-5 font-sans text-[15px] md:text-[16px] leading-[1.75] text-primary-foreground/85">
                <p>
                  Voyage Records is in the Foundation build for an operational reason — it removes the paperwork chase from a person and puts it on the system. It's also worth flagging for a second reason.
                </p>
                <p>
                  You have an active solicitor claim from the June 2025 on-water injury. Your insurer thinks it's probably nothing. <em>Probably nothing</em> isn't the same as having a timestamped record showing that pre-sail checks were completed, crew were briefed, and a skipper signed off. A Voyage Records database gives you that paper trail automatically, from the day the system goes live.
                </p>
                <p className="font-serif-pro italic text-xl md:text-2xl text-primary-foreground pt-2">
                  For a commercial sailing operator, this isn't a nice-to-have. It's due diligence with a system behind it.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============== 05 Ongoing ============== */}
        <section className="px-5 sm:px-8 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              num="05"
              eyebrow="Ongoing support"
              title={<>One block a month. More capable, not more reliant.</>}
              intro={
                <>
                  <strong className="text-foreground">£400/month.</strong> One half-day per month. Coaching, iteration, troubleshooting, and building on what's working. The aim is that you get progressively more capable and more independent over time — not more reliant on me.
                </>
              }
            />

            <motion.div
              {...fadeUp}
              className="bg-card rounded-3xl p-7 md:p-10 shadow-[var(--shadow-soft)] border border-border/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <Repeat className="w-5 h-5" />
                </div>
                <h3 className="font-serif-pro italic text-xl font-semibold">Where the monthly block can take you</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-4">
                {ONGOING_USES.map((u, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14.5px] text-foreground leading-[1.6]">
                    <Sparkles className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ============== 06 Stack ============== */}
        <section className="px-5 sm:px-8 py-20 md:py-28 bg-muted/40">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              num="06"
              eyebrow="The tech stack"
              title={<>What stays, what goes, what changes.</>}
              intro={
                <>
                  The net of these moves is a conservative <strong className="text-foreground">~£500/year saving</strong> on tooling in Year 1 — more if the Squarespace plan correction lands.
                </>
              }
            />

            <div className="grid md:grid-cols-2 gap-4 md:gap-5">
              {STACK_ROWS.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-background rounded-2xl p-6 border border-border/50 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-serif-pro italic text-[17px] font-semibold text-foreground">{r.tool}</h3>
                    <span
                      className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        background: r.status.startsWith("Replace") ? "#FF620015" : r.status.startsWith("Keep") ? "hsl(var(--accent) / 0.12)" : "hsl(var(--muted))",
                        color: r.status.startsWith("Replace") ? "#FF6200" : "hsl(var(--accent))",
                      }}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="font-sans text-[13.5px] text-muted-foreground leading-[1.65]">{r.notes}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== 07 Investment ============== */}
        <section className="px-5 sm:px-8 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              num="07"
              eyebrow="The investment"
              title={<>Cash flow that lands where it can.</>}
              intro={
                <>
                  Pricing is staged so the cash flow lands where it can. There's no 50% upfront on the build — payments are spread across the months the work happens in.
                </>
              }
            />

            <div className="grid gap-3 mb-8">
              {INVESTMENT_ROWS.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="bg-card rounded-2xl p-5 sm:p-6 border border-border/50 shadow-[var(--shadow-soft)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <h3 className="font-serif-pro italic text-[17px] font-semibold text-foreground">{row.title}</h3>
                    <p className="font-sans text-[12.5px] text-muted-foreground mt-0.5">{row.when}</p>
                  </div>
                  <div className="font-sans text-2xl font-bold text-foreground">{row.amount}</div>
                </motion.div>
              ))}

              <motion.div
                {...fadeUp}
                className="rounded-2xl p-6 bg-primary text-primary-foreground flex items-center justify-between gap-4"
              >
                <div className="font-sans text-sm font-semibold tracking-wide uppercase text-primary-foreground/70">
                  Total initial engagement
                </div>
                <div className="font-sans text-2xl md:text-3xl font-bold" style={{ color: "#FF6200" }}>£4,400</div>
              </motion.div>
            </div>

            <motion.blockquote
              {...fadeUp}
              className="border-l-[3px] border-accent pl-6 my-12 md:my-16 max-w-3xl"
            >
              <p className="font-serif-pro text-2xl md:text-3xl italic leading-[1.4] text-foreground">
                "The system has to be built to survive without any one person at the helm. That's the brief underneath the brief — and it's what every part of this proposal is shaped around."
              </p>
            </motion.blockquote>

            <div className="grid md:grid-cols-2 gap-5">
              <motion.div
                {...fadeUp}
                className="bg-card rounded-3xl p-7 shadow-[var(--shadow-soft)] border border-border/50"
              >
                <div className="flex items-center gap-3 mb-5 text-accent">
                  <Shield className="w-5 h-5" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em]">Data, safety & ownership</span>
                </div>
                <div className="flex flex-col gap-4">
                  {SECURITY_ROWS.map((row, i) => (
                    <div key={i} className={`text-[13.5px] leading-[1.65] ${i > 0 ? "pt-4 border-t border-border/50" : ""}`}>
                      <div className="font-semibold text-foreground mb-1">{row.title}</div>
                      <div className="text-muted-foreground">{row.detail}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-muted rounded-3xl p-7 border border-border/50"
              >
                <div className="flex items-center gap-3 mb-4 text-accent">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em]">Payment terms</span>
                </div>
                <p className="font-sans text-[14px] text-foreground leading-[1.7]">
                  Invoices are issued in advance of each milestone so you can schedule them. Thread & Stack is not VAT registered — no VAT applies. A 15% late charge applies to any payment not received within 30 days of invoicing.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============== 08 Next steps ============== */}
        <section className="px-5 sm:px-8 py-20 md:py-28 bg-muted/40">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              num="08"
              eyebrow="Next steps"
              title={<>If you'd like to move forward.</>}
            />

            <ol className="grid sm:grid-cols-2 gap-5 mb-10">
              {NEXT_STEPS.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-background rounded-2xl p-6 border border-border/50 shadow-[var(--shadow-soft)] flex gap-4"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 text-accent font-sans text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[14.5px] text-foreground leading-[1.6] pt-1.5">{step}</span>
                </motion.li>
              ))}
            </ol>

            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
              <p className="font-sans text-[14px] text-muted-foreground leading-relaxed mb-8">
                Anything in here that doesn't match what you had in mind, just say — easy to adjust before we book Phase 1. The aim is a system that fits the way LSS actually runs, not the way a brief assumes it does.
              </p>
              <PillButton size="lg" icon={Anchor} asChild>
                <a href="mailto:br@brendanrodgers.uk?subject=LSS%20Proposal%20—%20let's%20book%20Phase%201">
                  Reply to book Phase 1
                </a>
              </PillButton>
            </motion.div>
          </div>
        </section>

        {/* ============== Footer ============== */}
        <footer className="px-5 sm:px-8 py-12 border-t border-border">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="font-sans text-[13px] text-muted-foreground leading-[1.6]">
              Brendan Rodgers ·{" "}
              <a href="https://threadandstack.com/" className="text-accent hover:underline">
                threadandstack.com
              </a>
              <div className="mt-1 text-[11px] text-muted-foreground/60">Prepared for London School of Sailing · May 2026</div>
            </div>
            <img src={GreyStacked} alt="Thread & Stack" className="h-8 opacity-50 flex-shrink-0" />
          </div>
        </footer>
      </motion.main>
    </>
  );
};

export default LSSProposalPage;
