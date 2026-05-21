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

const OUTCOMES = [
  "Narrative stays consistent across ads, landing, email, socials, and product touchpoints — no quiet drift into generic wellness-speak.",
  "Creative iteration moves faster because the 'why' is anchored — performance data sharpens the message instead of fragmenting it.",
  "Decisions get simpler. The framework holds under pressure when the launch window starts surfacing new questions weekly.",
];

const SCOPE_MODULES = [
  {
    title: "Strategic maintenance + iteration",
    desc: "Weekly review of what's shipping and what's landing. Message refinement off the back of ad performance signals. Guardrails so the tone stays true — especially across the 16+ and 19+ feedback weighting where it's easiest to drift.",
  },
  {
    title: "Channel translation",
    desc: "The framework, converted into the things teams actually ship: ad hooks and angles, the narrative spine of the landing page, and organic content themes that ladder back to the core story rather than chasing trends.",
  },
  {
    title: "Light project adjacency",
    desc: "Drop-in support for the other BfB comms work that touches the brand narrative — within agreed capacity. The aim is one strategic head across the surface, not three disconnected vendors all interpreting the brand differently.",
  },
];

const CADENCE_A = [
  "1 day per week",
  "One weekly working session + async review in between",
  "Best fit if the campaign is steady and you want a senior brain on call",
];

const CADENCE_B = [
  "2 days per week for 4–6 weeks across the launch window",
  "Then steps down to Option A maintenance cadence",
  "Best fit if early-March is the make-or-break moment and you want more shoulder behind it",
];

const NEEDS = [
  "Access to performance signals — topline is fine, no full data warehouse required.",
  "A shared place for drafts and feedback (Notion, Google Drive, Figma — whatever you're already in).",
  "One named owner on your side for quick approvals, so iteration doesn't get stuck in committee.",
];

const NEXT_STEPS = [
  "Reply to confirm the shape works and pick a starting cadence (A or B). Easy to switch between them as the launch evolves.",
  "Share read-access to the campaign performance view and the current narrative working docs.",
  "Confirm the named approver on your side, and whether Lauren and Malcolm should be in the thread from day one.",
  "We book a 30-minute kickoff in week one to set the working rhythm — then we're moving.",
];

const SECURITY_ROWS = [
  { title: "Continuity of work", detail: "Everything I produce lives in your shared workspace, not mine. Briefs, working docs, message variants — all owned by BfB Labs from the moment they exist." },
  { title: "Sensitive context handling", detail: "Mental health context for 16+ and 19+ audiences is handled with the seriousness it deserves. Nothing gets shipped that I wouldn't be comfortable showing the safeguarding lead in the room." },
  { title: "Confidentiality", detail: "Standard mutual NDA on request. Case study use (if and when it comes up) is opt-in and reviewed by you before anything goes public." },
  { title: "Exit cleanly", detail: "Engagement is rolling month-to-month after the initial 90 days. 30 days notice either way. No lock-in, no awkward handover — the work walks with you." },
];

const BfBLabsProposalPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Proposal — BfB Labs · Thread & Stack";

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
            <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-[#FF6200]">Fractional Engagement</span>
          </div>
          <h1 className="font-serif-pro text-[52px] max-sm:text-[40px] italic font-bold leading-[1.15] text-primary-foreground mb-5">
            Keep the framework{" "}
            <span className="text-[#FF6200]">intact</span>{" "}
            through launch.
          </h1>
          <p className="font-sans text-[15px] text-primary-foreground/70 leading-relaxed max-w-[560px]">
            Fractional brand + comms strategy for BfB Labs — built around the Phase 3 pilot and the March campaign launch. Strategic maintenance, channel translation, and a senior brain in the room as performance data starts surfacing new questions every week.
          </p>
          <div className="mt-6 font-sans text-[12px] text-primary-foreground/40 leading-[1.8]">
            Prepared for: Manjul, BfB Labs · February 2026 · Ref: BfB Fractional 01
          </div>
        </div>

        {/* Body */}
        <div className="px-14 pt-[52px] pb-14 max-sm:px-7 max-sm:pt-9 max-sm:pb-9">

          {/* 01 — Where we are */}
          <SectionLabel num="01" title="Where we are" />
          <div className="bg-muted rounded-2xl p-7 mb-4">
            <p className="text-[15px] leading-[1.7] text-foreground">
              Phase 2 wrapped on 13 February. The Phase 3 pilot started on 14 February. The campaign launches in early March. The framework is strong, the architecture is in place, and the case study work is running on its own track.
            </p>
            <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
              What happens next is the part where most teams quietly lose ground — not because the strategy was wrong, but because the gap between framework and rollout is where coherence usually leaks out. Ad data lands, opinions multiply, the calendar tightens, and the narrative starts drifting one comms touchpoint at a time.
            </p>
            <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
              This proposal is shaped around keeping that gap closed.
            </p>
          </div>

          <div className="h-px bg-border my-10" />

          {/* 02 — The offer */}
          <SectionLabel num="02" title="The core offer" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-2">
            <strong>Fractional Brand + Comms Strategy.</strong> Ongoing strategic maintenance and iteration support as Phase 3 runs and the campaign goes live. You keep the momentum you've already built. You avoid the "great framework, messy rollout" pattern. You get a senior brain in the room every week as the data and the internal inputs evolve.
          </p>

          <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mt-5">
            <h4 className="font-serif-pro text-[17px] italic font-semibold text-primary mb-3">Outcomes — what actually changes</h4>
            <div className="flex flex-col gap-2.5">
              {OUTCOMES.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13.5px] text-foreground leading-[1.6]">
                  <div className="w-4 h-4 rounded-full bg-accent/10 border-[1.5px] border-accent flex items-center justify-center flex-shrink-0 mt-px text-accent">
                    <CheckIcon />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-border my-10" />

          {/* 03 — Scope */}
          <SectionLabel num="03" title="Scope — initial 90-day period" />
          <div className="flex flex-col gap-3 mt-2">
            {SCOPE_MODULES.map((m, i) => (
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

          <Caveat>
            <strong>The framing:</strong> this isn't another agency seat at the table — it's continuity for the work that's already been done. The strategy already exists; this is the layer that makes sure it survives contact with launch reality.
          </Caveat>

          <div className="h-px bg-border my-10" />

          {/* 04 — Cadence options */}
          <SectionLabel num="04" title="Two cadences — pick the one that fits" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-5">
            Both shapes hold the same scope. The difference is how much shoulder is behind the launch window itself.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Option A */}
            <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-border flex flex-col">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent mb-2">Option A</span>
              <h4 className="font-serif-pro text-[22px] italic font-semibold text-primary leading-tight mb-1">Maintenance</h4>
              <p className="text-[13px] text-muted-foreground mb-4">Light, consistent, steady-state.</p>
              <div className="flex flex-col gap-2 mb-4">
                {CADENCE_A.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[13px] text-foreground leading-[1.55]">
                    <div className="w-4 h-4 rounded-full bg-accent/10 border-[1.5px] border-accent flex items-center justify-center flex-shrink-0 mt-px text-accent">
                      <CheckIcon />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-3 border-t border-border">
                <div className="font-sans text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">From</div>
                <div className="font-serif-pro text-[24px] italic font-semibold text-primary">£2,600 <span className="font-sans not-italic text-[13px] text-muted-foreground font-normal">/ month</span></div>
              </div>
            </div>

            {/* Option B */}
            <div className="bg-card rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-2 ring-accent flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-accent-foreground text-[11px] font-sans font-semibold px-3 py-1 rounded-full whitespace-nowrap">Recommended for launch</span>
              </div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent mb-2">Option B</span>
              <h4 className="font-serif-pro text-[22px] italic font-semibold text-primary leading-tight mb-1">Launch Support</h4>
              <p className="text-[13px] text-muted-foreground mb-4">Heavier through the March window, then steps down.</p>
              <div className="flex flex-col gap-2 mb-4">
                {CADENCE_B.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[13px] text-foreground leading-[1.55]">
                    <div className="w-4 h-4 rounded-full bg-accent/10 border-[1.5px] border-accent flex items-center justify-center flex-shrink-0 mt-px text-accent">
                      <CheckIcon />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-3 border-t border-border">
                <div className="font-sans text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">Launch window</div>
                <div className="font-serif-pro text-[24px] italic font-semibold text-primary">£5,200 <span className="font-sans not-italic text-[13px] text-muted-foreground font-normal">/ month</span></div>
                <div className="text-[12px] text-muted-foreground mt-1">Then £2,600/month from week 7 onward.</div>
              </div>
            </div>
          </div>

          <div className="border-l-[3px] border-accent pl-5 my-10">
            <p className="font-serif-pro text-xl italic leading-[1.55] text-primary">
              "Ad performance data tends to surface new questions quickly — this is where teams either move fast and drift, or move carefully and slow down. The job is to do neither."
            </p>
          </div>

          <div className="h-px bg-border my-10" />

          {/* 05 — What I'd need */}
          <SectionLabel num="05" title="What I'd need from you" />
          <ul className="flex flex-col gap-2.5 mt-2">
            {NEEDS.map((u, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-foreground leading-[1.6]">
                <span className="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span>{u}</span>
              </li>
            ))}
          </ul>

          <div className="h-px bg-border my-10" />

          {/* 06 — Investment */}
          <SectionLabel num="06" title="The investment" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            Invoiced monthly in advance. Rolling 90-day commitment to start, then month-to-month with 30 days notice either way.
          </p>

          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] mt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left">Engagement</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left max-sm:hidden">Cadence</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-right">Monthly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-muted">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Option A — Maintenance</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground align-top max-sm:hidden">1 day / week</td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£2,600</span>
                  </td>
                </tr>
                <tr className="bg-card border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Option B — Launch (wks 1–6)</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground align-top max-sm:hidden">2 days / week</td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£5,200</span>
                  </td>
                </tr>
                <tr className="bg-muted border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Option B — Steady state (wk 7+)</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground align-top max-sm:hidden">Steps down to 1 day / week</td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£2,600</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-primary text-primary-foreground">
                  <td colSpan={2} className="font-sans text-[13.5px] font-bold px-5 py-4 max-sm:hidden">Indicative 90-day total (Option B)</td>
                  <td className="font-sans text-[13.5px] font-bold px-5 py-4 sm:hidden">90-day total</td>
                  <td className="font-sans text-[15px] font-bold px-5 py-4 text-right">~£13,000</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Security / governance */}
          <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mb-4 mt-6">
            <div className="flex items-center gap-2 mb-3 text-accent">
              <ShieldIcon />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent">Governance, ownership & exit</span>
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
                  Invoiced monthly in advance, 14-day terms. Thread & Stack is not VAT registered — no VAT applies. A 15% late charge applies to any payment not received within 30 days of invoicing.
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border my-10" />

          {/* Next steps */}
          <SectionLabel num="07" title="If you'd like to move forward" />
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
            Anything here that doesn't match what you had in mind — cadence, scope, who's in the thread — just say. Easy to reshape before week one. The aim is a setup that fits the way BfB actually ships, not the way a proposal assumes it does.
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

export default BfBLabsProposalPage;
