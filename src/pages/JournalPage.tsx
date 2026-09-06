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
  isUpcoming,
  mergeJournalItems,
} from "@/lib/journalFeed";

const FILTERS = [
  { key: "all", label: "Everything" },
  { key: "writing", label: "Writing" },
  { key: "builds", label: "Builds" },
  { key: "events", label: "Events" },
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
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
      {post.headerImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.headerImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          {post.theme && (
            <span className={`rounded-full px-3 py-1 text-sm ${getThemeColors(post.theme)}`}>
              {post.theme}
            </span>
          )}
          {post.readingTime && (
            <span className="text-sm text-muted-foreground">{post.readingTime} min read</span>
          )}
        </div>

        <h3 className="mb-3 text-2xl transition-colors group-hover:text-accent">{post.title}</h3>

        {(post.intro || post.description) && (
          <p className="mb-4 line-clamp-2 text-muted-foreground">{post.intro || post.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="italic">Brendan @ Thread and Stack</span>
          {post.date && <span>{formatJournalDate(post.date)}</span>}
        </div>
      </div>
    </Card>
  </Link>
);

const SPRING = { type: "spring" as const, stiffness: 220, damping: 30, mass: 0.9 };

const renderItem = (
  item: JournalItem,
  expandedBuild: string | null,
  toggleBuild: (id: string) => void
) => {
  if (item.kind === "writing")
    return (
      <motion.div key={item.id} layout transition={SPRING} className="md:row-span-4">
        <WritingCard post={item} />
      </motion.div>
    );
  if (item.kind === "build")
    return (
      <motion.div key={item.id} layout transition={SPRING} className="md:row-span-2">
        <BuildFeedCard item={item} />
      </motion.div>
    );
  if (item.kind === "buildGroup") {
    const isOpen = expandedBuild === item.id;
    // 120px rows: closed card = 2 rows, open card grows with its update list
    const openRows = Math.max(4, 2 + Math.ceil((item.releases.length * 108) / 120));
    return (
      <motion.div
        key={item.id}
        layout
        transition={SPRING}
        style={isOpen ? { gridRow: `span ${openRows} / span ${openRows}` } : undefined}
        className={isOpen ? "md:col-span-2 lg:col-span-3" : "md:row-span-2"}
      >
        <BuildGroupCard
          group={item}
          expanded={isOpen}
          onToggle={() => toggleBuild(item.id)}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={item.id}
      layout
      transition={SPRING}
      className="md:col-span-2 md:row-span-2"
    >
      <EventCard event={item} wide />
    </motion.div>
  );
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
    if (activeFilter === "all") return past;
    if (activeFilter === "writing") return past.filter((i) => i.kind === "writing");
    if (activeFilter === "builds") return past.filter((i) => i.kind === "buildGroup");
    return past.filter((i) => i.kind === "event");
  }, [items, activeFilter]);

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
                    className={`rounded-full px-4 py-2 text-sm transition-all ${
                      activeFilter === f.key
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
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
                  <div className="grid grid-flow-row-dense items-stretch gap-8 md:auto-rows-[120px] md:grid-cols-2 lg:grid-cols-3">
                    {feed.map((item) => renderItem(item, expandedBuild, toggleBuild))}

                    {feed.length === 0 && (
                      <div className="col-span-full py-20 text-center">
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
