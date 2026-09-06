import { supabase } from "@/integrations/supabase/client";

export type JournalItemType = "writing" | "build" | "event";

export interface WritingItem {
  kind: "writing";
  id: string;
  date: string | null;
  slug: string;
  title: string;
  description?: string | null;
  intro?: string | null;
  headerImage?: string | null;
  readingTime?: string | null;
  theme?: string | null;
  featured?: boolean;
}

export interface BuildItem {
  kind: "build";
  id: string;
  date: string | null;
  slug: string;
  title: string;
  buildName: string | null;
  buildSlug: string | null;
  version: string | null;
  releaseType: string | null;
  changeTypes: string[];
  changelog: string | null;
  description: string | null;
  headerImage?: string | null;
  /** Position of this release within its build's history, e.g. 3 of 6 */
  releaseIndex?: number;
  releaseCount?: number;
}

export interface EventItem {
  kind: "event";
  id: string;
  date: string | null;
  slug: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  role: string | null;
  format: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  venue: string | null;
  organiser: string | null;
  topics: string[];
  eventUrl: string | null;
  slidesUrl: string | null;
  recordingUrl: string | null;
  featured: boolean;
}

export interface BuildGroupItem {
  kind: "buildGroup";
  id: string;
  /** Date of the most recent release, used for feed ordering */
  date: string | null;
  slug: string;
  buildName: string;
  headerImage?: string | null;
  releases: BuildItem[];
}

export type JournalItem = WritingItem | BuildItem | BuildGroupItem | EventItem;

