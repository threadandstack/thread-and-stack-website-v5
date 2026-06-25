import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Download, Sparkles, Copy } from "lucide-react";
import { Tilt3D } from "@/components/Tilt3D";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/home-draft2/CTA";
import { ContactDrawer } from "@/components/ContactDrawer";
import PageSeo from "@/components/seo/PageSeo";

// Active logos (current set — gradient blue logo retired, not imported)
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

// Photography — current set
import workshop2 from "@/assets/photos/workshop/brendan-2.webp";
import workshop19 from "@/assets/photos/workshop/brendan-19.webp";
import workshop22 from "@/assets/photos/workshop/brendan-22.webp";
import workshop25 from "@/assets/photos/workshop/brendan-25.webp";
import shoreditch26 from "@/assets/photos/shoreditch/brendan-26.webp";
import shoreditch29 from "@/assets/photos/shoreditch/brendan-29.webp";
import shoreditch34 from "@/assets/photos/shoreditch/brendan-34.webp";
import shoreditch37 from "@/assets/photos/shoreditch/brendan-37.webp";
import portrait7 from "@/assets/photos/portraits/brendan-7.webp";
import portrait12 from "@/assets/photos/portraits/brendan-12.webp";
import portrait16 from "@/assets/photos/portraits/brendan-16.webp";

// ── Helpers ───────────────────────────────────────────────────────────────

const SECTIONS = [
  ["01", "Brand essence"],
  ["02", "Logo system"],
  ["03", "Colour"],
  ["04", "Gradients"],
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
    <button
      onClick={copy}
      className="text-left group transition-opacity hover:opacity-90"
    >
      <div
        className="w-full aspect-[3/2] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-3"
        style={{ backgroundColor: hex }}
      />
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs font-mono text-muted-foreground group-hover:text-accent transition-colors">
        {copied ? "Copied" : hex}
      </p>
      {hsl && (
        <p className="text-[10px] font-mono text-muted-foreground/60">{hsl}</p>
      )}
    </button>
  );
};

const Gradient = ({
  name,
  css,
}: {
  name: string;
  css: string;
}) => {
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
      <p className="text-[11px] font-mono text-muted-foreground/70 mt-1 break-all">
        {css}
      </p>
    </button>
  );
};

const SectionHead = ({ num, title, kicker }: { num: string; title: string; kicker?: string }) => (
  <div className="space-y-2">
    <div className="flex items-baseline gap-4">
      <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">{num}</span>
      <h2 className="font-serif-pro text-3xl md:text-4xl font-medium">{title}</h2>
    </div>
    {kicker && (
      <p className="text-base text-muted-foreground max-w-2xl pl-12">{kicker}</p>
    )}
  </div>
);

const Rule = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 text-sm text-foreground/80">
    <Check className="w-4 h-4 mt-[3px] text-accent shrink-0" />
    <span>{children}</span>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────

