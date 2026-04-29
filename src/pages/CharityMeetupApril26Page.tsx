import { useState } from "react";
import { Compass, Linkedin, ArrowRight, GraduationCap, Zap, FileStack, Sparkles, Brain, Mail } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { Footer } from "@/components/Footer";
import { PowerHourBookingDrawer } from "@/components/PowerHourBookingDrawer";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import WhiteLogo from "@/assets/logos/White_TS_Stacked.svg";
import avatarPhoto from "@/assets/brendan-avatar.webp";

const RESOURCES = [
  {
    title: "AI Training Resources",
    description: "A curated Notion hub of AI training links for nonprofits — courses, primers, and trusted starting points to build confidence with the tools.",
    icon: GraduationCap,
    cta: "Open the resource hub",
    url: "https://threadandstack.notion.site/AI-Resources-for-Nonprofits-3518863b87d4802c98f0eed5afc6ecea",
    available: true,
  },
  {
    title: "Quick Wins",
    description: "Small, immediate AI moves your team can apply this week — drafting, summarising, repurposing, and reclaiming time from admin chaos.",
    icon: Zap,
    cta: "Coming soon",
    url: "#",
    available: false,
  },
  {
    title: "Templates for AI Skills",
    description: "Prompt and workflow templates designed for charity teams — fundraising, comms, and operations — so you can practise the skills, not start from scratch.",
    icon: FileStack,
    cta: "Coming soon",
    url: "#",
    available: false,
  },
];

