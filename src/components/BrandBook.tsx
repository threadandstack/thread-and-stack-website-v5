import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Download, Sparkles, Copy, ChevronDown } from "lucide-react";
import { Tilt3D } from "@/components/Tilt3D";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/home-draft2/CTA";
import { DiagnosticDrawer } from "@/components/home-draft2/DiagnosticDrawer";
import PageSeo from "@/components/seo/PageSeo";

// Active logos — 12 variants. The 2024 gradient blue mark is retired
// and intentionally not imported here.
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import IndigoStacked from "@/assets/logos/Indigo_TS_Stacked.svg";
import BlackStacked from "@/assets/logos/Black_TS_Stacked.svg";
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import GreyWordmark from "@/assets/logos/Grey_TS_Wordmark.svg";
import IndigoWordmark from "@/assets/logos/Indigo_TS_Wordmark.svg";
import BlackWordmark from "@/assets/logos/Black_TS_Wordmark.svg";
import WhiteWordmark from "@/assets/logos/White_TS_Wordmark.svg";
import GreySocialSq from "@/assets/logos/Grey_TS_SocialSq.svg";
import IndigoSocialSq from "@/assets/logos/Indigo_TS_SocialSq.svg";
import BlackSocialSq from "@/assets/logos/Black_TS_SocialSq.svg";
import WhiteSocialSq from "@/assets/logos/White_TS_SocialSq.svg";

