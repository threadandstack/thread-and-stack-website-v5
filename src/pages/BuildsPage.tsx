import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Loader2, Sun, Moon, ChevronDown } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/home-draft2/CTA";
import { Tilt3D } from "@/components/Tilt3D";
import { ChangeChips, VersionChip } from "@/components/builds/ChangeChips";
import { BuildIcon } from "@/components/builds/BuildIcon";
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

const TimelineEntry = ({
  update,
  showBuild = true,
}: {
  update: BuildUpdate;
  showBuild?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const hasBody = Boolean(update.html_content && update.html_content.trim());

  return (
    <li className="relative">
      <span className="absolute -left-4 top-5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background md:-left-6" />

      <Tilt3D>
        <div className="rounded-2xl bg-card p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:p-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-ink-soft">
            {showBuild && update.build_name && (
              <>
                <Link
                  to={`/builds/${update.build_slug || update.slug}`}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent transition-opacity hover:opacity-70"
                >
                  {update.build_name}
                </Link>
                <span className="text-ink-soft/40">·</span>
              </>
            )}
            <time className="tabular-nums">
              {formatUpdateDate(update.published_date || update.last_edited_time)}
            </time>
            <span className="text-ink-soft/50">·</span>
            <VersionChip version={update.version} releaseType={update.release_type} />
          </div>

          <h3 className="mt-2 font-serif-pro text-lg font-normal leading-snug md:text-xl">
            <Link to={buildHref(update)} className="transition-opacity hover:opacity-70">
              {update.title}
            </Link>
          </h3>

          {update.change_types && update.change_types.length > 0 && (
            <div className="mt-2">
              <ChangeChips types={update.change_types} />
            </div>
          )}

          {(update.changelog || update.description) && (
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {update.changelog || update.description}
            </p>
          )}

          {hasBody && (
            <>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                aria-expanded={open}
              >
                {open ? "Hide details" : "Read the full note"}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div
                  className="blog-content prose prose-lg mt-4 max-w-none"
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

const BuildGroup = ({
  group,
}: {
  group: { name: string; slug: string | null; items: BuildUpdate[] };
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="group flex items-center gap-3 text-left"
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-ink-soft transition-transform ${open ? "" : "-rotate-90"}`}
          />
          <BuildIcon slug={group.slug} name={group.name} />
          <h2 className="font-serif-pro text-2xl font-normal leading-snug transition-opacity group-hover:opacity-70 md:text-[28px]">
            {group.name}
          </h2>
        </button>
        <div className="flex items-center gap-3 pl-11 md:pl-0">
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            {group.items.length} release{group.items.length === 1 ? "" : "s"}
            {group.items[0]?.version ? ` • latest ${group.items[0].version}` : ""}
          </span>
          {group.slug && (
            <Link
              to={`/builds/${group.slug}`}
              className="text-[11px] uppercase tracking-[0.18em] text-accent transition-opacity hover:opacity-70"
            >
              View
            </Link>
          )}
        </div>
      </div>

      {open && (
        <ol className="relative ml-[26px] mt-5 space-y-5 border-l border-border/60 pl-4 md:ml-[30px] md:pl-6">
          {group.items.map((update) => (
            <TimelineEntry key={update.id} update={update} showBuild={false} />
          ))}
        </ol>
      )}
    </div>
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

  const sortKey = (u: BuildUpdate) => u.published_date || u.last_edited_time || "";

  const groups = (() => {
    const map = new Map<string, { name: string; slug: string | null; items: BuildUpdate[] }>();
    for (const u of updates) {
      const name = u.build_name || "Other updates";
      const existing = map.get(name);
      if (existing) existing.items.push(u);
      else map.set(name, { name, slug: u.build_slug || null, items: [u] });
    }
    return Array.from(map.values())
      .map((g) => ({
        ...g,
        items: [...g.items].sort((a, b) => sortKey(b).localeCompare(sortKey(a))),
      }))
      .sort((a, b) => sortKey(b.items[0]).localeCompare(sortKey(a.items[0])));
  })();

  const buildCount = groups.length;

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
              ) : updates.length === 0 ? (
                <p className="text-center text-ink-soft">
                  Nothing shipped here yet. Check back shortly.
                </p>
              ) : (
                <>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                    {updates.length} release{updates.length === 1 ? "" : "s"}
                    {buildCount > 1 && (
                      <>
                        {" "}across {buildCount} build{buildCount === 1 ? "" : "s"}
                      </>
                    )}
                  </p>
                  <div className="mt-8 space-y-8">
                    {groups.map((group) => (
                      <BuildGroup key={group.name} group={group} />
                    ))}
                  </div>
                </>
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
