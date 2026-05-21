import { useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";

const CheckIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8">
    <polyline points="1.5,4 3,5.5 6.5,2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5L2 4v4c0 3.31 2.47 6.41 6 7.16C11.53 14.41 14 11.31 14 8V4L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="4" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1 8h16" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SectionLabel = ({ num, title }: { num: string; title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="font-sans text-[13px] font-bold tracking-wider text-accent">{num}</span>
    <span className="font-serif-pro text-[30px] italic font-semibold text-primary">{title}</span>
  </div>
);

const Caveat = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#FFFBEA] border-l-[3px] border-[#E5A800] rounded-r-[10px] p-3.5 px-[18px] mt-4 ${className}`}>
    <p className="text-[13.5px] text-[#5a4500] m-0 leading-[1.65]">{children}</p>
  </div>
);

const PHASE1_ITEMS = [
  "A focused half-day with you in person — walking your current stack together (Monday boards, Google Drive, Squarespace, the tools around them).",
  "A short conversation with Sharon where possible, so her workflow is captured before it gets systematised.",
  "A written scope document for the Foundation build that you can read, mark up, and approve before anything gets built.",
];

const PHASE2_MODULES = [
  {
    title: "CRM — replacing Monday entirely",
    desc: "Contacts, enquiries, and bookings in a single pipeline. Clear stages, visible follow-ups, nothing falling through the gaps.",
  },
  {
    title: "Customer journey automations",
    desc: "Booking reminders, final payment prompts at 6–8 weeks, joining instructions 1–2 weeks before the event, post-event review and upsell. The things that currently sit on your shoulders, running on their own.",
  },
  {
    title: "Voyage Records",
    desc: "Per-trip crew manifest, dietary requirements and allergies (GDPR-handled), next of kin, RYA qualification, pre-sail checklist, skipper sign-off, post-sail incident log. A safety-critical record that runs whether anyone remembers to chase it or not.",
  },
  {
    title: "Daily operations dashboard",
    desc: "One view when you wake up: upcoming events, unresponded enquiries, overdue tasks, outstanding payments, skipper assignments. A clear task list for Sharon. James's event schedule and boat logistics in one place.",
  },
  {
    title: "Notion Mail for email triage",
    desc: "Gmail inbox managed from inside the system. Client comms surfaced, junk filtered, and Sharon working from a structured inbox view rather than waiting on a forward from you.",
  },
  {
    title: "Guest pages for joining instructions",
    desc: "Clean, templated pages replacing the current Monday public links. No login required for clients. Skipper packs accessible to contractors without needing a paid seat.",
  },
  {
    title: "Two onboarding sessions",
    desc: "You and Sharon (or whoever is available) working in the system comfortably before handover. Recorded for James and anyone who joins later.",
  },
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

const LSSProposalPage = () => {
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

  const handleDownload = () => window.print();

  return (
    <div className="min-h-screen bg-muted/50 flex justify-center items-start py-10 px-5 print:bg-white print:p-0">
      <div className="fixed top-5 right-5 z-50 print:hidden">
        <Button onClick={handleDownload} size="sm" className="gap-2 rounded-lg shadow-lg">
          <Download className="w-3.5 h-3.5" />
          Download PDF
        </Button>
      </div>

      <div className="bg-background w-full max-w-[780px] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden print:shadow-none print:rounded-none print:max-w-full">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-14 pt-[52px] pb-11 max-sm:px-7 max-sm:pt-9 max-sm:pb-8">
          <div className="flex items-center gap-3 mb-6">
            <img src={WhiteStacked} alt="Thread & Stack" className="h-8" />
            <span className="text-primary-foreground/40">·</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-[#FF6200]">Project Proposal</span>
          </div>
          <h1 className="font-serif-pro text-[52px] max-sm:text-[40px] italic font-bold leading-[1.15] text-primary-foreground mb-5">
            One system that holds{" "}
            <span className="text-[#FF6200]">LSS</span>{" "}
            together.
          </h1>
          <p className="font-sans text-[15px] text-primary-foreground/70 leading-relaxed max-w-[560px]">
            An operational backbone for the school — CRM, customer journey, Voyage Records, daily ops — built so the business runs cleanly through the season and doesn't depend on any one person being at full capacity.
          </p>
          <div className="mt-6 font-sans text-[12px] text-primary-foreground/40 leading-[1.8]">
            Prepared for: Ruaraidh Plummer, London School of Sailing · May 2026 · Ref: LSS Foundation
          </div>
        </div>

        {/* Body */}
        <div className="px-14 pt-[52px] pb-14 max-sm:px-7 max-sm:pt-9 max-sm:pb-9">

          {/* 01 — What this is */}
          <SectionLabel num="01" title="What we're solving" />
          <div className="bg-muted rounded-2xl p-7 mb-4">
            <p className="text-[15px] leading-[1.7] text-foreground">
              You're running the same client volume today as the school did in a full year five years ago, on a tool stack that's fragmented, expensive, and slower than the work demands. The communication load — 300–400 WhatsApp notifications a day, an inbox that fights you — is the surface. Underneath it, Monday is failing as the system of record and the everyday machinery of bookings, joining instructions, and crew manifests is held together by you and Sharon personally.
            </p>
            <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
              The brief is to build LSS an operational system that runs cleanly through the season — and that keeps running on days when Sharon can give four hours, on days when she can't give any, and on days when you're on the water and not at a screen.
            </p>
          </div>

          <div className="h-px bg-border my-10" />

          {/* 02 — Phase 1 */}
          <SectionLabel num="02" title="Phase 1 — In-person mapping session" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            <strong>1 block · £400 · invoiced on booking.</strong> Before anything gets built, we sit down together and walk the real stack.
          </p>
          <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mb-4">
            <h4 className="font-serif-pro text-[17px] italic font-semibold text-primary mb-3">What this gives you</h4>
            <div className="flex flex-col gap-2">
              {PHASE1_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13.5px] text-foreground leading-[1.55]">
                  <div className="w-4 h-4 rounded-full bg-accent/10 border-[1.5px] border-accent flex items-center justify-center flex-shrink-0 mt-px text-accent">
                    <CheckIcon />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <Caveat>
            <strong>Why this matters:</strong> Phase 1 is the gate. The Foundation build doesn't start until you've seen and agreed exactly what it contains. No surprise scope, no surprise invoice.
          </Caveat>

          <div className="h-px bg-border my-10" />

          {/* 03 — Phase 2 */}
          <SectionLabel num="03" title="Phase 2 — Foundation build" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-2">
            <strong>~10 blocks · £4,000 · paid in two halves.</strong> The transfer of LSS's operational infrastructure into a single coherent system in Notion. Phase 1 confirms the exact shape — based on what we've already discussed, the core looks like this:
          </p>

          <div className="flex flex-col gap-3 mt-5">
            {PHASE2_MODULES.map((m, i) => (
              <div key={i} className="bg-card rounded-2xl px-5 py-[18px] shadow-[var(--shadow-soft)] border border-border">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="font-sans text-[11px] font-bold text-[#FF6200] bg-[#FF6200]/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-serif-pro text-[17px] italic font-semibold text-primary leading-tight">{m.title}</h4>
                </div>
                <p className="text-[13.5px] text-muted-foreground leading-[1.6] m-0 pl-9">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="h-px bg-border my-10" />

          {/* 04 — Voyage Records */}
          <SectionLabel num="04" title="A word on Voyage Records" />
          <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mb-4">
            <div className="flex items-center gap-2 mb-3 text-accent">
              <ShieldIcon />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent">Safety, RYA, and the active claim</span>
            </div>
            <p className="text-[14px] text-foreground leading-[1.7] mb-2.5">
              Voyage Records is in the Foundation build for an operational reason — it removes the paperwork chase from a person and puts it on the system. It's also worth flagging for a second reason.
            </p>
            <p className="text-[14px] text-foreground leading-[1.7] mb-2.5">
              You have an active solicitor claim from the June 2025 on-water injury. Your insurer thinks it's probably nothing. <em>Probably nothing</em> isn't the same as having a timestamped record showing that pre-sail checks were completed, crew were briefed, and a skipper signed off. A Voyage Records database gives you that paper trail automatically, from the day the system goes live.
            </p>
            <p className="text-[14px] text-foreground leading-[1.7] m-0">
              For a commercial sailing operator, this isn't a nice-to-have. It's due diligence with a system behind it.
            </p>
          </div>

          <div className="h-px bg-border my-10" />

          {/* 05 — Ongoing */}
          <SectionLabel num="05" title="Ongoing — monthly support block" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            <strong>1 block · £400/month.</strong> One half-day per month. Coaching, iteration, troubleshooting, and building on what's working. The aim is that you get progressively more capable and more independent over time — not more reliant on me.
          </p>
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            This is also the natural place for the next chapter once the foundation is bedded in. Things we've talked about that the monthly block can build toward, when you're ready:
          </p>
          <ul className="flex flex-col gap-2.5 mt-2 mb-2">
            {ONGOING_USES.map((u, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-foreground leading-[1.6]">
                <span className="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span>{u}</span>
              </li>
            ))}
          </ul>

          <div className="h-px bg-border my-10" />

          {/* 06 — Tech stack */}
          <SectionLabel num="06" title="The tech stack — recommended" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            What stays, what goes, and what changes. The net of these moves is a conservative <strong>~£500/year saving</strong> on tooling in Year 1 — more if the Squarespace plan correction lands.
          </p>
          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] mt-2 border border-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-4 py-3 text-left">Tool</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-4 py-3 text-left">Status</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-4 py-3 text-left max-sm:hidden">Notes</th>
                </tr>
              </thead>
              <tbody>
                {STACK_ROWS.map((r, i) => (
                  <tr key={i} className={`${i % 2 === 0 ? "bg-muted" : "bg-card"} border-t border-border`}>
                    <td className="px-4 py-3 align-top">
                      <span className="font-serif-pro italic text-[14.5px] font-semibold text-primary">{r.tool}</span>
                    </td>
                    <td className="px-4 py-3 align-top text-[13px] text-foreground">{r.status}</td>
                    <td className="px-4 py-3 text-[12.5px] text-muted-foreground align-top leading-[1.55] max-sm:hidden">{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="h-px bg-border my-10" />

          {/* 07 — Investment */}
          <SectionLabel num="07" title="The investment" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            Pricing is staged so the cash flow lands where it can. There's no 50% upfront on the build — payments are spread across the months the work happens in.
          </p>

          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] mt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left">Milestone</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left max-sm:hidden">When</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-muted">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Phase 1 — Mapping session</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground align-top max-sm:hidden">Invoiced on booking</td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£400</span>
                  </td>
                </tr>
                <tr className="bg-card border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Phase 2 — Foundation build (1/2)</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground align-top max-sm:hidden">End of month one</td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£2,000</span>
                  </td>
                </tr>
                <tr className="bg-muted border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Phase 2 — Foundation build (2/2)</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground align-top max-sm:hidden">End of month two</td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£2,000</span>
                  </td>
                </tr>
                <tr className="bg-card border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Ongoing — monthly support</span>
                    <div className="text-xs text-muted-foreground mt-0.5">Begins after handover, cancel anytime</div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground align-top max-sm:hidden">Per month</td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£400</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-primary text-primary-foreground">
                  <td colSpan={2} className="font-sans text-[15px] font-bold px-5 py-4 max-sm:hidden">Total initial engagement</td>
                  <td className="font-sans text-[15px] font-bold px-5 py-4 sm:hidden">Total</td>
                  <td className="font-sans text-[15px] font-bold px-5 py-4 text-right">£4,400</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="border-l-[3px] border-accent pl-5 my-8">
            <p className="font-serif-pro text-xl italic leading-[1.55] text-primary">
              "The system has to be built to survive without any one person at the helm. That's the brief underneath the brief — and it's what every part of this proposal is shaped around."
            </p>
          </div>

          {/* Security */}
          <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mb-4">
            <div className="flex items-center gap-2 mb-3 text-accent">
              <ShieldIcon />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent">Data, safety, and ownership</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {SECURITY_ROWS.map((row, i) => (
                <div key={i} className={`grid grid-cols-[160px_1fr] max-sm:grid-cols-1 gap-3 max-sm:gap-1 text-[13px] leading-[1.6] ${i > 0 ? "pt-2.5 border-t border-border" : ""}`}>
                  <div className="font-semibold text-primary">{row.title}</div>
                  <div className="text-muted-foreground">{row.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment terms */}
          <div className="bg-muted rounded-2xl p-[18px] px-5 mt-4">
            <div className="flex gap-3.5 items-start text-accent">
              <div className="flex-shrink-0 mt-0.5"><CardIcon /></div>
              <div className="flex-1">
                <div className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent mb-1.5">Payment terms</div>
                <div className="font-sans text-[13.5px] text-foreground leading-[1.65]">
                  Invoices are issued in advance of each milestone so you can schedule them. Thread & Stack is not VAT registered — no VAT applies. A 15% late charge applies to any payment not received within 30 days of invoicing.
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border my-10" />

          {/* Next steps */}
          <SectionLabel num="08" title="If you'd like to move forward" />
          <ul className="flex flex-col gap-4 mt-2">
            {NEXT_STEPS.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent font-sans text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[14.5px] text-foreground leading-[1.6] pt-0.5">{step}</span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-muted-foreground leading-relaxed mt-5">
            Anything in here that doesn't match what you had in mind, just say — easy to adjust before we book Phase 1. The aim is a system that fits the way LSS actually runs, not the way a brief assumes it does.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-14 py-7 flex items-center justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:px-7">
          <p className="text-[13.5px] text-muted-foreground leading-[1.55] max-w-[380px]">
            Brendan Rodgers · <a href="https://threadandstack.com/" className="text-accent hover:underline">threadandstack.com</a>
          </p>
          <img src={GreyStacked} alt="Thread & Stack" className="h-8 opacity-50 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default LSSProposalPage;
