import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Download, Anchor, X } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { Emphasis } from "@/components/Emphasis";
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import LssLogoWhite from "@/assets/proposal/lss-logo-white.webp";
import BrSignature from "@/assets/proposal/br-signature.png";

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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="self-center flex items-center gap-10 sm:gap-14 md:gap-20 mt-16 sm:mt-20 md:mt-24 mb-12 sm:mb-16"
        >
          <img src={WhiteStacked} alt="Thread & Stack" className="h-20 sm:h-24 md:h-28 w-auto" />
          <X aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground/30" strokeWidth={1} />
          <img src={LssLogoWhite} alt="London School of Sailing" className="h-20 sm:h-24 md:h-28 w-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="self-center font-sans text-[11px] sm:text-[12px] tracking-[0.28em] uppercase text-primary-foreground/55 mb-10 sm:mb-12"
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
          A vision for LSS.
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
              This proposal is not a pitch. It's a <strong>vision document</strong>. This is my way of showing
              you, clearly and honestly, what we can do together for LSS.
            </p>

            <p>
              There is a lot of love, hope, sweat and determination in your business. I was very touched by how
              our meeting in Peter's shed took place. Not only did you share with me some sensitive context, but
              it reminded me that you, and your new family are part of my own story. So I'm going to start us off
              from a different footing than we left on:
            </p>

            <p>
              My intention is to help LSS reach a place of <strong>stable, systematised operational strength</strong>{" "}
              - that is tailored to you, and LSS's needs. This system will hold steady no matter how many new team
              members, new customers, or new friends arrive to join the LSS's own voyage.
            </p>

            <ul className="space-y-2 my-2 ml-0 pl-0 list-none">
              <li className="flex items-start gap-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary-foreground/40 flex-shrink-0" />
                <span>
                  I'm reducing all my rates by <strong>20% for you, permanently</strong>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary-foreground/40 flex-shrink-0" />
                <span>
                  I'm also going to propose a few options, with a <strong>flexible project framework</strong>{" "}
                  within this vision doc.
                </span>
              </li>
            </ul>

            <p>
              Putting it bluntly, we can also keep talking it through until it works for you. Price would be a
              daft reason to find myself not helping you. I'm a friend in your camp already, and I'd rather get
              you kitted out, the way I know you should be.
            </p>

            <p>So give this a read (probably best to grab a cup of tea or a beer),</p>

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
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-sans text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-10"
            >
              Confidential <span className="text-muted-foreground/40 mx-2">·</span> Proposal{" "}
              <span className="text-muted-foreground/40 mx-2">·</span> May 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="font-serif-pro text-[40px] sm:text-5xl md:text-6xl italic font-semibold leading-[1.05] tracking-tight text-foreground text-balance mb-8"
            >
              A{" "}
              <span className="inline-block relative text-accent" style={{ transform: "translateY(1px)" }}>
                vision
                <Emphasis className="absolute -bottom-2 left-0 right-0" delay={900} animate={true} />
              </span>{" "}
              for the London School of Sailing.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="font-sans text-[15px] text-muted-foreground tracking-wide"
            >
              Prepared for Ruaraidh Plummer · By Brendan Rodgers, Thread &amp; Stack
            </motion.p>
          </div>
        </header>

        {/* ============== BODY ============== */}
        <article className="px-5 sm:px-8 pb-24">
          <div className="max-w-2xl mx-auto">
            {/* 01 — Outgrown the tool-sprawl stage */}
            <section>
              <SectionHead
                num="01"
                eyebrow="Where LSS is now"
                rotate={-0.4}
                title={<>LSS has outgrown the <Hl>tool-sprawl</Hl> stage.</>}
              />
              <P>
                LSS is now scaling at a pace where the systems that got you here will quietly start to cost you
                more than they're worth. What you need now is operational strength that scales with the team, the
                customer base, and the ambition behind the business.
              </P>
              <P>What you're really buying is:</P>
              <BulletList
                items={[
                  <><strong>Less reactive comms</strong> (email, WhatsApp, phone) landing on you personally.</>,
                  <><strong>Centralised knowledge</strong> — LSS team and collaborators can find answers, faster.</>,
                  <><strong>Clear accountability</strong> across the team — who owns what, what's next, what's overdue.</>,
                  <><strong>Repeatable customer delivery</strong> (pre-voyage → on-voyage → post-voyage).</>,
                  <><strong>A founder setup that stops you being the bottleneck.</strong></>,
                ]}
              />
            </section>

            <Rule />

            {/* 02 — Voyage Tracking */}
            <section>
              <SectionHead
                num="02"
                eyebrow="Systems that build safety"
                rotate={0.3}
                title={<>Voyage <Hl shift={-1}>Tracking.</Hl></>}
              />
              <P>
                As I reviewed our notes, something we didn't discuss became obvious — we should build a live
                Voyage Tracking system. It gives you:
              </P>
              <BulletList
                items={[
                  <><strong>Safety and compliance, systematised</strong> — crew details, requirements, sign-offs, incident notes, all in one place.</>,
                  <><strong>Clarity of responsibility</strong> — who checked what, when, and who signed it off.</>,
                  <><strong>A stronger paper trail</strong> for a commercial sailing operation, in a world that increasingly rewards businesses that can show their working.</>,
                ]}
              />
              <P>
                And crucially: built in a way that utilises offline tools, so that intermittent signal on a boat
                becomes less of an issue. When you next find signal, the system updates and resumes. From the
                boat, in the harbour, mid-Solent, wherever the work actually happens.
              </P>
              <PullQuote>
                This shouldn't feel heavy. It should feel like: <em>we run a tight ship, and the system proves it.</em>
              </PullQuote>
            </section>

            <Rule />

            {/* 03 — Operational continuity */}
            <section>
              <SectionHead
                num="03"
                eyebrow="The brief underneath the brief"
                rotate={-0.3}
                title={<>Operational <Hl>continuity.</Hl></>}
              />
              <P>This is not about any one team member, but about designing LSS its own OS. We want to enable:</P>
              <BulletList
                items={[
                  <>You can add staff without adding chaos.</>,
                  <>Contractors and skippers can be onboarded without you reinventing the wheel each time.</>,
                  <>The business doesn't slow down because information is stuck in one person's inbox, memory, or WhatsApp thread.</>,
                ]}
              />
              <PullQuote>
                Continuity is what lets LSS grow without it costing you the life you want outside the business.
              </PullQuote>
            </section>

            <Rule />

            {/* 04 — Four windows of work */}
            <section>
              <SectionHead
                num="04"
                eyebrow="The shape of the work"
                rotate={0.4}
                title={<>Four windows of <Hl shift={-1}>work.</Hl></>}
              />

              <H3>1) Communications triage</H3>
              <P>
                Right now, too much lands on you personally. WhatsApp, email, phone — all the same inbox in
                practice. The goal here isn't to depersonalise LSS. It's to give the business an{" "}
                <em>intentional front door</em>.
              </P>
              <P><strong>What changes:</strong></P>
              <BulletList
                items={[
                  <>Clear routing for enquiries — what gets answered, what gets escalated, what gets scheduled.</>,
                  <>A practical system for managing WhatsApp + email volume without losing the personal touch you're known for.</>,
                  <>A way to handle the high-frequency, repeatable questions so they stop interrupting deep work.</>,
                ]}
              />
              <P>
                <strong>Outcome:</strong> fewer interruptions, faster replies, less mental load — and a customer
                experience that feels <em>more</em> attentive, not less.
              </P>

              <H3>2) LSS OS — a Notion operating system for the business</H3>
              <P>This is the core build: a single, calm source of truth that the business runs on.</P>
              <P><strong>Bundled inside LSS OS:</strong></P>
              <BulletList
                items={[
                  <><strong>CRM migration</strong> (replacing Monday as the system of record).</>,
                  <><strong>Customer journey automation</strong> — reminders and prompts that stop things slipping.</>,
                  <><strong>Daily ops management</strong> — what's happening this week, what's blocked, what needs attention.</>,
                  <><strong>Email triage inside Notion</strong> — so the inbox stops being the control centre.</>,
                  <><strong>Marketing management (CMS)</strong> — kept lightweight, switched on if and when you want it.</>,
                ]}
              />
              <P>
                <strong>Designed in three layers</strong> so each person sees only what they need:
              </P>
              <BulletList
                items={[
                  <><strong>Founder OS</strong> — your view: priorities, decisions, money in and out, the week ahead.</>,
                  <><strong>Team OS</strong> — Sharon, James, future hires: tasks, customer records, event logistics.</>,
                  <><strong>Customer OS</strong> — the experience your customers feel: clear, consistent, branded touchpoints.</>,
                ]}
              />
              <P>
                <strong>Outcome:</strong> the business becomes easier to <em>steer</em>, not just survive.
              </P>

              <H3>3) Growth automations</H3>
              <P>
                This is where the CRM stops being a messy spreadsheet and becomes a place you genuinely{" "}
                <em>learn</em> from.
              </P>
              <P><strong>Bundled inside Growth Automations:</strong></P>
              <BulletList
                items={[
                  <><strong>Customer journey automations</strong> — sharpened, prompts that drive review collection, upsells and re-engagement.</>,
                  <><strong>CRM Enricher agents</strong> — small, focused AI agents that enrich customer records: repeat patterns, lifetime value, segments, context you'd never have time to add manually.</>,
                  <><strong>Decision visibility</strong> — what's converting, what's not, what's worth repeating, what's worth dropping.</>,
                ]}
              />
              <P>
                <strong>Outcome:</strong> better decisions, faster, with less guesswork — and a CRM you actually
                want to open.
              </P>

              <H3>4) Customer onboarding</H3>
              <P>This is the repeatable delivery layer — the experience customers and skippers feel.</P>
              <P><strong>Bundled inside Customer Onboarding:</strong></P>
              <BulletList
                items={[
                  <><strong>Customer-facing page management system</strong> — joining instructions, what to bring, expectations, FAQs, all live and up to date.</>,
                  <><strong>Pre-voyage comms framework</strong> that runs consistently every time, without you chasing.</>,
                  <><strong>Repeatable guidance framework</strong> so customers arrive informed and confident.</>,
                  <><strong>Skipper packs</strong> per voyage so contractors have everything they need without messaging you.</>,
                ]}
              />
              <P>
                <strong>Outcome:</strong> smoother voyages, fewer "where is that info?" messages, more trust per
                touchpoint.
              </P>
            </section>

            <Rule />

            {/* 05 — How it works */}
            <section>
              <SectionHead
                num="05"
                eyebrow="How it works"
                rotate={-0.3}
                title={<>Tools and tasks, without <Hl>overwhelm.</Hl></>}
              />

              <H3>What I do</H3>
              <BulletList
                items={[
                  <>Design the system architecture (databases, dashboards, permissions, templates).</>,
                  <>Build the workflows, automations, and CRM Enricher agents.</>,
                  <>Migrate and structure the data that matters.</>,
                  <>Set you and the team up to actually <em>use</em> it day to day — not just admire it.</>,
                ]}
              />

              <H3>What you do</H3>
              <BulletList
                items={[
                  <>Give access to current systems (Monday, Drive, Squarespace, etc.).</>,
                  <>Walk me through how things really run — not how they "should".</>,
                  <>Make a few key decisions when options branch.</>,
                ]}
              />

              <H3>What you get</H3>
              <BulletList
                items={[
                  <>A working LSS OS that reduces comms load, strengthens delivery, and supports growth.</>,
                  <>Voyage Tracking that systematises safety and accountability.</>,
                  <>A system that can scale with new people and new volume.</>,
                ]}
              />
            </section>

            <Rule />

            {/* 06 — Relationship rate */}
            <section>
              <SectionHead
                num="06"
                eyebrow="Family-first, permanently"
                rotate={0.3}
                title={<>Relationship <Hl shift={-1}>rate.</Hl></>}
              />
              <P>My standard rate is £500 per half-day.</P>
              <PullQuote>Your rate is £400 per half-day. Permanently.</PullQuote>
              <P>
                This isn't a discount. It's a deliberate, structural decision about the kind of relationship I
                want this to be.
              </P>
              <P>
                If I hadn't been close friends with Mike at primary school, Joey and Anna might never have met.
                The Thomsons — and now the Plummers — sit on a very short inner-circle list. That's not a
                sentimental footnote. It changes how I'll show up, how I prioritise, and how flexibly I work with
                you.
              </P>
              <P>
                On top of the £400 rate, we'll layer <strong>flexible arrangements</strong> so price never
                becomes a deterrent to doing the right thing:
              </P>
              <BulletList
                items={[
                  <>Phasing payments around your cash flow rhythms (Fastnet years, busy season, lumpy invoices).</>,
                  <>Splitting larger pieces of work across months when it helps.</>,
                  <>Quietly absorbing the small stuff (a quick call, a fix, a "can you take a look?") inside the ongoing relationship rather than nickel-and-diming you for it.</>,
                ]}
              />
              <P>
                <strong>My honest position:</strong> I do not think you should do this work with anyone else. The
                mix of context, care, continuity, and inner-circle priority you'll get here isn't something a
                stranger can replicate, no matter how good their build deck looks.
              </P>
            </section>

            <Rule />

            {/* 07 — The journey */}
            <section>
              <SectionHead
                num="07"
                eyebrow="The journey"
                rotate={-0.4}
                title={<>Three stages, <Hl>shaped</Hl> around you.</>}
              />

              <H3>1) Audit &amp; Workshop — an in-person day with you</H3>
              <P>A full day in person to map:</P>
              <BulletList
                items={[
                  <>How the business runs today (tools, handoffs, bottlenecks).</>,
                  <>What "operational continuity" actually needs to look like for LSS specifically.</>,
                  <>What the first version of LSS OS needs to contain — and, just as importantly, what it doesn't.</>,
                ]}
              />
              <P>
                <strong>Output:</strong> a shared plan you can see, agree, and trust before the build begins.
              </P>

              <H3>2) LSS OS Build</H3>
              <P>Build and implement:</P>
              <BulletList
                items={[
                  <>The operating system (CRM, dashboards, customer journey prompts, inbox triage, Founder / Team / Customer OS layers).</>,
                  <>Voyage Tracking (safety, sign-offs, clarity of responsibility).</>,
                  <>Customer-facing onboarding pages + skipper packs.</>,
                  <>The first wave of growth automations and CRM Enricher agents.</>,
                ]}
              />
              <P>
                <strong>Output:</strong> a system your week can actually run on.
              </P>

              <H3>3) Ongoing — 3+ months of monthly support</H3>
              <P>One half-day per month to iterate, tighten, and build on what's working.</P>
              <P><strong>Included every month:</strong></P>
              <BulletList
                items={[
                  <><strong>Asynchronous access</strong> to me all month, with a 48-hour response time.</>,
                  <><strong>One dedicated working session</strong> focused on whatever matters most that month.</>,
                ]}
              />
              <P>
                If you ever want to move faster, we can scale up by adding more dedicated sessions in a given
                month — a genuinely cost-efficient way to get ambitious things done together without committing
                to a full new project each time.
              </P>
            </section>

            <Rule />

            {/* 08 — Next steps / CTA */}
            <section className="text-center">
              <motion.div {...fadeUp}>
                <div className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-accent mb-5">
                  Next
                </div>
                <h2 className="font-serif-pro text-[32px] sm:text-4xl md:text-[44px] italic font-semibold leading-[1.1] tracking-tight text-foreground text-balance mb-8">
                  If this feels right, let's begin.
                </h2>
                <p className="font-sans text-[16px] text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
                  Anything in here that doesn't match what you had in mind, just say — easy to adjust before we
                  book the Audit &amp; Workshop day. The aim is a system that fits the way LSS actually runs, not
                  the way a brief assumes it does.
                </p>
                <PillButton size="lg" icon={Anchor} asChild>
                  <a href="mailto:br@brendanrodgers.uk?subject=LSS%20Proposal%20—%20next%20steps">
                    Reply to begin
                  </a>
                </PillButton>
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
