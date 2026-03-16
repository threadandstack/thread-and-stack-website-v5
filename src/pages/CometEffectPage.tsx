import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";


const CometDiagram = () => (
  <svg className="w-full max-w-[900px] mx-auto block" viewBox="0 0 900 320" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trailGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="hsl(234, 89%, 50%)" stopOpacity="0" />
        <stop offset="40%" stopColor="hsl(234, 89%, 50%)" stopOpacity="0.25" />
        <stop offset="100%" stopColor="hsl(234, 89%, 50%)" stopOpacity="0.9" />
      </linearGradient>
      <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(234, 89%, 75%)" stopOpacity="1" />
        <stop offset="50%" stopColor="hsl(234, 89%, 50%)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="hsl(234, 89%, 50%)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="streakFade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="hsl(234, 89%, 50%)" stopOpacity="0.9" />
        <stop offset="100%" stopColor="hsl(234, 89%, 50%)" stopOpacity="0" />
      </linearGradient>
    </defs>

    <rect width="900" height="320" fill="hsl(230, 15%, 11%)" rx="20"/>
    {[60,120,180,240,300].map(y => <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="hsl(230, 14%, 16%)" strokeWidth="1"/>)}
    {[180,360,540,720].map(x => <line key={x} x1={x} y1="0" x2={x} y2="320" stroke="hsl(230, 14%, 16%)" strokeWidth="1"/>)}

    <text x="90" y="30" textAnchor="middle" fill="hsl(230, 12%, 25%)" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" letterSpacing="0.12em">ENTRY</text>
    <text x="270" y="30" textAnchor="middle" fill="hsl(230, 12%, 25%)" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" letterSpacing="0.12em">ENGAGEMENT</text>
    <text x="540" y="30" textAnchor="middle" fill="hsl(230, 12%, 25%)" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" letterSpacing="0.12em">CONVICTION</text>
    <text x="810" y="30" textAnchor="middle" fill="hsl(230, 12%, 25%)" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" letterSpacing="0.12em">EXIT</text>

    <line x1="180" y1="40" x2="180" y2="300" stroke="hsl(230, 12%, 22%)" strokeWidth="1" strokeDasharray="4,4"/>
    <line x1="720" y1="40" x2="720" y2="300" stroke="hsl(230, 12%, 22%)" strokeWidth="1" strokeDasharray="4,4"/>

    <text x="14" y="120" fill="hsl(220, 8%, 55%)" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500" writingMode="vertical-lr" transform="rotate(180, 14, 120)">ENGAGEMENT</text>
    <text x="880" y="200" fill="hsl(220, 8%, 55%)" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500" writingMode="vertical-lr">FRICTION RISK</text>

    <path d="M 60 260 Q 300 250 540 140 Q 650 90 720 80" stroke="hsl(150, 30%, 50%)" strokeWidth="1" strokeDasharray="5,5" opacity="0.4"/>
    <path d="M 60 280 Q 300 275 540 200 Q 650 150 720 100" stroke="hsl(0, 50%, 55%)" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>

    <path d="M 60 220 Q 200 215 380 180 Q 480 160 600 120 Q 660 100 720 80" stroke="url(#trailGrad)" strokeWidth="20" strokeLinecap="round" opacity="0.18"/>
    <path d="M 60 220 Q 200 215 380 180 Q 480 160 600 120 Q 660 100 720 80" stroke="url(#trailGrad)" strokeWidth="10" strokeLinecap="round" opacity="0.35"/>
    <path className="animate-comet-trail" d="M 60 220 Q 200 215 380 180 Q 480 160 600 120 Q 660 100 720 80" stroke="url(#trailGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1200" strokeDashoffset="0"/>

    <path d="M 720 80 L 870 40" stroke="url(#streakFade)" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M 720 80 L 870 40" stroke="url(#streakFade)" strokeWidth="8" strokeLinecap="round" opacity="0.15"/>

    <circle cx="720" cy="80" r="40" fill="url(#headGlow)" opacity="0.25"/>
    <circle cx="720" cy="80" r="20" fill="hsl(234, 89%, 50%)" opacity="0.3"/>

    <g className="animate-pulse">
      <circle cx="720" cy="80" r="12" fill="hsl(234, 89%, 50%)"/>
      <circle cx="720" cy="80" r="7" fill="hsl(234, 89%, 75%)"/>
      <circle cx="716" cy="76" r="2.5" fill="white" opacity="0.7"/>
    </g>

    {/* Stage markers */}
    <g>
      <circle cx="60" cy="220" r="8" fill="hsl(230, 14%, 14%)" stroke="hsl(234, 89%, 50%)" strokeWidth="1.5"/>
      <circle cx="60" cy="220" r="3" fill="hsl(234, 89%, 50%)"/>
      <line x1="60" y1="212" x2="60" y2="170" stroke="hsl(234, 89%, 50%)" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
      <rect x="20" y="140" width="80" height="28" rx="6" fill="hsl(230, 14%, 14%)" stroke="hsl(230, 12%, 20%)"/>
      <text x="60" y="152" textAnchor="middle" fill="hsl(234, 89%, 60%)" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="700">01 — TAIL</text>
      <text x="60" y="163" textAnchor="middle" fill="hsl(220, 8%, 55%)" fontFamily="Inter, sans-serif" fontSize="8">Entry</text>
    </g>

    <g>
      <circle cx="380" cy="180" r="8" fill="hsl(230, 14%, 14%)" stroke="hsl(234, 89%, 50%)" strokeWidth="1.5"/>
      <circle cx="380" cy="180" r="3" fill="hsl(234, 89%, 50%)"/>
      <line x1="380" y1="172" x2="380" y2="130" stroke="hsl(234, 89%, 50%)" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
      <rect x="330" y="100" width="100" height="28" rx="6" fill="hsl(230, 14%, 14%)" stroke="hsl(230, 12%, 20%)"/>
      <text x="380" y="112" textAnchor="middle" fill="hsl(234, 89%, 60%)" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="700">02 — CURVE</text>
      <text x="380" y="123" textAnchor="middle" fill="hsl(220, 8%, 55%)" fontFamily="Inter, sans-serif" fontSize="8">Scroll Depth</text>
    </g>

    <g>
      <line x1="720" y1="92" x2="720" y2="140" stroke="hsl(234, 89%, 50%)" strokeWidth="1" strokeDasharray="3,3" opacity="0.5"/>
      <rect x="658" y="140" width="124" height="28" rx="6" fill="hsl(230, 14%, 14%)" stroke="hsl(234, 89%, 50%)" strokeWidth="1.5"/>
      <text x="720" y="152" textAnchor="middle" fill="hsl(234, 89%, 60%)" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="700">03 — HEAD</text>
      <text x="720" y="163" textAnchor="middle" fill="hsl(220, 8%, 55%)" fontFamily="Inter, sans-serif" fontSize="8">CTA Moment</text>
    </g>

    <g>
      <circle cx="820" cy="56" r="8" fill="hsl(230, 14%, 14%)" stroke="hsl(220, 8%, 55%)" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="820" cy="56" r="3" fill="hsl(220, 8%, 55%)" opacity="0.7"/>
      <line x1="820" y1="64" x2="820" y2="100" stroke="hsl(220, 8%, 55%)" strokeWidth="1" strokeDasharray="3,3" opacity="0.4"/>
      <rect x="768" y="100" width="104" height="28" rx="6" fill="hsl(230, 14%, 14%)" stroke="hsl(230, 12%, 20%)"/>
      <text x="820" y="112" textAnchor="middle" fill="hsl(220, 8%, 55%)" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="700">04 — STREAK OFF</text>
      <text x="820" y="123" textAnchor="middle" fill="hsl(220, 8%, 45%)" fontFamily="Inter, sans-serif" fontSize="8">Exit / Next Step</text>
    </g>

    <text x="260" y="238" fill="hsl(220, 8%, 55%)" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="500" fontStyle="italic">momentum builds →</text>
    <text x="565" y="175" fill="hsl(0, 50%, 55%)" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" opacity="0.8">⚡ friction risk peaks</text>
  </svg>
);

const stages = [
  { num: "01 — Tail", name: "Entry Point", sub: "Low Engagement · Low Friction", desc: "User lands. Curiosity is the only currency here. The job is safety and orientation — not persuasion.", eng: 20, friction: 10 },
  { num: "02 — Curve", name: "Scroll Depth", sub: "Rising Engagement · Friction Risk Growing", desc: "Commitment deepens as they scroll. Emotional resonance must match the depth — this is where connection or confusion is built.", eng: 55, friction: 40 },
  { num: "03 — Head", name: "CTA Moment", sub: "Peak Engagement · Peak Friction Risk", desc: "The highest stakes point. Users are most committed — and most likely to hit a friction trap. Conviction must arrive precisely here.", eng: 92, friction: 85, highlight: true },
  { num: "04 — Streak Off", name: "Exit", sub: "Converted or Lost", desc: "User exits toward the next step — or drops off. A smooth streak means the arc held. Maintain momentum through transition.", eng: 70, friction: 20, dim: true },
];

const frictionTraps = [
  "Unclear CTA — the call to action doesn't match where the user is emotionally",
  "Cognitive overload — too many decisions, too much density near the head",
  "Trust gaps — no proof, no signal that you're safe to move toward",
  "Mismatched emotional beats — logic where feeling was needed",
  "Story out of order — conviction arrived before curiosity was satisfied",
];

const resonancePoints = [
  { label: "Tail", desc: "Build curiosity and safety. No pressure, only invitation." },
  { label: "Curve", desc: "Deepen connection and address real objections without selling." },
  { label: "Head", desc: "Deliver conviction. Clear action, clear stakes, earned trust." },
  { label: "Streak off", desc: "Maintain momentum — the experience continues beyond the click." },
];

const principles = [
  { num: "01", title: "Map the Arc", desc: "Identify where users enter, what depth looks like on this page, where conversion lives, and where they go next." },
  { num: "02", title: "Identify Friction Points", desc: "Closer to the head, higher the stakes. Audit for cognitive load spikes, trust gaps, and emotional mismatches." },
  { num: "03", title: "Design for Depth", desc: "Don't optimise for speed. Match the emotional note to the scroll depth. Resonance at the wrong moment breaks the streak." },
  { num: "04", title: "Test the Streak", desc: "A smooth comet means frictionless acceleration. Drop-off points, hesitation spikes, and engagement dips locate the problem." },
];

const CometEffectPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = "The Comet Effect Framework — Thread & Stack";
    const setMeta = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement("meta"); el.setAttribute(prop.startsWith("og:") || prop.startsWith("twitter:") ? (prop.startsWith("og:") ? "property" : "name") : "name", prop); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", "A framework for web experiences that balance conversion velocity with emotional resonance.");
    setMeta("og:title", "The Comet Effect Framework — Thread & Stack");
    setMeta("og:description", "A framework for web experiences that balance conversion velocity with emotional resonance.");
    setMeta("og:image", "https://threadandstack.com/images/og/comet-effect.png");
    setMeta("og:type", "website");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "The Comet Effect Framework — Thread & Stack");
    setMeta("twitter:image", "https://threadandstack.com/images/og/comet-effect.png");
  }, []);

  return (
    <>
      <div className="dark bg-background min-h-screen text-foreground">
        <Navigation variant="dark" />

        <main className="relative z-10 max-w-[1100px] mx-auto px-6 sm:px-10 pt-32 pb-20">
          {/* Header */}
          <div className="text-center mb-14 animate-fade-in">
            <p className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-4">
              ☄️ Thread & Stack — Original IP
            </p>
            <h1 className="font-serif-pro text-4xl sm:text-5xl md:text-6xl font-bold italic leading-[1.1] mb-4">
              The <span className="text-accent">Comet Effect</span> Framework
            </h1>
            <p className="font-sans text-[15px] text-muted-foreground max-w-[540px] mx-auto leading-relaxed">
              A framework for web experiences that balance conversion velocity with emotional resonance — mapping how users actually move, not how narrative theory says they should.
            </p>
          </div>

          {/* Core insight */}
          <div className="bg-accent/8 border border-accent/25 border-l-[3px] border-l-accent rounded-xl px-6 py-5 max-w-[680px] mx-auto mb-14">
            <p className="font-serif-pro italic text-[17px] leading-relaxed">
              <strong className="text-accent not-italic">Core insight:</strong> The hero's journey forces narrative structure onto digital experiences. The comet effect maps how users actually move — with momentum, depth, and friction points that either accelerate or break their journey.
            </p>
          </div>

          {/* Comet Diagram */}
          <div className="mb-16">
            <CometDiagram />
          </div>

          {/* Stage cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stages.map((s) => (
              <div
                key={s.num}
                className={`bg-card border border-border rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-accent/30 ${s.highlight ? 'border-accent/30' : ''} ${s.dim ? 'opacity-70' : ''}`}
              >
                <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-accent mb-2">{s.num}</p>
                <p className="font-serif-pro text-xl font-bold italic mb-1 leading-tight">{s.name}</p>
                <p className="font-sans text-[11px] text-muted-foreground font-medium tracking-wider uppercase mb-3">{s.sub}</p>
                <p className="font-sans text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="flex items-center gap-1.5 mt-3.5">
                  <span className="text-[10px] text-muted-foreground">Eng</span>
                  <div className="h-[3px] flex-1 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70" style={{ width: `${s.eng}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">Friction</span>
                  <div className="h-[3px] flex-1 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70" style={{ width: `${s.friction}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* The Design Challenge */}
          <div className="mb-12">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-sans text-[13px] font-bold text-accent tracking-wider">01</span>
              <h2 className="font-serif-pro text-2xl sm:text-3xl font-bold italic">The Design Challenge</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Friction Traps */}
              <div className="bg-card border border-border rounded-2xl p-7 border-t-2 border-t-destructive">
                <h3 className="font-serif-pro text-xl italic font-bold text-destructive mb-4">⚡ Friction Traps</h3>
                {frictionTraps.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-b-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                    <p className="font-sans text-[13.5px] text-muted-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              {/* Emotional Resonance */}
              <div className="bg-card border border-border rounded-2xl p-7 border-t-2" style={{ borderTopColor: 'hsl(150, 30%, 50%)' }}>
                <h3 className="font-serif-pro text-xl italic font-bold mb-4" style={{ color: 'hsl(150, 30%, 50%)' }}>✦ Emotional Resonance by Depth</h3>
                {resonancePoints.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-b-0">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'hsl(150, 30%, 50%)' }} />
                    <p className="font-sans text-[13.5px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground/70">{item.label}:</strong> {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Application Principles */}
          <div className="mb-16">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-sans text-[13px] font-bold text-accent tracking-wider">02</span>
              <h2 className="font-serif-pro text-2xl sm:text-3xl font-bold italic">Application Principles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {principles.map((p) => (
                <div key={p.num} className="bg-card border border-border rounded-xl p-5 transition-transform hover:-translate-y-0.5">
                  <p className="font-sans text-[22px] font-bold text-accent/50 mb-2">{p.num}</p>
                  <p className="font-serif-pro text-base italic font-bold leading-tight mb-2">{p.title}</p>
                  <p className="font-sans text-[12.5px] text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer bar */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <p className="font-serif-pro text-lg italic font-bold">
              Thread & <span className="text-accent">Stack</span>
            </p>
            <p className="font-sans text-xs text-muted-foreground">
              Original IP · The Comet Effect Framework · {new Date().getFullYear()}
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CometEffectPage;
