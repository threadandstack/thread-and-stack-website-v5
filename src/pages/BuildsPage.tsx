import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Loader2, Sun, Moon } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/home-draft2/CTA";
import { Tilt3D } from "@/components/Tilt3D";
import { supabase } from "@/integrations/supabase/client";

export interface BuildUpdate {
  id: string;
  slug: string;
  title: string;
  build_name: string | null;
  build_slug: string | null;
  version: string | null;
  description: string | null;
  header_image_url: string | null;
  theme: string | null;
  published_date: string | null;
  last_edited_time: string | null;
}

export const formatUpdateDate = (value?: string | null) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const buildHref = (update: BuildUpdate) =>
  `/builds/${update.build_slug || update.slug}`;

const BuildsPage = () => {
  const [updates, setUpdates] = useState<BuildUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("build_updates_cache")
        .select(
          "id, slug, title, build_name, build_slug, version, description, header_image_url, theme, published_date, last_edited_time",
        )
        .order("last_edited_time", { ascending: false, nullsFirst: false });

      if (error) console.error("Error loading builds:", error);
      setUpdates((data as BuildUpdate[]) || []);
      setIsLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>Builds | Thread &amp; Stack</title>
        <meta
          name="description"
          content="Building in public. Live product builds from Thread & Stack, with every version update as it ships."
        />
        <link rel="canonical" href="https://threadandstack.com/builds" />
        <meta property="og:url" content="https://threadandstack.com/builds" />
        <meta property="og:title" content="Builds | Thread & Stack" />
        <meta
          property="og:description"
          content="Building in public. Live product builds from Thread & Stack, with every version update as it ships."
        />
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

        <main>
          <section className="pt-32 md:pt-40">
            <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
              <span className="mb-5 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Building in public
              </span>
              <h1 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[64px]">
                Builds, shipped in the{" "}
                <span className="text-gradient-warm">open.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
                Every product I'm building, and every version update as it lands.
                Newest work rises to the top.
              </p>
            </div>
          </section>

          <section className="px-6 py-16 md:py-20">
            <div className="mx-auto max-w-5xl">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : updates.length === 0 ? (
                <p className="text-center text-ink-soft">
                  Nothing shipped here yet. Check back shortly.
                </p>
              ) : (
                <div className="grid gap-8 md:grid-cols-2">
                  {updates.map((update) => (
                    <Tilt3D key={update.id}>
                      <Link
                        to={buildHref(update)}
                        className="group block h-full overflow-hidden rounded-2xl bg-card shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_16px_44px_rgba(0,0,0,0.12)]"
                      >
                        {update.header_image_url && (
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={update.header_image_url}
                              alt={update.title}
                              loading="lazy"
                              className="h-full w-full object-cover opacity-95 transition-opacity group-hover:opacity-100"
                            />
                          </div>
                        )}
                        <div className="space-y-4 p-7">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                            {update.build_name && <span>{update.build_name}</span>}
                            {update.version && (
                              <span className="rounded-full bg-muted px-2.5 py-1 tracking-normal text-foreground/80">
                                {update.version}
                              </span>
                            )}
                          </div>
                          <h2 className="font-serif-pro text-2xl font-normal leading-snug md:text-[28px]">
                            {update.title}
                          </h2>
                          {update.description && (
                            <p className="text-[15px] leading-relaxed text-ink-soft">
                              {update.description}
                            </p>
                          )}
                          <p className="text-sm text-ink-soft">
                            {formatUpdateDate(update.published_date || update.last_edited_time)}
                          </p>
                        </div>
                      </Link>
                    </Tilt3D>
                  ))}
                </div>
              )}
            </div>
          </section>

          <CTA theme={theme} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BuildsPage;
