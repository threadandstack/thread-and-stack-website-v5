// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/sitemap.xml with static routes + dynamic blog post slugs
// pulled from the Supabase blog_posts_cache table.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://threadandstack.com";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://uohhfesyumigbpqjpacl.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvaGhmZXN5dW1pZ2JwcWpwYWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTQwNjIsImV4cCI6MjA3OTkzMDA2Mn0.YPZtQPf1w2Y2kFGg_05iqXpOqkcA1NR-Re34hZGqA7c";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/how-i-work", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/work-with-me", changefreq: "monthly", priority: "0.8" },
  { path: "/workshops", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/collective", changefreq: "monthly", priority: "0.6" },
  { path: "/favourite-fiction", changefreq: "monthly", priority: "0.4" },
  { path: "/momentum-map", changefreq: "monthly", priority: "0.5" },
  { path: "/retainer/launch", changefreq: "monthly", priority: "0.6" },
  { path: "/retainer/startup", changefreq: "monthly", priority: "0.6" },
  { path: "/retainer/scaleup", changefreq: "monthly", priority: "0.6" },
  { path: "/notion-hackathon-london", changefreq: "monthly", priority: "0.5" },
  { path: "/notion-devotion-brighton", changefreq: "monthly", priority: "0.5" },
  { path: "/notion-masterclass", changefreq: "monthly", priority: "0.5" },
  { path: "/charity-meetup-april26", changefreq: "monthly", priority: "0.5" },
  { path: "/unleash-your-team", changefreq: "monthly", priority: "0.5" },
  { path: "/blueprint/become-united", changefreq: "monthly", priority: "0.5" },
  { path: "/scorecard", changefreq: "monthly", priority: "0.5" },
  { path: "/portfolio/creative", changefreq: "monthly", priority: "0.5" },
  { path: "/portfolio/notion", changefreq: "monthly", priority: "0.5" },
  { path: "/intro-call", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/data-guarantee", changefreq: "yearly", priority: "0.3" },
];

interface BlogSitemapEntry extends SitemapEntry {
  imageUrl?: string;
  imageTitle?: string;
}

async function fetchBlogEntries(): Promise<BlogSitemapEntry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts_cache?select=slug,title,published_date,synced_at,header_image_url`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) {
      console.warn(`[sitemap] blog fetch failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const rows = (await res.json()) as Array<{
      slug: string;
      title: string | null;
      published_date: string | null;
      synced_at: string | null;
      header_image_url: string | null;
    }>;
    return rows
      .filter((r) => r.slug)
      .map((r) => {
        const stamp = r.published_date || r.synced_at;
        return {
          path: `/blog/${r.slug}`,
          lastmod: stamp ? new Date(stamp).toISOString().slice(0, 10) : undefined,
          changefreq: "monthly" as const,
          priority: "0.6",
          imageUrl: r.header_image_url || undefined,
          imageTitle: r.title || undefined,
        };
      });
  } catch (err) {
    console.warn(`[sitemap] blog fetch error:`, err);
    return [];
  }
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemap(entries: BlogSitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      e.imageUrl
        ? `    <image:image>\n      <image:loc>${xmlEscape(e.imageUrl)}</image:loc>${e.imageTitle ? `\n      <image:title>${xmlEscape(e.imageTitle)}</image:title>` : ""}\n    </image:image>`
        : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const staticWithLastmod = staticEntries.map((e) => ({
    ...e,
    lastmod: e.lastmod || today,
  }));
  const blogEntries = await fetchBlogEntries();
  const all = [...staticWithLastmod, ...blogEntries];
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(all));
  console.log(
    `[sitemap] wrote ${all.length} entries (${staticEntries.length} static + ${blogEntries.length} blog)`
  );
}

main();