/** Collapse individual build releases into one card per build. */
export function groupBuildItems(items: BuildItem[]): BuildGroupItem[] {
  const groups = new Map<string, BuildItem[]>();
  for (const item of items) {
    const key = item.buildSlug || item.slug;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  const toTime = (v?: string | null) => (v ? new Date(v).getTime() : 0);

  return [...groups.entries()]
    .map(([slug, releases]) => {
      const ordered = [...releases].sort((a, b) => toTime(b.date) - toTime(a.date));
      return {
        kind: "buildGroup" as const,
        id: `buildGroup-${slug}`,
        date: ordered[0]?.date ?? null,
        slug,
        buildName: ordered[0]?.buildName || ordered[0]?.title || "Build",
        headerImage: ordered.find((r) => r.headerImage)?.headerImage ?? null,
        releases: ordered,
      };
    })
    .sort((a, b) => toTime(b.date) - toTime(a.date));
}

export const formatJournalDate = (value?: string | null): string => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export const formatEventDateRange = (start?: string | null, end?: string | null): string => {
  if (!start) return "";
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return "";
  if (!end || end === start) return formatJournalDate(start);
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.getDate()}–${e.getDate()} ${e.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`;
  }
  return `${formatJournalDate(start)} – ${formatJournalDate(end)}`;
};

export const isUpcoming = (item: EventItem): boolean => {
  const ref = item.endDate || item.startDate;
  if (!ref) return false;
  const d = new Date(ref);
  d.setHours(23, 59, 59, 999);
  return d.getTime() >= Date.now();
};

export async function fetchWritingItems(): Promise<WritingItem[]> {
  const { data, error } = await supabase.functions.invoke("fetch-blog-posts");
  if (error) {
    console.error("Journal: failed to load posts", error);
    return [];
  }
  return ((data?.posts || []) as any[]).map((p) => ({
    kind: "writing" as const,
    id: `writing-${p.id}`,
    date: p.publishedDate || null,
    slug: p.slug,
    title: p.title,
    description: p.description,
    intro: p.intro,
    headerImage: p.headerImage,
    readingTime: p.readingTime,
    theme: p.theme,
    featured: !!p.featured,
  }));
}

export async function fetchBuildItems(): Promise<BuildItem[]> {
  const { data, error } = await supabase
    .from("build_updates_cache")
    .select(
      "notion_id, slug, title, build_name, build_slug, version, release_type, change_types, changelog, description, header_image_url, published_date, last_edited_time"
    )
    .order("published_date", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Journal: failed to load builds", error);
    return [];
  }

  const rows = (data || []) as any[];

  // Work out each release's position within its build's history (oldest = 1)
  const byBuild = new Map<string, any[]>();
  for (const row of rows) {
    const key = row.build_slug || row.slug;
    if (!byBuild.has(key)) byBuild.set(key, []);
    byBuild.get(key)!.push(row);
  }
  const position = new Map<string, { index: number; count: number }>();
  byBuild.forEach((group) => {
    const ordered = [...group].sort((a, b) =>
      String(a.published_date || a.last_edited_time || "").localeCompare(
        String(b.published_date || b.last_edited_time || "")
      )
    );
    ordered.forEach((row, i) =>
      position.set(row.notion_id, { index: i + 1, count: ordered.length })
    );
  });

  return rows.map((row) => ({
    kind: "build" as const,
    id: `build-${row.notion_id}`,
    date: row.published_date || row.last_edited_time || null,
    slug: row.slug,
    title: row.title,
    buildName: row.build_name,
    buildSlug: row.build_slug,
    version: row.version,
    releaseType: row.release_type,
    changeTypes: row.change_types || [],
    changelog: row.changelog,
    description: row.description,
    headerImage: row.header_image_url || null,
    releaseIndex: position.get(row.notion_id)?.index,
    releaseCount: position.get(row.notion_id)?.count,
  }));
}

export async function fetchEventItems(): Promise<EventItem[]> {
  const { data, error } = await supabase.functions.invoke("fetch-events");
  if (error) {
    console.error("Journal: failed to load events", error);
    return [];
  }
  return ((data?.events || []) as any[]).map((e) => ({
    kind: "event" as const,
    id: `event-${e.id}`,
    date: e.startDate || null,
    slug: e.slug,
    title: e.title,
    summary: e.summary ?? null,
    coverImage: e.coverImage ?? null,
    role: e.role ?? null,
    format: e.format ?? null,
    startDate: e.startDate ?? null,
    endDate: e.endDate ?? null,
    location: e.location ?? null,
    venue: e.venue ?? null,
    organiser: e.organiser ?? null,
    topics: e.topics || [],
    eventUrl: e.eventUrl ?? null,
    slidesUrl: e.slidesUrl ?? null,
    recordingUrl: e.recordingUrl ?? null,
    featured: !!e.featured,
  }));
}

export function mergeJournalItems(items: JournalItem[]): JournalItem[] {
  return [...items].sort((a, b) => {
    const av = a.date ? new Date(a.date).getTime() : 0;
    const bv = b.date ? new Date(b.date).getTime() : 0;
    return bv - av;
  });
}

/**
 * Keep broadly newest-first order but avoid stacking same-type cards
 * (especially the double-width events) directly next to each other.
 * Items are only nudged within a small window, so dates stay near-accurate.
 */
export function interleaveJournalItems(items: JournalItem[], window = 10): JournalItem[] {
  const pool = [...items];
  const out: JournalItem[] = [];
  /** how many cards since the last event banner */
  let sinceEvent = Infinity;
  const MIN_GAP = 3; // events need at least this many other cards between them

  while (pool.length) {
    const prev = out[out.length - 1];
    const prev2 = out[out.length - 2];
    const limit = Math.min(window, pool.length);

    let pick = -1;
    for (let i = 0; i < limit; i++) {
      const k = pool[i].kind;
      if (k === "event" && sinceEvent < MIN_GAP) continue;
      if (prev && prev2 && prev.kind === k && prev2.kind === k) continue;
      pick = i;
      break;
    }
    // nothing acceptable in range: relax the same-type rule, then give up
    if (pick === -1) {
      pick = pool.findIndex((it, i) => i < limit && it.kind !== "event");
      if (pick === -1) pick = 0;
    }

    const chosen = pool.splice(pick, 1)[0];
    sinceEvent = chosen.kind === "event" ? 0 : sinceEvent + 1;
    out.push(chosen);
  }

  return out;
}
