# Make threadandstack.com findable by humans and LLMs

## Goal
Every public page that's in the main navigation or the sitemap returns full HTML on first request — with a unique title, description, canonical, OG tags, and structured data — so Google, Bing, GPTBot, ClaudeBot, PerplexityBot, and Google-Extended index real content instead of an empty React shell.

## Current state
- Static SPA (Vite + React Router). Crawlers without JS see only `index.html`.
- `react-helmet-async` is installed and the provider is wired, but only 6 of ~30 public pages set per-route head tags.
- `index.html` has a typo: the favicon `<link>` tags sit *after* `</head>` — they belong inside.
- `public/sitemap.xml` is generated; `public/robots.txt` exists; no `llms.txt`; no pre-rendering.

## Scope — three layers

### 1. Per-route head tags (`<Helmet>`) on every public page
For each route in the sitemap (and every nav page), add a `<Helmet>` block with:
- Unique `<title>` (≤60 chars, keyword first)
- Unique `<meta name="description">` (≤160 chars, outcome-led, no em dash per copy rules)
- Self-referencing `<link rel="canonical">` and `<meta property="og:url">`
- `og:title`, `og:description`, `og:type` (article for blog posts, website otherwise)
- JSON-LD per page type: `WebSite` + `Organization` on `/`, `Article` + `BreadcrumbList` on blog posts, `Service` on service/retainer pages, `Event` on event pages (Hackathon, Devotion, Charity Meetup), `Person` on About, `FAQPage` where FAQs exist.

Pages covered (matches sitemap, excludes admin/auth/internal):
`/`, `/about`, `/how-i-work`, `/services`, `/work-with-me`, `/workshops`, `/blog`, `/blog/:slug`, `/collective`, `/favourite-fiction`, `/momentum-map`, `/retainer/launch`, `/retainer/startup`, `/retainer/scaleup`, `/notion-hackathon-london`, `/notion-devotion-brighton`, `/notion-masterclass`, `/charity-meetup-april26`, `/unleash-your-team`, `/blueprint/become-united`, `/scorecard`, `/portfolio/creative`, `/portfolio/notion`, `/intro-call`, `/privacy`, `/data-guarantee`.

To stay DRY, add a small `<PageSeo>` helper component (`src/components/seo/PageSeo.tsx`) that takes `{ title, description, path, ogType?, jsonLd? }` and renders the Helmet block consistently.

### 2. Build-time pre-rendering (the LLM fix)
Add `vite-plugin-prerender` (or `react-snap`) so each public route is crawled with a headless browser at build time and written to `dist/<route>/index.html`. Result: GPTBot/ClaudeBot/PerplexityBot/Google-Extended hit a fully-populated HTML document, not the JS shell. Real users still get the SPA experience after hydration.

Dynamic routes:
- Blog: enumerate slugs from `blog_posts_cache` (same source the sitemap script already uses) and pre-render each one.
- Portfolio: pre-render the index pages only (`/portfolio/creative`, `/portfolio/notion`); individual `:itemId` views are drawer-driven from the index, so crawlers reach the content there.

Exclude: `/admin/*`, `/private/*`, `/proposal/*`, `/depreciate/*`, `/home-draft*`, `/onboarding/*`, `/v/*`, `/unsubscribe`, `/power-hour/thank-you`, `/thread-demo`, `/brand-book`.

### 3. `/llms.txt`
Add `public/llms.txt` listing the same public routes (grouped: Pages, Services, Events, Portfolio, Journal, Optional) with one-line descriptions. Complements pre-rendering for LLM tools that respect the convention.

### 4. Small cleanup
- Move the favicon `<link>` tags inside `<head>` in `index.html`.
- Verify `robots.txt` doesn't block GPTBot/ClaudeBot/PerplexityBot/Google-Extended (we want them allowed — this is a marketing site).

## Technical notes
- Pre-rendering runs at `npm run build`. Notion-sourced content updates flow on the next publish (already true for sitemap — consistent behaviour).
- Pages that read query params or auth state still hydrate normally; pre-render captures the unauthenticated default view.
- `index.html`'s sitewide `og:*` stays as the fallback for social crawlers (LinkedIn/Slack), which don't run JS — per-route Helmet tags override for everything else.
- No business logic changes. No design changes. No backend/DB changes.

## Out of scope
- Migrating to Next.js / Remix (we discussed; not the right trade-off now).
- Editing copy on individual pages beyond title/description metadata. If you want me to also polish on-page H1/intro copy for SEO on specific pages, point me at them in a follow-up.

## Order of execution
1. Fix `index.html` head, create `PageSeo` helper.
2. Add `<Helmet>`/`PageSeo` to every public page missing it.
3. Add `public/llms.txt`.
4. Add pre-rendering plugin + config, verify a sample built route contains real HTML.
