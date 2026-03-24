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

const STEPS = [
  { title: "Foundations", desc: "You share the content folder (photos, quotes, written narrative) and confirm branding requirements with your comms director. One point of contact from the working group is nominated to consolidate feedback." },
  { title: "Design concepts", desc: "I produce two visual directions on a shared design board where you can leave comments directly. We agree on a direction before any build begins." },
  { title: "Build & amends", desc: "I build the site using Lovable, an AI-assisted platform that lets me move quickly without compromising quality. Two rounds of amends are included to refine it." },
  { title: "Staging & sign-off", desc: "A live but private version goes up for your review before anything is made public. Final edits, then launch." },
  { title: "Handover", desc: "Full editing access transferred to your team, along with two one-hour training sessions on how to use Lovable to make changes and update the site, plus simple written explainer documentation you can refer back to. Thirty-day aftercare period included — I'm available for questions." },
];

const SCOPE_ITEMS = [
  "A scrolling homepage — the main storytelling journey",
  "Up to 2 additional sub-pages (e.g. About the Working Group, Contact / Get Involved)",
  "Navigation, footer, GGF branding integration, and accessibility basics",
  "Mobile-responsive layout throughout",
];

const TIMELINE = [
  { title: "Foundations", date: "By Day 3", dateStyle: "amber" as const, body: "Content folder delivered (photos, quotes, narrative text). Branding requirements confirmed with your comms director. Site map agreed — homepage plus up to 2 sub-pages confirmed in writing before design work begins.", owner: "ggf" as const },
  { title: "Design concepts", date: "Days 4–8", dateStyle: "blue" as const, body: "Two visual directions produced on a shared design board. You and your nominated feedback contact leave comments directly on the board — no email chains.", owner: "ts" as const },
  { title: "Design sign-off", date: "By Day 9", dateStyle: "amber" as const, body: "Consolidated feedback from your single point of contact. One direction confirmed. This is the point of no return for the visual approach — amends after this stage go into the build, not the design phase.", owner: "ggf" as const },
  { title: "Build — version one", date: "Days 10–17", dateStyle: "blue" as const, body: "Full site built on Lovable using agreed design and content. All pages, navigation, responsive layout, and branding applied. No external access yet.", owner: "ts" as const },
  { title: "Staging review + amends", date: "Days 18–21", dateStyle: "amber" as const, body: "Private staging link shared with you. Two rounds of consolidated amends included. Feedback must come from a single contact — this is where the working group nomination really matters.", owner: "both" as const },
  { title: "Final sign-off", date: "By Day 22", dateStyle: "amber" as const, body: "Written confirmation that the site is approved and ready to go live. Any last-minute copy corrections handled at this point — structural changes at this stage may affect the launch date.", owner: "ggf" as const },
  { title: "Launch + handover", date: "Day 24", dateStyle: "green" as const, body: "Site goes live. Two one-hour training sessions delivered on how to make changes and updates using Lovable. Simple explainer documentation provided for reference. Full editing access transferred to your team. Thirty-day aftercare period begins.", owner: "both" as const, isLaunch: true },
];

const NEXT_STEPS = [
  "Let me know you're happy with this proposal and we'll book a brief scoping call to confirm the project start date and talk through any questions.",
  "Nominate one person from the working group as the single feedback point of contact.",
  "Confirm branding requirements with your comms director (even a quick steer on colours/logo usage is enough to begin).",
  "Share the content folder — WeTransfer or Google Drive, whatever's easiest — so I can understand what we're working with before design concepts begin.",
];

const SECURITY_ROWS = [
  { title: "Data residency", detail: "Lovable supports regional data hosting in the EU, US, and Australia. For a project like this, EU hosting is the default — your data stays in the region you choose and doesn't move across regions." },
  { title: "Your data is not used to train AI", detail: "Lovable does not use customer content, code, or workspace data to train its models. Contractual agreements with any AI providers restrict training and retention of customer data." },
  { title: "Certifications", detail: "The platform is SOC 2 Type II certified, GDPR compliant, and ISO 27001 certified." },
  { title: "Workspace transfer", detail: "The site will initially be built inside my Thread & Stack workspace. On handover, it's transferred into a GGF-owned Lovable workspace. Your team is invited with full access, and from that point everything is yours — I'm no longer involved unless you want me to be." },
];

const ownerLabel = (owner: string) => {
  switch (owner) {
    case "ggf": return { text: "GGF to action", cls: "bg-[#FFF0E8] text-[#B34A00]" };
    case "ts": return { text: "Thread & Stack", cls: "bg-accent/10 text-accent" };
    case "both": return { text: "Both", cls: "bg-[#F0F7F0] text-[#2A7A2A]" };
    default: return { text: "", cls: "" };
  }
};

