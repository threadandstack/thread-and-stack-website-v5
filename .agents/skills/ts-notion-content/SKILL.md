---
name: ts-notion-content
description: Thread & Stack Notion CMS integration — unified content cache, 5-minute sync polling, media persistence proxy (S3 expiry handling), content fidelity rules, blog theme colours, governance pages sync. Load when working with blog posts, journal content, CV, portfolio, or any Notion-backed surface.
---

# Thread & Stack Notion Content Integration

## Architecture: cache-first, never read-through

Pages **never** call the Notion API directly at request time. They read from a unified Supabase cache that is refreshed every 5 minutes by a scheduled sync.

```
Notion ──(5 min cron)──▶ sync-blog-cache / sync-portfolio / sync-cv ──▶ Supabase tables ──▶ Page
```

Edge functions involved:
- `supabase/functions/sync-blog-cache/`
- `supabase/functions/sync-portfolio/`
- `supabase/functions/sync-cv/`
- `supabase/functions/persist-notion-media/`
- `supabase/functions/fetch-notion-page/` (one-off rendering, still goes via cache where possible)

If a request comes in and the cache is empty for a slug, return a graceful empty/200 with `null` payload — do **not** fall back to a live Notion call. See `mem://technical/edge-function-error-handling-patterns`.

## Media persistence (S3 expiry)

Notion's S3-hosted images expire every ~hour. `persist-notion-media` mirrors every referenced asset into Supabase Storage on sync, and the cache stores the **Supabase Storage URL**, not the Notion URL. Never render Notion's `file.url` directly in the app — always the rewritten Storage URL.

## Content fidelity rules

When rendering Notion blocks:
- Preserve callouts with their emoji and colour as a soft card.
- Bookmarks/embeds render as link preview cards, not raw iframes.
- iframes are allowed only for domains in the CSP allowlist (see `mem://security/video-embed-csp-policy`). Anything else → render as a link.
- Toggle blocks become accordions matching the FAQ pattern.
- Image alignment from Notion is respected; default to full-width card with rounded corners.

## Blog theme colour system

Each post's category tag in Notion maps to a palette used for callouts, accent colour, and the related-posts carousel. Mapping lives in the sync function. Adding a new category requires extending the colour map — do not invent palettes per-post.

See `mem://integration/blog-theme-color-system`.

## Journal / blog branding

The blog is presented as the **Thread & Stack Journal**. Floating Tilt3D cards, masonry grid, light + Night theme. Journal CTA blocks and related-content carousels are themed per category. See `mem://features/blog-cta-and-related-content`.

## Governance pages

`/privacy-policy` and `/data-guarantee` are rendered from Notion via the same sync system. Edits go in Notion, not in code. See `mem://integration/governance-pages-notion-sync`.

## CV

`/cv` is a standalone page generated from a dedicated Notion page via the `notion-cv` bot connection (requires its own integration — see `mem://technical/notion-cv-integration`).

## Portfolio

- Password-gated; shareable direct links use URL params (see `mem://ux/portfolio-shareable-direct-links`).
- Notion property mapping for grid tags: `mem://technical/notion-portfolio-property-mapping`.
- Sync is batched to avoid edge function memory limits: `mem://technical/portfolio-sync-batching`.

## References

- `mem://integration/unified-content-cache-system`
- `mem://integration/notion-media-persistence-proxy`
- `mem://integration/notion-content-rendering-fidelity`
- `supabase/functions/sync-blog-cache/`
- `supabase/functions/persist-notion-media/`
