import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Sun, Moon, ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { BlogNewsletterCTA } from "@/components/BlogNewsletterCTA";
import { SubscribeLightbox } from "@/components/SubscribeLightbox";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  intro?: string | null;
  headerImage?: string | null;
  url: string;
  readingTime?: string | null;
  theme?: string | null;
  publishedDate?: string | null;
  featured?: boolean;
}

const formatPublishedDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const JournalDraft2Page = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSubscribe, setShowSubscribe] = useState(
    searchParams.get("subscribe") === "true"
  );

  const themes = [...new Set(posts.map((p) => p.theme).filter(Boolean))] as string[];
  const filteredPosts = activeTheme
    ? posts.filter((p) => p.theme === activeTheme)
    : posts;
  const featured = filteredPosts.find((p) => p.featured);
  const rest = activeTheme ? filteredPosts : filteredPosts.filter((p) => !p.featured);

  const handleSubscribeChange = (open: boolean) => {
    setShowSubscribe(open);
    if (!open) {
      searchParams.delete("subscribe");
      setSearchParams(searchParams, { replace: true });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("fetch-blog-posts");
        if (error) {
          console.error("Error fetching blog posts:", error);
          return;
        }
        setPosts(data?.posts || []);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
      <Navigation
        variant={theme === "dark" ? "image-hero" : "default"}
        hideLogo
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

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-hairline">
          <div aria-hidden className="aurora">
            <span />
          </div>
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              maskImage:
                "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
            }}
          />

          <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 md:pb-24 md:pt-32">
            <div className="flex flex-col items-center text-center">
              <Link
                to="/home-draft2"
                className="fade-up mb-8 inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to home
              </Link>

              <div className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/70 px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground backdrop-blur">
                <BookOpen className="h-3 w-3 text-violet" strokeWidth={2} />
                Thread & Stack Journal
              </div>

              <h1 className="fade-up fade-up-2 mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.035em] md:text-[76px]">
                Field notes from
                <br />
                <span
                  className="font-serif-pro italic font-normal bg-clip-text text-transparent text-5xl md:text-7xl"
                  style={{
                    backgroundImage: "linear-gradient(100deg, var(--gradient-4color))",
                  }}
                >
                  the workbench.
                </span>
              </h1>

              <p className="fade-up fade-up-3 mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
                Thoughts on brand, creativity, and the systems that build the businesses around them — written between client work, never instead of it.
              </p>

              <div className="fade-up fade-up-4 mt-9">
                <BlogNewsletterCTA />
              </div>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            {!isLoading && themes.length > 0 && (
              <div className="mb-12 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setActiveTheme(null)}
                  className={`rounded-full border px-4 py-1.5 text-[13px] transition-all ${
                    activeTheme === null
                      ? "border-foreground bg-foreground text-background"
                      : "border-hairline bg-paper/60 text-ink-soft hover:bg-paper"
                  }`}
                >
                  All
                </button>
                {themes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTheme(t)}
                    className={`rounded-full border px-4 py-1.5 text-[13px] transition-all ${
                      activeTheme === t
                        ? "border-foreground bg-foreground text-background"
                        : "border-hairline bg-paper/60 text-ink-soft hover:bg-paper"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo" />
              </div>
            ) : (
              <>
                {featured && !activeTheme && (
                  <Link to={`/blog/${featured.slug}`} className="group mb-12 block">
                    <article className="grid overflow-hidden rounded-2xl border border-hairline bg-paper/60 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] md:grid-cols-2">
                      {featured.headerImage && (
                        <div className="aspect-[16/10] overflow-hidden md:aspect-auto">
                          <img
                            src={featured.headerImage}
                            alt={featured.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex flex-col justify-center p-8 md:p-10">
                        <div className="mb-4 flex flex-wrap items-center gap-2 text-[11.5px] uppercase tracking-wider">
                          <span className="rounded-full border border-indigo/30 bg-indigo/10 px-2.5 py-0.5 text-indigo">
                            Featured
                          </span>
                          {featured.theme && (
                            <span className="rounded-full border border-hairline bg-background px-2.5 py-0.5 text-muted-foreground">
                              {featured.theme}
                            </span>
                          )}
                          {featured.readingTime && (
                            <span className="text-muted-foreground">
                              {featured.readingTime} min read
                            </span>
                          )}
                        </div>

                        <h2 className="font-sans not-italic text-3xl font-semibold leading-[1.05] tracking-[-0.025em] md:text-4xl">
                          {featured.title}
                        </h2>

                        {featured.description && (
                          <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
                            {featured.description}
                          </p>
                        )}

                        <div className="mt-6 flex items-center justify-between text-[12.5px] text-muted-foreground">
                          <span className="italic">Brendan @ Thread & Stack</span>
                          {featured.publishedDate && (
                            <span>{formatPublishedDate(featured.publishedDate)}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group block"
                    >
                      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-paper/60 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.3)]">
                        {post.headerImage && (
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={post.headerImage}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11.5px] uppercase tracking-wider">
                            {post.theme && (
                              <span className="rounded-full border border-hairline bg-background px-2.5 py-0.5 text-muted-foreground">
                                {post.theme}
                              </span>
                            )}
                            {post.readingTime && (
                              <span className="text-muted-foreground">
                                {post.readingTime} min read
                              </span>
                            )}
                          </div>

                          <h3 className="font-sans not-italic text-[22px] font-semibold leading-snug tracking-[-0.015em]">
                            {post.title}
                          </h3>

                          {post.intro && (
                            <p className="mt-3 line-clamp-2 flex-1 text-[14.5px] leading-relaxed text-ink-soft">
                              {post.intro}
                            </p>
                          )}

                          <div className="mt-5 flex items-center justify-between text-[12px] text-muted-foreground">
                            <span className="italic">Brendan</span>
                            {post.publishedDate && (
                              <span>{formatPublishedDate(post.publishedDate)}</span>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}

                  {rest.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-lg text-muted-foreground">
                        {activeTheme
                          ? `No posts in "${activeTheme}" yet.`
                          : "No published posts yet. Check back soon."}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JournalDraft2Page;
