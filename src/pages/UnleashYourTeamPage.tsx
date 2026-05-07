import { useState, useEffect } from "react";
import { Linkedin, ArrowRight, GraduationCap, Zap, FileStack, Sparkles, Brain, Mail, Lock, Check, Percent, Scissors } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { Footer } from "@/components/Footer";
import { PowerHourBookingDrawer } from "@/components/PowerHourBookingDrawer";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WhiteLogo from "@/assets/logos/White_TS_Stacked.svg";
import avatarPhoto from "@/assets/brendan-avatar.webp";

const UNLOCK_STORAGE_KEY = "unleash-your-team-resources-unlocked";

const RESOURCES = [
  {
    title: "AI Training Resources",
    description: "A curated Notion hub of AI training links for purpose-driven teams: courses, primers, and trusted starting points to build confidence with the tools.",
    icon: GraduationCap,
    cta: "Open the resource hub",
    url: "https://threadandstack.notion.site/AI-Resources-for-Nonprofits-3518863b87d4802c98f0eed5afc6ecea",
    available: true,
  },
  {
    title: "Quick Wins With AI",
    description: "Small, immediate AI moves your team can apply this week: drafting, summarising, repurposing, and reclaiming time from admin chaos.",
    icon: Zap,
    cta: "Open quick wins",
    url: "https://threadandstack.notion.site/Quick-Wins-With-AI-3518863b87d480f9aaa8def89f7f1726",
    available: true,
  },
  {
    title: "Prompts & Skills for AI",
    description: "Prompt and workflow templates designed for mission-led teams across fundraising, comms, and operations, so you can practise the skills without starting from scratch.",
    icon: FileStack,
    cta: "Open prompts & skills",
    url: "https://threadandstack.notion.site/Prompts-Skills-for-AI-3518863b87d480659135cc9c9f508008",
    available: true,
  },
];

const UnleashYourTeamPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const book = params.get("book");
    if (book === "1" || book === "true" || book === "yes") {
      setDrawerOpen(true);
    }
    try {
      if (sessionStorage.getItem(UNLOCK_STORAGE_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please tick the box to receive emails.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        email,
        source: "unleash-your-team-resources",
        message: "Unlocked AI starter pack resources",
      });
      if (error) throw error;
      setUnlocked(true);
      try { sessionStorage.setItem(UNLOCK_STORAGE_KEY, "1"); } catch { /* ignore */ }
      toast({ title: "Resources unlocked", description: "Thanks — links are open below." });
    } catch (error: any) {
      console.error("Lead capture failed:", error);
      setUnlocked(true);
      try { sessionStorage.setItem(UNLOCK_STORAGE_KEY, "1"); } catch { /* ignore */ }
      toast({ title: "Resources unlocked", description: "Links are open below." });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            For purpose-driven teams · AI that frees you up
          </p>
          <h1 className="font-serif-pro text-3xl sm:text-4xl md:text-5xl font-semibold italic leading-tight">
            <span className="bg-gradient-to-r from-[#FF6200] via-[#FF8A3D] to-[#FFB36B] bg-clip-text text-transparent">
              Unleash your team's power
            </span>
            <br />
            <span className="text-3xl">AI that frees you to be strategic & creative 🌱</span>
          </h1>
        </div>

        <div className="font-sans text-[15px] sm:text-base md:text-lg text-muted-foreground leading-relaxed space-y-4">
          <p>
            Mission-led teams carry a quiet <span className="text-foreground font-medium">creative tax</span>: the admin chaos, the inbox sprawl, the half-finished docs that swallow the time you'd rather spend on strategy, story, and the work that actually moves the needle. It's the visible symptom of a deeper cognitive load.
          </p>
          <p>
            The barrier to AI actually relieving that load is what we call the <span className="text-foreground font-medium">context wall</span>. Your team has the ingredients for good decisions: notes, project history, client nuance, the why behind the work. But it's scattered across tools, docs, and threads, so the model never gets what it needs at the moment you need it.
          </p>
          <p>
            We help purpose-driven teams adopt practical <span className="text-foreground font-medium">AI workflows</span> that bridge the context wall, so your people are freed up to do their most strategic and creative work, not replaced by a machine.
          </p>
          <p>
            Below are three free resources to get you started.
          </p>
          <p>
            I've also included a discounted 1:1 Power-Hour for impact-focused teams, should you want hands-on support.
          </p>
          <p>
            Warm wishes,<br />
            <span className="text-foreground font-medium">Brendan @ Thread &amp; Stack</span>
          </p>
        </div>

        {/* Limited Offer — Voucher */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="group block w-full text-left relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent))]/80 text-[hsl(var(--accent-foreground))] shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.5)] transition-transform hover:-translate-y-0.5"
        >
          {/* Side notches */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-background z-10" />

          <div className="relative p-5 sm:p-7">
            {/* Solid inner frame */}
            <div className="absolute inset-3 rounded-xl border border-[hsl(var(--background))]/40 pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0">
              {/* Left — offer value */}
              <div className="flex-1 flex flex-col items-center sm:items-start justify-between text-center sm:text-left sm:pr-6 gap-4">
                <div className="flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-sans uppercase tracking-widest opacity-80">
                    <Scissors className="w-3 h-3" />
                    <span>For impact-focused teams</span>
                  </div>
                  <span className="mt-1 text-5xl sm:text-8xl font-extrabold italic tracking-tight font-serif-pro leading-none">
                    15%
                  </span>
                  <h2 className="mt-2 font-serif-pro text-lg sm:text-xl font-semibold italic leading-tight">
                    AI Power-Hour
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[hsl(var(--background))]/40 bg-[hsl(var(--background))]/80 text-[hsl(var(--foreground))]">
                  <span className="text-[10px] uppercase tracking-wider opacity-70">Voucher</span>
                  <span className="font-mono font-bold tracking-wider text-sm">IMPACT15</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:flex flex-col items-center justify-center px-6">
                <div className="w-px h-full border-l border-[hsl(var(--background))]/40" />
              </div>
              <div className="flex sm:hidden items-center justify-center">
                <div className="w-full h-px border-t border-[hsl(var(--background))]/40" />
              </div>

              {/* Right — details + CTA */}
              <div className="flex-[1.4] flex flex-col justify-between gap-4 sm:pl-6">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base font-sans font-medium opacity-95">
                    One hour, one workflow. Normally £395, yours for <span className="font-bold">£335.75</span>.
                  </p>
                  <p className="text-[13px] sm:text-sm font-sans opacity-90 leading-relaxed">
                    Pick a workflow that's eating your team's time, and we'll spend an hour together getting it running with AI properly.
                  </p>
                </div>
                <span className="inline-flex items-center self-start sm:self-end rounded-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] pl-5 pr-5 py-2 text-sm font-sans font-medium shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all">
                  Claim your slot
                  <span className="w-0 h-5 flex items-center justify-center overflow-hidden transition-all duration-300 opacity-0 scale-75 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Email gate */}
        {!unlocked && (
          <div className="rounded-xl border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/5 p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="font-serif-pro text-lg sm:text-xl font-semibold italic leading-tight">
                  Join our mailing list to access these free resources
                </h2>
                <p className="text-[14px] sm:text-[15px] text-muted-foreground font-sans leading-relaxed">
                  Pop your email in once and all three resources unlock below. No spam, just occasional, useful notes for purpose-driven teams.
                </p>
              </div>
            </div>
            <form onSubmit={handleUnlock} className="relative space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
              <div className="flex items-start gap-2">
                <Checkbox
                  id="unleash-consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="unleash-consent"
                  className="text-xs sm:text-sm text-muted-foreground cursor-pointer leading-tight"
                >
                  I agree to be emailed by Thread &amp; Stack
                </Label>
              </div>
              <PillButton
                type="submit"
                icon={ArrowRight}
                disabled={isSubmitting || !consent}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Unlocking…" : "Unlock resources"}
              </PillButton>
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <Input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
            </form>
            <p className="text-[11px] text-muted-foreground/70">
              Unsubscribe any time. We never share your data.
            </p>
          </div>
        )}

        {/* Resources */}
        <div className="space-y-4">
          {unlocked && (
            <div className="inline-flex items-center gap-2 text-xs font-sans text-[hsl(var(--accent))]">
              <Check className="w-3.5 h-3.5" />
              Resources unlocked for this session
            </div>
          )}
          {RESOURCES.map((r) => {
            const Icon = r.icon;
            const isLocked = !unlocked;
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
                  isLocked ? (
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans text-muted-foreground border border-dashed border-border rounded-full px-3 py-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Join the list above to unlock
                    </div>
                  ) : (
                    <PillButton asChild icon={ArrowRight} className="w-full sm:w-auto">
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        {r.cta}
                      </a>
                    </PillButton>
                  )
                ) : (
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans text-muted-foreground border border-dashed border-border rounded-full px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
                    {r.cta} · I'll share this shortly
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
                Two simple frameworks I lean on so AI stays a tool that serves the mission, not the other way round.
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
                <li className="text-base"><span className="text-foreground font-medium">Connection</span>: belonging, trust, and rapport</li>
                <li className="text-base"><span className="text-foreground font-medium">Creativity</span>: judgement, taste, and craft</li>
                <li className="text-base"><span className="text-foreground font-medium">Curiosity</span>: better questions and reframes</li>
                <li className="text-base"><span className="text-foreground font-medium">Contribution</span>: purpose and meaning</li>
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
                <li className="text-base"><span className="text-foreground font-medium">Delegation</span>: knowing whether, when, and how to engage AI</li>
                <li className="text-base"><span className="text-foreground font-medium">Description</span>: articulating goals clearly enough to prompt useful behaviour</li>
                <li className="text-base"><span className="text-foreground font-medium">Discernment</span>: accurately assessing AI outputs</li>
                <li className="text-base"><span className="text-foreground font-medium">Diligence</span>: ethics, transparency, and accountability</li>
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
            If you'd like a hand piloting AI in your team, whether that's narrative, ops, or building custom assistants on Notion, I'd love to chat. No pressure, just useful conversation.
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
        source="unleash-your-team"
        defaultCoupon="IMPACT15"
      />
    </div>
  );
};

export default UnleashYourTeamPage;
