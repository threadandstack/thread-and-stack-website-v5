

# Re-sync Updated Portfolio Pages

## What happened
You've updated BFB Labs, IMMA, and Nerve Tumours in Notion to use YouTube embeds instead of hosted videos. Now we need to re-sync those pages so the cache picks up the new embed blocks.

## Plan

1. **Trigger a full portfolio sync** with `{"full": true}` to re-fetch all pages from Notion, picking up the YouTube embed changes
2. **Verify** the three updated pages now have `<iframe>` embed markup instead of `<video>` tags in the cached HTML
3. **Quick browser check** on the creative portfolio to confirm videos render as embedded YouTube players

## Technical detail
- The sync function's `blockToHtml` already handles `video` blocks with external URLs by converting them to YouTube/Vimeo iframes, so no code changes are needed
- This is a deploy + invoke operation only

