// Postbuild step. Reads dist/index.html (the built shell with hashed asset
// references) and writes a route-specific dist/<route>/index.html for every
// public page. Each file contains:
//   - route-correct <title>, <meta description>, canonical, og:*, JSON-LD
//   - authored body content inside <div id="root">…</div> so crawlers and
//     LLMs that do not execute JavaScript still see real text
// React replaces the contents of #root on mount, so real users get the
// normal SPA after hydration with no flash of stale content.
//
// Hosts that serve static files (Lovable hosting, Netlify, Vercel, etc.)
// will serve /services/index.html at /services automatically. SPA fallback
// still handles routes that do not have a prerendered file.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { pages, SITE, type PageContent } from "./lib/page-content";

const DIST = resolve("dist");
const SHELL_PATH = resolve(DIST, "index.html");

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://uohhfesyumigbpqjpacl.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvaGhmZXN5dW1pZ2JwcWpwYWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTQwNjIsImV4cCI6MjA3OTkzMDA2Mn0.YPZtQPf1w2Y2kFGg_05iqXpOqkcA1NR-Re34hZGqA7c";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|section|article|li|h[1-6]|blockquote|br|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, " ")
    .replace(/&ndash;/g, "-")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function renderBody(page: PageContent): string {
  const parts: string[] = [];
  parts.push(`<h1>${escapeHtml(page.h1)}</h1>`);
  for (const block of page.body) {
    if (typeof block === "string") {
      parts.push(`<p>${escapeHtml(block)}</p>`);
    } else {
      parts.push(`<h2>${escapeHtml(block.heading)}</h2>`);
      for (const p of block.paragraphs || []) {
        parts.push(`<p>${escapeHtml(p)}</p>`);
      }
      if (block.bullets && block.bullets.length) {
        parts.push(
          `<ul>${block.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        );
      }
    }
  }
  return parts.join("\n");
}

function buildJsonLd(page: PageContent): string {
  const url = `${SITE}${page.path}`;
  const type = page.schemaType || "WebPage";

  if (type === "Event") {
    const evt: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: page.h1,
      description: page.description,
      url,
      organizer: {
        "@type": "Organization",
        name: "Thread & Stack",
        url: SITE,
      },
    };
    if (page.eventStartDate) evt.startDate = page.eventStartDate;
    if (page.eventLocation) {
      evt.location = { "@type": "Place", name: page.eventLocation };
    }
    return JSON.stringify(evt);
  }

  if (type === "Service") {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.h1,
      description: page.description,
      url,
      provider: {
        "@type": "Organization",
        name: "Thread & Stack",
        url: SITE,
      },
    });
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": type,
    name: page.title,
    description: page.description,
    url,
  });
}

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Thread & Stack",
  url: SITE,
  logo: `${SITE}/favicon.svg`,
  founder: {
    "@type": "Person",
    name: "Brendan Rodgers",
    jobTitle: "Designer, strategist, and certified Notion partner",
    url: `${SITE}/about`,
  },
  sameAs: [
    "https://www.linkedin.com/in/brendan-rodgers",
    "https://www.notion.com/@brendanrodgers",
  ],
};

const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Brendan Rodgers",
  jobTitle: "Designer, strategist, and certified Notion partner",
  url: `${SITE}/about`,
  worksFor: { "@type": "Organization", name: "Thread & Stack", url: SITE },
  sameAs: [
    "https://www.linkedin.com/in/brendan-rodgers",
    "https://www.notion.com/@brendanrodgers",
  ],
};

function buildBreadcrumb(page: PageContent): string | null {
  if (page.path === "/") return null;
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
  ];
  if (page.breadcrumb) {
    items.push({
      "@type": "ListItem",
      position: items.length + 1,
      name: page.breadcrumb.name,
      item: `${SITE}${page.breadcrumb.path}`,
    });
  }
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: page.h1,
    item: `${SITE}${page.path}`,
  });
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  });
}

interface BlogRow {
  slug: string;
  title: string | null;
  description: string | null;
  html_content: string | null;
  reading_time: number | null;
  published_date: string | null;
  synced_at: string | null;
}

async function fetchBlogPosts(): Promise<BlogRow[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_content_cache?select=slug,title,description,html_content,reading_time,synced_at`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) {
      console.warn(`[prerender] blog fetch failed: ${res.status}`);
      return [];
    }
    const rows = (await res.json()) as BlogRow[];
    return rows.filter((r) => r.slug);
  } catch (e) {
    console.warn(`[prerender] blog fetch error: ${(e as Error).message}`);
    return [];
  }
}

const BUILD_ISO = new Date().toISOString();

function applyShell(
  shell: string,
  opts: {
    path: string;
    canonicalPath?: string; // defaults to path; redirect aliases pass redirectTo here
    title: string;
    description: string;
    bodyHtml: string;
    jsonLdBlocks: string[];
    ogType?: string;
    noindex?: boolean;
    dateModified?: string;
  }
): string {
  const canonicalUrl = `${SITE}${opts.canonicalPath || opts.path}`;
  const title = escapeHtml(opts.title);
  const desc = escapeHtml(opts.description);
  const ogType = opts.ogType || "website";
  const dateModified = opts.dateModified || BUILD_ISO;

  let out = shell;

  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  out = out.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${desc}">`
  );
  out = out.replace(
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${title}">`
  );
  out = out.replace(
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${desc}">`
  );
  out = out.replace(
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${title}">`
  );
  out = out.replace(
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${desc}">`
  );
  out = out.replace(
    /<meta\s+property=["']og:type["'][^>]*>/i,
    `<meta property="og:type" content="${ogType}" />`
  );

  const headExtras = [
    `<link rel="canonical" href="${escapeAttr(canonicalUrl)}">`,
    `<meta property="og:url" content="${escapeAttr(canonicalUrl)}">`,
    `<meta name="last-modified" content="${escapeAttr(dateModified)}">`,
    opts.noindex
      ? `<meta name="robots" content="noindex,follow">`
      : null,
    ...opts.jsonLdBlocks.map(
      (j) => `<script type="application/ld+json">${j}</script>`
    ),
  ]
    .filter(Boolean)
    .join("\n    ");

  out = out.replace(/<\/head>/i, `    ${headExtras}\n  </head>`);

  out = out.replace(
    /<div id="root">\s*<\/div>/i,
    `<div id="root"><div data-prerender="static">\n${opts.bodyHtml}\n</div></div>`
  );

  return out;
}

function writeRoute(distRelPath: string, html: string) {
  const filePath = resolve(DIST, distRelPath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html);
}

function distPathForRoute(route: string): string {
  // "/" -> "index.html" (already exists; we overwrite with prerendered home)
  // "/services" -> "services/index.html"
  // "/blog/foo" -> "blog/foo/index.html"
  if (route === "/") return "index.html";
  const clean = route.replace(/^\/+/, "").replace(/\/+$/, "");
  return `${clean}/index.html`;
}

async function main() {
  if (!existsSync(SHELL_PATH)) {
    console.warn(`[prerender] dist/index.html not found at ${SHELL_PATH}; skipping.`);
    return;
  }
  const shell = readFileSync(SHELL_PATH, "utf8");

  let written = 0;

  // Static authored pages
  for (const page of pages) {
    const bodyHtml = renderBody(page);
    const jsonLdBlocks: string[] = [];
    if (!page.redirectTo) {
      jsonLdBlocks.push(buildJsonLd(page));
      // Sitewide Organization on home + about; Person on about.
      if (page.path === "/" || page.path === "/about") {
        jsonLdBlocks.push(JSON.stringify(ORGANIZATION_LD));
      }
      if (page.path === "/about") {
        jsonLdBlocks.push(JSON.stringify(PERSON_LD));
      }
      const crumb = buildBreadcrumb(page);
      if (crumb) jsonLdBlocks.push(crumb);
    }
    const html = applyShell(shell, {
      path: page.path,
      canonicalPath: page.redirectTo || page.path,
      title: page.title,
      description: page.description,
      bodyHtml,
      jsonLdBlocks,
      ogType: page.schemaType === "Event" ? "event" : "website",
      noindex: Boolean(page.redirectTo),
    });
    writeRoute(distPathForRoute(page.path), html);
    written++;
  }


  // Blog posts
  const posts = await fetchBlogPosts();
  for (const post of posts) {
    const title = post.title || post.slug;
    const description =
      post.description ||
      stripHtml(post.html_content || "").slice(0, 160).trim() ||
      `Essay from the Thread & Stack Journal.`;
    const contentText = stripHtml(post.html_content || "");
    // Render paragraphs split on blank lines
    const paragraphs = contentText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    const bodyHtml = [
      `<h1>${escapeHtml(title)}</h1>`,
      post.description ? `<p><em>${escapeHtml(post.description)}</em></p>` : "",
      ...paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`),
    ]
      .filter(Boolean)
      .join("\n");

    const url = `${SITE}/blog/${post.slug}`;
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      url,
      author: { "@type": "Person", name: "Brendan Rodgers" },
      publisher: {
        "@type": "Organization",
        name: "Thread & Stack",
        url: SITE,
      },
      ...(post.synced_at ? { dateModified: post.synced_at } : {}),
    });
    const html = applyShell(shell, {
      path: `/blog/${post.slug}`,
      title: `${title} — Thread & Stack Journal`,
      description,
      bodyHtml,
      jsonLdBlocks: [jsonLd],
      ogType: "article",
      dateModified: post.synced_at || undefined,
    });
    writeRoute(distPathForRoute(`/blog/${post.slug}`), html);
    written++;
  }

  console.log(
    `[prerender] wrote ${written} route files (${pages.length} static + ${posts.length} blog)`
  );
}

main().catch((e) => {
  console.error(`[prerender] failed: ${(e as Error).message}`);
  // Do not fail the build — SPA still works without prerender.
  process.exitCode = 0;
});