const CharityMeetupApril26Page = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:py-20 space-y-8 sm:space-y-10">
        {/* Avatar + Logo */}
        <div className="flex items-center gap-4">
          <img src={avatarPhoto} alt="Brendan" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-border" />
          <img src={WhiteLogo} alt="Thread & Stack" className="h-12 sm:h-14 opacity-80" />
        </div>

        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-sans text-muted-foreground uppercase tracking-widest">
            Charity Meetup London · April 2026
          </p>
          <h1 className="font-serif-pro text-3xl sm:text-4xl md:text-5xl font-semibold italic leading-tight">
            The Smart Digital Shift
            <br />
            Your AI starter pack 🌱
          </h1>
        </div>

        {/* Limited Offer */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="group block w-full text-left relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent))]/80 text-[hsl(var(--accent-foreground))] p-5 sm:p-6 shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.5)] transition-transform hover:-translate-y-0.5"
        >
          <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/15 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 flex-1">
              <p className="text-[11px] sm:text-xs font-sans uppercase tracking-widest opacity-80">
                Charity Meetup attendees — limited offer
              </p>
              <h2 className="font-serif-pro text-xl sm:text-2xl font-semibold italic leading-tight">
                AI Power-Hour Offer · £100 off
              </h2>
              <p className="text-[13px] sm:text-sm font-sans font-medium opacity-95">
                One hour, one workflow — normally £395.
              </p>
              <p className="text-[13px] sm:text-sm font-sans opacity-90">
                Pick a workflow that's eating your team's time, and we'll spend an hour together to get it running with AI properly.
              </p>
              <p className="text-[13px] sm:text-sm font-sans opacity-90 pt-0.5">
                Voucher: <span className="font-mono font-semibold tracking-wider">CHARITYMEETUP100</span> <span className="opacity-75">(first 10 claimed)</span>
              </p>
              <p className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-medium pt-1 group-hover:gap-2 transition-all">
                Claim your slot <ArrowRight className="w-4 h-4" />
              </p>
            </div>
          </div>
        </button>

        <div className="font-sans text-[15px] sm:text-base md:text-lg text-muted-foreground leading-relaxed space-y-4">
          <p>
            Lovely to be in the room with you for{" "}
            <span className="text-foreground font-medium">Future-Proofing Your Charity</span> at Oliver Wyman, hosted by Dawn Newton.
            I co-led the <span className="text-foreground font-medium">Smart Digital Shift</span> chat room with David Cobb — and promised to share the resources I mentioned.
          </p>
          <p>
            Below are three things to help your team move from{" "}
            <em className="text-foreground not-italic font-medium">"AI feels overwhelming"</em>{" "}
            to <em className="text-foreground not-italic font-medium">"we've actually tried it this week"</em>. No jargon, no hype — just practical, human-first ways in.
          </p>
        </div>

        {/* Resources */}
        <div className="space-y-4">
          {RESOURCES.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="rounded-xl border bg-card p-5 sm:p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="font-serif-pro text-lg sm:text-xl font-semibold italic leading-tight">
                      {r.title}
                    </h2>
                    <p className="text-[14px] sm:text-[15px] text-muted-foreground font-sans leading-relaxed">
                      {r.description}
                    </p>
                  </div>
                </div>
                {r.available ? (
                  <PillButton asChild icon={ArrowRight} className="w-full sm:w-auto">
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      {r.cta}
                    </a>
                  </PillButton>
                ) : (
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans text-muted-foreground border border-dashed border-border rounded-full px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
                    {r.cta} — I'll share this shortly
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* How I think about AI */}
        <div className="rounded-xl border bg-card p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif-pro text-lg sm:text-xl font-semibold italic leading-tight">
                How I think about AI use
              </h2>
              <p className="text-[14px] sm:text-[15px] text-muted-foreground font-sans leading-relaxed">
                Two simple frameworks I lean on so AI stays a tool that serves the mission — not the other way round.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-lg bg-background/50 border border-border p-4 space-y-2">
              <p className="text-[11px] font-sans uppercase tracking-widest text-[hsl(var(--accent))]">
                The 4 C's
              </p>
              <p className="font-serif-pro text-base font-semibold italic">
                What stays human
              </p>
              <ul className="text-[13px] sm:text-sm font-sans text-muted-foreground space-y-1.5 leading-snug">
                <li><span className="text-foreground font-medium">Connection</span> — relationships and trust</li>
                <li><span className="text-foreground font-medium">Care</span> — empathy and judgement</li>
                <li><span className="text-foreground font-medium">Creativity</span> — original thinking and craft</li>
                <li><span className="text-foreground font-medium">Conviction</span> — values and decisions</li>
              </ul>
            </div>

            <div className="rounded-lg bg-background/50 border border-border p-4 space-y-2">
              <p className="text-[11px] font-sans uppercase tracking-widest text-[hsl(var(--accent))]">
                The 4 D's
              </p>
              <p className="font-serif-pro text-base font-semibold italic">
                How to operate with AI
              </p>
              <ul className="text-[13px] sm:text-sm font-sans text-muted-foreground space-y-1.5 leading-snug">
                <li><span className="text-foreground font-medium">Delegation</span> — knowing whether, when, and how to engage AI</li>
                <li><span className="text-foreground font-medium">Description</span> — articulating goals clearly enough to prompt useful behaviour</li>
                <li><span className="text-foreground font-medium">Discernment</span> — accurately assessing AI outputs</li>
                <li><span className="text-foreground font-medium">Diligence</span> — ethics, transparency, and accountability</li>
              </ul>
            </div>
          </div>

          <p className="text-[13px] sm:text-sm font-sans text-muted-foreground italic">
            Protect the C's. Practise the D's. That's the shift.
          </p>

          <PillButton variant="outline" icon={ArrowRight} asChild className="w-full sm:w-auto">
            <a href="/how-i-work">Read more</a>
          </PillButton>
        </div>

        {/* Stay connected */}
        <div className="border-t border-border pt-6 sm:pt-8 space-y-4 sm:space-y-5">
          <h2 className="font-serif-pro text-xl sm:text-2xl font-semibold italic">Let's stay connected</h2>
          <p className="font-sans text-sm sm:text-base text-muted-foreground">
            If you'd like a hand piloting AI in your charity — narrative, ops, or building custom assistants on Notion — I'd love to chat. No pressure, just useful conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <PillButton variant="indigo" icon={Linkedin} asChild className="w-full sm:w-auto">
              <a
                href="https://www.linkedin.com/in/rodgersbrendan/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
            </PillButton>
            <PillButton variant="outline" icon={Mail} asChild className="w-full sm:w-auto">
              <a href="mailto:br@brendanrodgers.uk">Email me</a>
            </PillButton>
          </div>
        </div>
      </main>
      <Footer />
      <PowerHourBookingDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        source="charity-meetup-april26"
        defaultCoupon="CHARITYMEETUP100"
      />
    </div>
  );
};

export default CharityMeetupApril26Page;
