import { useRef, useState } from "react";

export type Testimonial = {
  headline: string;
  quote: string;
  author: string;
  date: string;
};

type Props = { testimonials: Testimonial[] };

const tagByAuthor: Record<string, { tag: string; tagColor: string }> = {
  "Jasmine Stone": { tag: "Notion Mentorship", tagColor: "bg-orange-100 text-orange-700" },
  "Lilli Graf": { tag: "AI Workflows", tagColor: "bg-blue-100 text-blue-700" },
  "Lucian James": { tag: "Task OS", tagColor: "bg-purple-100 text-purple-700" },
  "Alex Aggidis": { tag: "Strategy", tagColor: "bg-green-100 text-green-700" },
  "Courtney Evans": { tag: "Leadership", tagColor: "bg-yellow-100 text-yellow-700" },
  "Gary O'Donnell": { tag: "Operations", tagColor: "bg-pink-100 text-pink-700" },
  "Chris Mejaski": { tag: "Content Strategy", tagColor: "bg-indigo-100 text-indigo-700" },
  "Xania Khan": { tag: "Content Strategy", tagColor: "bg-teal-100 text-teal-700" },
  "Matthew Ivo": { tag: "Campaigns", tagColor: "bg-rose-100 text-rose-700" },
};

export const TestimonialVariants = ({ testimonials }: Props) => {
  return (
    <section className="pb-12 md:px-4">
      {/* Mobile: clean swipe carousel */}
      <div className="md:hidden">
        <MobileCarousel testimonials={testimonials} />
      </div>
      {/* Desktop: scatter board */}
      <div className="hidden md:block max-w-[1500px] mx-auto px-2">
        <KanbanScatter testimonials={testimonials} />
      </div>
    </section>
  );
};

const MobileCarousel = ({ testimonials }: Props) => {
  return (
    <div className="relative">
      <div className="px-5 mb-3 flex items-center justify-between">
        <span className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground/70">
          ← Swipe →
        </span>
        <span className="text-[11px] font-sans text-muted-foreground/70">
          {testimonials.length} kind words
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {testimonials.map((t, idx) => {
          const meta = tagByAuthor[t.author] ?? { tag: "Testimonial", tagColor: "bg-muted text-muted-foreground" };
          return (
            <article
              key={idx}
              className="snap-start shrink-0 w-[82vw] max-w-[320px] bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded ${meta.tagColor}`}>
                  {meta.tag}
                </span>
              </div>
              <p className="font-serif-pro italic text-[18px] leading-snug mb-2 text-foreground">
                {t.headline}
              </p>
              <p className="text-[13px] font-sans text-muted-foreground leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="pt-3 border-t border-border/40 flex items-baseline justify-between gap-2">
                <p className="text-[12px] font-sans font-medium text-foreground truncate">{t.author}</p>
                <p className="text-[11px] font-sans text-muted-foreground/70 truncate">{t.date}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

const KanbanScatter = ({ testimonials }: Props) => {
  // Cluttered, overlapping starting positions spread across the board.
  // Positions kept inside the board: cards are ~280px wide, so left maxes at calc(100% - 290px).
  const positions = [
    { top: "6%", left: "1%", rotate: -5 },
    { top: "12%", left: "14%", rotate: 3 },
    { top: "4%", left: "28%", rotate: -2 },
    { top: "10%", left: "42%", rotate: 4 },
    { top: "8%", left: "56%", rotate: -3 },
    { top: "14%", left: "calc(100% - 290px)", rotate: 2 },
    { top: "44%", left: "4%", rotate: 5 },
    { top: "48%", left: "18%", rotate: -4 },
    { top: "42%", left: "32%", rotate: 2 },
    { top: "46%", left: "46%", rotate: -2 },
    { top: "44%", left: "60%", rotate: 4 },
    { top: "50%", left: "calc(100% - 290px)", rotate: -3 },
    { top: "20%", left: "8%", rotate: 1 },
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
      onPointerLeave={() => setDragState(null)}
      className="kindwords-board relative w-full h-[280px] md:h-[260px] rounded-3xl border border-border/60 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] bg-[radial-gradient(circle_at_1px_1px,hsl(var(--muted-foreground)/0.18)_1px,transparent_0)] [background-size:20px_20px] bg-muted/20 overflow-visible touch-none"
    >
      <div className="absolute top-3 left-6 text-[11px] font-sans uppercase tracking-widest text-muted-foreground/70 pointer-events-none">
        ↕ Drag the cards around
      </div>

      {testimonials.slice(0, positions.length).map((t, idx) => {
        const pos = positions[idx];
        const meta = tagByAuthor[t.author] ?? { tag: "Testimonial", tagColor: "bg-muted text-muted-foreground" };
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
            className="kindwords-card absolute w-[260px] md:w-[280px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)] cursor-grab active:cursor-grabbing transition-shadow p-4 select-none"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded ${meta.tagColor}`}>
                {meta.tag}
              </span>
              <span className="text-[10px] font-sans text-muted-foreground/60 ml-auto">
                ⋮⋮
              </span>
            </div>
            <p className="text-sm font-semibold italic mb-1.5 leading-snug line-clamp-1">
              {t.headline}
            </p>
            <p className="text-[11px] font-sans text-muted-foreground leading-relaxed mb-2 line-clamp-2">
              "{t.quote}"
            </p>
            <div className="kindwords-divider pt-1.5 border-t border-border/40 flex items-baseline justify-between gap-2">
              <p className="text-[11px] font-sans text-foreground truncate">{t.author}</p>
              <p className="text-[10px] font-sans text-muted-foreground/70 truncate">{t.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
