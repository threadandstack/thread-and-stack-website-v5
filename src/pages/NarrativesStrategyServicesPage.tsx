import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sun, Moon, ArrowRight, ArrowDown, Lock, MessageCircle, Sparkles, Compass, Check } from "lucide-react";
import { PageSeo } from "@/components/seo/PageSeo";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactDrawer } from "@/components/ContactDrawer";
import { PortfolioDetailModal } from "@/components/PortfolioDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { LogoTilt } from "@/components/home-draft2/LogoTilt";
import creativeLogoLight from "@/assets/thread-stack-creative-light.png.asset.json";
import creativeLogoDark from "@/assets/thread-stack-creative-dark.png.asset.json";

const CREATIVE_DB_ID = "2808863b-87d4-8027-8f0e-fb1f70d684e0";

interface PortfolioItem {
  id: string;
  name: string;
  tags: string[];
  text: string;
  monthYear: string;
  date: string | null;
  coverImage: string | null;
  hasNda: boolean;
}

const TAG_COLORS: Record<string, string> = {
  "Brand Strategy": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Content Strategy": "bg-pink-100 text-pink-800 border-pink-200",
  "Copywriting & Storytelling": "bg-orange-100 text-orange-800 border-orange-200",
  "Customer Journey Mapping": "bg-blue-100 text-blue-800 border-blue-200",
  "Design": "bg-purple-100 text-purple-800 border-purple-200",
  "CRM": "bg-green-100 text-green-800 border-green-200",
  "Performance": "bg-gray-100 text-gray-800 border-gray-200",
  "Clientside": "bg-amber-100 text-amber-800 border-amber-200",
};

const EXCLUDED_TAGS = ["NDA", "Not Ready", "Featured", "Featured-Hero", "Masonry-Top"];

const pillars = [
  {
    eyebrow: "Strategy Session",
    icon: MessageCircle,
    title: "A focused 60–90 minute working call.",
    body:
      "Bring a stuck positioning question, a launch you're second-guessing, or messaging that isn't landing. You leave with a clearer through-line and a short action list.",
    highlights: [
      "One sharp focus per session",
      "Live working call, not a deck",
      "Action list you can ship this week",
    ],
  },
  {
    eyebrow: "Project Engagement",
    icon: Sparkles,
    title: "A developed brand or narrative sprint.",
    body:
      "Repositioning, a new offer story, a launch narrative, or a full brand voice and messaging system. Scoped, priced, and shipped against a fixed timeline.",
    highlights: [
      "Positioning, story, and voice",
      "Messaging architecture you can reuse",
      "Fixed scope, fixed price, fixed end date",
    ],
    highlightsLabel: "Developed brand",
  },
  {
    eyebrow: "Fractional Strategy Director",
    icon: Compass,
    title: "Embedded strategic partnership.",
    body:
      "Monthly retainer support for teams that want senior brand and narrative thinking inside the room. Strategy sessions, creative direction, and unblocking on the things that matter.",
    highlights: [
      "Senior strategist in your room",
      "Creative direction and unblocking",
      "Monthly retainer, capped capacity",
    ],
    highlightsLabel: "Embedded strategy",
  },
];

