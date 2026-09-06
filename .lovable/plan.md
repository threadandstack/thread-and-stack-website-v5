# The Journal, evolved: writing, builds and events in one place

Today the site has three separate strands of "what Brendan is doing": the Journal (writing), Builds (the build-in-public timeline), and nothing at all for events. This plan turns the Journal into a single hub that holds all three, without flattening what makes each one different.

## The idea

`/journal` becomes one mixed, newest-first feed. Every item is dated and carries a type: **Writing**, **Build**, or **Event**. A filter row at the top lets people show everything or just one type, and the existing topic filters stay for writing.

Each type keeps its own card design, so the feed reads as a varied, editorial page rather than a uniform list:

- **Writing** — image-led card, topic pill, reading time, intro line. Same as today.
- **Build** — compact changelog card: build icon, version chip, change-type chips, product name. Keeps the lineage cue (a small "3rd release of 6" style marker) so it still feels like part of a timeline, not a loose post.
- **Event** — event card: date block, location, "Hosted" or "Attended" badge, format (talk, workshop, meetup, panel), and a small photo. Past and upcoming handled differently, with upcoming events pinned in a slim strip above the feed.

Nothing is lost. `/builds` stays exactly as it is, with its grouped and combined timelines — the Journal feed just surfaces the same entries in a mixed context and links through. Build detail pages and blog post pages are untouched.

Events get a detail page at `/journal/events/:slug` with the write-up, photos, links to slides or recordings, and any related post or build.

## Navigation

Untouched for now, as agreed. Journal and Builds both stay in the bar. If the hub works, removing Builds from the nav later is a one-line change.

## Events data

Confirmed: the **Published Events** database exists in Notion (under Events / GROWTH // WIKI) and has everything needed — Name, Slug, Status (Draft/Live), Role (Hosted, Attended, Spoke, Panel), Format (Talk, Workshop, Meetup, Conference, Panel, Webinar), Date with end date, Location, Organiser, Summary, Event URL, Slides URL, Recording URL, Cover, Featured, plus a Planning Record relation to your internal planning database.

The site will only ever read entries where Status is Live. The Planning Record relation stays internal and is never published. The page body becomes the event write-up.

One thing to check on your side: the Lovable Notion connection needs access to this database, otherwise the sync returns nothing. If the first sync comes back empty, that's the cause.


## Build order

1. **Events pipeline** — new `events_cache` table, a `sync-events-cache` function mirroring the builds sync (HTML rendering, image persistence, incremental + full sync), and a `fetch-events` reader.
2. **Event cards and detail page** — `/journal/events/:slug`, plus an events-only view so events are browsable on their own.
3. **The unified feed** — a shared item model that merges posts, build releases and events into one dated stream, with type filters and per-type card components.
4. **Upcoming strip and cross-links** — pinned upcoming events, and "related" links between an event, a post and a build where they connect.

## Alternative, if the hub feels like too much

A lighter version: keep `/journal` as writing only, add `/journal/events` as a standalone events section reusing the Journal's look, and leave `/builds` alone. Same event cards, same Notion pipeline, no merged feed. Less interesting, but it's a smaller step and the merged feed can be layered on later without rework — the sync work in step 1 is identical either way.

## Technical notes

- New table `public.events_cache` (notion_id, slug, title, summary, html_content, cover_image_url, role, format, start_date, end_date, location, venue, organiser, topics[], event_url, slides_url, recording_url, featured, last_edited_time, synced_at) with anon read and service-role write, matching `build_updates_cache`.
- Sync reuses the `persist-notion-media` proxy so Notion S3 image URLs don't expire.
- Feed merging happens client-side over the three existing fetch functions, normalised into a single `JournalItem` union type in `src/lib/journalFeed.ts`. No new aggregate backend endpoint needed at this volume.
- `sitemap.xml`, `llms.txt` and the prerender script get the new event routes.
- Existing `/builds`, `/builds/:slug`, `/blog` and `/blog/:slug` routes and components are not modified beyond extracting the build card into a reusable component.

## About / T&S Way

Deliberately out of scope here, as agreed. Worth its own pass once the Journal hub settles.
