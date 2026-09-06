import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Moon, Sun } from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tilt3D } from "@/components/Tilt3D";
import { BlogNewsletterCTA } from "@/components/BlogNewsletterCTA";
import { SubscribeLightbox } from "@/components/SubscribeLightbox";
import { EventCard } from "@/components/journal/EventCard";
import { BuildFeedCard, BuildGroupCard } from "@/components/journal/BuildFeedCard";
import { JournalCardShell } from "@/components/journal/JournalCardShell";
import journalLogoLight from "@/assets/journal-logo-light.png.asset.json";
import journalLogoDark from "@/assets/journal-logo-dark.png.asset.json";
import {
  EventItem,
  JournalItem,
  WritingItem,
  fetchBuildItems,
  fetchEventItems,
  fetchWritingItems,
  formatJournalDate,
  groupBuildItems,
  interleaveJournalItems,
  isUpcoming,
  mergeJournalItems,
} from "@/lib/journalFeed";

type IconProps = { className?: string };

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.5,
  viewBox: "0 0 24 24",
};

const WritingIcon = ({ className }: IconProps) => (
  <svg {...iconBase} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13" />
  </svg>
);

const BuildsIcon = ({ className }: IconProps) => (
  <svg {...iconBase} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12v.01m7.071-7.081c-1.562-1.562-6 .337-9.9 4.243-3.905 3.905-5.804 8.337-4.242 9.9 1.562 1.561 6-.338 9.9-4.244 3.905-3.905 5.804-8.337 4.242-9.9" />
    <path d="M4.929 4.929c-1.562 1.562.337 6 4.243 9.9 3.905 3.905 8.337 5.804 9.9 4.242 1.561-1.562-.338-6-4.244-9.9-3.905-3.905-8.337-5.804-9.9-4.242" />
  </svg>
);

const EventsIcon = ({ className }: IconProps) => (
  <svg {...iconBase} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0" />
    <path d="M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0m-4 0a5 5 0 0 1 5-5m0 10a5 5 0 0 0 5-5" />
  </svg>
);

const FILTERS = [
  { key: "all", label: "Everything", Icon: null },
  { key: "writing", label: "Writing", Icon: WritingIcon },
  { key: "builds", label: "Builds", Icon: BuildsIcon },
  { key: "events", label: "Events", Icon: EventsIcon },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];



const getThemeColors = (theme: string): string => {
  const themeMap: Record<string, string> = {
    Growth: "pill-growth",
    Strategy: "pill-strategy",
    Creative: "pill-creative",
    Systems: "pill-systems",
    "Case Studies": "pill-casestudy",
    "Case Study": "pill-casestudy",
  };
  return themeMap[theme] || "pill-casestudy";
};

