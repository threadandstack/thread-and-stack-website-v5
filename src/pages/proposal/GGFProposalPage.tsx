import { useEffect } from "react";

const CheckIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8">
    <polyline points="1.5,4 3,5.5 6.5,2" stroke="#1026D6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5L2 4v4c0 3.31 2.47 6.41 6 7.16C11.53 14.41 14 11.31 14 8V4L8 1.5z" stroke="#1026D6" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5.5 8l2 2 3-3" stroke="#1026D6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="4" width="16" height="11" rx="2" stroke="#1026D6" strokeWidth="1.5" />
    <path d="M1 8h16" stroke="#1026D6" strokeWidth="1.5" />
    <path d="M5 12h3" stroke="#1026D6" strokeWidth="1.5" strokeLinecap="round" />
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
    case "ts": return { text: "Thread & Stack", cls: "bg-[#EEF1FD] text-[#1026D6]" };
    case "both": return { text: "Both", cls: "bg-[#F0F7F0] text-[#2A7A2A]" };
    default: return { text: "", cls: "" };
  }
};

const dateBadgeCls = (style: string) => {
  switch (style) {
    case "amber": return "text-[#8B5E00] bg-[#FFF3CC]";
    case "green": return "text-[#2A7A2A] bg-[#F0F7F0]";
    default: return "text-[#1026D6] bg-[#EEF1FD]";
  }
};

const GGFProposalPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0D0D0D] font-sans antialiased animate-fade-in">
      <div className="max-w-[720px] mx-auto px-8 py-[60px] pb-[100px] leading-[1.7] max-[540px]:px-5 max-[540px]:py-10">

        {/* HEADER */}
        <header className="flex justify-between items-start pb-10 border-b border-[#EBEBEB] mb-12 max-[540px]:flex-col max-[540px]:gap-3">
          <div className="font-serif italic font-bold text-lg text-[#1A1A1A] tracking-tight">
            Thread <span className="text-[#1026D6]">&</span> Stack
          </div>
          <div className="font-sans text-xs text-[#666] text-right leading-[1.8] max-[540px]:text-left">
            Prepared for: Ursula, Global Green Grants Fund<br />
            Date: March 2026<br />
            Ref: Gender Justice Microsite
          </div>
        </header>

        {/* HERO */}
        <section className="mb-14">
          <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1026D6] mb-4">
            Project Proposal
          </div>
          <h1 className="font-serif italic font-bold text-[clamp(32px,5vw,46px)] leading-[1.12] text-[#1A1A1A] mb-5 tracking-tight">
            A storytelling site that does the{" "}
            <span className="text-[#1026D6] underline decoration-2 underline-offset-[5px]">work</span>{" "}
            justice.
          </h1>
          <p className="font-sans text-base leading-[1.75] text-[#666] max-w-[580px]">
            A scrollable microsite for the Gender Justice working group — photos, voices, narrative. Built fast, handed over cleanly, no ongoing dependency on me.
          </p>
        </section>

        {/* SECTION 1 */}
        <Section num="01" title="What you're getting">
          <p className="proposal-p">A standalone scrollable microsite that tells the story of your Gender Justice working group's impact. The site lives at its own URL, separate from GGF's main website, so it doesn't touch your existing infrastructure at all.</p>
          <p className="proposal-p">It's built for emotional resonance first. Photos paired with quotes and narrative text, flowing naturally as the reader scrolls. No maps, no complex functionality — just the story, presented with care and clarity, at a pace the reader controls.</p>
          <p className="proposal-p !mb-0">Once it launches, anyone on your team can update it. No agency. No back-and-forth. No two-and-a-half years.</p>
        </Section>

        {/* SECTION 2 */}
        <Section num="02" title="How we get there">
          <div className="flex flex-col gap-0.5 mt-1">
            {STEPS.map((step, i) => (
              <div key={i} className="grid grid-cols-[28px_1fr] gap-4 p-4 px-5 bg-[#FCFCFC] border border-[#EBEBEB] rounded-[10px] items-start hover:shadow-md hover:border-[#d0d0d0] transition-all">
                <div className="font-sans text-[11px] font-bold text-[#1026D6] mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-sans text-sm font-semibold text-[#1A1A1A] mb-1">{step.title}</h3>
                  <p className="text-[13.5px] text-[#666] m-0 leading-[1.65]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* SECTION 3 */}
        <Section num="03" title="What's in scope">
          <p className="proposal-p">Before build begins, we'll confirm a simple site map together — typically a homepage scroll plus one or two supporting pages. That confirmation is a shared starting point, not an afterthought, because scope is what keeps the budget and timeline clean.</p>

          <div className="bg-[#F5F5F5] border border-[#EBEBEB] rounded-2xl p-6 px-7 mb-4">
            <h3 className="font-serif italic text-lg font-semibold text-[#1A1A1A] mb-2.5">Included in this proposal</h3>
            <p className="text-sm text-[#0D0D0D] mb-2">The project fee covers the following structure:</p>
            <div className="flex flex-col gap-1.5 mt-3">
              {SCOPE_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 font-sans text-[13.5px] text-[#0D0D0D] leading-[1.55]">
                  <div className="w-4 h-4 rounded-full bg-[#E8F0FE] border-[1.5px] border-[#1026D6] flex items-center justify-center flex-shrink-0 mt-px">
                    <CheckIcon />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Caveat>
            <strong>More than 3 pages in total requires a rescope.</strong> If the working group decides they'd like additional pages, sections, or functionality beyond what's described here, that's absolutely possible — it just means a revised proposal before work continues. Adding scope mid-build is how timelines slip and budgets blow, so it's better for both of us to catch that early.
          </Caveat>
        </Section>

        {/* SECTION 4 */}
        <Section num="04" title="How the timeline works">
          <p className="proposal-p">Rather than fixing a calendar date here, the timeline below runs from <strong>Day 1</strong> — the agreed project kick-off following our scoping call. A launch date of 15 April was discussed in our initial conversation; given where we are now, we'll confirm whether that's still achievable on the scoping call and set the clock from there.</p>
          <p className="proposal-p">The phases marked <strong className="text-[#B34A00]">GGF to action</strong> are where the project depends on your team. Any delays on those phases — content arriving late, branding sign-off taking longer than expected, feedback rounds stretching — will push the delivery date forward by the same amount. Thread & Stack's timelines are calculated from the point we receive what we need, not from Day 1.</p>

          <Caveat className="mb-5">
            <strong>A note on delays:</strong> This isn't small print — it's how every project works in practice. If the content folder lands on Day 6 instead of Day 3, the build finishes on Day 17 instead of Day 14. We'll flag any slippage as soon as we see it, and we'll always give you an updated delivery estimate when things shift.
          </Caveat>

          {/* Timeline */}
          <div className="mt-1 relative">
            <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#1026D6] to-[#EBEBEB]" />
            {TIMELINE.map((phase, i) => {
              const owner = ownerLabel(phase.owner);
              return (
                <div key={i} className="grid grid-cols-[32px_1fr] gap-4 mb-1 relative">
                  <div className="flex flex-col items-center pt-[18px] z-[1]">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white flex-shrink-0"
                      style={{
                        background: phase.isLaunch ? "#2A7A2A" : (phase.owner === "ggf" ? undefined : undefined),
                        backgroundColor: phase.isLaunch ? "#2A7A2A" : "#1026D6",
                        boxShadow: `0 0 0 2px ${phase.isLaunch ? "#2A7A2A" : phase.owner === "ggf" ? "#C0C0C0" : "#1026D6"}`,
                        ...(phase.owner === "ggf" && !phase.isLaunch ? { backgroundColor: "#C0C0C0" } : {}),
                      }}
                    />
                  </div>
                  <div className={`bg-[#FCFCFC] border rounded-[10px] p-3.5 px-[18px] hover:shadow-md transition-shadow ${phase.isLaunch ? "border-[#C8E6C9]" : "border-[#EBEBEB]"}`}>
                    <div className="flex justify-between items-start gap-2 mb-1.5 flex-wrap">
                      <span className="font-sans text-[13.5px] font-semibold text-[#1A1A1A]">{phase.title}</span>
                      <span className={`font-sans text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${dateBadgeCls(phase.dateStyle)}`}>
                        {phase.date}
                      </span>
                    </div>
                    <p className="font-sans text-[13px] text-[#666] leading-[1.6] m-0">{phase.body}</p>
                    <span className={`inline-block mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.07em] px-[7px] py-0.5 rounded-full ${owner.cls}`}>
                      {owner.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* SECTION 5 */}
        <Section num="05" title="The investment">
          <p className="proposal-p">Everything sits within your $5,000 ceiling, with the first year of platform costs included so there's no surprise bill after launch.</p>

          <div className="border border-[#EBEBEB] rounded-2xl overflow-hidden mt-1">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#666] bg-[#F5F5F5] p-3 px-5 text-left">Item</th>
                  <th className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#666] bg-[#F5F5F5] p-3 px-5 text-left">What's included</th>
                  <th className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#666] bg-[#F5F5F5] p-3 px-5 text-right">Cost (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#EBEBEB]">
                  <td className="font-sans text-sm text-[#0D0D0D] p-3.5 px-5 align-top leading-[1.55]">
                    <strong>Project fee</strong>
                    <div className="text-xs text-[#666] mt-0.5">Brendan Rodgers / Thread & Stack</div>
                  </td>
                  <td className="font-sans text-sm text-[#0D0D0D] p-3.5 px-5 align-top leading-[1.55]">
                    All phases: design concepts, build, two rounds of amends, staging, launch, two one-hour training sessions on Lovable, written explainer documentation, handover, 30-day aftercare
                  </td>
                  <td className="font-sans text-sm font-medium text-[#1A1A1A] p-3.5 px-5 align-top text-right">$4,645</td>
                </tr>
                <tr className="border-t border-[#EBEBEB]">
                  <td className="font-sans text-sm text-[#0D0D0D] p-3.5 px-5 align-top leading-[1.55]">
                    <strong>Platform — Lovable</strong>
                    <div className="text-xs text-[#666] mt-0.5">Year 1 subscription</div>
                  </td>
                  <td className="font-sans text-sm text-[#0D0D0D] p-3.5 px-5 align-top leading-[1.55]">
                    £19/month, billed as part of the project. After Year 1 this becomes GGF's direct subscription at the same rate. Included in the subscription:
                    <ul className="mt-2 pl-4 text-[13px] text-[#666] leading-[1.8] list-disc">
                      <li>Website hosting</li>
                      <li>AI-powered content management system — update text, images, and content without technical knowledge</li>
                      <li>Unlimited user seats — your whole team can have access</li>
                      <li>Accessibility optimisation built into the build process</li>
                      <li>Integrations and extensions available as the site grows</li>
                    </ul>
                  </td>
                  <td className="font-sans text-sm font-medium text-[#1A1A1A] p-3.5 px-5 align-top text-right">~$289</td>
                </tr>
                <tr className="border-t border-[#EBEBEB]">
                  <td className="font-sans text-sm text-[#0D0D0D] p-3.5 px-5 align-top leading-[1.55]">
                    <strong>Domain name</strong>
                    <div className="text-xs text-[#666] mt-0.5">Year 1 registration</div>
                  </td>
                  <td className="font-sans text-sm text-[#0D0D0D] p-3.5 px-5 align-top leading-[1.55]">
                    Custom URL for the microsite. Renewed directly by GGF from Year 2.
                  </td>
                  <td className="font-sans text-sm font-medium text-[#1A1A1A] p-3.5 px-5 align-top text-right">~$50</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#1A1A1A] bg-[#1A1A1A]">
                  <td colSpan={2} className="font-sans text-[15px] font-bold text-white p-4 px-5">Total</td>
                  <td className="font-sans text-[15px] font-bold text-white p-4 px-5 text-right">~$5,000</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <Callout>
            <strong className="text-[#1026D6]">Why the numbers work:</strong> The speed and cost-efficiency here come from using Lovable, an AI-assisted build platform, rather than a traditional development workflow. That's what lets a project of this scope sit comfortably inside a $5,000 budget, with hosting and handover included. The same work through a conventional agency would typically cost two to three times more and take considerably longer. The output is real, editable, and fully owned by you when we're done.
          </Callout>

          {/* Security block */}
          <div className="mt-4 border border-[#C9D4F8] rounded-2xl p-5 px-[22px] bg-[#F6F8FE]">
            <div className="flex items-center gap-2 mb-2.5">
              <ShieldIcon />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-[#1026D6]">Platform security & data</span>
            </div>
            <p className="font-sans text-[13.5px] text-[#0D0D0D] mb-3.5 leading-[1.65]">This is a small project, but it will be backed by the same security infrastructure you'd expect from a professional platform. A few things worth knowing:</p>
            <div className="flex flex-col gap-2.5">
              {SECURITY_ROWS.map((row, i) => (
                <div key={i} className={`grid grid-cols-[160px_1fr] max-[540px]:grid-cols-1 gap-3 max-[540px]:gap-1 font-sans text-[13px] leading-[1.6] ${i > 0 ? "pt-2.5 border-t border-[#DDE3F7]" : ""}`}>
                  <div className="font-semibold text-[#1A1A1A]">{row.title}</div>
                  <div className="text-[#666]">{row.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment terms */}
          <div className="mt-4 border border-[#EBEBEB] rounded-2xl p-[18px] px-5 bg-[#FCFCFC]">
            <div className="flex gap-3.5 items-start">
              <div className="flex-shrink-0 mt-0.5"><CardIcon /></div>
              <div className="flex-1">
                <div className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-[#1026D6] mb-1.5">Payment schedule</div>
                <div className="font-sans text-[13.5px] text-[#0D0D0D] leading-[1.65]">
                  <strong className="text-[#1A1A1A]">50% on project kick-off, 50% on delivery.</strong> Invoices are provided in advance of each payment so you have everything you need for internal approvals. We ask that both payments are honoured promptly — timely payment on both sides is what keeps the project on track and the delivery date protected.
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* SECTION 6 */}
        <Section num="06" title="If you'd like to move forward">
          <ul className="list-none flex flex-col gap-2.5 mt-1">
            {NEXT_STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3 font-sans text-[14.5px] text-[#0D0D0D] leading-[1.6]">
                <span className="w-2 h-2 rounded-full border-2 border-[#1026D6] flex-shrink-0 mt-[6px]" />
                {step}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-[#666]">Happy to answer any questions before you decide. And if anything in here doesn't quite reflect what you had in mind from our conversation, just say — it's easy to adjust at this stage.</p>
        </Section>

        {/* FOOTER */}
        <footer className="mt-16 pt-7 border-t border-[#EBEBEB] flex justify-between items-end flex-wrap gap-3 max-[540px]:flex-col max-[540px]:items-start">
          <div className="font-serif italic text-base font-semibold text-[#1A1A1A]">
            Thread <span className="text-[#1026D6]">&</span> Stack
          </div>
          <div className="font-sans text-xs text-[#666] text-right leading-[1.8] max-[540px]:text-left">
            Brendan Rodgers<br />
            <a href="https://threadandstack.com/" className="text-[#1026D6] no-underline">threadandstack.com</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

/* Reusable sub-components */

const Section = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
  <section className="mb-[52px]">
    <div className="flex items-baseline gap-3 mb-5 pb-3.5 border-b border-[#EBEBEB]">
      <span className="font-sans text-xs font-bold text-[#1026D6] tracking-[0.05em] flex-shrink-0">{num}</span>
      <h2 className="font-serif italic font-semibold text-2xl text-[#1A1A1A] tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#EEF1FD] border-l-[3px] border-[#1026D6] rounded-r-[10px] p-4 px-5 mt-5">
    <p className="text-sm text-[#1A1A1A] m-0 leading-[1.7]">{children}</p>
  </div>
);

const Caveat = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#FFFBEA] border-l-[3px] border-[#E5A800] rounded-r-[10px] p-3.5 px-[18px] mt-4 ${className}`}>
    <p className="text-[13.5px] text-[#5a4500] m-0 leading-[1.65]">{children}</p>
  </div>
);

export default GGFProposalPage;
