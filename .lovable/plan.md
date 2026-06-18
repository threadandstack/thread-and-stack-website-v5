## What the LLM tests actually told us

Reading the three crawls side by side:

- **Claude** successfully extracted the *current* positioning ("Stories that land. Systems that stick.", two-pillar services, full Notion tier pricing, payment terms). The prerender we shipped is working on the routes it covers.
- **ChatGPT** said "almost every discovered page is exposing the same description". When I curl the live site now, that is true for `/notion-systems` and the other legacy URLs — they fall back to `dist/index.html` (the homepage prerender) because they're React `<Navigate>` redirects, not pages, so the prerender script never wrote a `/notion-systems/index.html`. Any LLM that hits a legacy URL gets the homepage's title and description.
- **Perplexity** keeps quoting *very* old copy ("Threadwork / True Voice / Brand Therapy / Conscious AI"). That's stale third-party caches (LinkedIn, ProspEo, old Google snapshot) plus its tools timing out on subpages. Nothing we do on-site removes it instantly, but fresh, distinct, dated HTML on every URL is what eventually replaces it.
- **Google's indexed snippet** is still the *pre-prerender* description. It only changes after Googlebot recrawls.

So the gap isn't the prerender approach — it's coverage and freshness.

## Plan

### 1. Prerender every legacy / redirect URL

The redirect routes in `src/App.tsx` (`/notion-systems`, `/fractional-deep-engagement`, `/sessions-and-sprints`, `/narratives-strategy`, `/clarity-sessions`, `/mentorship-sprint`, `/fractional-strategy`, `/deep-engagement`, plus the casing variants `/Charity-Meetup-April26` and `/Unleash-Your-Team`) all currently serve the homepage shell to crawlers. For each:

- Add a "redirect page" entry to `scripts/lib/page-content.ts` with a route-correct title, description, short body explaining where the content moved, and a canonical pointing at the *new* canonical URL (e.g. `/services`).
- Extend `scripts/generate-prerendered.ts` to support a `redirectTo` field that:
  - sets `<link rel="canonical">` to the destination,
  - emits `<meta name="robots" content="noindex,follow">` so Google consolidates signals without indexing the duplicate,
  - still injects readable body text + JSON-LD so an LLM that lands there gets real information instead of homepage boilerplate.
- Result: every URL an LLM might discover (old links, sitemap, social cards) returns route-specific HTML.

### 2. Add the routes the SEO crawl is missing

`/notion-hackathon-london/v2`, `/notion-hackathon-london`, `/notion-devotion-brighton`, `/charity-meetup-april26`, `/unleash-your-team` are already in `page-content.ts`. Audit against `src/App.tsx` and add anything public that's missing (e.g. `/work-with-me`, `/intro-call`, `/momentum-map`, `/collective`, `/portfolio/*` already present — double-check). Anything `noindex` (admin, proposals, onboarding, thank-you, drafts, `/v/*`, `/depreciate/*`) stays out and is already covered by `robots.txt`.

### 3. Strengthen freshness signals so Google/Perplexity recrawl sooner

- `scripts/generate-sitemap.ts`: set `lastmod` to today's ISO date on every entry at generation time, and keep `changefreq` realistic (`weekly` for marketing pages, `daily` for `/blog`).
- `scripts/generate-prerendered.ts`: add `<meta name="last-modified" content="…">` and an Article `dateModified` (already present for posts) plus `WebPage` `dateModified` for static pages.
- Add a one-line note in the plan output telling you to hit "Request indexing" in Google Search Console for `/`, `/services`, `/about`, `/notion-systems` after deploy — fastest way to force Google to drop the stale snippet.

### 4. Tighten the JSON-LD

Currently each page emits a single `WebPage` / `Service` / `Event` block. Add:

- `Organization` block on `/` and `/about` (name, url, logo, sameAs LinkedIn/Notion ambassador, founder Person).
- `Person` block on `/about` (Brendan Rodgers, jobTitle, sameAs).
- `BreadcrumbList` on every non-home page (Home → section → page).
- `FAQPage` on `/services` and `/work-with-me` if their body content already lists FAQs (check first).

LLMs lean heavily on these blocks to disambiguate "what does this business do".

### 5. Verify

After build:

```
curl -s https://threadandstack.com/notion-systems        | grep -E '<title>|description|canonical'
curl -s https://threadandstack.com/sessions-and-sprints  | grep -E '<title>|description|canonical'
curl -s https://threadandstack.com/services              | grep -E 'application/ld\+json' -c
```

Expected: unique title + description + correct canonical for each legacy URL; ≥2 JSON-LD blocks on `/services`.

### Out of scope (call out, don't do)

- True SSR / a different framework — explicit "no" from earlier in this thread.
- Server-side bot-detection redirects — adds infra, brittle, and the prerender already covers it.
- Forcing third-party caches (LinkedIn, ProspEo) to refresh — those are external; only time fixes them.

## Files touched

- `scripts/lib/page-content.ts` — add redirect-page entries + any missing public routes.
- `scripts/generate-prerendered.ts` — `redirectTo` support, extra JSON-LD (Organization/Person/Breadcrumb), `dateModified`.
- `scripts/generate-sitemap.ts` — fresh `lastmod` per build, include redirect URLs as `noindex` excluded.
- No runtime React changes; SPA behaviour unchanged for real users.
