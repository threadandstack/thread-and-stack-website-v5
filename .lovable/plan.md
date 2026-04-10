

# Fix: Full Re-sync with Integrated Media Persistence

## The Problem

Two issues are preventing media from displaying:

1. **Expired URLs in cache**: The Notion S3 signed URLs stored during the initial sync have already expired (they last ~1 hour). The `persist-notion-media` function tries to download from these dead URLs and gets 403 errors.

2. **Memory limits**: Processing all pages at once exceeds the edge function memory cap.

The root cause: the sync function writes expired Notion URLs to the cache, then fires off a separate `persist-notion-media` call — but that second function also hits memory limits and fails, leaving the cache full of dead URLs.

## The Fix

Restructure so media persistence happens **inline during sync**, one page at a time, instead of as a separate batch job. This way each file is downloaded while the Notion signed URL is still fresh (within seconds of fetching it).

### Changes

**1. Update `sync-portfolio-cache` — inline media persistence**

Instead of writing Notion S3 URLs to the cache and hoping a second function replaces them later:
- After rendering each page's HTML, scan it for S3 URLs
- Download each file to the `notion-media` storage bucket immediately
- Replace the URLs in the HTML with permanent storage URLs
- Do the same for cover images
- Then upsert the already-permanent-URL content to the cache

This processes one page at a time, keeping memory low.

**2. Update `sync-blog-cache` — same inline approach**

Same pattern: persist media inline during content rendering.

**3. Add a `full=true` body parameter to both sync functions**

When `full=true` is passed, skip the incremental timestamp filter and re-sync everything. This is what the admin "Sync Now" buttons will use, and what we'll trigger now to do the initial media migration.

**4. Process pages sequentially with cleanup**

To stay within memory limits, process each page serially and avoid holding large buffers. Skip files larger than 50MB (same as current logic).

**5. Keep `persist-notion-media` as a standalone fallback**

Don't remove it — it can still be useful for one-off fixes — but the primary path becomes inline persistence during sync.

### Files Changed

| File | Change |
|---|---|
| `supabase/functions/sync-portfolio-cache/index.ts` | Add inline media persistence + `full` parameter support |
| `supabase/functions/sync-blog-cache/index.ts` | Add inline media persistence + `full` parameter support |

### After deployment

1. Trigger `sync-portfolio-cache` with `{"full": true}` — this will re-fetch all pages from Notion, get fresh signed URLs, download media to storage, and save permanent URLs in the cache
2. Trigger `sync-blog-cache` with `{"full": true}` — same for blog content
3. Verify BFB Labs videos now load with permanent storage URLs

