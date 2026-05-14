import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export type Testimonial = {
  headline: string;
  quote: string;
  author: string;
  date: string;
};

type Props = { testimonials: Testimonial[] };

const variants = [
  { id: "kanban", label: "Kanban Scatter" },
  { id: "deck", label: "Polaroid Deck" },
  { id: "marquee", label: "Marquee + Spotlight" },
  { id: "ticker", label: "Ticker + Expanding Quote" },
] as const;

type VariantId = (typeof variants)[number]["id"];

export const TestimonialVariants = ({ testimonials }: Props) => {
  const [variant, setVariant] = useState<VariantId>("kanban");

  return (
    <section className="pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Variant switcher (preview only) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-sans text-muted-foreground mr-2 uppercase tracking-wide">
            Preview style:
          </span>
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariant(v.id)}
              className={`text-xs font-sans px-3 py-1.5 rounded-full transition-all ${
                variant === v.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {variant === "kanban" && <KanbanScatter testimonials={testimonials} />}
        {variant === "deck" && <PolaroidDeck testimonials={testimonials} />}
        {variant === "marquee" && <MarqueeSpotlight testimonials={testimonials} />}
        {variant === "ticker" && <TickerExpand testimonials={testimonials} />}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 1. Notion Kanban Scatter — draggable cards on a soft board         */
/* ------------------------------------------------------------------ */
const KanbanScatter = ({ testimonials }: Props) => {
  // Hand-tuned positions so cards feel scattered but balanced.
  const positions = [
    { top: "4%", left: "3%", rotate: -4, tag: "Mentorship", tagColor: "bg-orange-100 text-orange-700" },
    { top: "8%", left: "38%", rotate: 2, tag: "Notion Build", tagColor: "bg-blue-100 text-blue-700" },
    { top: "2%", left: "70%", rotate: 5, tag: "Strategy", tagColor: "bg-purple-100 text-purple-700" },
    { top: "48%", left: "12%", rotate: 3, tag: "Marketing", tagColor: "bg-green-100 text-green-700" },
    { top: "52%", left: "48%", rotate: -3, tag: "Ops", tagColor: "bg-pink-100 text-pink-700" },
    { top: "46%", left: "75%", rotate: 6, tag: "Leadership", tagColor: "bg-yellow-100 text-yellow-700" },
  ];

  const boardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    idx: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [overrides, setOverrides] = useState<Record<number, { x: number; y: number }>>({});
  const [topZ, setTopZ] = useState(10);
  const [zMap, setZMap] = useState<Record<number, number>>({});

  const onPointerDown = (e: React.PointerEvent, idx: number) => {
    const target = e.currentTarget as HTMLDivElement;
    target.setPointerCapture(e.pointerId);
    const board = boardRef.current?.getBoundingClientRect();
    if (!board) return;
    const rect = target.getBoundingClientRect();
    setDragState({
      idx,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
    const next = topZ + 1;
    setTopZ(next);
    setZMap((m) => ({ ...m, [idx]: next }));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;
    const board = boardRef.current?.getBoundingClientRect();
    if (!board) return;
    const x = e.clientX - board.left - dragState.offsetX;
    const y = e.clientY - board.top - dragState.offsetY;
    setOverrides((o) => ({ ...o, [dragState.idx]: { x, y } }));
  };

  const onPointerUp = () => setDragState(null);

  return (
    <div
      ref={boardRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className="relative w-full h-[640px] md:h-[560px] rounded-2xl bg-[radial-gradient(circle_at_1px_1px,hsl(var(--muted-foreground)/0.18)_1px,transparent_0)] [background-size:20px_20px] bg-muted/20 overflow-hidden touch-none"
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[11px] font-sans uppercase tracking-widest text-muted-foreground/70 pointer-events-none">
        ↕ Drag the cards · Notion-style board
      </div>

      {testimonials.slice(0, positions.length).map((t, idx) => {
        const pos = positions[idx];
        const override = overrides[idx];
        const style: React.CSSProperties = override
          ? {
              left: override.x,
              top: override.y,
              transform: `rotate(${pos.rotate}deg)`,
              zIndex: zMap[idx] ?? 1,
            }
          : {
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate}deg)`,
              zIndex: zMap[idx] ?? 1,
            };

        return (
          <div
            key={idx}
            onPointerDown={(e) => onPointerDown(e, idx)}
            style={style}
            className="absolute w-[260px] md:w-[280px] bg-card rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)] cursor-grab active:cursor-grabbing transition-shadow p-5 select-none"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded ${pos.tagColor}`}>
                {pos.tag}
              </span>
              <span className="text-[10px] font-sans text-muted-foreground/60 ml-auto">
                ⋮⋮
              </span>
            </div>
            <p className="text-sm font-semibold italic mb-2 leading-snug">
              {t.headline}
            </p>
            <p className="text-xs font-sans text-muted-foreground leading-relaxed mb-3 line-clamp-5">
              "{t.quote}"
            </p>
            <div className="pt-2 border-t border-border/40">
              <p className="text-xs font-sans text-foreground">{t.author}</p>
              <p className="text-[10px] font-sans text-muted-foreground/70">{t.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Polaroid Deck — flick the top card away                          */
/* ------------------------------------------------------------------ */
const PolaroidDeck = ({ testimonials }: Props) => {
  const [order, setOrder] = useState(testimonials.map((_, i) => i));
  const [flipping, setFlipping] = useState(false);

  const advance = () => {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setFlipping(false);
    }, 380);
  };

  return (
    <div className="relative h-[420px] flex items-center justify-center">
      <button
        type="button"
        onClick={advance}
        aria-label="Next testimonial"
        className="absolute inset-0 z-30 cursor-pointer"
      />
      {order.map((tIdx, stackIdx) => {
        const t = testimonials[tIdx];
        const isTop = stackIdx === 0;
        const offset = stackIdx * 8;
        const rotate = stackIdx % 2 === 0 ? -stackIdx * 1.2 : stackIdx * 1.2;
        const flying = isTop && flipping;
        return (
          <div
            key={tIdx}
            style={{
              transform: flying
                ? `translate(120%, -20%) rotate(18deg)`
                : `translate(${offset}px, ${offset}px) rotate(${rotate}deg)`,
              opacity: flying ? 0 : 1 - stackIdx * 0.12,
              zIndex: 20 - stackIdx,
              transition: "transform 0.4s cubic-bezier(.4,.1,.2,1), opacity 0.4s",
            }}
            className="absolute w-[340px] md:w-[420px] bg-card p-6 pb-10 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          >
            <Quote className="w-6 h-6 text-accent/40 mb-3" />
            <p className="text-base md:text-lg font-semibold italic mb-3">{t.headline}</p>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-5">
              "{t.quote}"
            </p>
            <p className="font-sans text-sm text-foreground" style={{ fontFamily: "Marginalia, cursive" }}>
              {t.author}
            </p>
            <p className="font-sans text-xs text-muted-foreground/70">{t.date}</p>
          </div>
        );
      })}
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-sans uppercase tracking-widest text-muted-foreground/60 pointer-events-none">
        Tap to flick →
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Marquee Wall + Spotlight                                         */
/* ------------------------------------------------------------------ */
const MarqueeSpotlight = ({ testimonials }: Props) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const doubled = [...testimonials, ...testimonials];

  return (
    <div
      className="relative overflow-hidden py-6 group"
      onMouseLeave={() => setHovered(null)}
    >
      <div
        className="flex gap-6 w-max animate-[marquee_40s_linear_infinite]"
        style={{ animationPlayState: hovered !== null ? "paused" : "running" }}
      >
        {doubled.map((t, idx) => {
          const isHover = hovered === idx;
          const dim = hovered !== null && !isHover;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHovered(idx)}
              className={`shrink-0 w-[320px] bg-card rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 ${
                isHover ? "scale-110 shadow-[0_12px_40px_rgba(0,0,0,0.18)] z-10" : ""
              } ${dim ? "opacity-30 scale-95" : "opacity-100"}`}
            >
              <Quote className="w-5 h-5 text-accent/40 mb-2" />
              <p className="text-sm font-semibold italic mb-2">{t.headline}</p>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-4">
                "{t.quote}"
              </p>
              <p className="font-sans text-xs text-foreground">{t.author}</p>
              <p className="font-sans text-[10px] text-muted-foreground/70">{t.date}</p>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Ticker + Expanding Quote                                         */
/* ------------------------------------------------------------------ */
const TickerExpand = ({ testimonials }: Props) => {
  const [active, setActive] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  useEffect(() => {
    api?.scrollTo(active);
  }, [active, api]);

  return (
    <div>
      {/* Ticker */}
      <div className="border-y border-border bg-muted/30 overflow-hidden">
        <div className="flex divide-x divide-border">
          {testimonials.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              className={`shrink-0 px-5 py-3 text-left transition-colors ${
                idx === active ? "bg-card" : "hover:bg-card/50"
              }`}
            >
              <p className="text-xs font-sans font-medium truncate max-w-[220px]">
                {t.headline}
              </p>
              <p className="text-[10px] font-sans text-muted-foreground">{t.author}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Expanded quote */}
      <Carousel setApi={setApi} opts={{ loop: true }} className="mt-8">
        <CarouselContent>
          {testimonials.map((t, idx) => (
            <CarouselItem key={idx} className="basis-full">
              <div className="max-w-2xl mx-auto text-center px-6">
                <Quote className="w-8 h-8 text-accent/40 mx-auto mb-4" />
                <p className="text-2xl md:text-3xl font-semibold italic mb-6 leading-tight">
                  {t.headline}
                </p>
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <p className="font-sans text-sm text-foreground">{t.author}</p>
                <p className="font-sans text-xs text-muted-foreground/70">{t.date}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