const WritingCard = ({ post }: { post: WritingItem }) => (
  <Link to={`/blog/${post.slug}`} className="group block h-full">
    <JournalCardShell
      media={
        post.headerImage ? (
          <img
            src={post.headerImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : undefined
      }
    >
      <div className="mb-3 flex items-center gap-3">
        {post.theme && (
          <span className={`rounded-full px-3 py-1 text-sm ${getThemeColors(post.theme)}`}>
            {post.theme}
          </span>
        )}
        {post.readingTime && (
          <span className="text-sm text-muted-foreground">{post.readingTime} min read</span>
        )}
      </div>

      <h3 className="line-clamp-2 text-2xl leading-snug transition-colors group-hover:text-accent">
        {post.title}
      </h3>

      {(post.intro || post.description) && (
        <p className="mt-2 line-clamp-2 text-muted-foreground">{post.intro || post.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-4 text-sm text-muted-foreground">
        <span className="italic">Brendan @ Thread and Stack</span>
        {post.date && <span>{formatJournalDate(post.date)}</span>}
      </div>
    </JournalCardShell>
  </Link>
);

const SPRING = { type: "spring" as const, stiffness: 220, damping: 30, mass: 0.9 };

const SPRING_TRANSITION = SPRING;

/** Only an expanded build takes over a full row of the feed */
const isFullWidth = (item: JournalItem, expandedBuild: string | null) =>
  item.kind === "buildGroup" && expandedBuild === item.id;

/** Featured events are the only cards that go double width, and only on desktop */
const spanClass = (item: JournalItem) =>
  item.kind === "event" && item.featured ? "lg:col-span-2" : "";

const renderCard = (
  item: JournalItem,
  expandedBuild: string | null,
  toggleBuild: (id: string) => void
) => {
  if (item.kind === "writing") return <WritingCard post={item} />;
  if (item.kind === "build") return <BuildFeedCard item={item} />;
  if (item.kind === "buildGroup")
    return (
      <BuildGroupCard
        group={item}
        expanded={expandedBuild === item.id}
        onToggle={() => toggleBuild(item.id)}
      />
    );
  return <EventCard event={item} featured={item.featured} />;
};

const renderItem = (
  item: JournalItem,
  expandedBuild: string | null,
  toggleBuild: (id: string) => void
) => (
  <motion.div
    key={item.id}
    layout
    transition={SPRING_TRANSITION}
    className={`h-full min-h-0 ${spanClass(item)}`}
  >
    {renderCard(item, expandedBuild, toggleBuild)}
  </motion.div>
);

/** Split the feed into full-width rows and dense-packed grid blocks */
const buildLayout = (items: JournalItem[], expandedBuild: string | null) => {
  const blocks: Array<
    { type: "full"; item: JournalItem } | { type: "grid"; items: JournalItem[] }
  > = [];
  let bucket: JournalItem[] = [];

  const flush = () => {
    if (!bucket.length) return;
    blocks.push({ type: "grid", items: bucket });
    bucket = [];
  };

  items.forEach((item) => {
    if (isFullWidth(item, expandedBuild)) {
      flush();
      blocks.push({ type: "full", item });
    } else {
      bucket.push(item);
    }
  });
  flush();
  return blocks;
};





const JournalPage = () => {
  const [items, setItems] = useState<JournalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSubscribe, setShowSubscribe] = useState(searchParams.get("subscribe") === "true");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null);
  const toggleBuild = (id: string) => setExpandedBuild((cur) => (cur === id ? null : id));
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const filterParam = searchParams.get("type") as FilterKey | null;
  const activeFilter: FilterKey =
    filterParam && FILTERS.some((f) => f.key === filterParam) ? filterParam : "all";

  const setFilter = (key: FilterKey) => {
    if (key === "all") searchParams.delete("type");
    else searchParams.set("type", key);
    setSearchParams(searchParams, { replace: true });
  };

  const handleSubscribeChange = (open: boolean) => {
    setShowSubscribe(open);
    if (!open) {
      searchParams.delete("subscribe");
      setSearchParams(searchParams, { replace: true });
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const [writing, builds, events] = await Promise.all([
        fetchWritingItems(),
        fetchBuildItems(),
        fetchEventItems(),
      ]);
      setItems(mergeJournalItems([...writing, ...groupBuildItems(builds), ...events]));
      setIsLoading(false);
    };
    load();
  }, []);

  const upcomingEvents = useMemo(
    () => items.filter((i): i is EventItem => i.kind === "event" && isUpcoming(i)).reverse(),
    [items]
  );

  const feed = useMemo(() => {
    const past = items.filter((i) => !(i.kind === "event" && isUpcoming(i)));
    if (activeFilter === "writing") return past.filter((i) => i.kind === "writing");
    if (activeFilter === "builds") return past.filter((i) => i.kind === "buildGroup");
    if (activeFilter === "events") return past.filter((i) => i.kind === "event");
    return interleaveJournalItems(past);
  }, [items, activeFilter]);

  const layout = useMemo(() => buildLayout(feed, expandedBuild), [feed, expandedBuild]);




  return (
    <>
      <Helmet>
        <title>Thread &amp; Stack Journal | Writing, builds and events</title>
        <meta
          name="description"
          content="Writing on ops and strategy, a public log of what we're building, and the events we host and attend."
        />
        <link rel="canonical" href="https://threadandstack.com/journal" />
        <meta property="og:url" content="https://threadandstack.com/journal" />
        <meta property="og:title" content="Thread & Stack Journal" />
        <meta
          property="og:description"
          content="Writing on ops and strategy, a public log of what we're building, and the events we host and attend."
        />
      </Helmet>

      <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
        <main className="relative min-h-screen pt-24">
          <Navigation
            variant={theme === "dark" ? "image-hero" : "default"}
            themeToggle={
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-muted/60 text-foreground/70 backdrop-blur-sm transition-all hover:bg-muted hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            }
          />
          <SubscribeLightbox open={showSubscribe} onOpenChange={handleSubscribeChange} />

          <section className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
              <div className="mb-6 flex justify-center">
                <Tilt3D>
                  <img
                    src={theme === "dark" ? journalLogoDark.url : journalLogoLight.url}
                    alt="Thread & Stack Journal"
                    className="h-40 w-auto sm:h-56 md:h-80"
                  />
                </Tilt3D>
              </div>
              <p className="mx-auto mb-8 max-w-2xl text-center text-xl leading-relaxed text-muted-foreground">
                Writing on ops, strategy and intelligence, a running log of what we're building, and
                the rooms we show up in.
              </p>

              <div className="mb-10 flex justify-center">
                <BlogNewsletterCTA />
              </div>

              {/* Upcoming events strip */}
              {!isLoading && upcomingEvents.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                    Coming up
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {/* Type filters */}
              <div className="mb-12 flex flex-wrap justify-center gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                      activeFilter === f.key
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {f.Icon && <f.Icon className="h-4 w-4" />}
                    {f.label}
                  </button>

                ))}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : (
                <LayoutGroup>
                  <div className="flex flex-col gap-8">
                    {layout.map((block, blockIndex) =>
                      block.type === "full" ? (
                        <div key={block.item.id}>
                          {renderItem(block.item, expandedBuild, toggleBuild)}
                        </div>
                      ) : (
                        <div
                          key={`grid-${blockIndex}`}
                          className="grid gap-8 md:grid-cols-2 md:[grid-auto-flow:dense] md:[grid-auto-rows:13.5rem] lg:grid-cols-3"
                        >
                          {block.items.map((item) => renderItem(item, expandedBuild, toggleBuild))}
                        </div>
                      )
                    )}


                    {feed.length === 0 && (
                      <div className="py-20 text-center">
                        <p className="text-xl text-muted-foreground">Nothing here yet. Check back soon.</p>
                      </div>
                    )}
                  </div>
                </LayoutGroup>

              )}

              {activeFilter === "builds" && !isLoading && (
                <div className="mt-10 text-center">
                  <Link to="/builds" className="text-sm text-muted-foreground hover:text-foreground">
                    See builds as a timeline →
                  </Link>
                </div>
              )}
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </>
  );
};

export default JournalPage;
