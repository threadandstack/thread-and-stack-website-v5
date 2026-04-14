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

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="4" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1 8h16" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1l1.76 3.57L12.5 5.2l-2.75 2.68.65 3.78L7 9.88 3.6 11.66l.65-3.78L1.5 5.2l3.74-.63L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
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

const OPTIONS = [
  {
    num: "1",
    title: "Clarity Sessions",
    price: "£350 per session",
    description:
      "A focused hour on a specific problem: Notion architecture, Lovable setup, questionnaire logic, whatever's in front of you. You leave with direction you can act on yourself.",
    includes: [
      "60-minute focused session on one specific challenge",
      "Clear direction and next steps you can act on immediately",
      "Full recording and summary notes",
    ],
    extra: "3-session bundle: £900 (£300 each) if you want a sounding board as you build things out.",
  },
  {
    num: "2",
    title: "Foundation Sprint",
    price: "£2,250–£3,750",
    duration: "3–5 days",
    description:
      "We co-build your core Notion operating system. Clients database with a proper pipeline, Services linked to your four-stage journey, Projects, Content Library, questionnaire integration. I walk you through everything as we go, so you own it afterwards. Exact scope defined in a discovery session.",
    includes: [
      "Core Notion workspace: Clients, Services, Projects, Content Library",
      "Pipeline and four-stage journey structure",
      "Questionnaire integration",
      "Hands-on walkthrough so you own it fully",
    ],
    timeline: "Your workspace could be operational within two weeks.",
  },
  {
    num: "3",
    title: "Website Build",
    price: "£5,000–£6,000",
    duration: "~8 days of work",
    description:
      "Full transparency: I don't typically offer website builds as a standalone service. But I've been building my own site and delivering a client project using Lovable over the past few months, and the practical knowledge I've picked up is directly relevant to what you need.",
    extendedDescription:
      "What I've learned is that even with AI-powered tools, a website build requires regular touch points, careful attention to security, and structured decision-making around design and integrations. It's incredibly empowering for a founder to be able to move quickly with these tools, but it does represent a genuinely separate category of work that benefits from being scoped on its own.",
    includes: [
      "Full website design and build using Lovable",
      "Responsive layout across all devices",
      "Structured decision-making around design and integrations",
      "Regular touch points throughout the build process",
      "Handover with full editing access",
    ],
    timeline: "Assuming all content and creative assets are provided, the website could be live within four to five weeks.",
  },
  {
    num: "4",
    title: "Fractional Support",
    originalPrice: "£4,000/month",
    price: "£3,500/month",
    duration: "3-month commitment",
    recommended: true,
    description:
      "This is what I'd genuinely recommend, and honestly where I do my best work. Rather than billing per day across separate projects, I'm embedded alongside you for three months. We scope goals for each month and I plug into whatever matters most.",
    extendedDescription:
      "Getting Notion operational, building the website, implementing the brand work Jules is finishing, setting up proper AI workflows, making sure your business systems are genuinely connected.",
    includes: [
      "Notion operating system — built and running",
      "Website — designed, built, and live",
      "Brand implementation from Jules's work",
      "AI workflow setup and training",
      "Business systems connected end-to-end",
      "Monthly goal scoping and ongoing support",
    ],
    investment: "I've included a £500 discount per month for this because I genuinely believe this would be the best solution for what we discussed. I appreciate your perspective on being pre-revenue.",
    timeline: "Everything stood up across three months at a sustainable pace, rather than trying to sprint through it all at once.",
  },
];

const ArcCollectiveProposalPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const metaRobots = document.createElement("meta");
    metaRobots.name = "robots";
    metaRobots.content = "noindex, nofollow";
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
            <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-[#FF6200]">Proposal</span>
          </div>
          <h1 className="font-serif-pro text-[56px] max-sm:text-[42px] italic font-bold leading-[1.18] text-primary-foreground mb-5">
            Building the{" "}
            <span className="text-[#FF6200]">foundations</span>{" "}
            properly.
          </h1>
          <p className="font-sans text-[15px] text-primary-foreground/60 leading-relaxed max-w-[520px]">
            Four ways to work together — from focused sessions through to embedded strategic and operational support. Every option starts with a scoping session so we define exactly what's needed before any build work begins.
          </p>
          <div className="mt-6 font-sans text-[12px] text-primary-foreground/40 leading-[1.8]">
            Prepared for: The Arc Collective · April 2026
          </div>
        </div>

        {/* Body */}
        <div className="px-14 pt-[52px] pb-14 max-sm:px-7 max-sm:pt-9 max-sm:pb-9">

          {/* Opening note */}
          <div className="bg-muted rounded-2xl p-7 mb-10">
            <p className="text-[15px] leading-[1.7] text-foreground">
              A note on all of the below: each option would start with a scoping session so we define exactly what's needed before any build work begins. No guesswork, no wasted time.
            </p>
          </div>

          {/* Options */}
          {OPTIONS.map((option, i) => (
            <div key={i}>
              {i > 0 && <div className="h-px bg-border my-10" />}

              <SectionLabel num={`0${option.num}`} title={option.title} />

              {option.recommended && (
                <div className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-[11px] font-sans font-semibold px-3 py-1 rounded-full mb-4">
                  <StarIcon />
                  Recommended
                </div>
              )}

              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                {option.originalPrice && (
                  <span className="font-serif-pro text-[20px] italic font-semibold text-muted-foreground/50 line-through">{option.originalPrice}</span>
                )}
                <span className="font-serif-pro text-[22px] italic font-semibold text-primary">{option.price}</span>
                {option.duration && (
                  <span className="font-sans text-[13px] text-muted-foreground">({option.duration})</span>
                )}
              </div>

              <p className="text-[15px] leading-[1.7] text-foreground mb-3">{option.description}</p>

              {option.extendedDescription && (
                <p className="text-[15px] leading-[1.7] text-foreground mb-3">{option.extendedDescription}</p>
              )}

              {/* Includes */}
              <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mb-4 mt-5">
                <h4 className="font-serif-pro text-[17px] italic font-semibold text-primary mb-3">What's included</h4>
                <div className="flex flex-col gap-2">
                  {option.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[13.5px] text-foreground leading-[1.55]">
                      <div className="w-4 h-4 rounded-full bg-accent/10 border-[1.5px] border-accent flex items-center justify-center flex-shrink-0 mt-px text-accent">
                        <CheckIcon />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {option.extra && (
                <div className="bg-accent/5 rounded-xl p-4 mt-3">
                  <p className="text-[13.5px] text-foreground leading-[1.6]">{option.extra}</p>
                </div>
              )}

              {option.investment && (
                <div className="bg-accent/5 rounded-xl p-4 mt-3">
                  <p className="text-[13.5px] text-foreground leading-[1.6] font-medium">{option.investment}</p>
                  {option.discount && (
                    <p className="text-[13px] text-accent mt-1.5 leading-[1.6]">{option.discount}</p>
                  )}
                </div>
              )}

              {option.timeline && (
                <Caveat className="mt-4">
                  <strong>Timeline:</strong> {option.timeline}
                </Caveat>
              )}
            </div>
          ))}

          <div className="h-px bg-border my-10" />

          {/* Bundling note */}
          <SectionLabel num="05" title="Bundling" />
          <div className="bg-muted rounded-2xl p-7 mb-4">
            <p className="text-[15px] leading-[1.7] text-foreground">
              The sprint and website build work well together or separately. The fractional option absorbs both, plus the wider work around AI, brand implementation, and business workflows.
            </p>
          </div>

          <div className="h-px bg-border my-10" />

          {/* Investment summary */}
          <SectionLabel num="06" title="At a glance" />
          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-soft)] mt-2 mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-left">Option</th>
                  <th className="font-sans text-[11px] font-semibold tracking-wider uppercase px-5 py-3.5 text-right">Investment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-muted">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Clarity Sessions</span>
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£350/session</span>
                    <div className="text-xs text-muted-foreground mt-0.5">or £900 for 3</div>
                  </td>
                </tr>
                <tr className="bg-card border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Foundation Sprint</span>
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£2,250–£3,750</span>
                  </td>
                </tr>
                <tr className="bg-muted border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Website Build</span>
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£5,000–£6,000</span>
                  </td>
                </tr>
                <tr className="bg-card border-t border-border">
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <span className="font-serif-pro italic text-[15px] font-semibold text-primary">Fractional Support</span>
                      <span className="bg-accent text-accent-foreground text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">Recommended</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <span className="font-sans text-[15px] font-bold text-primary">£3,500/month</span>
                    <div className="text-xs text-muted-foreground mt-0.5">£10,500 over 3 months</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment terms */}
          <div className="bg-muted rounded-2xl p-[18px] px-5 mt-6">
            <div className="flex gap-3.5 items-start text-accent">
              <div className="flex-shrink-0 mt-0.5"><CardIcon /></div>
              <div className="flex-1">
                <div className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent mb-1.5">Payment</div>
                <div className="font-sans text-[13.5px] text-foreground leading-[1.65]">
                  Brendan Rodgers / Thread & Stack is not currently VAT registered. No VAT is applicable. Payment terms and schedule agreed during scoping. A 15% late charge applies to any payment not received within 30 days of invoicing.
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border my-10" />

          {/* Next steps */}
          <SectionLabel num="07" title="Next steps" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            I'll send the library system document across separately. Should help as you're mapping things out this week with Jules.
          </p>
          <p className="text-[15px] leading-[1.7] text-foreground mb-4">
            Let me know what resonates, or if you'd rather jump on a quick call once you've had a chance to sit with it.
          </p>
          <p className="text-[15px] leading-[1.7] text-foreground">
            Happy to answer any questions before you decide. And if anything in here doesn't quite reflect what we discussed, just say — it's easy to adjust at this stage.
          </p>

          <div className="mt-8 border-l-[3px] border-accent pl-5">
            <p className="font-sans text-[15px] text-foreground leading-[1.7]">
              Brendan
            </p>
          </div>
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

export default ArcCollectiveProposalPage;
