import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Loader2, Sun, Moon, ChevronDown } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/home-draft2/CTA";
import { Tilt3D } from "@/components/Tilt3D";
import { ChangeChips, VersionChip } from "@/components/builds/ChangeChips";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";

export interface BuildUpdate {
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
  header_image_url: string | null;
  html_content?: string | null;
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

const TimelineEntry = ({ update }: { update: BuildUpdate }) => {
  const [open, setOpen] = useState(false);
  const hasBody = Boolean(update.html_content && update.html_content.trim());

  return (
    <li className="relative pl-10">
      <span className="absolute left-[11px] top-7 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background" />
      <Tilt3D>
        <div className="rounded-2xl bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:p-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-soft">
            <time className="tabular-nums">
              {formatUpdateDate(update.published_date || update.last_edited_time)}
            </time>
            <span className="text-ink-soft/50">·</span>
            <VersionChip version={update.version} releaseType={update.release_type} />
          </div>

          <h3 className="mt-3 font-serif-pro text-2xl font-normal leading-snug md:text-[26px]">
            <Link to={buildHref(update)} className="transition-opacity hover:opacity-70">
              {update.title}
            </Link>
          </h3>

          {update.change_types && update.change_types.length > 0 && (
            <div className="mt-3">
              <ChangeChips types={update.change_types} />
            </div>
          )}

          {(update.changelog || update.description) && (
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {update.changelog || update.description}
            </p>
          )}

          {hasBody && (
            <>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:text-foreground"
                aria-expanded={open}
              >
                {open ? "Hide details" : "Read the full note"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div
                  className="blog-content prose prose-lg mt-5 max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(update.html_content || "") }}
                />
              )}
            </>
          )}
        </div>
      </Tilt3D>
    </li>
  );
};

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
          "id, slug, title, build_name, build_slug, version, release_type, change_types, changelog, description, header_image_url, html_content, published_date, last_edited_time",
        )
        .order("published_date", { ascending: false, nullsFirst: false })
        .order("last_edited_time", { ascending: false, nullsFirst: false });

      if (error) console.error("Error loading builds:", error);
      setUpdates((data as BuildUpdate[]) || []);
      setIsLoading(false);
    };
    load();
  }, []);

  const groups = updates.reduce<{ name: string; slug: string | null; items: BuildUpdate[] }[]>(
    (acc, update) => {
      const name = update.build_name || "Other updates";
      const existing = acc.find((g) => g.name === name);
      if (existing) existing.items.push(update);
      else acc.push({ name, slug: update.build_slug, items: [update] });
      return acc;
    },
    [],
  );

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
                Every product I'm building, and every release as it lands. Newest
                first, with the changelog attached.
              </p>
            </div>
          </section>

          <section className="px-6 py-16 md:py-20">
            <div className="mx-auto max-w-3xl">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : groups.length === 0 ? (
                <p className="text-center text-ink-soft">
                  Nothing shipped here yet. Check back shortly.
                </p>
              ) : (
                <div className="space-y-20">
                  {groups.map((group) => (
                    <div key={group.name}>
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <h2 className="font-serif-pro text-3xl font-normal leading-tight">
                          {group.slug ? (
                            <Link
                              to={`/builds/${group.slug}`}
                              className="transition-opacity hover:opacity-70"
                            >
                              {group.name}
                            </Link>
                          ) : (
                            group.name
                          )}
                        </h2>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                          {group.items.length} release
                          {group.items.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      <ol className="relative mt-8 space-y-8 before:absolute before:bottom-4 before:left-[11px] before:top-4 before:w-px before:bg-border/60">
                        {group.items.map((update) => (
                          <TimelineEntry key={update.id} update={update} />
                        ))}
                      </ol>
                    </div>
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