const NarrativesStrategyServicesPage = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [contactOpen, setContactOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<PortfolioItem | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const { data: items = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["portfolio-public", CREATIVE_DB_ID],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-portfolio", {
        body: { database_id: CREATIVE_DB_ID },
      });
      if (error) throw error;
      return data?.items || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Surface everything except "Not Ready". Sort Masonry-Top + Featured first, then date desc.
  const visible = items
    .filter((i) => !i.tags.includes("Not Ready"))
    .sort((a, b) => {
      const rank = (i: PortfolioItem) =>
        (i.tags.includes("Featured-Hero") ? 3 : 0) +
        (i.tags.includes("Featured") ? 2 : 0) +
        (i.tags.includes("Masonry-Top") ? 1 : 0);
      const r = rank(b) - rank(a);
      if (r !== 0) return r;
      const ad = a.date ? new Date(a.date).getTime() : 0;
      const bd = b.date ? new Date(b.date).getTime() : 0;
      return bd - ad;
    });

  const allTags = Array.from(new Set(visible.flatMap((i) => i.tags))).filter(
    (t) => !EXCLUDED_TAGS.includes(t)
  );

  const displayed = activeTag ? visible.filter((i) => i.tags.includes(activeTag)) : visible;

  useEffect(() => {
    // ensure single render at top
  }, []);

  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
      <PageSeo
        title="Narratives & Strategy Services | Thread & Stack"
        description="Brand strategy, narrative, and messaging for purpose-led founders and teams. Strategy sessions, project engagements, and fractional strategy director retainers."
        path="/narratives-and-strategy-services"
        noindex
      />
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

      <main>
        {/* Hero — mirrors the new homepage hero treatment: 3D tilt logo + headline */}
        <section className="relative">
          <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
            <div className="flex flex-col items-center text-center">
              <div
                className="w-full"
                style={{
                  perspective: "1400px",
                  ["--g-tx" as never]: "0deg",
                  ["--g-ty" as never]: "0deg",
                }}
                onMouseMove={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  const r = el.getBoundingClientRect();
                  const px = (e.clientX - r.left) / r.width;
                  const py = (e.clientY - r.top) / r.height;
                  const tx = (px - 0.5) * 8;
                  const ty = (0.5 - py) * 6;
                  el.style.setProperty("--g-tx", `${tx}deg`);
                  el.style.setProperty("--g-ty", `${ty}deg`);
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.setProperty("--g-tx", `0deg`);
                  el.style.setProperty("--g-ty", `0deg`);
                }}
              >
                <div
                  className="transition-transform duration-300 ease-out [transform-style:preserve-3d]"
                  style={{
                    transformOrigin: "50% 70%",
                    transform:
                      "rotateX(var(--g-ty, 0deg)) rotateY(var(--g-tx, 0deg))",
                  }}
                >
                  <div className="mb-10 flex justify-center">
                    <LogoTilt
                      className="h-56 sm:h-72 md:h-[22rem] lg:h-[26rem]"
                      theme={theme}
                      lightSrc={creativeLogoLight.url}
                      darkSrc={creativeLogoDark.url}
                      alt="Thread & Stack Creative — my secret secondary service stash"
                      groupTilt
                    />
                  </div>

                  <span className="mb-5 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                    Narratives &amp; Strategy
                  </span>

                  <h1 className="font-serif-pro italic font-normal max-w-4xl mx-auto text-balance text-5xl leading-[1.02] tracking-[-0.02em] md:text-[76px]">
                    12+ years of Creative, Marketing &amp; Brand.
                  </h1>
                </div>
              </div>

              <p className="mt-8 max-w-2xl text-[16.5px] leading-relaxed text-ink-soft">
                Thread &amp; Stack wasn't always an ops and systems focused business.
                For a long time - it was a solo branding consultancy. I still offer
                that service quietly - to satisfy my own need for creative
                exploration, and to allow me to pick value-aligned clients for creative
                work.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="group inline-flex h-12 items-center rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
                  style={{
                    backgroundImage: "linear-gradient(95deg, var(--gradient-3color))",
                  }}
                >
                  Book a free intro call
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </button>
                <a
                  href="#selected-work"
                  className="group inline-flex h-12 items-center rounded-md border border-hairline bg-background px-6 text-[14.5px] font-medium text-foreground transition-colors hover:bg-paper"
                >
                  See selected work
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                    <ArrowDown className="h-4 w-4 shrink-0" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* Service shapes */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14 max-w-2xl">
              <span className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                The shapes
              </span>
              <h2 className="font-serif-pro italic font-normal text-balance text-3xl leading-[1.05] tracking-[-0.02em] md:text-5xl">
                Three ways to <span className="text-clay">work together.</span>
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3 [perspective:1200px]">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <article
                    key={p.eyebrow}
                    className="group relative flex h-full flex-col rounded-2xl border border-hairline bg-card p-8 md:p-9 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out will-change-transform hover:-translate-y-2 hover:shadow-[0_28px_60px_-20px_rgba(0,0,0,0.25)] hover:[transform:translateY(-8px)_rotateX(4deg)_rotateY(-3deg)] [transform-style:preserve-3d]"
                  >
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="block text-[11px] uppercase tracking-[0.18em] text-clay">
                      {p.eyebrow}
                    </span>
                    <h3 className="mt-3 font-serif-pro italic font-normal text-[26px] leading-tight tracking-[-0.01em] md:text-[30px]">
                      {p.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                      {p.body}
                    </p>

                    {p.highlights && (
                      <div className="mt-7 rounded-xl border border-hairline bg-background/60 p-5">
                        {p.highlightsLabel && (
                          <span className="mb-3 block text-[10px] uppercase tracking-[0.2em] text-clay">
                            {p.highlightsLabel}
                          </span>
                        )}
                        <ul className="space-y-2.5">
                          {p.highlights.map((h) => (
                            <li
                              key={h}
                              className="flex items-start gap-2.5 text-[14px] leading-snug text-foreground/80"
                            >
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>


        {/* Selected work — masonry grid in the /blog style */}
        <section id="selected-work" className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 flex flex-col items-start gap-4 md:mb-12">
              <span className="block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Selected work
              </span>
              <h2 className="font-serif-pro italic font-normal text-balance text-3xl leading-[1.05] tracking-[-0.02em] md:text-5xl">
                A few <span className="text-clay">recent threads.</span>
              </h2>
              <p className="max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
                Brand strategy, storytelling, and content work shaping how organisations talk
                to the people who matter most.
              </p>
            </div>

            {/* Filter pills (blog-style) */}
            {!isLoading && allTags.length > 1 && (
              <div className="mb-10 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTag(null)}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    activeTag === null
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`rounded-full px-4 py-2 text-sm transition-all ${
                      activeTag === tag
                        ? "bg-foreground text-background"
                        : `${TAG_COLORS[tag] || "bg-muted text-muted-foreground"} hover:opacity-80`
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-hairline">
                    <Skeleton className="aspect-[16/9] w-full" />
                    <div className="space-y-3 p-6">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <p className="py-16 text-center text-muted-foreground">No projects to show yet.</p>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
                {displayed.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDetailItem(item)}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-card text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out will-change-transform hover:-translate-y-2 hover:shadow-[0_28px_60px_-20px_rgba(0,0,0,0.25)] hover:[transform:translateY(-8px)_rotateX(4deg)_rotateY(-3deg)] [transform-style:preserve-3d]"
                  >
                    {item.coverImage && !item.hasNda ? (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                        <img
                          src={item.coverImage}
                          alt={item.name}
                          loading="lazy"
                          className="block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-muted">
                        {item.hasNda ? (
                          <div className="text-center text-muted-foreground">
                            <Lock className="mx-auto mb-2 h-6 w-6" />
                            <span className="text-xs">Under NDA</span>
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-accent/10" />
                        )}
                      </div>
                    )}
                    <div className="space-y-3 p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.tags
                          .filter((t) => !EXCLUDED_TAGS.includes(t))
                          .slice(0, 3)
                          .map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`text-[11px] ${
                                TAG_COLORS[tag] || "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        {item.monthYear && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            {item.monthYear}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif-pro italic font-normal text-2xl leading-tight tracking-[-0.01em] transition-colors group-hover:text-clay">
                        {item.name}
                      </h3>
                      {item.text && (
                        <p className="line-clamp-3 text-[14.5px] leading-relaxed text-ink-soft">
                          {item.text}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif-pro italic font-normal text-balance text-3xl leading-[1.05] tracking-[-0.02em] md:text-5xl">
              Ready to <span className="text-clay">say it clearly?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
              Tell us where you're stuck. We'll suggest the smallest engagement that moves
              the needle.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="group inline-flex h-12 items-center rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
                style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
              >
                Start a conversation
                <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ContactDrawer
        open={contactOpen}
        onOpenChange={setContactOpen}
        source="narratives-and-strategy-services"
      />

      <PortfolioDetailModal
        open={!!detailItem}
        onOpenChange={(open) => {
          if (!open) setDetailItem(null);
        }}
        pageId={detailItem?.id || null}
        name={detailItem?.name || ""}
        hasNda={detailItem?.hasNda || false}
      />
    </div>
  );
};

export default NarrativesStrategyServicesPage;
