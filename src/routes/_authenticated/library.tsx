import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Mic, Link2, ImageIcon, Type, Video, CheckCircle2, ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";
import { listInspirations } from "@/lib/inspiration.functions";

export const Route = createFileRoute("/_authenticated/library")({
  component: LibraryPage,
});

type Item = {
  id: string;
  title: string;
  subject: string | null;
  summary: string | null;
  tags: string[];
  source: string;
  source_url: string | null;
  cover_image_url: string | null;
  cover_width: number | null;
  cover_height: number | null;
  status: string;
  notion_page_url: string | null;
  captured_at: string;
};

const SOURCE_ICONS: Record<string, typeof Mic> = {
  voice: Mic, link: Link2, image: ImageIcon, text: Type, video: Video, typed: Type,
};

const FILTERS = ["all", "voice", "link", "image", "text", "video"] as const;

function LibraryPage() {
  const fetchAll = useServerFn(listInspirations);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  useEffect(() => {
    fetchAll()
      .then((r: { items: Item[] }) => setItems(r.items))
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [fetchAll]);

  const filtered = filter === "all"
    ? items
    : items.filter((i) => i.source === filter || (filter === "text" && i.source === "typed"));

  return (
    <main className="relative min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-hairline bg-background/85 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
          <Link to="/capture" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Capture
          </Link>
          <h1 className="font-serif-pro text-2xl italic">library</h1>
          <div className="w-16" />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                filter === f
                  ? "border-clay bg-clay/15 text-clay"
                  : "border-hairline bg-paper/40 text-ink-soft hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="py-24 text-center text-sm text-ink-soft">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <p className="font-serif-pro text-2xl italic text-ink-soft">
            {filter === "all" ? "Nothing captured yet." : `No ${filter} inspirations.`}
          </p>
          <Link
            to="/capture"
            className="mt-6 inline-flex h-11 items-center rounded-md bg-gradient-warm px-5 text-sm font-medium text-accent-foreground"
          >
            <Plus className="mr-2 h-4 w-4" /> Capture something
          </Link>
        </div>
      ) : (
        <div className="columns-2 gap-3 px-3 py-4 md:columns-3 lg:columns-4">
          {filtered.map((it) => <Card key={it.id} item={it} />)}
        </div>
      )}
    </main>
  );
}

function Card({ item }: { item: Item }) {
  const navigate = useNavigate();
  const Icon = SOURCE_ICONS[item.source] ?? Type;

  return (
    <button
      onClick={() => navigate({ to: "/review/$draftId", params: { draftId: item.id } })}
      className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-hairline bg-paper/40 text-left transition-all hover:-translate-y-0.5 hover:border-clay/50 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]"
    >
      {item.cover_image_url && (
        <div className="relative w-full overflow-hidden bg-paper">
          <img
            src={item.cover_image_url}
            alt=""
            loading="lazy"
            className="w-full"
            style={{
              aspectRatio: item.cover_width && item.cover_height
                ? `${item.cover_width} / ${item.cover_height}`
                : "4 / 3",
              objectFit: "cover",
            }}
          />
          <div className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-background/80 backdrop-blur">
            <Icon className="h-3 w-3 text-foreground" />
          </div>
        </div>
      )}
      <div className="p-3">
        {!item.cover_image_url && (
          <div className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-warm text-accent-foreground">
            <Icon className="h-3 w-3" />
          </div>
        )}
        <h3 className="font-serif-pro text-[17px] italic leading-snug text-foreground line-clamp-2">
          {item.title || "Untitled"}
        </h3>
        {item.summary && (
          <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft line-clamp-3">{item.summary}</p>
        )}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {item.subject && (
            <span className="rounded-full bg-clay/15 px-2 py-0.5 text-[10px] text-clay">{item.subject}</span>
          )}
          {item.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-violet/15 px-2 py-0.5 text-[10px] text-violet">{t}</span>
          ))}
        </div>
        {(item.status === "synced" || item.source_url) && (
          <div className="mt-2 flex items-center gap-2 text-[10px] text-ink-soft">
            {item.status === "synced" && (
              <span className="inline-flex items-center gap-1 text-clay">
                <CheckCircle2 className="h-3 w-3" /> Notion
              </span>
            )}
            {item.source_url && (
              <span className="inline-flex items-center gap-1 truncate">
                <ExternalLink className="h-3 w-3" />
                {new URL(item.source_url).hostname.replace(/^www\./, "")}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