const dateBadgeCls = (style: string) => {
  switch (style) {
    case "amber": return "text-[#8B5E00] bg-[#FFF3CC]";
    case "green": return "text-[#2A7A2A] bg-[#F0F7F0]";
    default: return "text-accent bg-accent/10";
  }
};

const SectionLabel = ({ num, title }: { num: string; title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="font-sans text-[13px] font-bold tracking-wider text-accent">{num}</span>
    <span className="font-serif-pro text-[30px] italic font-semibold text-primary">{title}</span>
  </div>
);

const GGFProposalPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-muted/50 flex justify-center items-start py-10 px-5 print:bg-white print:p-0">
      {/* Download button */}
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
          <h1 className="font-serif-pro text-[56px] max-sm:text-[42px] italic font-bold leading-[1.18] text-primary-foreground mb-5">
            A storytelling site that does the{" "}
            <span className="text-[#FF6200]">work</span>{" "}
            justice.
          </h1>
          <p className="font-sans text-[15px] text-primary-foreground/60 leading-relaxed max-w-[520px]">
            A scrollable microsite for the Gender Justice working group — photos, voices, narrative. Built fast, handed over cleanly, no ongoing dependency on me.
          </p>
          <div className="mt-6 font-sans text-[12px] text-primary-foreground/40 leading-[1.8]">
            Prepared for: Ursula, Global Green Grants Fund · March 2026 · Ref: Gender Justice Microsite
          </div>
        </div>

        {/* Body */}
        <div className="px-14 pt-[52px] pb-14 max-sm:px-7 max-sm:pt-9 max-sm:pb-9">

          {/* Section 01 */}
          <SectionLabel num="01" title="What you're getting" />
          <div className="bg-muted rounded-2xl p-7 mb-8">
            <p className="text-[15px] leading-[1.7] text-foreground">
              A standalone scrollable microsite that tells the story of your Gender Justice working group's impact. The site lives at its own URL, separate from GGF's main website, so it doesn't touch your existing infrastructure at all.
            </p>
            <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
              It's built for emotional resonance first. Photos paired with quotes and narrative text, flowing naturally as the reader scrolls. No maps, no complex functionality — just the story, presented with care and clarity, at a pace the reader controls.
            </p>
            <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
              Once it launches, anyone on your team can update it. No agency. No back-and-forth. No two-and-a-half years.
            </p>
          </div>

          <div className="h-px bg-border my-10" />

          {/* Section 02 */}
          <SectionLabel num="02" title="How we get there" />
          <ul className="flex flex-col gap-4 mt-2">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent font-sans text-xs font-bold flex items-center justify-center mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong className="block text-sm font-semibold text-primary mb-0.5">{step.title}</strong>
                  <span className="text-[13.5px] text-muted-foreground leading-[1.55]">{step.desc}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-px bg-border my-10" />

          {/* Section 03 */}
          <SectionLabel num="03" title="What's in scope" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            Before build begins, we'll confirm a simple site map together — typically a homepage scroll plus one or two supporting pages. That confirmation is a shared starting point, not an afterthought, because scope is what keeps the budget and timeline clean.
          </p>

          <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mb-4">
            <h4 className="font-serif-pro text-[17px] italic font-semibold text-primary mb-3">Included in this proposal</h4>
            <div className="flex flex-col gap-2">
              {SCOPE_ITEMS.map((item, i) => (
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
            <strong>More than 3 pages in total requires a rescope.</strong> If the working group decides they'd like additional pages, sections, or functionality beyond what's described here, that's absolutely possible — it just means a revised proposal before work continues.
          </Caveat>

          <div className="h-px bg-border my-10" />

          {/* Section 04 */}
          <SectionLabel num="04" title="How the timeline works" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            Rather than fixing a calendar date here, the timeline below runs from <strong>Day 1</strong> — the agreed project kick-off following our scoping call. A launch date of 15 April was discussed in our initial conversation; given where we are now, we'll confirm whether that's still achievable on the scoping call and set the clock from there.
          </p>
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            The phases marked <strong className="text-[#B34A00]">GGF to action</strong> are where the project depends on your team. Any delays on those phases will push the delivery date forward by the same amount.
          </p>

          <Caveat className="mb-6">
            <strong>A note on delays:</strong> If the content folder lands on Day 6 instead of Day 3, the build finishes on Day 17 instead of Day 14. We'll flag any slippage as soon as we see it.
          </Caveat>

          {/* Timeline */}
          <div className="mt-1 relative">
            <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-accent to-border" />
            {TIMELINE.map((phase, i) => {
              const owner = ownerLabel(phase.owner);
              return (
                <div key={i} className="grid grid-cols-[32px_1fr] gap-4 mb-1 relative">
                  <div className="flex flex-col items-center pt-[18px] z-[1]">
                    <div
                      className={`w-3 h-3 rounded-full border-2 border-background flex-shrink-0 ${
                        phase.isLaunch ? "bg-[#2A7A2A] shadow-[0_0_0_2px_#2A7A2A]" :
                        phase.owner === "ggf" ? "bg-muted-foreground/40 shadow-[0_0_0_2px_hsl(var(--muted-foreground)/0.4)]" :
                        "bg-accent shadow-[0_0_0_2px_hsl(var(--accent))]"
                      }`}
                    />
                  </div>
                  <div className={`bg-card rounded-2xl p-3.5 px-[18px] shadow-[var(--shadow-soft)] transition-shadow ${phase.isLaunch ? "border border-[#C8E6C9]" : "border border-border"}`}>
                    <div className="flex justify-between items-start gap-2 mb-1.5 flex-wrap">
                      <span className="font-sans text-[13.5px] font-semibold text-primary">{phase.title}</span>
                      <span className={`font-sans text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${dateBadgeCls(phase.dateStyle)}`}>
                        {phase.date}
                      </span>
                    </div>
                    <p className="font-sans text-[13px] text-muted-foreground leading-[1.6] m-0">{phase.body}</p>
                    <span className={`inline-block mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.07em] px-[7px] py-0.5 rounded-full ${owner.cls}`}>
                      {owner.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-border my-10" />

          {/* Section 05 */}
          <SectionLabel num="05" title="The investment" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            Everything sits within your $5,000 ceiling, with the first year of platform costs included so there's no surprise bill after launch.
          </p>

          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] mt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left">Item</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left max-sm:hidden">What's included</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-right">Cost (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-muted">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Project fee</span>
                    <div className="text-xs text-muted-foreground mt-0.5">Brendan Rodgers / Thread & Stack</div>
                  </td>
                  <td className="px-5 py-4 text-[13.5px] text-foreground align-top leading-[1.55] max-sm:hidden">
                    All phases: design concepts, build, two rounds of amends, staging, launch, two one-hour training sessions, written documentation, handover, 30-day aftercare
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">$4,645</span>
                  </td>
                </tr>
                <tr className="bg-card border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Platform — Lovable</span>
                    <div className="text-xs text-muted-foreground mt-0.5">Year 1 subscription</div>
                  </td>
                  <td className="px-5 py-4 text-[13.5px] text-foreground align-top leading-[1.55] max-sm:hidden">
                    £19/month, billed as part of the project. Includes hosting, AI-powered CMS, unlimited seats, accessibility optimisation, and integrations.
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">~$289</span>
                  </td>
                </tr>
                <tr className="bg-muted border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Domain name</span>
                    <div className="text-xs text-muted-foreground mt-0.5">Year 1 registration</div>
                  </td>
                  <td className="px-5 py-4 text-[13.5px] text-foreground align-top leading-[1.55] max-sm:hidden">
                    Custom URL for the microsite. Renewed directly by GGF from Year 2.
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">~$50</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-primary text-primary-foreground">
                  <td colSpan={2} className="font-sans text-[15px] font-bold px-5 py-4 max-sm:hidden">Total</td>
                  <td className="font-sans text-[15px] font-bold px-5 py-4 sm:hidden">Total</td>
                  <td className="font-sans text-[15px] font-bold px-5 py-4 text-right">~$5,000</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="border-l-[3px] border-accent pl-5 my-8">
            <p className="font-serif-pro text-xl italic leading-[1.55] text-primary">
              "The speed and cost-efficiency come from using Lovable rather than a traditional development workflow. The same work through a conventional agency would typically cost two to three times more."
            </p>
          </div>

          {/* Security block */}
          <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mb-4">
            <div className="flex items-center gap-2 mb-3 text-accent">
              <ShieldIcon />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent">Platform security & data</span>
            </div>
            <p className="text-[13.5px] text-foreground mb-3.5 leading-[1.65]">This is a small project, but it will be backed by the same security infrastructure you'd expect from a professional platform.</p>
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
                <div className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent mb-1.5">Payment schedule</div>
                <div className="font-sans text-[13.5px] text-foreground leading-[1.65]">
                  <strong className="text-primary">50% on project kick-off, 50% on delivery.</strong> Invoices are provided in advance of each payment so you have everything you need for internal approvals.
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border my-10" />

          {/* Section 06 */}
          <SectionLabel num="06" title="If you'd like to move forward" />
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
            Happy to answer any questions before you decide. And if anything in here doesn't quite reflect what you had in mind from our conversation, just say — it's easy to adjust at this stage.
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

/* Reusable sub-components */

const Caveat = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#FFFBEA] border-l-[3px] border-[#E5A800] rounded-r-[10px] p-3.5 px-[18px] mt-4 ${className}`}>
    <p className="text-[13.5px] text-[#5a4500] m-0 leading-[1.65]">{children}</p>
  </div>
);

export default GGFProposalPage;