// Photography — full inventory via Vite glob so the section stays in sync
// with whatever ships in `src/assets/photos/`.
const workshopFiles = import.meta.glob(
  "@/assets/photos/workshop/*.webp",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;
const shoreditchFiles = import.meta.glob(
  "@/assets/photos/shoreditch/*.webp",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;
const portraitFiles = import.meta.glob(
  "@/assets/photos/portraits/*.webp",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const sortedUrls = (rec: Record<string, string>) =>
  Object.entries(rec)
    .sort(([a], [b]) => {
      const na = parseInt(a.match(/brendan-(\d+)/)?.[1] ?? "0", 10);
      const nb = parseInt(b.match(/brendan-(\d+)/)?.[1] ?? "0", 10);
      return na - nb;
    })
    .map(([path, url]) => ({ url, name: path.split("/").pop() ?? path }));

const WORKSHOP = sortedUrls(workshopFiles);
const SHOREDITCH = sortedUrls(shoreditchFiles);
const PORTRAITS = sortedUrls(portraitFiles);

const LOGO_INVENTORY: ReadonlyArray<{ src: string; name: string; use: string; dark?: boolean }> = [
  { src: GreyStacked, name: "Grey_TS_Stacked.svg", use: "Default — nav, light backgrounds" },
  { src: IndigoStacked, name: "Indigo_TS_Stacked.svg", use: "Warm gradient — hover / accent" },
  { src: BlackStacked, name: "Black_TS_Stacked.svg", use: "Print, single-colour" },
  { src: WhiteStacked, name: "White_TS_Stacked.svg", use: "On dark backgrounds", dark: true },
  { src: GreyWordmark, name: "Grey_TS_Wordmark.svg", use: "Horizontal lockup, default" },
  { src: IndigoWordmark, name: "Indigo_TS_Wordmark.svg", use: "Horizontal lockup, warm gradient" },
  { src: BlackWordmark, name: "Black_TS_Wordmark.svg", use: "Print, single-colour" },
  { src: WhiteWordmark, name: "White_TS_Wordmark.svg", use: "On dark backgrounds", dark: true },
  { src: GreySocialSq, name: "Grey_TS_SocialSq.svg", use: "Avatar / favicon, default" },
  { src: IndigoSocialSq, name: "Indigo_TS_SocialSq.svg", use: "Avatar / favicon, warm gradient" },
  { src: BlackSocialSq, name: "Black_TS_SocialSq.svg", use: "Print, single-colour" },
  { src: WhiteSocialSq, name: "White_TS_SocialSq.svg", use: "On dark backgrounds", dark: true },
];

// ── Helpers ───────────────────────────────────────────────────────────────

const SECTIONS = [
  ["01", "Brand essence"],
  ["02", "Logo system"],
  ["03", "Colour"],
  ["04", "Gradients"],
  ["04a", "Gradient text"],
  ["05", "Typography"],
  ["06", "Cards & 3D float"],
  ["07", "Pill buttons"],
  ["08", "FAQ pattern"],
  ["09", "Drawers & lightbox"],
  ["10", "Bottom CTA block"],
  ["11", "Animation rules"],
  ["12", "Photography"],
  ["13", "Notion translations"],
  ["14", "Voice & copy"],
  ["15", "Downloads"],
] as const;

const Swatch = ({ name, hex, hsl }: { name: string; hex: string; hsl?: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button onClick={copy} className="text-left group transition-opacity hover:opacity-90">
      <div
        className="w-full aspect-[3/2] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-3"
        style={{ backgroundColor: hex }}
      />
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs font-mono text-muted-foreground group-hover:text-accent transition-colors">
        {copied ? "Copied" : hex}
      </p>
      {hsl && <p className="text-[10px] font-mono text-muted-foreground/60">{hsl}</p>}
    </button>
  );
};

const Gradient = ({ name, css }: { name: string; css: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button onClick={copy} className="text-left group block w-full">
      <div
        className="w-full aspect-[4/1] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] mb-3"
        style={{ background: css }}
      />
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs font-mono text-muted-foreground group-hover:text-accent transition-colors inline-flex items-center gap-1">
          <Copy className="w-3 h-3" /> {copied ? "Copied" : "Copy CSS"}
        </p>
      </div>
      <p className="text-[11px] font-mono text-muted-foreground/70 mt-1 break-all">{css}</p>
    </button>
  );
};

const SectionHead = ({ num, title, kicker }: { num: string; title: string; kicker?: string }) => (
  <div className="space-y-2">
    <div className="flex items-baseline gap-4">
      <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">{num}</span>
      <h2 className="font-serif-pro text-3xl md:text-4xl font-medium">{title}</h2>
    </div>
    {kicker && <p className="text-base text-muted-foreground max-w-2xl pl-12">{kicker}</p>}
  </div>
);

const Rule = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 text-sm text-foreground/80">
    <Check className="w-4 h-4 mt-[3px] text-accent shrink-0" />
    <span>{children}</span>
  </div>
);

const SkillEmbed = ({ name, body }: { name: string; body: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="rounded-2xl bg-muted/40 border border-border/40 overflow-hidden"
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4">
        <span className="text-sm font-medium font-mono">{name}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </summary>
      <pre className="px-5 pb-5 text-[12px] leading-relaxed font-mono whitespace-pre-wrap text-foreground/80">
        {body}
      </pre>
    </details>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────

export const BrandBook = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <PageSeo
        path="/brand-book"
        title="Brand Book — Thread & Stack"
        description="Internal reference for the Thread & Stack visual system, voice, and component patterns."
        noindex
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Floating print */}
        <div className="fixed top-5 right-5 z-50 print:hidden">
          <Button onClick={() => window.print()} size="sm" className="gap-2 rounded-full shadow-lg">
            <Download className="w-3.5 h-3.5" />
            Print
          </Button>
        </div>

        {/* Header */}
        <header className="max-w-6xl mx-auto px-6 md:px-12 pt-20 pb-12">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-mono">
            Internal reference · v4
          </p>
          <h1 className="font-serif-pro text-5xl md:text-7xl font-medium leading-[1.05] mb-6">
            Brand book
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The living source of truth for Thread &amp; Stack. Every pattern on
            this page is rendered with the production component it documents.
            If something here disagrees with the live site, the live site wins
            and this page is updated.
          </p>

          {/* TOC */}
          <nav className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 print:hidden">
            {SECTIONS.map(([num, title]) => (
              <a
                key={num}
                href={`#s${num}`}
                className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-baseline gap-2"
              >
                <span className="font-mono text-xs text-muted-foreground/60">{num}</span>
                <span>{title}</span>
              </a>
            ))}
          </nav>
        </header>

        <main className="max-w-6xl mx-auto px-6 md:px-12 pb-24 space-y-24">
          {/* 01 — Brand essence */}
          <section id="s01" className="scroll-mt-24 space-y-8">
            <SectionHead num="01" title="Brand essence" />
            <div className="rounded-3xl bg-card p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                The problem we name
              </p>
              <h3 className="font-serif-pro text-3xl md:text-4xl leading-tight">
                Operational <span className="text-gradient-warm italic">fragmentation</span>.
              </h3>
              <p className="text-[15.5px] text-foreground/85 leading-relaxed max-w-3xl">
                The founder has hired the right specialists. Marketing, design,
                ops, sales, finance. Each runs their own corner well. Nobody is
                accountable to the whole picture. Running the business is harder
                than it should be, and the cost of that is absorbed silently in
                missed handoffs, repeated work, and energy lost between teams.
              </p>
              <p className="text-[15.5px] text-foreground/85 leading-relaxed max-w-3xl">
                The creative tax is one expression of fragmentation. So are the
                stalled launch, the duplicate CRM, the founder still owning the
                Notion they swore they'd hand over. Same root.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-accent/5 p-8 md:p-10">
                <p className="text-xs uppercase tracking-widest text-accent mb-4 font-mono">
                  Primary service
                </p>
                <h4 className="font-serif-pro text-2xl mb-3">
                  Operations, systems &amp; strategy consultancy
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  For teams of five to fifty experiencing fragmentation, ready
                  to unlock growth and do their best work. Notion-native,
                  AI-aware, behaviourally informed.
                </p>
              </div>
              <div className="rounded-3xl bg-card p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                  Retained secondary
                </p>
                <h4 className="font-serif-pro text-2xl mb-3">Narratives &amp; Strategy</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Positioning, story, messaging. Retained quietly for
                  value-aligned creative work. Not a peer of the primary
                  service.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-card p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                Founder positioning
              </p>
              <p className="font-serif-pro text-xl md:text-2xl leading-snug">
                Brendan is a <span className="italic">strategist, systems thinker, AI ops
                consultant,</span> and <span className="italic">behavioural-science-informed
                integrator</span>. Not another specialist. The person willing to
                hold the whole picture.
              </p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-6 max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                Recurring brand thread
              </p>
              <p className="font-serif-pro italic text-lg">
                Transformation doesn't work until it works.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Use as a closing line where one is needed. Not a headline
                device. There is no current brand line above the fold.
              </p>
            </div>
          </section>

          {/* 02 — Logo system */}
          <section id="s02" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="02"
              title="Logo system"
              kicker="One mark, four colourways, three forms. Twelve files in src/assets/logos/."
            />

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Stacked
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { src: GreyStacked, label: "Grey · default" },
                  { src: IndigoStacked, label: "Warm gradient · hover / accent" },
                  { src: BlackStacked, label: "Black" },
                  { src: WhiteStacked, label: "White · on dark", dark: true },
                ].map((l) => (
                  <div
                    key={l.label}
                    className={`p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-4 aspect-square ${
                      l.dark ? "bg-foreground" : "bg-card"
                    }`}
                  >
                    <img src={l.src} alt={l.label} className="h-16 w-auto" />
                    <p className={`text-xs ${l.dark ? "text-background/70" : "text-muted-foreground"}`}>
                      {l.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Wordmark
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { src: GreyWordmark, label: "Grey" },
                  { src: IndigoWordmark, label: "Warm gradient" },
                  { src: BlackWordmark, label: "Black" },
                  { src: WhiteWordmark, label: "White", dark: true },
                ].map((l) => (
                  <div
                    key={l.label}
                    className={`p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-4 aspect-[2/1] ${
                      l.dark ? "bg-foreground" : "bg-card"
                    }`}
                  >
                    <img src={l.src} alt={l.label} className="h-6 w-auto" />
                    <p className={`text-xs ${l.dark ? "text-background/70" : "text-muted-foreground"}`}>
                      {l.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Social square (favicon)
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { src: GreySocialSq, label: "Grey" },
                  { src: IndigoSocialSq, label: "Warm gradient" },
                  { src: BlackSocialSq, label: "Black" },
                  { src: WhiteSocialSq, label: "White", dark: true },
                ].map((l) => (
                  <div
                    key={l.label}
                    className={`p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center gap-3 ${
                      l.dark ? "bg-foreground" : "bg-card"
                    }`}
                  >
                    <img src={l.src} alt={l.label} className="h-14 w-14" />
                    <p className={`text-xs ${l.dark ? "text-background/70" : "text-muted-foreground"}`}>
                      {l.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 03 — Colour */}
          <section id="s03" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="03"
              title="Colour"
              kicker="Light mode is the default. Dark mode is a peer, not an afterthought. Click any swatch to copy the hex."
            />

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Light mode
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                <Swatch name="Background" hex="#FFFFFF" hsl="0 0% 100%" />
                <Swatch name="Foreground" hex="#0D0D0D" hsl="0 0% 5%" />
                <Swatch name="Card" hex="#FCFCFC" hsl="0 0% 99%" />
                <Swatch name="Accent · Indigo" hex="#1340E8" hsl="234 89% 50%" />
                <Swatch name="Muted" hex="#F5F5F5" />
                <Swatch name="Muted Fg" hex="#666666" />
                <Swatch name="Border" hex="#EBEBEB" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Dark mode
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                <Swatch name="Background" hex="#181B24" hsl="230 15% 11%" />
                <Swatch name="Foreground" hex="#EAEBED" hsl="220 10% 93%" />
                <Swatch name="Card" hex="#1F2330" hsl="230 14% 14%" />
                <Swatch name="Accent · Orange" hex="#FF6200" hsl="24 100% 50%" />
                <Swatch name="Muted" hex="#262A38" />
                <Swatch name="Muted Fg" hex="#828795" />
                <Swatch name="Border" hex="#2B2F3D" />
              </div>
            </div>

            <div className="rounded-2xl bg-muted/30 p-6 space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Utility tokens — not in active use
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <Swatch name="Destructive" hex="#CC2929" />
                <Swatch name="Secondary lavender" hex="#6B7CC4" />
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                Destructive was originally paired with an emerald success green
                for form-state communication. Neither is currently in use as a
                UI colour. Tokens remain defined in <code className="font-mono">src/index.css</code>{" "}
                so future work can adopt them without a migration. Re-add the
                emerald success token alongside destructive when form-state
                communication is next revisited.
              </p>
            </div>
          </section>

          {/* 04 — Gradients */}
          <section id="s04" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="04"
              title="Gradients"
              kicker="Three approved families. The primary warm gradient is the single source of truth for CTAs — defined globally as the --gradient-3color CSS variable."
            />
            <div className="space-y-6">
              <Gradient
                name="Primary warm · all CTAs & pill buttons"
                css="linear-gradient(95deg, hsl(320 85% 55%), hsl(var(--orange)))"
              />
              <Gradient
                name="Default indigo · brand mark hover only"
                css="linear-gradient(90deg, #1340E8, #4E6CFF)"
              />
              <Gradient
                name="Dark mode orange · accent gradient"
                css="linear-gradient(90deg, #FF6200, #FF9248)"
              />
            </div>
            <div className="rounded-2xl bg-muted/40 p-5 text-sm text-foreground/80 leading-relaxed max-w-3xl">
              The Narratives light-blue → navy gradient was created in error
              and has been retired. Every page now uses the primary warm
              gradient for CTAs.
            </div>
          </section>

          {/* 04a — Gradient text treatment */}
          <section id="s04a" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="04a"
              title="Gradient text treatment"
              kicker="Where colour is introduced to a heading or display word for emphasis, apply the primary warm gradient as a text gradient. Replaces solid orange on italic or accent display text."
            />
            <div className="rounded-3xl bg-card p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-8">
              <p className="font-serif-pro italic text-4xl md:text-6xl leading-[1.05]">
                Start with a call.{" "}
                <span className="text-gradient-warm">Leave with a plan.</span>
              </p>
              <p className="font-serif-pro italic text-3xl md:text-5xl leading-tight text-foreground/85">
                Built by an <span className="text-gradient-warm">AI Ops Consultant</span>.
              </p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-6 space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Utility class
              </p>
              <pre className="text-[12.5px] font-mono whitespace-pre-wrap leading-relaxed">{`.text-gradient-warm {
  background-image: linear-gradient(95deg, hsl(320 85% 55%), hsl(var(--orange)));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}`}</pre>
              <p className="text-xs text-muted-foreground">
                Apply subtly. One or two display words per heading. Where the
                effect reads as tacky on a specific instance, leave a code
                comment for review rather than silently reverting.
              </p>
            </div>
          </section>

          {/* 05 — Typography */}
          <section id="s05" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="05"
              title="Typography"
              kicker="Crimson Pro for editorial moments, Inter for everything else. Use less bold than instinct asks for."
            />
            <div className="rounded-3xl bg-card p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                  Display · Crimson Pro italic · 500–600
                </p>
                <p className="font-serif-pro italic font-normal text-5xl md:text-6xl leading-[1.05]">
                  Ops that finally <span className="text-gradient-warm">felt joined up</span>.
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  Italic at weight 500. One or two emphasis words carry the
                  gradient. The rest stays foreground.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                  Editorial accent · single serif word in an Inter line
                </p>
                <p className="text-xl md:text-2xl text-foreground/85">
                  A single serif{" "}
                  <span className="font-serif-pro italic">phrase</span> inside a
                  sans line outperforms a fully serif heading.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                  Body · Inter · 400 / 500
                </p>
                <p className="text-base leading-relaxed text-foreground/85 max-w-2xl">
                  Inter handles every functional surface: body copy, UI labels,
                  captions, buttons. Body weight 400, emphasis 500. Never 700
                  on Crimson Pro.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                {[
                  ["Display", "font-serif-pro italic text-3xl", "500–600"],
                  ["Body", "text-base", "400–500"],
                  ["Caption", "text-xs uppercase tracking-widest font-mono", "—"],
                ].map(([label, cls, w]) => (
                  <div key={label as string} className="rounded-2xl bg-background p-5">
                    <p className={cls as string}>{label}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-mono">weight {w}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-destructive font-mono">Don't</p>
                <p className="text-sm text-foreground/80">
                  Use Crimson Pro at weight 700+. Stack three serif lines in a
                  row. Ship a fully serif heading where one italic word would do.
                </p>
              </div>
              <div className="rounded-2xl bg-accent/5 border border-accent/20 p-5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-accent font-mono">Do</p>
                <p className="text-sm text-foreground/80">
                  Weight 500–600 on display, 400–500 on body. One italic serif
                  phrase per hero. Sentence case headings.
                </p>
              </div>
            </div>
          </section>

          {/* 06 — Cards & 3D float */}
          <section id="s06" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="06"
              title="Cards & 3D float"
              kicker="Move your mouse across these. Tilt3D wraps any card in a perspective container that gently follows the cursor."
            />
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Service pillar", body: "Landscape image, soft shadow, gentle float." },
                { title: "Portfolio tile", body: "Used inside masonry grids on /portfolio and /narratives-and-strategy-services." },
                { title: "Journal card", body: "Drives the floating feel of the Thread & Stack Journal." },
              ].map((c) => (
                <Tilt3D key={c.title} className="h-full">
                  <div className="rounded-2xl bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] h-full">
                    <Sparkles className="w-5 h-5 text-clay mb-4" />
                    <h4 className="font-serif-pro italic font-normal text-xl mb-2">
                      {c.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                  </div>
                </Tilt3D>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-accent/5 border border-accent/20 p-5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-accent font-mono">Rules</p>
                <Rule>Max tilt 8° horizontal, 6° vertical.</Rule>
                <Rule>Pair with rounded-2xl and the soft shadow tokens above.</Rule>
                <Rule>Icons inside cards default to <code className="font-mono">text-clay</code> (orange in both modes).</Rule>
                <Rule>Opacity transitions on photos inside Tilt3D, never translate-y.</Rule>
              </div>
              <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-destructive font-mono">Forbidden</p>
                <Rule>Skew transforms.</Rule>
                <Rule>Parallax layers inside the card.</Rule>
                <Rule>Aggressive rotate or scale on hover.</Rule>
              </div>
            </div>
          </section>

          {/* 07 — Pill buttons */}
          <section id="s07" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="07"
              title="Pill buttons"
              kicker="Three live variants. Primary warm gradient is mode-agnostic — same fill on light and dark."
            />
            <div className="space-y-6">
              <div className="rounded-3xl bg-card p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                  1 · Primary CTA · light mode
                </p>
                <button
                  className="group inline-flex items-center gap-2 rounded-full text-white px-6 py-3 text-sm font-medium transition-all hover:-translate-y-px"
                  style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                >
                  Book a free intro call
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100">
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </span>
                </button>
              </div>

              <div className="rounded-3xl bg-card p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                  2 · Secondary · outline, context-aware
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="group inline-flex items-center gap-2 rounded-full border border-accent/40 text-foreground px-6 py-3 text-sm font-medium hover:border-accent transition-colors">
                    Indigo outline · next to indigo
                    <ArrowRight className="w-4 h-4 -ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                  <button className="group inline-flex items-center gap-2 rounded-full border border-clay/50 text-foreground px-6 py-3 text-sm font-medium hover:border-clay transition-colors">
                    Orange outline · next to orange/gradient
                    <ArrowRight className="w-4 h-4 -ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                </div>
              </div>

              <div className="rounded-3xl bg-foreground p-8 shadow-[0_8px_30px_rgba(0,0,0,0.2)] space-y-5">
                <p className="text-xs uppercase tracking-widest text-background/60 font-mono">
                  3 · Primary CTA · dark mode (same gradient)
                </p>
                <button
                  className="group inline-flex items-center gap-2 rounded-full text-white px-6 py-3 text-sm font-medium transition-all hover:-translate-y-px"
                  style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                >
                  Book a free intro call
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100">
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </span>
                </button>
              </div>
            </div>
            <div className="rounded-2xl bg-muted/40 p-5 text-sm text-foreground/80 leading-relaxed max-w-3xl">
              Secondary outline colour always matches the accent colour of its
              surrounding context. Next to an indigo element use indigo. Next
              to an orange or gradient element use orange.
            </div>
          </section>

          {/* 08 — FAQ */}
          <section id="s08" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="08"
              title="FAQ pattern"
              kicker="Always import { FAQ } from @/components/FAQ. Never re-implement an accordion."
            />
            <div className="rounded-3xl bg-card p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <FAQ
                title="Pattern preview"
                items={[
                  {
                    question: "Why a single FAQ component?",
                    answer:
                      "Consistency. Chevron easing, spacing, and card treatment are locked in so every page reads the same.",
                  },
                  {
                    question: "Can I add a category label per item?",
                    answer:
                      "Yes, extend the items shape. Keep the visual treatment identical.",
                  },
                  {
                    question: "Where does it work?",
                    answer:
                      "Services, journal posts, anywhere with three or more recurring questions.",
                  },
                ]}
              />
            </div>
          </section>

          {/* 09 — Drawers & lightbox */}
          <section id="s09" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="09"
              title="Drawers & lightbox"
              kicker="The 'swish' reveal. Lead capture uses the intro-call DiagnosticDrawer (intro mode) with the full qualification form."
            />
            <div className="rounded-3xl bg-card p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h4 className="font-serif-pro italic font-normal text-2xl">
                  Try the drawer
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  First / last name, email, role, company, website, annual
                  revenue, employee count, GDPR consent, honeypot, and the
                  triple-fire (Notion + visitor email + admin email). Secondary
                  "I'm ready to book my Diagnostic session now" link below the
                  primary CTA.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="group inline-flex items-center gap-2 rounded-full text-white px-6 py-3 text-sm font-medium transition-all hover:-translate-y-px"
                style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
              >
                Open intro-call drawer
                <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100">
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </span>
              </button>
            </div>
            <div className="rounded-2xl bg-muted/40 p-5 text-sm text-foreground/80 leading-relaxed max-w-3xl">
              The older "Let's Work Together" <code className="font-mono">ContactDrawer</code>{" "}
              still exists in the codebase for legacy callsites but is being
              phased out. New work uses{" "}
              <code className="font-mono">DiagnosticDrawer</code> with{" "}
              <code className="font-mono">initialMode="intro"</code>.
            </div>
          </section>

          {/* 10 — Bottom CTA */}
          <section id="s10" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="10"
              title="Bottom CTA block"
              kicker="Every marketing page ends with this. Don't author a new bottom CTA — import { CTA } from @/components/home-draft2/CTA."
            />
            <CTA />
          </section>

          {/* 11 — Animation */}
          <section id="s11" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="11"
              title="Animation rules"
              kicker="Scroll-triggered fade-in from 40% opacity, max 10px travel. One motion per section."
            />
            <div className="grid sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] animate-fade-in"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">
                    Stage {i}
                  </p>
                  <p className="font-serif-pro italic text-xl">Gentle, not bouncy.</p>
                </div>
              ))}
            </div>
          </section>

          {/* 12 — Photography */}
          <section id="s12" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="12"
              title="Photography"
              kicker={`Full inventory of src/assets/photos/. ${
                WORKSHOP.length + SHOREDITCH.length + PORTRAITS.length
              } images across three buckets. WebP for hero imagery, JPG companions exist for headshots above 600px square.`}
            />
            {[
              { label: "Workshop", items: WORKSHOP },
              { label: "Shoreditch", items: SHOREDITCH },
              { label: "Portraits", items: PORTRAITS },
            ].map(({ label, items }) => (
              <div key={label} className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground/70 font-mono">
                    {items.length} files
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {items.map((img) => (
                    <figure key={img.name} className="space-y-1.5">
                      <img
                        src={img.url}
                        alt={img.name}
                        loading="lazy"
                        className="w-full aspect-square object-cover rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                      />
                      <figcaption className="text-[10.5px] font-mono text-muted-foreground/80 truncate">
                        {img.name}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* 13 — Notion translations */}
          <section id="s13" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="13"
              title="Notion translations"
              kicker="The journal, portfolio, CV, and governance pages all render from a cache-first Notion sync. This is the block-by-block visual translation reference."
            />

            <div className="rounded-3xl bg-card p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Architecture
              </p>
              <p className="text-sm text-foreground/85 leading-relaxed">
                Pages never call the Notion API at request time. A 5-minute
                cron mirrors content into Supabase and rehosts every S3 image
                into Supabase Storage so links never expire.
              </p>
            </div>

            <div className="rounded-3xl bg-card p-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Block</th>
                    <th className="px-5 py-3 font-medium">Rendered as</th>
                    <th className="px-5 py-3 font-medium">CSS / notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[
                    {
                      block: "Paragraph",
                      render: (
                        <p className="text-base leading-[1.8]">
                          Body paragraph at 1.125rem, line-height 1.8.
                        </p>
                      ),
                      notes: ".blog-content p · font-style normal, 1.5rem bottom margin.",
                    },
                    {
                      block: "Heading 1",
                      render: (
                        <h3 className="font-serif-pro text-[2.4rem] leading-[1.2] font-light tracking-[-0.02em]">
                          Section opener
                        </h3>
                      ),
                      notes: "3rem on full pages. Weight 300, letter-spacing -0.02em.",
                    },
                    {
                      block: "Heading 2",
                      render: (
                        <h4 className="font-serif-pro text-[1.75rem] leading-[1.3] font-normal tracking-[-0.01em]">
                          Within-article section
                        </h4>
                      ),
                      notes: "2rem · top margin 4rem · weight 400.",
                    },
                    {
                      block: "Heading 3",
                      render: (
                        <h5 className="font-serif-pro text-[1.4rem] leading-[1.4] font-normal">
                          Sub-section
                        </h5>
                      ),
                      notes: "1.5rem · top margin 3rem · weight 400.",
                    },
                    {
                      block: "Callout (default)",
                      render: (
                        <div className="callout callout-default flex items-start gap-3 p-4 rounded-lg bg-muted/40">
                          <span className="text-xl">💡</span>
                          <span>Notion callouts keep their emoji and palette as a soft card.</span>
                        </div>
                      ),
                      notes: "Variants per Notion colour: gray/brown/orange/yellow/green/blue/purple/pink/red. Background at 15% opacity.",
                    },
                    {
                      block: "Quote",
                      render: (
                        <blockquote className="blog-content">
                          <blockquote>
                            Block quotes render with a 4px accent left border and muted background.
                          </blockquote>
                        </blockquote>
                      ),
                      notes: "Left border 4px accent · padding 1.5rem · rounded right corners only.",
                    },
                    {
                      block: "Toggle",
                      render: (
                        <details className="rounded-lg border border-border/40 p-4">
                          <summary className="cursor-pointer font-medium text-sm">
                            Click to expand
                          </summary>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Renders with the same chevron and easing as the FAQ component.
                          </p>
                        </details>
                      ),
                      notes: "Toggle blocks reuse the FAQ accordion pattern (§08).",
                    },
                    {
                      block: "Bookmark / link preview",
                      render: (
                        <a
                          href="#"
                          className="block rounded-lg border border-border p-4 hover:bg-muted/40 transition-colors"
                        >
                          <p className="font-medium text-sm">External resource title</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            example.com · short description.
                          </p>
                        </a>
                      ),
                      notes: "Bookmarks and embeds become preview cards, never raw iframes.",
                    },
                    {
                      block: "Image (content, with caption)",
                      render: (
                        <figure className="max-w-[65%] mx-auto text-center">
                          <div className="aspect-[4/3] rounded-md bg-muted" />
                          <figcaption className="text-xs text-muted-foreground mt-2">
                            Captioned content images sit at 65% width, centered.
                          </figcaption>
                        </figure>
                      ),
                      notes: "figure.image-content · max-w 65% · centered. Decorative images (no caption) use figure.image-decorative · max-w 180px · left-aligned.",
                    },
                    {
                      block: "Divider",
                      render: <hr className="border-border" />,
                      notes: "Single 1px border line. Used sparingly — the blog prefers whitespace.",
                    },
                    {
                      block: "Bullet list",
                      render: (
                        <ul className="blog-content">
                          <li>Custom 7px indigo ring as bullet (primary)</li>
                          <li>
                            Nested bullets use a 4px filled dot, then a 6px dash
                          </li>
                        </ul>
                      ),
                      notes: "Bullets are custom-drawn via ::before pseudo-elements in index.css.",
                    },
                    {
                      block: "Iframe / video embed",
                      render: (
                        <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
                          Only domains on the CSP allowlist render as iframes. Everything else
                          falls back to a link preview card.
                        </div>
                      ),
                      notes: "See ts-notion-content for the CSP allowlist policy.",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="align-top">
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground w-[18%]">
                        {row.block}
                      </td>
                      <td className="px-5 py-4 w-[52%]">{row.render}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground leading-relaxed">
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SkillEmbed
              name="Skill: ts-notion-content"
              body={`Triggers when working with blog posts, journal content, CV, portfolio, or any Notion-backed surface.

Core rules:
- Cache-first. Pages never call the Notion API at request time.
- Every S3 image is rehosted into Supabase Storage on sync.
- Callouts preserve emoji + colour. Toggles become FAQ-style accordions.
- Bookmarks render as link preview cards. iframes only for CSP-allowlisted domains.
- Each post's category tag maps to a fixed palette — never invent per-post.
- Edge functions: sync-blog-cache, sync-portfolio, sync-cv, persist-notion-media, fetch-notion-page.

See .agents/skills/ts-notion-content/SKILL.md for full text.`}
            />
          </section>

          {/* 14 — Voice */}
          <section id="s14" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="14"
              title="Voice & copy"
              kicker="The hard ban is non-negotiable. The live source is the Notion checklist — re-fetch before substantive passes."
            />

            <div className="rounded-3xl bg-card p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Identity
              </p>
              <p className="font-serif-pro italic text-xl leading-snug max-w-3xl">
                Brendan is a strategist, systems thinker, AI ops consultant,
                and behavioural-science-informed integrator. Not primarily a
                designer.
              </p>
              <p className="text-sm text-foreground/80 max-w-3xl">
                The brand communicates through the fragmentation problem it
                names. Most founders don't have a marketing problem, they have
                an architecture problem. Nobody is accountable to the whole
                picture. The cost is absorbed silently. Thread &amp; Stack is
                the integrating intelligence that holds the whole picture.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-destructive/5 border border-destructive/20 p-6 space-y-5">
                <p className="text-xs uppercase tracking-widest text-destructive font-mono font-medium">
                  Hard ban
                </p>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-destructive/80 font-mono">
                    Punctuation &amp; constructions
                  </p>
                  <ul className="text-sm text-foreground/80 space-y-1.5 list-disc pl-5">
                    <li>No em dashes (—). Use full stops, commas, or line breaks.</li>
                    <li>No "X isn't Y, it's Z" contrastive constructions.</li>
                    <li>No rule-of-three cadence ("clear, calm, confident").</li>
                    <li>No interrobang, no all-caps headings.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-destructive/80 font-mono">
                    Meta-commentary
                  </p>
                  <ul className="text-sm text-foreground/80 space-y-1.5 list-disc pl-5">
                    <li>Do not restate the reader's situation ("As a founder, you know…").</li>
                    <li>No "let's dive in", "let's unpack", "the truth is".</li>
                    <li>No "we hear you", "we get it", performative empathy.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-destructive/80 font-mono">
                    Generic openings / closings
                  </p>
                  <ul className="text-sm text-foreground/80 space-y-1.5 list-disc pl-5">
                    <li>No "in today's fast-paced world".</li>
                    <li>No "at the end of the day".</li>
                    <li>No "hope this helps" or "thanks for reading".</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-destructive/80 font-mono">
                    Overused transitions (usage caps)
                  </p>
                  <ul className="text-sm text-foreground/80 space-y-1.5 list-disc pl-5">
                    <li>"Moreover", "furthermore", "additionally" — max once per 800 words on long-form; never on LinkedIn.</li>
                    <li>"That said", "with that in mind" — max once per piece.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-destructive/80 font-mono">
                    Buzzword clichés
                  </p>
                  <ul className="text-sm text-foreground/80 space-y-1.5 list-disc pl-5">
                    <li>unlock, elevate, supercharge, seamless, delight, leverage, holistic, synergy, robust, cutting-edge, game-changing.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-accent/5 border border-accent/20 p-6 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-accent font-mono font-medium">
                    Channel minimums
                  </p>
                  <ul className="text-sm text-foreground/80 space-y-2">
                    <li>
                      <strong>LinkedIn:</strong> 3+ proper nouns, zero
                      restricted transition words.
                    </li>
                    <li>
                      <strong>Newsletter &amp; Journal:</strong> 5+ proper
                      nouns, maximum one restricted transition word.
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl bg-card border border-border p-6 space-y-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono font-medium">
                    The "only Brendan could write this" test
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Before publishing, ask: could a competent ghostwriter for
                    any other AI ops consultant have written this? If yes,
                    rewrite. Specificity, particular receipts, and the
                    Strategist/Coach tension are what make it ours.
                  </p>
                </div>

                <div className="rounded-3xl bg-card border border-border p-6 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono font-medium">
                    Core voice principles
                  </p>
                  <ul className="text-sm text-foreground/80 space-y-2.5">
                    <li>
                      <strong>Strategist &amp; Coach in tension.</strong> The
                      strategist asserts. The coach asks. Most pieces hold
                      both.
                    </li>
                    <li>
                      <strong>The wandering sentence.</strong> Long, considered
                      lines next to clipped ones. The cadence is uneven on
                      purpose.
                    </li>
                    <li>
                      <strong>Bold as surgical hammer.</strong> One bold
                      assertion per section. Not a decorator.
                    </li>
                    <li>
                      <strong>Truth over polish.</strong> Ship the awkward
                      sentence that's right over the smooth one that's vague.
                    </li>
                    <li>
                      <strong>Specificity as trust.</strong> Name the tool, the
                      metric, the client, the deliverable.
                    </li>
                    <li>
                      <strong>Value in every sentence.</strong> Cut anything
                      that doesn't earn its place.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <SkillEmbed
              name="Skill: ts-copy-voice"
              body={`Triggers when writing or editing any copy that ships on threadandstack.com.

Identity: strategist, systems thinker, AI ops consultant, behavioural-science-informed integrator.

Hard ban (summary): no em dashes, no "X isn't Y, it's Z", no rule-of-three cadence, no restating the reader's situation, no meta-commentary, no generic openings/closings, capped transitions, no buzzword clichés.

Channel minimums: LinkedIn 3+ proper nouns / zero restricted transitions; Newsletter & Journal 5+ proper nouns / max one.

Test: "Only Brendan could write this." If a ghostwriter for any other consultant could have written it, rewrite.

Voice: Strategist/Coach tension. The wandering sentence. Bold as surgical hammer. Truth over polish. Specificity as trust. Value in every sentence.

Pre-publish: re-fetch the live Notion hard-ban checklist before substantive copy passes.

See .agents/skills/ts-copy-voice/SKILL.md for full text.`}
            />
          </section>

          {/* 15 — Downloads */}
          <section id="s15" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="15"
              title="Downloads"
              kicker="Complete asset inventory. Right-click any logo to save. Photography lives in section 12."
            />

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Logo files · src/assets/logos/
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {LOGO_INVENTORY.map((l) => (
                  <div
                    key={l.name}
                    className={`rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3 ${
                      l.dark ? "bg-foreground" : "bg-card"
                    }`}
                  >
                    <div className="aspect-square flex items-center justify-center">
                      <img src={l.src} alt={l.name} className="max-h-20 w-auto" />
                    </div>
                    <div className={l.dark ? "text-background" : ""}>
                      <p className="text-[11px] font-mono leading-tight break-all">{l.name}</p>
                      <p
                        className={`text-[11px] mt-1 ${
                          l.dark ? "text-background/60" : "text-muted-foreground"
                        }`}
                      >
                        {l.use}
                      </p>
                    </div>
                    <p
                      className={`text-[10px] font-mono ${
                        l.dark ? "text-background/40" : "text-muted-foreground/60"
                      }`}
                    >
                      Right-click → Save image as…
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-card p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Asset paths
              </p>
              <div className="overflow-hidden rounded-xl border border-border/40">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border/40">
                    {[
                      ["Logos · SVG", "src/assets/logos/"],
                      ["Photography · workshop", "src/assets/photos/workshop/"],
                      ["Photography · shoreditch", "src/assets/photos/shoreditch/"],
                      ["Photography · portraits", "src/assets/photos/portraits/"],
                      ["Notion mock screenshots", "src/assets/notion-mock/"],
                      ["Tool / brand logos (svg)", "src/assets/tool-logos/"],
                      ["Creative pillar marks", "src/assets/thread-stack-creative-*.png"],
                      ["Journal logo", "src/assets/journal-logo-*.png"],
                      ["Preferred founder portrait", "src/assets/photos/brendan-34-square.jpg"],
                      ["Default OG image", "src/assets/OpenGraph_TS2026.png"],
                    ].map(([label, path]) => (
                      <tr key={label} className="align-top">
                        <td className="px-4 py-3 text-foreground/80 w-1/2">{label}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground break-all">
                          {path}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-6 space-y-2">
              <p className="text-xs uppercase tracking-widest text-destructive font-mono font-medium">
                Retired — do not reintroduce under any circumstances
              </p>
              <ul className="text-sm text-foreground/80 list-disc pl-5 space-y-1">
                <li>The 2024 gradient blue swoosh logo mark.</li>
                <li>Any pre-rebrand T&amp;S wordmark from before Crimson Pro adoption.</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-card p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif-pro italic font-normal text-xl">PDF snapshot</h4>
                <p className="text-sm text-muted-foreground">
                  Print the current view for offline reference.
                </p>
              </div>
              <Button onClick={() => window.print()} className="gap-2 rounded-full">
                <Download className="w-4 h-4" /> Print brand book
              </Button>
            </div>
          </section>
        </main>

        <DiagnosticDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          source="brand-book-demo"
          initialMode="intro"
          theme="light"
        />
      </div>
    </>
  );
};

export default BrandBook;
