

# Unified Content Cache: Blog + Portfolio Pre-Rendering with Incremental Polling

## Problem

Both blog and portfolio content currently hit Notion's API in real-time on every page load, causing 1-3 second delays. The blog listing is cached, but individual blog posts are not. Portfolio listings query Notion live every time.

## Solution

A cache-first architecture for all Notion content, with 5-minute incremental polling that only syncs pages that have changed. Your workflow: edit in Notion, and within 5 minutes the site reflects changes automatically. Manual sync buttons remain in the admin dashboard as an optional escape hatch.

```text
Every 5 minutes (cron):
  1. Check Notion: "pages where Last edited time > last_sync_timestamp"
  2. If nothing changed → done
  3. If changed → re-render only those items, upsert into cache
  4. Update last_sync_timestamp

Frontend reads:
  Blog listing    → blog_posts_cache (already exists)
  Blog post page  → blog_content_cache (new)
  Portfolio listing → portfolio_listing_cache (new)
  Portfolio detail  → portfolio_content_cache (already exists)
```

## Implementation Steps

### Step 1: Create new database tables

**`blog_content_cache`** — stores pre-rendered HTML for each blog post:
- `notion_id` (text, unique)
- `slug` (text)
- `title` (text)
- `html_content` (text) — full rendered HTML
- `header_image_url` (text, nullable)
- `description` (text, nullable)
- `reading_time` (text, nullable)
- `theme` (text, nullable)
- `synced_at` (timestamptz)

**`portfolio_listing_cache`** — stores listing metadata for gallery pages:
- `database_id` (text) — which portfolio database this belongs to
- `notion_page_id` (text, unique)
- `name` (text)
- `tags` (text[])
- `text` (text, nullable)
- `month_year` (text, nullable)
- `date` (date, nullable)
- `cover_image` (text, nullable)
- `has_nda` (boolean)
- `synced_at` (timestamptz)

**`sync_metadata`** — tracks last sync timestamp per content type:
- `sync_type` (text, primary key) — e.g. 'blog', 'portfolio-creative', 'portfolio-notion'
- `last_synced_at` (timestamptz)

RLS: public SELECT on cache tables, service_role for writes.

### Step 2: Create `sync-portfolio-cache` edge function

New function that, for both portfolio databases:
1. Reads `last_synced_at` from `sync_metadata`
2. Queries Notion for pages where `Last edited time` > that timestamp (or all pages on first run)
3. For each changed page: fetches all blocks, renders to HTML (reusing the existing block-to-HTML logic from `fetch-portfolio-page`)
4. Upserts listing metadata into `portfolio_listing_cache`
5. Upserts rendered HTML into `portfolio_content_cache`
6. Updates `sync_metadata` with current timestamp

### Step 3: Update `sync-blog-cache` to also pre-render full post HTML

Currently this function only syncs listing metadata. Extend it to:
1. Read `last_synced_at` from `sync_metadata` for incremental mode
2. For changed posts: fetch blocks and render to HTML (reusing logic from `fetch-blog-post`)
3. Upsert into `blog_content_cache`
4. Update `sync_metadata`

### Step 4: Rewrite `fetch-portfolio` to read from database

Replace the Notion API call with a simple SELECT from `portfolio_listing_cache` filtered by `database_id`. Apply tag filtering and "Not Ready" exclusion in the query. This becomes a ~10ms database read.

### Step 5: Simplify `fetch-portfolio-page` to cache-only

Remove the 1-hour TTL check. Read directly from `portfolio_content_cache`. If cache miss (rare), fall back to Notion and cache the result.

### Step 6: Rewrite `fetch-blog-post` to cache-first

Check `blog_content_cache` by slug first. If found, return instantly. If cache miss, fall back to the existing Notion rendering logic and cache the result.

### Step 7: Set up 5-minute cron jobs

Two cron jobs using pg_cron + pg_net:
- `sync-blog-cache` every 5 minutes
- `sync-portfolio-cache` every 5 minutes

Replace the existing hourly blog sync cron with the 5-minute interval.

### Step 8: Add "Sync Portfolio" button to Admin Dashboard

Add a second sync button alongside the existing blog sync button, calling `sync-portfolio-cache`. Both buttons remain as manual overrides.

## Files Changed

| File | Change |
|---|---|
| Migration | Create `blog_content_cache`, `portfolio_listing_cache`, `sync_metadata` tables with RLS |
| `supabase/functions/sync-portfolio-cache/index.ts` | **New** — syncs both portfolio databases incrementally, renders HTML |
| `supabase/functions/sync-blog-cache/index.ts` | **Extend** — add full HTML pre-rendering + incremental mode |
| `supabase/functions/fetch-portfolio/index.ts` | **Rewrite** — SELECT from `portfolio_listing_cache` |
| `supabase/functions/fetch-portfolio-page/index.ts` | **Simplify** — cache-only read |
| `supabase/functions/fetch-blog-post/index.ts` | **Rewrite** — cache-first with Notion fallback |
| `supabase/config.toml` | Add `sync-portfolio-cache` function config |
| `src/pages/AdminDashboard.tsx` | Add "Sync Portfolio" button |
| Cron SQL (via insert tool) | Update blog cron to 5min, add portfolio cron at 5min |

## Expected Result

- Blog listing: instant (already cached, no change)
- Blog post pages: ~100ms (from `blog_content_cache` instead of 3 sequential Notion API calls)
- Portfolio listing: ~100ms (from `portfolio_listing_cache` instead of live Notion query)
- Portfolio detail: ~100ms (from pre-rendered cache instead of on-demand rendering)
- Content freshness: max 5-minute delay after Notion edit
- Manual sync buttons available for immediate updates

