---
name: ts-notion-content
description: Thread & Stack Notion CMS integration — cache-first architecture, 5-minute sync, media persistence (S3 expiry), block-by-block translation reference, blog theme colours, governance + CV + portfolio sync. Load when working with blog posts, journal content, CV, portfolio, or any Notion-backed surface.
---

# Thread & Stack Notion Content Integration

## Architecture: cache-first, never read-through

Pages **never** call the Notion API at request time. They read from a unified Supabase cache refreshed every 5 minutes by a scheduled sync.

```
Notion ──(5 min cron)──▶ sync-blog-cache / sync-portfolio / sync-cv ──▶ Supabase tables ──▶ Page
```

Edge functions:
- `supabase/functions/sync-blog-cache/`
- `supabase/functions/sync-portfolio/`
- `supabase/functions/sync-cv/`
- `supabase/functions/persist-notion-media/`
- `supabase/functions/fetch-notion-page/` (one-off rendering; still cache-first where possible)

If a request comes in and the cache is empty for a slug, return a graceful empty/200 with `null` payload. **Do not fall back to a live Notion call.** This is non-negotiable — it's both a rate-limit shield and a latency guarantee. See `mem://technical/edge-function-error-handling-patterns` for the full pattern.

## Media persistence (S3 expiry)

Notion's S3-hosted images expire every ~hour. `persist-notion-media` mirrors every referenced asset into Supabase Storage on sync, and the cache stores the **Supabase Storage URL**, not the Notion URL. **Never render Notion's `file.url` directly** in the app — always the rewritten Storage URL. This is the most common bug source if forgotten.

## Block translation reference

Block-by-block translation rules for the blog / journal renderer. Mirrors `/brand-book` §13. CSS lives in `src/index.css` under `.blog-content`.

| Notion block | Rendered as | CSS / notes |
|---|---|---|
| Paragraph | `<p>` 1.125rem, line-height 1.8 | `.blog-content p` · 1.5rem bottom margin |
| Heading 1 | Crimson Pro 3rem (full pages) / 2.4rem (cards) | weight 300, letter-spacing -0.02em |
| Heading 2 | Crimson Pro 2rem | weight 400 · top margin 4rem |
| Heading 3 | Crimson Pro 1.5rem | weight 400 · top margin 3rem |
| Callout | Soft card with emoji preserved | Variants per Notion colour (gray/brown/orange/yellow/green/blue/purple/pink/red), background at 15% opacity |
| Quote | `<blockquote>` with 4px accent left border | rounded right corners only · muted background · padding 1.5rem |
| Toggle | Accordion matching FAQ pattern (§08 brand book) | Same chevron + easing as `<FAQ />` |
| Bookmark / link preview | Card with title + domain + description | Never raw iframe |
| Image (with caption) | `<figure class="image-content">` | max-w 65% · centered · caption below |
| Image (no caption, decorative) | `<figure class="image-decorative">` | max-w 180px · left-aligned |
| Divider | `<hr>` 1px border | Used sparingly — prefer whitespace |
| Bulleted list | Custom 7px indigo ring bullet (primary), 4px filled dot then 6px dash for nested levels | Drawn via `::before` in `index.css` |
| Iframe / video embed | Iframe **only** for CSP-allowlisted domains | Everything else → link preview card |

Image alignment from Notion is respected. Default to full-width rounded card.

## Blog theme colour system

Each post's category tag in Notion maps to a palette used for callouts, accent colour, and the related-posts carousel. Mapping lives in the sync function. Adding a new category requires extending the colour map — do not invent palettes per-post. See `mem://integration/blog-theme-color-system`.

## Journal branding

The blog is presented as the **Thread & Stack Journal**. Floating Tilt3D cards, masonry grid, light + dark mode. Journal CTA blocks and related-content carousels are themed per category. See `mem://features/blog-cta-and-related-content`.

## Governance pages

`/privacy-policy` and `/data-guarantee` render from Notion via the same sync system. Edits go in Notion, not code. See `mem://integration/governance-pages-notion-sync`.

## CV

`/cv` is standalone, generated from a dedicated Notion page via the `notion-cv` bot connection. Requires its own integration — see `mem://technical/notion-cv-integration`.

## Portfolio

- Password-gated; shareable direct links use URL params (`mem://ux/portfolio-shareable-direct-links`).
- Notion property mapping for grid tags: `mem://technical/notion-portfolio-property-mapping`.
- Sync is batched to avoid edge function memory limits: `mem://technical/portfolio-sync-batching`.

## CSP / iframe allowlist

iframes are allowed only for domains in the CSP allowlist (YouTube, Vimeo, Loom, a small set of audio embeds). See `mem://security/video-embed-csp-policy`. Anything else → link preview card.

## References

- `/brand-book` §13 — human-side block translation reference
- `mem://integration/unified-content-cache-system`
- `mem://integration/notion-media-persistence-proxy`
- `mem://integration/notion-content-rendering-fidelity`
- `supabase/functions/sync-blog-cache/`
- `supabase/functions/persist-notion-media/`
