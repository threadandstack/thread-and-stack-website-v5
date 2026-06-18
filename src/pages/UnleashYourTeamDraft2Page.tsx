import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Check,
  Brain,
  Linkedin,
  Mail,
} from "lucide-react";
import { LogoTilt } from "@/components/home-draft2/LogoTilt";
import { DiagnosticDrawer } from "@/components/home-draft2/DiagnosticDrawer";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WAITLIST_STORAGE_KEY = "unleash-your-team-waitlist-joined";


const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
    {children}
  </div>
);

const UnleashYourTeamDraft2Page = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const book = params.get("book");
    if (book === "1" || book === "true" || book === "yes") setDrawerOpen(true);
    try {
      if (sessionStorage.getItem(WAITLIST_STORAGE_KEY) === "1") setJoined(true);
    } catch {
      /* ignore */
    }
  }, []);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
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
      const leadId = crypto.randomUUID();
      const submittedAt = new Date().toISOString();
      const { error } = await supabase.from("leads").insert({
        email,
        source: "unleash-your-team-draft2-waitlist",
        message: "Joined newsletter waitlist",
      });
      if (error) throw error;
      setJoined(true);
      try {
        sessionStorage.setItem(WAITLIST_STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }

      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "unleash-resources-confirmation",
            recipientEmail: email,
            idempotencyKey: `unleash-waitlist-${leadId}`,
          },
        })
        .catch((err) => console.error("Visitor confirmation email failed", err));

      supabase.functions
        .invoke("send-transactional-email", {
          body: {
            templateName: "unleash-lead-admin-notification",
            recipientEmail: "br@brendanrodgers.uk",
            idempotencyKey: `unleash-waitlist-admin-${leadId}`,
            templateData: {
              email,
              source: "unleash-your-team-draft2-waitlist",
              message: "Joined newsletter waitlist",
              submittedAt,
            },
          },
        })
        .catch((err) => console.error("Admin notification email failed", err));

      toast({
        title: "You're on the waitlist",
        description: "Thanks — I'll be in touch when the newsletter launches.",
      });
    } catch (err) {
      console.error("Waitlist signup failed:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
      <PaymentTestModeBanner />
      <Navigation variant={theme === "dark" ? "image-hero" : "default"} hideLogo />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-hairline">
          <div aria-hidden className="aurora">
            <span />
          </div>
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              maskImage:
                "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
            <div className="flex flex-col items-center text-center">
              <div className="fade-up mb-8">
                <LogoTilt className="h-28 sm:h-36 md:h-44" theme={theme} />
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="fade-up fade-up-1 relative inline-flex h-8 w-[72px] items-center rounded-full border border-hairline bg-paper/70 px-1 backdrop-blur transition-colors hover:border-indigo/50"
              >
                <span
                  className={`absolute top-1 grid h-6 w-6 place-items-center rounded-full text-accent-foreground shadow-[0_2px_8px_-2px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out ${
                    theme === "dark" ? "left-1" : "left-[calc(100%-1.75rem)]"
                  }`}
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, hsl(var(--orange)), hsl(var(--violet)))",
                  }}
                >
                  {theme === "dark" ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                </span>
                <span className="flex w-full items-center justify-between px-1.5 text-ink-soft/60">
                  <Sun
                    className={`h-3 w-3 transition-opacity ${theme === "light" ? "opacity-0" : "opacity-100"}`}
                  />
                  <Moon
                    className={`h-3 w-3 transition-opacity ${theme === "dark" ? "opacity-0" : "opacity-100"}`}
                  />
                </span>
              </button>

              <p className="fade-up fade-up-1 mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                For purpose-driven teams · AI that frees you up
              </p>

              <h1 className="font-sans not-italic fade-up fade-up-2 mt-5 max-w-5xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.035em] md:text-[78px]">
                Unleash your team
                <br />
                <span
                  className="font-serif-pro italic font-normal bg-clip-text text-transparent text-5xl md:text-7xl"
                  style={{ backgroundImage: "linear-gradient(100deg, var(--gradient-4color))" }}
                >
                  create meaningful change
                </span>
              </h1>

              <p className="fade-up fade-up-3 mt-7 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
                AI that frees you to be strategic & creative 🌱
              </p>
            </div>
          </div>
        </section>

        {/* LETTER */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            <SectionLabel>An open letter</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-8">
              Remove the systemic tax
            </h2>
            <div className="space-y-5 text-[16px] leading-relaxed text-ink-soft">
              <p>
                Mission-led teams carry a{" "}
                <span className="text-foreground font-medium">systemic tax</span>: the admin
                chaos, the inbox sprawl, the half-finished docs that swallow the time you'd
                rather spend on strategy, story, and the work that actually moves the needle.
                It's the visible symptom of a deeper cognitive load.
              </p>
              <p>
                The barrier to AI actually relieving that load is what we call the{" "}
                <span className="text-foreground font-medium">context wall</span>. Your team has
                the ingredients for good decisions: notes, project history, client nuance, the
                why behind the work. But it's scattered across tools, docs, and threads, so the
                model never gets what it needs at the moment you need it.
              </p>
              <p>
                We help purpose-driven teams{" "}
                <span className="text-foreground font-medium">unify fragmented knowledge</span>{" "}
                and protect your team's golden thread, building{" "}
                <span className="text-foreground font-medium">truly empowering systems</span>{" "}
                that bridge the context wall, so your people are freed up to do their most
                strategic and creative work, not replaced by a machine.
              </p>
              <p>
                I've included a discounted Stack Diagnostic below for impact-focused teams,
                should you want hands-on support. You can also join the waitlist for the
                upcoming newsletter for purpose-driven teams putting AI to work.
              </p>

              <p className="font-serif-pro italic text-foreground text-lg">
                Warm wishes,
                <br />
                Brendan @ Thread &amp; Stack
              </p>
            </div>
          </div>
        </section>

        {/* VOUCHER */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
            <SectionLabel>For purpose-led teams</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-10">
              A discounted Stack Diagnostic
            </h2>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-hairline bg-paper/50 p-6 md:p-8 text-left backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-indigo/50"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, hsl(var(--orange)), transparent)",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full opacity-30 blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, hsl(var(--indigo)), transparent)",
                }}
              />

              <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background/60 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider text-ink-soft backdrop-blur">
                    <Sparkles className="h-3 w-3 text-orange" strokeWidth={2} />
                    Purpose-Led Teams
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span
                      className="font-serif-pro italic text-7xl md:text-8xl font-semibold leading-none bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, hsl(var(--orange)), hsl(var(--violet)))",
                      }}
                    >
                      15%
                    </span>
                    <span className="text-[13px] uppercase tracking-[0.18em] text-muted-foreground">
                      off
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif-pro italic text-2xl md:text-3xl tracking-tight">
                    Stack Diagnostic
                  </h3>
                  <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
                    A paid 90-minute session plus a written blueprint. Normally{" "}
                    <span className="text-foreground">£395</span>, yours for{" "}
                    <span className="text-foreground font-medium">£335.75</span>. Bring your
                    stack, your sprawl, and the questions your team keeps asking, and leave
                    with a plan you could execute alone. Credited in full against any build
                    you choose afterwards.
                  </p>
                </div>

                <div className="flex flex-col items-start gap-4 md:items-end">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-dashed border-hairline bg-background/70 px-4 py-3 backdrop-blur">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Voucher
                    </span>
                    <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
                      IMPACT15
                    </span>
                  </div>
                  <span
                    className="inline-flex h-12 items-center rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-transform group-hover:-translate-y-px"
                    style={{
                      backgroundImage: "linear-gradient(95deg, var(--gradient-3color))",
                    }}
                  >
                    Claim your slot
                    <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </span>
                  </span>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* EMAIL GATE + RESOURCES */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
            <SectionLabel>Free starter pack</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-10">
              Three resources to begin with
            </h2>

            {!unlocked && (
              <div className="mb-8 rounded-2xl border border-hairline bg-paper/40 p-6 md:p-8 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-hairline bg-background/70 text-indigo">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif-pro italic text-xl md:text-2xl">
                      Join the mailing list to unlock
                    </h3>
                    <p className="text-[14.5px] text-ink-soft leading-relaxed">
                      Pop your email in once and all three resources unlock below. No spam, just
                      occasional, useful notes for purpose-driven teams.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUnlock} className="relative mt-5 space-y-3">
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
                      id="unleash-d2-consent"
                      checked={consent}
                      onCheckedChange={(c) => setConsent(c === true)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="unleash-d2-consent"
                      className="cursor-pointer text-xs sm:text-sm leading-tight text-muted-foreground"
                    >
                      I agree to be emailed by Thread &amp; Stack
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !consent}
                    className="group h-12 text-accent-foreground transition-transform hover:-translate-y-px"
                    style={{
                      backgroundImage: "linear-gradient(95deg, var(--gradient-3color))",
                    }}
                  >
                    {isSubmitting ? "Unlocking…" : "Unlock resources"}
                    <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </span>
                  </Button>
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
                <p className="mt-3 text-[11px] text-muted-foreground/70">
                  Unsubscribe any time. We never share your data.
                </p>
              </div>
            )}

            {unlocked && (
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-indigo">
                <Check className="h-3.5 w-3.5" />
                Resources unlocked for this session
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              {RESOURCES.map((r) => {
                const Icon = r.icon;
                const isLocked = !unlocked;
                return (
                  <div
                    key={r.title}
                    className="flex flex-col rounded-2xl border border-hairline bg-paper/40 p-6 backdrop-blur-sm transition-colors hover:border-indigo/40"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg border border-hairline bg-background/60 text-indigo">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-serif-pro italic text-2xl">{r.title}</h3>
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">
                      {r.description}
                    </p>
                    <div className="mt-5">
                      {isLocked ? (
                        <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-hairline px-3 py-1.5 text-xs text-muted-foreground">
                          <Lock className="h-3.5 w-3.5" />
                          Join the list above to unlock
                        </div>
                      ) : (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center text-[14px] font-medium text-indigo hover:text-indigo/80"
                        >
                          {r.cta}
                          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW I THINK ABOUT AI */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
            <SectionLabel>The frameworks</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-3">
              How I think about AI use
            </h2>
            <p className="mb-10 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
              Two simple frameworks I lean on so AI stays a tool that serves the mission, not
              the other way round.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-paper/40 p-6 md:p-8 backdrop-blur-sm">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-hairline bg-background/60 text-indigo">
                  <Brain className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-indigo">
                  The 4 C's
                </p>
                <h3 className="mt-1 font-serif-pro italic text-2xl">What stays human</h3>
                <ul className="mt-4 space-y-2 text-[15px] text-ink-soft">
                  <li>
                    <span className="text-foreground font-medium">Connection</span>: belonging,
                    trust, and rapport
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Creativity</span>: judgement,
                    taste, and craft
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Curiosity</span>: better
                    questions and reframes
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Contribution</span>: purpose
                    and meaning
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-hairline bg-paper/40 p-6 md:p-8 backdrop-blur-sm">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-hairline bg-background/60 text-orange">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-orange">
                  The 4 D's
                </p>
                <h3 className="mt-1 font-serif-pro italic text-2xl">How to operate with AI</h3>
                <ul className="mt-4 space-y-2 text-[15px] text-ink-soft">
                  <li>
                    <span className="text-foreground font-medium">Delegation</span>: knowing
                    whether, when, and how to engage AI
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Description</span>:
                    articulating goals clearly enough to prompt useful behaviour
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Discernment</span>: accurately
                    assessing AI outputs
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Diligence</span>: ethics,
                    transparency, and accountability
                  </li>
                </ul>
              </div>
            </div>

            <p className="mt-8 font-serif-pro italic text-lg text-ink-soft">
              Protect the C's. Practise the D's. That's the shift.
            </p>

            <div className="mt-6">
              <a
                href="/how-i-work"
                className="group inline-flex items-center text-[14.5px] font-medium text-indigo hover:text-indigo/80"
              >
                Read more
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </section>

        {/* STAY CONNECTED */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <SectionLabel>Let's stay connected</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-6">
              Up for a useful conversation?
            </h2>
            <p className="text-[16px] leading-relaxed text-ink-soft">
              If you'd like a hand piloting AI in your team, whether that's narrative, ops, or
              building custom assistants on Notion, I'd love to chat. No pressure, just useful
              conversation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/rodgersbrendan/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-2 rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-px"
                style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
              >
                <Linkedin className="h-4 w-4" />
                Connect on LinkedIn
              </a>
              <a
                href="mailto:br@brendanrodgers.uk"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-hairline px-6 text-[14.5px] font-medium text-foreground/90 transition-colors hover:bg-foreground/[0.06]"
              >
                <Mail className="h-4 w-4" />
                Email me
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <DiagnosticDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        theme={theme}
        source="unleash-your-team-draft2"
        defaultCoupon="IMPACT15"
        initialMode="diagnostic"
      />
    </div>
  );
};

export default UnleashYourTeamDraft2Page;