export const BrandBook = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <PageSeo
        title="Brand Book — Thread & Stack"
        description="Internal reference for the Thread & Stack visual system, voice, and component patterns."
        noindex
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Floating download */}
        <div className="fixed top-5 right-5 z-50 print:hidden">
          <Button
            onClick={() => window.print()}
            size="sm"
            className="gap-2 rounded-full shadow-lg"
          >
            <Download className="w-3.5 h-3.5" />
            Print
          </Button>
        </div>

        {/* Header */}
        <header className="max-w-6xl mx-auto px-6 md:px-12 pt-20 pb-12">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-mono">
            Internal reference · v3
          </p>
          <h1 className="font-serif-pro text-5xl md:text-7xl font-medium leading-[1.05] mb-6">
            Brand book
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The living source of truth for Thread & Stack. Every pattern on this
            page is rendered with the production component it documents. If
            something here disagrees with the live site, the live site wins and
            this page is updated.
          </p>

          {/* TOC */}
          <nav className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-2 print:hidden">
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
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-3xl bg-card p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                  Brand line
                </p>
                <p className="font-serif-pro text-3xl md:text-4xl leading-tight italic">
                  Stories that land.
                  <br />
                  Systems that stick.
                </p>
              </div>
              <div className="rounded-3xl bg-accent/5 p-8 md:p-10">
                <p className="text-xs uppercase tracking-widest text-accent mb-4 font-mono">
                  The problem we name
                </p>
                <h3 className="font-serif-pro text-2xl mb-3">The creative tax</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  The cognitive load and admin chaos that taxes creative teams
                  between intention and execution. Every page proposes the
                  problem before the solution.
                </p>
              </div>
            </div>
            <div className="rounded-3xl bg-card p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                Two pillars
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-serif-pro text-xl mb-1">Narratives & Strategy</h4>
                  <p className="text-sm text-muted-foreground">Positioning, story, messaging. Founder works as designer and strategist.</p>
                </div>
                <div>
                  <h4 className="font-serif-pro text-xl mb-1">Notion & Systems Consultancy</h4>
                  <p className="text-sm text-muted-foreground">Operating systems for creative teams. Notion-native, automation-aware.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 02 — Logo system */}
          <section id="s02" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="02"
              title="Logo system"
              kicker="One mark, four colourways, three forms. The 2024 gradient blue mark is retired and must not be reintroduced."
            />

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Stacked</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { src: GreyStacked, label: "Grey · default" },
                  { src: IndigoStacked, label: "Indigo · hover / accent" },
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
                    <p className={`text-xs ${l.dark ? "text-background/70" : "text-muted-foreground"}`}>{l.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Wordmark</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { src: GreyWordmark, label: "Grey" },
                  { src: IndigoWordmark, label: "Indigo" },
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
                    <p className={`text-xs ${l.dark ? "text-background/70" : "text-muted-foreground"}`}>{l.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Social square (favicon)</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { src: GreySocialSq, label: "Grey" },
                  { src: IndigoSocialSq, label: "Indigo" },
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
                    <p className={`text-xs ${l.dark ? "text-background/70" : "text-muted-foreground"}`}>{l.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-6 space-y-2">
              <p className="text-xs uppercase tracking-widest text-destructive font-mono font-medium">Retired — do not reintroduce</p>
              <p className="text-sm text-foreground/80">
                The 2024 gradient blue swoosh mark and any pre-rebrand T&S
                wordmark from before Crimson Pro adoption.
              </p>
            </div>
          </section>

          {/* 03 — Colour */}
          <section id="s03" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="03"
              title="Colour"
              kicker="Light is the default. Night is a peer, not an afterthought. Click any swatch to copy the hex."
            />

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Light theme</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                <Swatch name="Background" hex="#FFFFFF" hsl="0 0% 100%" />
                <Swatch name="Foreground" hex="#0D0D0D" hsl="0 0% 5%" />
                <Swatch name="Card" hex="#FCFCFC" hsl="0 0% 99%" />
                <Swatch name="Accent · Indigo" hex="#1340E8" hsl="234 89% 50%" />
                <Swatch name="Ring" hex="#5B14F5" hsl="256 89% 50%" />
                <Swatch name="Muted" hex="#F5F5F5" />
                <Swatch name="Muted Fg" hex="#666666" />
                <Swatch name="Border" hex="#EBEBEB" />
                <Swatch name="Destructive" hex="#CC2929" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Night theme</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                <Swatch name="Background" hex="#181B24" hsl="230 15% 11%" />
                <Swatch name="Foreground" hex="#EAEBED" hsl="220 10% 93%" />
                <Swatch name="Card" hex="#1F2330" hsl="230 14% 14%" />
                <Swatch name="Accent · Orange" hex="#FF6200" hsl="24 100% 50%" />
                <Swatch name="Ring" hex="#FF6200" hsl="24 100% 50%" />
                <Swatch name="Muted" hex="#262A38" />
                <Swatch name="Muted Fg" hex="#828795" />
                <Swatch name="Border" hex="#2B2F3D" />
                <Swatch name="Secondary" hex="#6B7CC4" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Per-page Night variant · Narratives & Strategy
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <Swatch name="Light blue" hex="#5DE0E6" />
                <Swatch name="Deep navy" hex="#004AAD" />
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Per-page overrides are scoped via CSS variables on a wrapper.
                Never mutate the global tokens.
              </p>
            </div>
          </section>

          {/* 04 — Gradients */}
          <section id="s04" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="04"
              title="Gradients"
              kicker="Three approved gradient families. Pass them as props (ctaGradient, logoHoverGradient) rather than hardcoding."
            />
            <div className="space-y-6">
              <Gradient
                name="Default · Indigo"
                css="linear-gradient(90deg, #1340E8, #4E6CFF)"
              />
              <Gradient
                name="Night · Orange"
                css="linear-gradient(90deg, #FF6200, #FF9248)"
              />
              <Gradient
                name="Narratives · Light blue → Deep navy"
                css="linear-gradient(90deg, #5DE0E6, #004AAD)"
              />
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
                  Display · Crimson Pro · 500
                </p>
                <p className="font-serif-pro text-5xl md:text-6xl leading-[1.05]">
                  Marketing that feels{" "}
                  <span className="italic text-accent">more human</span>.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
                  Editorial accent · Crimson Pro italic
                </p>
                <p className="font-serif-pro italic text-2xl md:text-3xl text-foreground/80">
                  A single serif word inside a sans line outperforms a fully
                  serif heading.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                  Body · Inter · 400 / 500
                </p>
                <p className="text-base leading-relaxed text-foreground/85 max-w-2xl">
                  Inter handles every functional surface: body copy, UI labels,
                  captions, buttons. Body weight 400, emphasis 500, never 700.
                  Targeted serif phrases earn their place by appearing rarely.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                {[
                  ["Display", "font-serif-pro text-3xl", "500"],
                  ["Body", "text-base", "400"],
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
                <p className="text-sm text-foreground/80">Bold every heading. Stack three serif lines in a row. Use weight 700+ on Crimson Pro.</p>
              </div>
              <div className="rounded-2xl bg-accent/5 border border-accent/20 p-5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-accent font-mono">Do</p>
                <p className="text-sm text-foreground/80">Weight 500–600 on display. One italic serif word per hero. Sentence case headings.</p>
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
                    <Sparkles className="w-5 h-5 text-accent mb-4" />
                    <h4 className="font-serif-pro text-xl mb-2">{c.title}</h4>
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
              kicker="Fully rounded, gradient fill on hover, icon slides in from the right."
            />
            <div className="flex flex-wrap gap-4 items-center">
              <button className="group inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity overflow-hidden">
                Primary CTA
                <ArrowRight className="w-4 h-4 -ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
              <button className="group inline-flex items-center gap-2 rounded-full border border-accent/30 text-foreground px-6 py-3 text-sm font-medium hover:border-accent transition-colors">
                Secondary
                <ArrowRight className="w-4 h-4 -ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
              <button
                className="group inline-flex items-center gap-2 rounded-full text-white px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #5DE0E6, #004AAD)" }}
              >
                Narratives gradient
                <ArrowRight className="w-4 h-4 -ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
              <button
                className="group inline-flex items-center gap-2 rounded-full text-white px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #FF6200, #FF9248)" }}
              >
                Night gradient
                <ArrowRight className="w-4 h-4 -ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
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
              kicker="The 'swish' reveal. Lead capture defaults to ContactDrawer. Portfolio and service exploration use the same easing."
            />
            <div className="rounded-3xl bg-card p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h4 className="font-serif-pro text-2xl">Try the drawer</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ContactDrawer ships with GDPR consent, honeypot, role and
                  organisation fields, and the triple-fire (Notion + visitor
                  email + admin email).
                </p>
              </div>
              <Button
                onClick={() => setDrawerOpen(true)}
                className="group rounded-full gap-2"
              >
                Open ContactDrawer
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Button>
            </div>
          </section>

          {/* 10 — Bottom CTA */}
          <section id="s10" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="10"
              title="Bottom CTA block"
              kicker="Every marketing page ends with this. Don't author a new bottom CTA — import { CTA } from @/components/home-draft2/CTA."
            />
            <div className="rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <CTA />
            </div>
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
                  <p className="font-serif-pro text-xl">Gentle, not bouncy.</p>
                </div>
              ))}
            </div>
          </section>

          {/* 12 — Photography */}
          <section id="s12" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="12"
              title="Photography"
              kicker="Three buckets: workshop, shoreditch, portraits. WebP for hero imagery, JPG for headshots above 600px square."
            />
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">Workshop</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[workshop2, workshop19, workshop22, workshop25].map((src, i) => (
                    <Tilt3D key={i} className="h-full">
                      <img src={src} alt="" className="w-full aspect-square object-cover rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]" />
                    </Tilt3D>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">Shoreditch</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[shoreditch26, shoreditch29, shoreditch34, shoreditch37].map((src, i) => (
                    <Tilt3D key={i} className="h-full">
                      <img src={src} alt="" className="w-full aspect-square object-cover rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]" />
                    </Tilt3D>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">Portraits</p>
                <div className="grid grid-cols-3 gap-3 max-w-2xl">
                  {[portrait7, portrait12, portrait16].map((src, i) => (
                    <Tilt3D key={i} className="h-full">
                      <img src={src} alt="" className="w-full aspect-square object-cover rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]" />
                    </Tilt3D>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 13 — Notion translations */}
          <section id="s13" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="13"
              title="Notion translations"
              kicker="The journal, portfolio, CV, and governance pages all render from a cache-first Notion sync. See the ts-notion-content skill."
            />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-2">
                <h4 className="font-serif-pro text-xl">Cache-first</h4>
                <p className="text-sm text-muted-foreground">Pages never hit Notion at request time. A 5-minute cron mirrors content into Supabase, including S3-hosted media.</p>
              </div>
              <div className="rounded-2xl bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-2">
                <h4 className="font-serif-pro text-xl">Block fidelity</h4>
                <p className="text-sm text-muted-foreground">Callouts keep their emoji and palette. Toggles become FAQ-style accordions. Embeds become link preview cards unless the domain is on the CSP allowlist.</p>
              </div>
              <div className="rounded-2xl bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-2">
                <h4 className="font-serif-pro text-xl">Theme colours</h4>
                <p className="text-sm text-muted-foreground">Journal categories map to a fixed palette. New categories extend the map — never invent palettes per post.</p>
              </div>
              <div className="rounded-2xl bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-2">
                <h4 className="font-serif-pro text-xl">Media proxy</h4>
                <p className="text-sm text-muted-foreground">Every Notion image is rehosted on Supabase Storage so links never expire.</p>
              </div>
            </div>
          </section>

          {/* 14 — Voice */}
          <section id="s14" className="scroll-mt-24 space-y-8">
            <SectionHead
              num="14"
              title="Voice & copy"
              kicker="The hard ban is non-negotiable. The live source is the Notion checklist — re-fetch before substantive passes."
            />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-6 space-y-3">
                <p className="text-xs uppercase tracking-widest text-destructive font-mono font-medium">Hard ban</p>
                <ul className="text-sm text-foreground/80 space-y-2">
                  <li>No em dashes.</li>
                  <li>No "X isn't Y, it's Z" constructions.</li>
                  <li>No rule-of-three cadence.</li>
                  <li>No restating the reader's situation back to them.</li>
                  <li>No "unlock", "elevate", "supercharge", "seamless", "delight".</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-accent/5 border border-accent/20 p-6 space-y-3">
                <p className="text-xs uppercase tracking-widest text-accent font-mono font-medium">Do</p>
                <ul className="text-sm text-foreground/80 space-y-2">
                  <li>Lead with the outcome the reader gets.</li>
                  <li>British English (organisation, optimise, colour).</li>
                  <li>Short clauses. One idea per sentence.</li>
                  <li>Name the tool, the metric, the deliverable.</li>
                  <li>Sentence case headings; title case only on page titles.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 15 — Downloads */}
          <section id="s15" className="scroll-mt-24 space-y-6">
            <SectionHead
              num="15"
              title="Downloads"
              kicker="Logos and core assets. Right-click and save any SVG above, or print this page for a flat reference."
            />
            <div className="rounded-3xl bg-card p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif-pro text-xl">PDF snapshot</h4>
                <p className="text-sm text-muted-foreground">Print the current view for offline reference.</p>
              </div>
              <Button onClick={() => window.print()} className="gap-2 rounded-full">
                <Download className="w-4 h-4" /> Print brand book
              </Button>
            </div>
          </section>
        </main>

        <ContactDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          source="brand-book-demo"
        />
      </div>
    </>
  );
};

export default BrandBook;
