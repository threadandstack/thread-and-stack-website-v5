import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Sun, Moon } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/home-draft2/CTA";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";
import { formatUpdateDate } from "./BuildsPage";

interface BuildUpdateFull {
  id: string;
  slug: string;
  title: string;
  build_name: string | null;
  build_slug: string | null;
  version: string | null;
  release_type: string | null;
  change_types: string[] | null;
  changelog: string | null;
  description: string | null;
  html_content: string;
  header_image_url: string | null;
  published_date: string | null;
  last_edited_time: string | null;
}

const BuildDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [updates, setUpdates] = useState<BuildUpdateFull[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("build_updates_cache")
        .select("*")
        .or(`build_slug.eq.${slug},slug.eq.${slug}`)
        .order("published_date", { ascending: false, nullsFirst: false })
        .order("last_edited_time", { ascending: false, nullsFirst: false });

      if (error) console.error("Error loading build:", error);
      setUpdates((data as BuildUpdateFull[]) || []);
      setIsLoading(false);
    };
    if (slug) load();
  }, [slug]);

  const primary = updates[0];
  const buildTitle = primary?.build_name || primary?.title || "Build";

  return (
    <>
      <Helmet>
        <title>{buildTitle} | Builds | Thread &amp; Stack</title>
        <meta
          name="description"
          content={primary?.description || `Version history and build updates for ${buildTitle}.`}
        />
        <link rel="canonical" href={`https://threadandstack.com/builds/${slug}`} />
      </Helmet>

      <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
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

        <main className="pb-10 pt-32 md:pt-40">
          <div className="mx-auto max-w-3xl px-6">
            <Link
              to="/builds"
              className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All builds
            </Link>

            {isLoading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : !primary ? (
              <p className="py-24 text-center text-ink-soft">
                This build hasn't been published yet.
              </p>
            ) : (
              <>
                <header className="mt-8">
                  <h1 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[56px]">
                    {buildTitle}
                  </h1>
                  {primary.description && (
                    <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
                      {primary.description}
                    </p>
                  )}
                  <p className="mt-4 text-sm text-ink-soft">
                    {updates.length} update{updates.length === 1 ? "" : "s"}
                    {primary.version ? ` • latest ${primary.version}` : ""}
                  </p>
                </header>

                {primary.header_image_url && (
                  <div className="mt-10 overflow-hidden rounded-2xl">
                    <img
                      src={primary.header_image_url}
                      alt={buildTitle}
                      className="w-full object-cover"
                    />
                  </div>
                )}

                {/* Version timeline */}
                <div className="mt-16 space-y-14">
                  {updates.map((update) => (
                    <article
                      key={update.id}
                      className="rounded-2xl bg-card p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:p-10"
                    >
                      <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                        {update.version && (
                          <span className="rounded-full bg-muted px-2.5 py-1 tracking-normal text-foreground/80">
                            {update.version}
                          </span>
                        )}
                        <span>
                          {formatUpdateDate(update.published_date || update.last_edited_time)}
                        </span>
                      </div>

                      <h2 className="mt-4 font-serif-pro text-2xl font-normal leading-snug md:text-[30px]">
                        {update.title}
                      </h2>

                      {update.html_content && (
                        <div
                          className="blog-content prose prose-lg mt-6 max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(update.html_content),
                          }}
                        />
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-20">
            <CTA theme={theme} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BuildDetailPage;
