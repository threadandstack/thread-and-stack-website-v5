

# Portfolio Pages Powered by Notion — Plan

## What We Found in Notion

The **Brendan Rodgers Portfolio** page contains an inline **Portfolio database** with this schema:

| Property | Type | Purpose |
|---|---|---|
| Name | title | Project name |
| Tags | multi_select | Brand Strategy, Content Strategy, Copywriting & Storytelling, Customer Journey Mapping, CRM, Design, Performance, Clientside, NDA, Not Ready |
| Show in Portfolio | checkbox | Controls public visibility |
| Text | text | Project description/summary |
| Month & Year | text | Display date (e.g. "Oct 2025") |
| Date | date | Sortable date |
| Place | place | Location |

A second identical database exists under "BFB Labs Examples" — this can serve as the Notion systems/builds portfolio.

The Tags naturally split across your two pillars:
- **Narrative Strategy**: Brand Strategy, Content Strategy, Copywriting & Storytelling, Customer Journey Mapping, Design
- **Notion Systems**: CRM, Performance, Clientside (plus new tags you'd add for system builds)

## Proposed Approach

### Use Notion as single source of truth for both portfolios

Rather than hardcoding portfolio items (as with the current Nerve Tumours UK featured project), fetch portfolio entries from the Notion databases via edge functions. You manage everything in Notion — add a new project, tick "Show in Portfolio", and it appears on the site.

### Two portfolio pages, one component pattern

**`/portfolio/creative`** — Narrative Strategy work
- Fetches from the main Portfolio database (`2808863b-87d4-8027...`)
- Filters by `Show in Portfolio = true` and creative-pillar Tags
- Gallery grid of project cards with cover images, tags, and summary text
- Click to expand into a detail view (modal or dedicated sub-page) showing full project content from Notion

**`/portfolio/notion`** — Notion Systems & Builds
- Fetches from the BFB Labs Portfolio database (`2e08863b-87d4-81e2...`) — or the same database filtered differently, depending on how you want to organise it
- Same gallery layout and interaction pattern
- Showcases Notion environments, automations, system builds

### Edge function: `fetch-portfolio`

A new edge function that:
- Accepts `database_id` and optional `tags` filter as parameters
- Queries the Notion API for entries where `Show in Portfolio = true`
- Returns: name, tags, text summary, month & year, cover image (from page cover), and page content blocks for the detail view
- Notion-hosted image URLs expire after ~1 hour, so we'd either cache in Supabase (like the blog) or accept fresh fetches

### Frontend component: `PortfolioGallery`

A shared component used by both `/portfolio/creative` and `/portfolio/notion`:
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Each card shows cover image, project name, tags as pills, and summary text
- Tag-based filtering UI at the top (click a tag to filter)
- Detail modal on click, rendering Notion block content (reusing the same HTML rendering approach as blog posts and governance pages)
- Soft CTA at the bottom: "Like what you see? Let's talk" linking to the relevant service page

### Integration with the lead gen plan

Both portfolio pages feed into the trackable flow:
- CTAs on portfolio pages link to `/work-with-me` or open the ContactDrawer with `source=portfolio-creative` or `source=portfolio-notion`
- UTM params carry through from the portfolio page to the thank you page
- Portfolio page views themselves become trackable funnel steps in GA4

## Technical Summary

| Step | What | Files |
|---|---|---|
| 1 | New edge function `fetch-portfolio` | `supabase/functions/fetch-portfolio/index.ts` |
| 2 | Shared `PortfolioGallery` component | `src/components/PortfolioGallery.tsx` |
| 3 | Portfolio detail modal (reuse Notion renderer) | `src/components/PortfolioDetailModal.tsx` |
| 4 | Creative portfolio page | `src/pages/CreativePortfolioPage.tsx` |
| 5 | Notion portfolio page | `src/pages/NotionPortfolioPage.tsx` |
| 6 | Register routes in App.tsx | `src/App.tsx` |
| 7 | Add nav links to portfolio pages | `src/components/Navigation.tsx` |

## Open Question

The two Notion databases have identical schemas. You could either:
- **A)** Use both databases separately (one for creative, one for Notion builds) — cleaner separation, easier to manage independently
- **B)** Merge everything into one database and differentiate with a new "Pillar" property — single source, but more complex filtering

Which do you prefer? Or would you like to start with just the creative portfolio and add the Notion builds portfolio later?

