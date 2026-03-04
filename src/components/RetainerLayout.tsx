import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";

const outcomes = [
  {
    icon: "🎯",
    title: "Product-market fit, on time",
    desc: "Messaging that meets your audience where they are, iterated quickly as you learn what's landing.",
  },
  {
    icon: "📋",
    title: "Stakeholders with proof",
    desc: "Consistent, credible outputs that give funders and partners the confidence they need to back you.",
  },
  {
    icon: "🔗",
    title: "A team that stays unblocked",
    desc: "Decisions get made. Work gets reviewed. The junior team has a direction to move toward rather than a fog to navigate.",
  },
];

const howSteps = [
  {
    title: "A monthly bank of days, not a rigid schedule",
    desc: "Typically structured around one day a week, flexed toward the moments where the work is moving hardest — a launch window, a pitch, a channel test.",
  },
  {
    title: "Iteration and decision support as messaging meets reality",
    desc: "Ads, landing pages, email sequences, partner and investor comms. What needs reworking, approving, or a steer — handled week to week.",
  },
  {
    title: "Creative direction guardrails between sessions",
    desc: "Quick reviews and directional decisions so the team stays consistent without burning formal days on things that can be resolved in a message.",
  },
  {
    title: "Weekly priorities, named clearly",
    desc: "What matters this week, and what to set aside. Senior focus is the resource — not more output.",
  },
];

const SectionLabel = ({ num, title }: { num: string; title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="font-sans text-[11px] font-bold tracking-wider text-accent">{num}</span>
    <span className="font-serif-pro text-[22px] italic font-semibold text-primary">{title}</span>
  </div>
);

interface PricingRow {
  label: string;
  dayRate: string;
  cadence: string;
  monthlyRange: string;
}

interface RetainerLayoutProps {
  headline: React.ReactNode;
  subtitle: string;
  pricing: PricingRow;
  pricingNote?: string;
}

const RetainerLayout = ({ headline, subtitle, pricing, pricingNote }: RetainerLayoutProps) => {
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
            <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-accent">Fractional Narrative & Strategy Retainer</span>
          </div>
          <h1 className="font-serif-pro text-[42px] max-sm:text-[32px] italic font-bold leading-[1.18] text-primary-foreground mb-5">
            {headline}
          </h1>
          <p className="font-sans text-[15px] text-primary-foreground/60 leading-relaxed max-w-[520px]">
            {subtitle}
          </p>
        </div>

        {/* Body */}
        <div className="px-14 pt-[52px] pb-14 max-sm:px-7 max-sm:pt-9 max-sm:pb-9">
          {/* Section 01 */}
          <SectionLabel num="01" title="Where most teams find themselves" />

          <div className="bg-muted rounded-2xl p-7 mb-8">
            <p className="text-[15px] leading-[1.7] text-foreground">
              You're at the moment where you realise you need senior marketing experience and you don't have it in the room. There may be a designer, a product team, junior people who can execute parts of the brief — but the strategy brain, the experienced lead who can hold the vision and make the calls, isn't there yet.
            </p>
            <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
              A full-time hire isn't the right answer at this stage. Too slow, too expensive, and the role would be over-scoped for where you are. What the work actually needs is someone who can show up consistently, understand the territory quickly, and help the team move without second-guessing every decision.
            </p>
          </div>

          <div className="border-l-[3px] border-accent pl-5 my-8">
            <p className="font-serif-pro text-xl italic leading-[1.55] text-primary">
              "Because of seasoned strategic support on retainer, you can make fast, confident decisions across messaging, creative direction, and launch milestones — without the drag of a stretched internal team."
            </p>
          </div>

          <div className="h-px bg-border my-10" />

          {/* Section 02 */}
          <SectionLabel num="02" title="What this makes possible" />

          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 mt-2">
            {outcomes.map((o) => (
              <div key={o.title} className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)]">
                <div className="text-xl mb-2.5">{o.icon}</div>
                <h4 className="font-serif-pro text-[17px] italic font-semibold text-primary mb-1.5">{o.title}</h4>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{o.desc}</p>
              </div>
            ))}
          </div>

          <div className="h-px bg-border my-10" />

          {/* Section 03 */}
          <SectionLabel num="03" title="How the retainer works" />

          <ul className="flex flex-col gap-4 mt-2">
            {howSteps.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent font-sans text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <strong className="block text-sm font-semibold text-primary mb-0.5">{step.title}</strong>
                  <span className="text-[13.5px] text-muted-foreground leading-[1.55]">{step.desc}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-px bg-border my-10" />

          {/* Section 04 */}
          <SectionLabel num="04" title="Structure and pricing" />

          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] mt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left">Engagement</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left">Day rate</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left">Typical cadence</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left">Monthly range</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-muted">
                  <td className="px-5 py-4 font-serif-pro italic text-[15px] font-semibold text-primary align-top">{pricing.label}</td>
                  <td className="px-5 py-4 text-[13.5px] text-foreground align-top"><span className="font-sans text-[15px] font-bold text-primary">{pricing.dayRate}</span></td>
                  <td className="px-5 py-4 text-[13.5px] text-foreground align-top">{pricing.cadence}</td>
                  <td className="px-5 py-4 text-[13.5px] text-foreground align-top">{pricing.monthlyRange}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[13px] text-muted-foreground leading-relaxed mt-3.5">
            {pricingNote || "Start with a short initial term, then review together. The cadence adjusts around what the business actually needs — lighter when things are steady, more intensive around key moments. Additional days or short launch intensives can be added at an agreed rate."}
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-14 py-7 flex items-center justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:px-7">
          <p className="text-[13.5px] text-muted-foreground leading-[1.55] max-w-[380px]">
            If this feels like the right kind of support for where you are, the next step is a short conversation about <strong className="text-foreground font-semibold">what the next six to eight weeks actually need to look like.</strong> No commitment required at that stage.
          </p>
          <img src={GreyStacked} alt="Thread & Stack" className="h-8 opacity-50 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default RetainerLayout;
