import { PageSeo } from "@/components/seo/PageSeo";
import React, { useState, useEffect, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

// ── Data types ──────────────────────────────────────────────
interface Touchpoint {
  id: string;
  t: string;
  m: boolean; // missing
}

interface Stage {
  id: number;
  lbl: string;
  sub: string;
  need: string;
  bar: string;
}

interface Layer {
  id: number;
  lbl: string;
  sub: string;
}

// ── Gate colors ─────────────────────────────────────────────
const GATE_COLORS = [
  "hsl(48, 95%, 50%)",   // Gate 1 — yellow
  "hsl(24, 100%, 50%)",  // Gate 2 — orange
  "hsl(348, 80%, 45%)",  // Gate 3 — crimson
  "hsl(270, 50%, 50%)",  // Gate 4 — purple
];

// ── Layer colors ────────────────────────────────────────────
const LAYER_COLORS = [
  "hsl(348, 80%, 45%)",  // Purposeful Intent — crimson
  "hsl(24, 100%, 50%)",  // Active Discovery — orange
  "hsl(145, 55%, 42%)",  // Ambient Exposure — green
];

// ── Constants ───────────────────────────────────────────────
const STAGES: Stage[] = [
  { id: 0, lbl: "Aware of Your Brand", sub: "Top of Funnel", need: "A reason to click", bar: "hsl(48, 95%, 50%)" },
  { id: 1, lbl: "Researching Your Offer", sub: "Middle of Funnel", need: "Clarity on your core value", bar: "hsl(24, 100%, 50%)" },
  { id: 2, lbl: "Considering Your Offer", sub: "Bottom of Funnel", need: "Unique selling points & personalised experiences", bar: "hsl(348, 80%, 45%)" },
  { id: 3, lbl: "Adopting Your Product", sub: "Activation & Adoption", need: "Proof that this is the right path & ease of activation", bar: "hsl(270, 50%, 50%)" },
  { id: 4, lbl: "Becoming Loyal to You", sub: "Integration & Advocacy", need: "A Path to Success", bar: "hsl(234, 89%, 50%)" },
];

const LAYERS: Layer[] = [
  { id: 0, lbl: "Purposeful Intent", sub: "Customer is taking a qualifying action" },
  { id: 1, lbl: "Active Discovery", sub: "Customer is taking an action" },
  { id: 2, lbl: "Ambient Exposure", sub: "Customer isn't trying" },
];

const DEFAULT_GATES = [
  "Has now visited your website",
  "Chemistry Call completed",
  "Sees you as their solution",
  "Paid for a service from you",
];

const DEFAULT_TP: Record<string, Touchpoint[]> = {
  "0-0": [{ id: "t1", t: "Visit Website", m: false }],
  "0-1": [{ id: "t2", t: "Webinar Takeaway Magnet", m: false }, { id: "t3", t: "Dedicated Webinar", m: true }],
  "0-2": [{ id: "t4", t: "Subscribe to Substack", m: false }],
  "0-3": [], "0-4": [],
  "1-0": [{ id: "t5", t: "In-person Networking", m: false }],
  "1-1": [{ id: "t6", t: "Downloads Lead Magnet", m: false }],
  "1-2": [{ id: "t7", t: '"Gets" what you offer', m: false }, { id: "t8", t: "Discovery Call", m: false }],
  "1-3": [
    { id: "t9", t: "Proposal of Services", m: false },
    { id: "t10", t: "Scope of Work Agreement", m: false },
    { id: "t11", t: "Payment Page", m: false },
    { id: "t12", t: "Paid for a service", m: false },
  ],
  "1-4": [{ id: "t13", t: "Submits or shares their success story", m: false }],
  "2-0": [
    { id: "t14", t: "Search Terms (SEO)", m: false },
    { id: "t15", t: "LinkedIn Posts", m: false },
    { id: "t16", t: "Evergreen Substack Content", m: false },
    { id: "t17", t: "3rd party webinars featuring me", m: false },
  ],
  "2-1": [], "2-2": [],
  "2-3": [{ id: "t18", t: "Client Onboarding", m: true }, { id: "t19", t: "Notion Dashboard", m: false }],
  "2-4": [],
};

// ── Small sub-components ────────────────────────────────────

const TouchpointChip = ({
  tp,
  onEdit,
  onDelete,
}: {
  tp: Touchpoint;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div
    onClick={onEdit}
    className={`group relative rounded px-2 py-1.5 pr-6 text-[11px] leading-snug cursor-pointer transition-all border ${
      tp.m
        ? "bg-destructive/10 border-destructive/40 text-destructive"
        : "bg-accent/10 border-accent/40 text-foreground/90"
    } hover:border-accent`}
  >
    {tp.m && (
      <span className="block text-[10px] font-semibold tracking-wider uppercase text-destructive mb-0.5">
        Missing
      </span>
    )}
    <span>{tp.t}</span>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="absolute top-0.5 right-1 text-foreground/30 hover:text-destructive text-sm hidden group-hover:block"
    >
      ×
    </button>
  </div>
);

const EditForm = ({
  initial,
  isMissing,
  onSave,
  onCancel,
  onDelete,
}: {
  initial: string;
  isMissing: boolean;
  onSave: (text: string, missing: boolean) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) => {
  const [text, setText] = useState(initial);
  const [missing, setMissing] = useState(isMissing);
  return (
    <div className="bg-card/90 border border-accent/30 rounded-lg p-2 flex flex-col gap-1.5">
      <input
        autoFocus
        className="w-full text-[11px] bg-background/80 border border-border rounded px-2 py-1 text-foreground outline-none focus:border-accent"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(text, missing);
        }}
        placeholder="Name this touchpoint..."
      />
      <label className="flex items-center gap-1.5 text-[11px] text-foreground/60 cursor-pointer">
        <input
          type="checkbox"
          checked={missing}
          onChange={(e) => setMissing(e.target.checked)}
          className="accent-destructive w-3 h-3"
        />
        Mark as <strong className="text-destructive">Missing</strong>
      </label>
      <div className="flex gap-1.5 items-center">
        {onDelete && (
          <button onClick={onDelete} className="text-[11px] text-destructive border border-destructive/40 rounded px-2 py-0.5 hover:bg-destructive/10 mr-auto">
            Delete
          </button>
        )}
        <button onClick={onCancel} className="text-[11px] text-foreground/60 border border-border rounded px-2 py-0.5 hover:bg-card/60">
          Cancel
        </button>
        <button
          onClick={() => onSave(text, missing)}
          className="text-[11px] font-medium bg-white text-background rounded px-2 py-0.5 hover:opacity-85"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// ── Gap Analysis ────────────────────────────────────────────

const GapAnalysis = ({ tp }: { tp: Record<string, Touchpoint[]> }) => {
  const all = Object.values(tp).flat();
  const total = all.length;
  const missing = all.filter((t) => t.m).length;
  const active = total - missing;
  const pct = total > 0 ? Math.round((active / total) * 100) : 0;

  const stageData = STAGES.map((st) => {
    const tps = LAYERS.reduce<Touchpoint[]>((a, l) => a.concat(tp[`${l.id}-${st.id}`] || []), []);
    return { lbl: st.lbl, tot: tps.length, mis: tps.filter((t) => t.m).length, bar: st.bar };
  });
  const max = Math.max(...stageData.map((s) => s.tot), 1);

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 mt-8">
      <h2 className="font-serif-pro text-xl font-bold italic text-foreground mb-1">
        Gap <span className="text-accent">Analysis</span>
      </h2>
      <p className="text-[12px] text-foreground/50 mb-5">
        A quick read on where your marketing effort actually lives — and where the gaps are showing up.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { n: total, l: "Total touchpoints", color: "text-accent" },
          { n: active, l: "Active", color: "text-foreground" },
          { n: missing, l: "Missing / gaps", color: "text-destructive" },
          { n: `${pct}%`, l: "Coverage rate", color: "text-foreground" },
        ].map((s, i) => (
          <div key={i} className="bg-background/60 border border-border rounded-xl py-3 px-4 text-center">
            <div className={`font-serif-pro text-3xl font-bold leading-none ${s.color}`}>{s.n}</div>
            <div className="text-[11px] text-foreground/50 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {stageData.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-40 text-[11px] text-foreground/60 shrink-0 truncate">{s.lbl}</div>
            <div className="flex-1 h-5 bg-background/60 border border-border rounded overflow-hidden min-w-[60px]">
              <div
                className="h-full rounded transition-all duration-300"
                style={{
                  width: s.tot === 0 ? "3px" : `${Math.round((s.tot / max) * 100)}%`,
                  background: s.bar,
                  opacity: 0.85,
                }}
              />
            </div>
            <div className="w-28 text-[11px] text-foreground/60 shrink-0">
              {s.tot} ({s.mis} missing)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────

const MomentumMapPage = () => {
  const [gates, setGates] = useState([...DEFAULT_GATES]);
  const [tp, setTp] = useState<Record<string, Touchpoint[]>>(() =>
    JSON.parse(JSON.stringify(DEFAULT_TP))
  );
  const [editingGate, setEditingGate] = useState<number | null>(null);
  const [addingCell, setAddingCell] = useState<string | null>(null);
  const [editingTp, setEditingTp] = useState<string | null>(null); // "layerId-stageId-tpId"
  const [nextId, setNextId] = useState(20);
  const exportRef = useRef<HTMLDivElement>(null);

  const exportAs = useCallback(async (format: "png" | "pdf") => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    if (format === "png") {
      const link = document.createElement("a");
      link.download = "momentum-map.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("momentum-map.pdf");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = "The Momentum Map — Thread & Stack";
    const setMeta = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(prop.startsWith("og:") || prop.startsWith("twitter:") ? (prop.startsWith("og:") ? "property" : "name") : "name", prop);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta("description", "Map your customer touchpoints across every funnel stage. An interactive framework by Thread & Stack.");
    setMeta("og:title", "The Momentum Map — Thread & Stack");
    setMeta("og:description", "Map your customer touchpoints across every funnel stage. An interactive framework by Thread & Stack.");
    setMeta("og:type", "website");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "The Momentum Map — Thread & Stack");
  }, []);

  const cellKey = (layerId: number, stageId: number) => `${layerId}-${stageId}`;

  const addTouchpoint = useCallback(
    (key: string, text: string, missing: boolean) => {
      if (!text.trim()) return;
      setTp((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), { id: `t${nextId}`, t: text.trim(), m: missing }],
      }));
      setNextId((n) => n + 1);
      setAddingCell(null);
    },
    [nextId]
  );

  const updateTouchpoint = useCallback((key: string, tpId: string, text: string, missing: boolean) => {
    if (!text.trim()) return;
    setTp((prev) => ({
      ...prev,
      [key]: (prev[key] || []).map((t) => (t.id === tpId ? { ...t, t: text.trim(), m: missing } : t)),
    }));
    setEditingTp(null);
  }, []);

  const deleteTouchpoint = useCallback((key: string, tpId: string) => {
    setTp((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((t) => t.id !== tpId),
    }));
    setEditingTp(null);
  }, []);

  const clearAll = () => {
    if (!confirm("Clear all touchpoints? The framework structure will remain intact.")) return;
    setTp((prev) => {
      const next: Record<string, Touchpoint[]> = {};
      Object.keys(prev).forEach((k) => (next[k] = []));
      return next;
    });
    setEditingTp(null);
    setAddingCell(null);
  };

  const updateGate = (i: number, val: string) => {
    setGates((prev) => prev.map((g, idx) => (idx === i ? val.trim() || g : g)));
    setEditingGate(null);
  };

  return (
    <>
      <div className="bg-background min-h-screen text-foreground relative overflow-hidden">
        {/* Subtle grid texture */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(0deg, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10">
          <Navigation />

          <main className="max-w-[1300px] mx-auto px-4 sm:px-8 pt-28 pb-20">
            {/* Header — left-aligned with compass in whitespace */}
            <div className="mb-10 animate-fade-in">
              <div className="flex items-start gap-8">
                {/* Left: text content */}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-3">
                    🧭 Thread & Stack — Original IP
                  </p>
                  <h1 className="font-serif-pro text-4xl sm:text-5xl md:text-6xl font-bold italic leading-[1.1] text-foreground mb-4">
                    The <span className="text-accent">Momentum</span> Map
                  </h1>
                  <p className="font-sans text-[15px] text-foreground/60 max-w-lg leading-relaxed mb-6">
                    Map your touchpoints across each funnel stage. Click any touchpoint to edit, any gate to set its criterion.
                  </p>

                  {/* Explainer callout */}
                  <div className="bg-accent/8 border border-accent/25 border-l-[3px] border-l-accent rounded-xl px-6 py-5 max-w-[640px] mb-6">
                    <p className="font-serif-pro italic text-[16px] leading-relaxed text-foreground/80">
                      <strong className="text-accent not-italic">How it works:</strong> Every customer journey passes through five stages — from first awareness to lasting loyalty. Between each stage sits a <em>gate</em>: a qualifying moment that signals real progression. Plot your touchpoints in the grid below to see where your experience is strong, and where the gaps are costing you momentum.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center gap-1.5 text-[11px] text-foreground/60">
                        <div className="w-3 h-3 rounded-sm bg-accent/15 border border-accent/50" /> Touchpoint
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-foreground/60">
                        <div className="w-3 h-3 rounded-sm bg-destructive/15 border border-destructive/50" /> Missing
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-foreground/60">
                        <div className="w-3 h-3 rounded-sm bg-accent/10 border border-accent/40" /> Gate
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportAs("png")}
                        className="text-[11px] font-medium text-accent border border-accent/40 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition"
                      >
                        Save PNG
                      </button>
                      <button
                        onClick={() => exportAs("pdf")}
                        className="text-[11px] font-medium text-accent border border-accent/40 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition"
                      >
                        Save PDF
                      </button>
                      <button
                        onClick={clearAll}
                        className="text-[11px] font-medium text-foreground/60 border border-border rounded-lg px-3 py-1.5 hover:bg-card/60 transition"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Grid wrapper — relative so compass can sit behind */}
            <div className="relative">
              {/* Compass rose — large, tilted, positioned to peek behind the grid */}
              <div className="hidden lg:block fixed z-0 pointer-events-none" style={{ width: '1040px', height: '1040px', transform: 'rotate(18deg)', top: '50%', left: 'calc(50% + 33vw)', marginTop: '-520px', marginLeft: '-520px' }}>
                <svg viewBox="0 0 200 200" fill="none" className="w-full h-full opacity-[0.12]">
                  <circle cx="100" cy="100" r="95" stroke="hsl(var(--accent))" strokeWidth="0.6" />
                  <circle cx="100" cy="100" r="85" stroke="hsl(var(--accent))" strokeWidth="0.4" />
                  <circle cx="100" cy="100" r="60" stroke="hsl(var(--accent))" strokeWidth="0.3" strokeDasharray="2,4" />
                  <circle cx="100" cy="100" r="35" stroke="hsl(var(--accent))" strokeWidth="0.2" strokeDasharray="1,3" />
                  <polygon points="100,8 105,38 100,28 95,38" fill="hsl(var(--accent))" />
                  <polygon points="100,192 95,162 100,172 105,162" fill="hsl(var(--foreground))" opacity="0.5" />
                  <polygon points="8,100 38,95 28,100 38,105" fill="hsl(var(--foreground))" opacity="0.5" />
                  <polygon points="192,100 162,105 172,100 162,95" fill="hsl(var(--foreground))" opacity="0.5" />
                  <line x1="100" y1="12" x2="100" y2="188" stroke="hsl(var(--accent))" strokeWidth="0.3" />
                  <line x1="12" y1="100" x2="188" y2="100" stroke="hsl(var(--accent))" strokeWidth="0.3" />
                  <line x1="30" y1="30" x2="170" y2="170" stroke="hsl(var(--foreground))" strokeWidth="0.2" opacity="0.4" />
                  <line x1="170" y1="30" x2="30" y2="170" stroke="hsl(var(--foreground))" strokeWidth="0.2" opacity="0.4" />
                  {Array.from({ length: 72 }).map((_, i) => {
                    const angle = (i * 5 * Math.PI) / 180;
                    const r1 = 93;
                    const r2 = i % 6 === 0 ? 83 : i % 2 === 0 ? 88 : 90;
                    return <line key={i} x1={100 + r1 * Math.sin(angle)} y1={100 - r1 * Math.cos(angle)} x2={100 + r2 * Math.sin(angle)} y2={100 - r2 * Math.cos(angle)} stroke="hsl(var(--accent))" strokeWidth={i % 6 === 0 ? "0.5" : "0.2"} />;
                  })}
                  <text x="100" y="24" textAnchor="middle" fill="hsl(var(--accent))" fontSize="9" fontWeight="800" fontFamily="Inter, sans-serif">N</text>
                  <text x="100" y="184" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="6" fontFamily="Inter, sans-serif" opacity="0.5">S</text>
                  <text x="20" y="103" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="6" fontFamily="Inter, sans-serif" opacity="0.5">W</text>
                  <text x="181" y="103" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="6" fontFamily="Inter, sans-serif" opacity="0.5">E</text>
                  <circle cx="100" cy="100" r="3" fill="hsl(var(--accent))" opacity="0.6" />
                  <circle cx="100" cy="100" r="1.2" fill="hsl(var(--background))" />
                </svg>
              </div>

              {/* Exportable area */}
              <div ref={exportRef} className="bg-background">
              {/* Grid — solid white background, sits above compass */}
              <div className="relative z-10 flex items-stretch bg-background border border-border rounded-2xl overflow-hidden">
              {/* Y-axis label */}
              <div className="flex items-center justify-center px-2 border-r border-border/50 bg-card/40 shrink-0" style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}>
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/40">
                  Customer's Effort
                </span>
              </div>

              {/* Scrollable grid */}
              <div className="overflow-x-auto flex-1">
                <div className="grid min-w-[1100px]" style={{ gridTemplateColumns: "110px repeat(5, 1fr)" }}>
                  {/* Row 1: Header row with stages & gates */}
                  <div className="flex items-end p-2 bg-card/60 border-r border-border/50 border-b border-b-border">
                    <span className="text-[11px] font-medium tracking-wider uppercase text-foreground/40">Stage →</span>
                  </div>
                  {STAGES.map((st, si) => (
                    <div key={st.id} className="border-r border-border/50 border-b border-b-border relative">
                      <div className="flex">
                        {/* Stage header */}
                        <div className="flex-1 py-3 px-3 text-center">
                          <div className="text-[11px] font-semibold text-accent mb-0.5">0{si + 1}</div>
                          <div className="font-serif-pro italic font-bold text-[13px] text-foreground leading-tight">{st.lbl}</div>
                          <div className="text-[11px] text-foreground/50 mt-0.5">{st.sub}</div>
                        </div>
                        {/* Gate column (between stages) */}
                        {si < 4 && (
                          <div
                            className="w-[70px] shrink-0 flex flex-col items-center justify-end py-2 cursor-pointer transition border-l border-r border-border"
                            style={{ backgroundColor: `${GATE_COLORS[si]}18` }}
                            onClick={() => setEditingGate(si)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${GATE_COLORS[si]}28`)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = `${GATE_COLORS[si]}18`)}
                          >
                            <div className="text-[10px] font-medium tracking-wider uppercase text-foreground/50">Gate</div>
                            <div className="font-serif-pro italic text-xl font-bold leading-none text-foreground/80">{si + 1}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Rows 2-4: Layer rows */}
                  {LAYERS.map((layer, li) => (
                    <React.Fragment key={layer.id}>
                      {/* Layer label */}
                      <div
                        key={`label-${layer.id}`}
                        className={`flex flex-col items-center justify-center p-2 text-center border-r border-border/50 ${li === 2 ? "border-b border-b-border" : "border-b border-border/50"} ${li === 2 ? "bg-card/40" : ""}`}
                      >
                        <div className="text-[11px] font-medium tracking-wider uppercase leading-snug" style={{ color: LAYER_COLORS[li] }}>{layer.lbl}</div>
                        <div className="text-[11px] italic font-serif-pro text-foreground/50 mt-1 leading-tight">{layer.sub}</div>
                      </div>

                      {/* Cells */}
                      {STAGES.map((st, si) => {
                        const key = cellKey(layer.id, st.id);
                        const tps = tp[key] || [];
                        const isAdding = addingCell === key;

                        return (
                          <div
                            key={`cell-${key}`}
                            className={`border-r border-border/50 ${li === 2 ? "border-b border-b-border" : "border-b border-border/50"} relative`}
                          >
                            <div className="flex h-full">
                              {/* Cell content */}
                              <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-[120px]">
                                {tps.map((t) => {
                                  const editKey = `${key}-${t.id}`;
                                  if (editingTp === editKey) {
                                    return (
                                      <EditForm
                                        key={t.id}
                                        initial={t.t}
                                        isMissing={t.m}
                                        onSave={(text, m) => updateTouchpoint(key, t.id, text, m)}
                                        onCancel={() => setEditingTp(null)}
                                        onDelete={() => deleteTouchpoint(key, t.id)}
                                      />
                                    );
                                  }
                                  return (
                                    <TouchpointChip
                                      key={t.id}
                                      tp={t}
                                      onEdit={() => {
                                        setEditingTp(editKey);
                                        setAddingCell(null);
                                      }}
                                      onDelete={() => deleteTouchpoint(key, t.id)}
                                    />
                                  );
                                })}

                                {isAdding ? (
                                  <EditForm
                                    initial=""
                                    isMissing={false}
                                    onSave={(text, m) => addTouchpoint(key, text, m)}
                                    onCancel={() => setAddingCell(null)}
                                  />
                                ) : (
                                  <button
                                    onClick={() => {
                                      setAddingCell(key);
                                      setEditingTp(null);
                                    }}
                                    className="w-6 h-6 rounded-full border-2 border-dashed border-border text-foreground/40 flex items-center justify-center text-lg hover:border-accent hover:text-accent transition shrink-0"
                                  >
                                    +
                                  </button>
                                )}
                              </div>

                              {/* Gate column spacer (between stages) */}
                              {si < 4 && (
                                <div
                                  className="w-[70px] shrink-0 flex items-center justify-center relative self-stretch border-l border-r border-border"
                                  style={{ backgroundColor: `${GATE_COLORS[si]}12` }}
                                >
                                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-border" />
                                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: `${GATE_COLORS[si]}` }} />
                                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: `${GATE_COLORS[si]}` }} />
                                  {/* Gate badge (only on middle layer row) */}
                                  {li === 1 && (
                                    editingGate === si ? (
                                      <div className="z-10 bg-background rounded p-1 w-[60px] border border-border shadow-sm">
                                        <input
                                          autoFocus
                                          className="w-full text-[10px] bg-transparent text-foreground text-center outline-none font-medium"
                                          defaultValue={gates[si]}
                                          onBlur={(e) => updateGate(si, e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") updateGate(si, (e.target as HTMLInputElement).value);
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        onClick={(e) => { e.stopPropagation(); setEditingGate(si); }}
                                        className="z-10 bg-background rounded px-1.5 py-1 w-[60px] text-center text-[10px] font-medium text-foreground/80 leading-tight cursor-pointer transition border border-border shadow-sm hover:bg-card"
                                      >
                                        {gates[si]}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}

                  {/* Needs row */}
                  <div className="bg-card/60 border-r border-border/50 flex items-center justify-center p-2">
                    <span className="text-[11px] font-medium tracking-wider uppercase text-foreground/40">Need</span>
                  </div>
                  {STAGES.map((st, si) => (
                    <div key={`need-${st.id}`} className="border-r border-border/50 relative">
                      <div className="flex">
                        <div className="flex-1 p-2.5 text-[11px]">
                          <span className="font-serif-pro italic text-accent font-bold text-xs block mb-0.5">Need:</span>
                          <span className="text-foreground/60">{st.need}</span>
                        </div>
                        {si < 4 && (
                          <div className="w-[70px] shrink-0 border-l border-r border-border" style={{ backgroundColor: `${GATE_COLORS[si]}12` }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> {/* end grid flex */}

            {/* Gap Analysis — inside exportable area */}
            <GapAnalysis tp={tp} />
            </div> {/* end exportRef */}
            </div> {/* end relative wrapper */}

            {/* Footer bar */}
            <div className="flex items-center justify-between pt-6 mt-8 border-t border-border/50">
              <p className="font-serif-pro text-lg italic font-bold text-foreground">
                Thread & <span className="text-accent">Stack</span>
              </p>
              <p className="font-sans text-xs text-foreground/50">
                Original IP · The Momentum Map · {new Date().getFullYear()}
              </p>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default MomentumMapPage;
