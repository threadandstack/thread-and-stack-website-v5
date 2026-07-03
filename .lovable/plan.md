
## Goal
Make Thread & Stack maximally discoverable and quotable by search crawlers *and* LLM fetchers (Claude, ChatGPT, Perplexity, Google AI, etc.) — without touching the visible UI.

## Current state (verified)
- `robots.txt` already allow-lists every major AI crawler ✓
- `sitemap.xml` is generated pre-build ✓
- `llms.txt` + `llms-full.txt` exist ✓
- `scripts/generate-prerendered.ts` runs post-build and injects real `<h1>/<h2>/<p>` copy into `<div id="root">` for static routes ✓
- `/about` served today = 7.7 KB with prerendered body, 13 content-keyword hits — bots that fetch, see real content
- `og:image` + JSON-LD (Organization + WebSite) present in `index.html` ✓

The site is already in good shape. Remaining gaps are coverage, signal strength, and self-advertisement.

## Gaps to close

### 1. Prerender coverage for dynamic routes
`generate-prerendered.ts` only covers routes listed in `scripts/lib/page-content.ts`. Blog posts and portfolio detail pages are still empty SPA shells on first fetch. Add a build-time fetch of published blog posts (and portfolio entries where public) and emit one prerendered file per slug with title, meta description, canonical, JSON-LD `Article`/`CreativeWork`, and the post's opening paragraphs in the root div.

### 2. Per-route JSON-LD upgrades
Add route-specific structured data during prerender:
- Service pages → `Service` schema (provider = Organization, areaServed, serviceType)
- Blog posts → `Article` (headline, datePublished, author, image)
- About → `Person` (Brendan) linked to Organization via `worksFor`
- FAQ blocks → `FAQPage`
- Breadcrumbs → `BreadcrumbList` on every non-home route

This is what makes AI answer engines cite you by name.

### 3. Advertise `llms.txt` from the HTML head
Add `<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt">` and the same for `llms-full.txt` in `index.html`. Also expose them in `robots.txt` as informational comments. Anthropic and Perplexity look for these.

### 4. Split `llms-full.txt` and add freshness
Current `llms-full.txt` is one monolithic file. Add:
- `Last-Updated:` line at the top
- Section anchors so retrievers can chunk cleanly
- Rebuild trigger when blog cache syncs (not only on prebuild) so new posts appear the same day

### 5. Sitemap enrichments
- Add `<lastmod>` per URL, sourced from blog `updated_at` / portfolio timestamps
- Add image sitemap entries (`<image:image>`) for portfolio + blog covers so Google Images and multimodal LLMs index them
- Split into `sitemap-pages.xml` + `sitemap-posts.xml` + `sitemap-index.xml` once posts pass ~50

### 6. Prerender the `<meta name="description">` per route
Currently the prerender injects body copy but `<title>` and description often stay as the sitewide default for routes not enumerated. Guarantee every prerendered route rewrites both — matches its `<h1>` and first paragraph.

### 7. Canonical + og:url self-reference audit
Confirm every prerendered page's `canonical` and `og:url` point to its own URL (not `/`). Silent misattribution here is the #1 reason per-page copy gets ignored by crawlers.

### 8. Small extras
- `X-Robots-Tag` isn't controllable on Lovable hosting, so nothing to do there
- Add a hidden `<address>` block with contact + org name on the homepage prerender for entity extraction
- Keep `noindex` on `/admin`, `/proposal`, `/onboarding`, `/v/*`, `/home-draft*` — already handled ✓

## What this won't fix
Claude (and most chat LLMs) still won't fetch URLs unless the user turns on web search or pastes the link. This plan makes sure that **when any bot does fetch**, it gets rich, structured, quotable content — which is the ceiling of what any website can do.

## Technical notes
- All work stays in `scripts/` and `public/`; no React/UI code changes
- Blog + portfolio data fetched via existing `sync-blog-cache` / `sync-portfolio-cache` edge functions (already Notion-backed)
- Add a `postsync` step so cache refreshes regenerate `llms-full.txt` and prerendered post files
- No new runtime dependencies; keep using `bunx tsx`

## Suggested build order
1. Per-route description + canonical/og:url audit (quick win, unblocks the rest)
2. JSON-LD upgrades (Article/Service/Person/FAQ/Breadcrumbs)
3. Blog post prerendering + image sitemap
4. `llms.txt` head links + freshness stamp
5. Sitemap split once volume warrants it
