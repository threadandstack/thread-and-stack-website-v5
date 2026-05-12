import { useEffect, useState } from "react";
import { Download, ArrowRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

const SectionLabel = ({ num, title }: { num: string; title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="font-sans text-[13px] font-bold tracking-wider text-accent">{num}</span>
    <span className="font-serif-pro text-[28px] italic font-semibold text-primary leading-tight">{title}</span>
  </div>
);

export type Offer = {
  num: string;
  title: string;
  shape: string;
  scope?: string;
  emotional: string;
  concrete?: string;
  includes?: string[];
  bestFor: string;
  icon?: string;
  variant?: "default" | "dark";
  cta?: { label: string; href: string };
};

type Props = {
  kicker: string;
  headline: React.ReactNode;
  intro: string;
  trackTitle: string;
  trackBlurb: string;
  offers: Offer[];
  startBlurb: string;
  metaTitle: string;
};

const ServicesOnePager = ({
  kicker,
  headline,
  intro,
  trackTitle,
  trackBlurb,
  offers,
  startBlurb,
  metaTitle,
}: Props) => {
  const [openOffers, setOpenOffers] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = metaTitle;

    const metaRobots = document.createElement("meta");
    metaRobots.name = "robots";
    metaRobots.content = "noindex, nofollow";
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, [metaTitle]);

  // Expand all when printing, restore on after-print
  useEffect(() => {
    let prev: string[] = [];
    const before = () => {
      prev = openOffers;
      setOpenOffers(offers.map((_, i) => `offer-${i}`));
    };
    const after = () => setOpenOffers(prev);
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [openOffers, offers]);

  const openAndScroll = (i: number) => {
    const val = `offer-${i}`;
    setOpenOffers((prev) => (prev.includes(val) ? prev : [...prev, val]));
    setTimeout(() => {
      document.getElementById(val)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const handleDownload = () => {
    window.print();
  };


  return (
    <div className="min-h-screen bg-muted/50 flex justify-center items-start py-10 px-5 print:bg-white print:p-0">
      <div className="fixed top-5 right-5 z-50 print:hidden">
        <Button onClick={handleDownload} size="sm" className="gap-2 rounded-lg shadow-lg">
          <Download className="w-3.5 h-3.5" />
          Download PDF
        </Button>
      </div>

      <div className="bg-background w-full max-w-[820px] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden print:shadow-none print:rounded-none print:max-w-full">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-14 pt-[52px] pb-11 max-sm:px-7 max-sm:pt-9 max-sm:pb-8">
          <div className="flex items-center gap-3 mb-6">
            <img src={WhiteStacked} alt="Thread & Stack" className="h-8" />
            <span className="text-primary-foreground/40">·</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-[#FF6200]">{kicker}</span>
          </div>
          <h1 className="font-serif-pro text-[52px] max-sm:text-[38px] italic font-bold leading-[1.15] text-primary-foreground mb-5">
            {headline}
          </h1>
          <p className="font-sans text-[15px] text-primary-foreground/80 leading-relaxed max-w-[600px] mb-7">
            {intro}
          </p>

          {/* Offer pills */}
          <div className="flex flex-wrap gap-2 mb-2">
            {offers.map((o, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => openAndScroll(idx)}
                className="group inline-flex items-center gap-2 bg-primary-foreground/[0.06] hover:bg-primary-foreground/[0.12] border border-primary-foreground/15 hover:border-[#FF6200]/60 transition-colors rounded-full pl-2 pr-3.5 py-1.5 print:bg-transparent print:border-primary-foreground/30"
              >
                <span className="font-sans text-[10px] font-bold text-[#FF6200] bg-[#FF6200]/15 rounded-full w-5 h-5 flex items-center justify-center">
                  {o.num}
                </span>
                <span className="font-sans text-[12.5px] font-medium text-primary-foreground/90 group-hover:text-primary-foreground">
                  {o.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-14 pt-[52px] pb-14 max-sm:px-7 max-sm:pt-9 max-sm:pb-9">
          {/* How we work */}
          <div className="bg-muted rounded-2xl p-7 mb-10">
            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-accent mb-2">How we work</div>
            <p className="text-[15px] leading-[1.7] text-foreground">
              Three engagement shapes across every track. A <strong>Rapid Intervention</strong> for the question you want answered in a session. A <strong>Concentrated Project</strong> when there is a defined piece of work to be done. An <strong>Ongoing Partnership</strong> when the work is continuous and the value compounds. Most clients start with an intervention or a project, and the ones who stay tend to move onto a retainer.
            </p>
          </div>

          {/* Track intro */}
          <SectionLabel num="01" title={trackTitle} />
          <p className="text-[15px] leading-[1.7] text-foreground mb-10">{trackBlurb}</p>

          {/* Offers (expandable) */}
          <Accordion
            type="multiple"
            value={openOffers}
            onValueChange={setOpenOffers}
            className="flex flex-col gap-3"
          >
            {offers.map((offer, i) => {
              const val = `offer-${i}`;
              return (
                <AccordionItem
                  key={i}
                  id={val}
                  value={val}
                  className={
                    offer.variant === "dark"
                      ? "scroll-mt-8 border border-black rounded-2xl bg-black text-white overflow-hidden print:break-inside-avoid"
                      : "scroll-mt-8 border border-border/60 rounded-2xl bg-card overflow-hidden print:break-inside-avoid"
                  }
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline [&>svg]:hidden group">
                    <div className="flex items-center gap-4 flex-1 text-left">
                      {offer.icon ? (
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <img src={offer.icon} alt="" className="w-5 h-5 object-contain" />
                        </span>
                      ) : (
                        <span className="font-sans text-[11px] font-bold text-[#FF6200] bg-[#FF6200]/10 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
                          {offer.num}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-serif-pro text-[20px] italic font-semibold leading-tight mb-1 ${offer.variant === "dark" ? "text-white" : "text-primary"}`}>
                          {offer.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className={`font-sans text-[10px] font-bold uppercase tracking-[0.14em] ${offer.variant === "dark" ? "text-[#FF6200]" : "text-accent"}`}>
                            {offer.shape}
                          </span>
                          {offer.scope && (
                            <>
                              <span className={offer.variant === "dark" ? "text-white/40 text-[10px]" : "text-muted-foreground/50 text-[10px]"}>·</span>
                              <span className={`font-sans text-[12px] ${offer.variant === "dark" ? "text-white/70" : "text-muted-foreground"}`}>{offer.scope}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-colors print:hidden ${offer.variant === "dark" ? "border-white/30 text-white/70 group-hover:text-[#FF6200] group-hover:border-[#FF6200]" : "border-border text-muted-foreground group-hover:text-accent group-hover:border-accent"}`}>
                        <Plus className="w-3.5 h-3.5 group-data-[state=open]:hidden" />
                        <Minus className="w-3.5 h-3.5 hidden group-data-[state=open]:block" />
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5">
                    <p className={`text-[15px] leading-[1.7] mb-3 ${offer.variant === "dark" ? "text-white/85" : "text-foreground"}`}>{offer.emotional}</p>

                    {offer.concrete && (
                      <p className={`text-[15px] leading-[1.7] mb-3 ${offer.variant === "dark" ? "text-white/85" : "text-foreground"}`}>{offer.concrete}</p>
                    )}

                    {offer.includes && offer.includes.length > 0 && (
                      <div className={`rounded-xl px-5 py-[18px] mb-4 mt-4 ${offer.variant === "dark" ? "bg-white/5" : "bg-muted/60"}`}>
                        <h4 className={`font-serif-pro text-[16px] italic font-semibold mb-3 ${offer.variant === "dark" ? "text-white" : "text-primary"}`}>What's included</h4>
                        <div className="flex flex-col gap-2">
                          {offer.includes.map((item, idx) => (
                            <div key={idx} className={`flex items-start gap-2.5 text-[13.5px] leading-[1.55] ${offer.variant === "dark" ? "text-white/85" : "text-foreground"}`}>
                              <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 mt-px ${offer.variant === "dark" ? "bg-[#FF6200]/15 border-[#FF6200] text-[#FF6200]" : "bg-accent/10 border-accent text-accent"}`}>
                                <CheckIcon />
                              </div>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {offer.cta && (
                      <a
                        href={offer.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#FF6200] text-white font-sans text-[13px] font-semibold px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity mt-2 mb-3"
                      >
                        {offer.cta.label}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <div className={`rounded-xl p-4 mt-3 ${offer.variant === "dark" ? "bg-[#FF6200]/10" : "bg-accent/5"}`}>
                      <p className={`text-[13.5px] leading-[1.6] ${offer.variant === "dark" ? "text-white/90" : "text-foreground"}`}>
                        <span className={`font-semibold ${offer.variant === "dark" ? "text-[#FF6200]" : "text-accent"}`}>Best for: </span>{offer.bestFor}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="h-px bg-border my-10" />

          {/* How to start */}
          <SectionLabel num="02" title="How to start" />
          <p className="text-[15px] leading-[1.7] text-foreground mb-6">{startBlurb}</p>

          <a
            href="https://calendly.com/brendanrodgersuk/book-a-discovery-call-with-brendan-rodgers-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-sans text-[14px] font-semibold px-5 py-3 rounded-full hover:opacity-90 transition-opacity print:hidden"
          >
            Book a discovery call
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Payment terms */}
          <div className="bg-muted rounded-2xl p-[18px] px-5 mt-10">
            <div className="flex gap-3.5 items-start text-accent">
              <div className="flex-shrink-0 mt-0.5"><CardIcon /></div>
              <div className="flex-1">
                <div className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent mb-1.5">Pricing & terms</div>
                <div className="font-sans text-[13.5px] text-foreground leading-[1.65]">
                  Pricing is shaped to scope and surfaced during the discovery conversation. Standard terms are 50% upfront and 50% on delivery. Thread & Stack is not VAT registered. A 15% late charge applies to any payment not received within 30 days of invoicing.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-14 py-7 flex items-center justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:px-7">
          <p className="text-[13.5px] text-muted-foreground leading-[1.55] max-w-[420px]">
            Brendan Rodgers · <a href="https://threadandstack.com/" className="text-accent hover:underline">threadandstack.com</a>
          </p>
          <img src={GreyStacked} alt="Thread & Stack" className="h-8 opacity-50 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default ServicesOnePager;
