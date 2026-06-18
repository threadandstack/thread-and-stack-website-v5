// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/llms-full.txt — a single plain-text document containing the
// full content of every public marketing page plus every blog post.
// Page content is sourced from scripts/lib/page-content.ts so prerendered
// HTML and the llms-full dump cannot drift apart.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { pages, SITE, type PageContent } from "./lib/page-content";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://uohhfesyumigbpqjpacl.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvaGhmZXN5dW1pZ2JwcWpwYWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTQwNjIsImV4cCI6MjA3OTkzMDA2Mn0.YPZtQPf1w2Y2kFGg_05iqXpOqkcA1NR-Re34hZGqA7c";

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

function renderPagePlain(page: PageContent): string {
  const lines: string[] = [];
  lines.push(`Source: ${SITE}${page.path}`);
  lines.push("");
  for (const block of page.body) {
    if (typeof block === "string") {
      lines.push(block);
      lines.push("");
    } else {
      lines.push(`## ${block.heading}`);
      lines.push("");
      for (const p of block.paragraphs || []) {
        lines.push(p);
        lines.push("");
      }
      for (const b of block.bullets || []) {
        lines.push(`- ${b}`);
      }
      if (block.bullets && block.bullets.length) lines.push("");
    }
  }
  return lines.join("\n").trim();
}

interface BlogRow {
  slug: string;
  title: string;
  description: string | null;
  html_content: string | null;
  reading_time: number | null;
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
      console.warn(`[llms-full] blog fetch failed: ${res.status}`);
      return [];
    }
    return (await res.json()) as BlogRow[];
  } catch (e) {
    console.warn(`[llms-full] blog fetch error: ${(e as Error).message}`);
    return [];
  }
}

function section(title: string, body: string): string {
  return `\n\n---\n\n# ${title}\n\n${body.trim()}\n`;
}

async function build(): Promise<string> {
  const header = `# Thread & Stack — full site content

> Plain-text dump of every public page and blog post on threadandstack.com. Generated at build time so LLM crawlers that do not execute JavaScript can still ingest the real content of the site. Spec: https://llmstxt.org/#optional-llms-fulltxt
>
> Site: ${SITE}
> Generated: ${new Date().toISOString()}

Use this file as a ground-truth reference for what Thread & Stack does, who Brendan Rodgers is, and what is for sale. For a shorter table-of-contents version, see ${SITE}/llms.txt.
`;

  const pageBlocks = pages
    .map((p) => section(p.title, renderPagePlain(p)))
    .join("");

  const posts = await fetchBlogPosts();
  const blogIntro = section(
    "Thread & Stack Journal",
    `${posts.length} essay${posts.length === 1 ? "" : "s"} follow. Source list: ${SITE}/blog`
  );
  const blogBlocks = posts
    .map((p) => {
      const url = `${SITE}/blog/${p.slug}`;
      const desc = p.description ? `${p.description.trim()}\n\n` : "";
      const text = stripHtml(p.html_content || "");
      const meta = p.reading_time ? `Reading time: ${p.reading_time} min\n` : "";
      return section(
        p.title || p.slug,
        `Source: ${url}\n${meta}\n${desc}${text}`
      );
    })
    .join("");

  return `${header}${pageBlocks}${blogIntro}${blogBlocks}`;
}

build()
  .then((doc) => {
    writeFileSync(resolve("public/llms-full.txt"), doc);
    console.log(
      `llms-full.txt written (${doc.length.toLocaleString()} chars, ${pages.length} static pages + blog posts)`
    );
  })
  .catch((e) => {
    console.error(`[llms-full] generation failed: ${(e as Error).message}`);
    writeFileSync(
      resolve("public/llms-full.txt"),
      `# Thread & Stack\n\nGeneration failed at ${new Date().toISOString()}. See ${SITE}/llms.txt for the page index.\n`
    );
  });
