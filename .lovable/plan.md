## Pivot summary

Reframe Brain → **Inspiration Records**. Any source (voice, link, image, text, video) becomes one record. Records live in an in-app masonry library. Notion sync becomes a per-record action. Capacitor wraps the finished web app for iOS/Android.

## Phasing

### Phase A — Data + capture model (foundation)
Rework `notes` table to support multiple source types and media:
- Rename `source` enum to include `voice | link | image | text | video`
- Add `source_url` (link), `media_path` (storage path for image/video/audio), `cover_image_path` (masonry thumbnail), `extracted_text`, `width`/`height` (for masonry sizing)
- Add Storage bucket `inspiration-media` (private, per-user folders) with RLS

Rename UI label "note" → "Inspiration Record" throughout.

### Phase B — Multi-source capture
Mobile-first capture screen with a bottom action bar (5 large icon buttons):
- **Voice** — existing recorder
- **Link** — paste URL → server fn fetches page, extracts title/meta/og:image/body, AI summarizes
- **Image** — upload → Gemini vision describes + OCRs → AI formats record
- **Text** — paste → AI structures
- **Video** — upload → extract audio (client-side via Web Audio / MediaRecorder) → transcribe → sample 3 frames via canvas → Gemini vision over frames → merge into record

Each runs through a unified `formatInspiration` server fn that returns `{ title, summary, body, tags[] }`.

### Phase C — Masonry library
Replace list view with Pinterest-style 2-column (mobile) / 3–4 column (tablet+) masonry:
- Card shows cover image (if any) + title + 2-line summary + source-type icon + tag chips
- Variable height based on content
- Tap → record detail/edit screen
- Top: search + source-type filter chips (optional)
- Smooth scroll, lazy-load images

### Phase D — Notion sync becomes optional
- Remove auto-sync on draft save
- Add "Send to Notion" button on record detail (with status: synced ✓ / not synced)
- Settings page keeps Notion DB config

### Phase E — Capacitor wrap
- Install `@capacitor/core`, `@capacitor/ios`, `@capacitor/android`, plugins: `camera`, `filesystem`, `share`, `app`
- Add `capacitor.config.ts`
- Use native camera/file picker where available (fallback to web input)
- Document build steps (requires user to run `npx cap add ios/android` and open in Xcode/Android Studio locally — can't build natively in Lovable)

## Technical details

**Storage**: bucket `inspiration-media`, path `{user_id}/{record_id}/{filename}`. Signed URLs for display.

**Link extraction**: server fn `fetchLinkPreview` — fetch URL, parse with regex/cheerio-lite for `<title>`, `<meta og:*>`, first paragraphs. Pass to Gemini for summary.

**Video processing** (heavy): client extracts audio blob + 3 canvas frame snapshots → uploads → server fn transcribes audio (ElevenLabs) + describes frames (Gemini vision) → composes record. Cap video length at 2 min for v1.

**Masonry**: use CSS columns (`columns-2 md:columns-3 lg:columns-4`) with `break-inside-avoid` — simple, no JS library needed.

**Capacitor**: web build stays primary; native wrap is a packaging step. App remains a PWA-capable web app.

## Out of scope (v1)
- Native push notifications
- Background uploads
- Offline mode
- Video > 2 min
- Direct camera capture inside web app (use file picker; native camera comes with Capacitor wrap)

## Order of execution
1. Phase A (migration + storage) — needs approval
2. Phase B + C together (capture + masonry, since they share the new schema)
3. Phase D (Notion optional)
4. Phase E (Capacitor) — last, after web flow is solid