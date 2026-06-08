# Brain — Voice notes → Notion

Mobile-first PWA. Tap to record, get a clean auto-tagged note, ship it to your Notion "Brain" DB.

## Design pivot — inspired by Thread & Stack `/home-draft2`

Adopting the "Notion Canvas" warm premium dark palette and serif/sans pairing instead of the earlier crimson + off-white direction.

**Palette (dark default, light variant)**
- bg `30 10% 9%` · fg `35 25% 95%` · paper `30 8% 14%` · hairline `30 6% 22%`
- accents: clay `18 75% 60%`, orange `28 88% 62%`, violet `280 70% 65%`, crimson `8 80% 55%`, sky `210 70% 65%`
- signature gradient: `linear-gradient(95deg, orange → violet)` used on the record button + display headline word

**Typography**
- Sans display: tight tracking (`-0.035em`), 5xl→8xl, semibold
- Serif italic accent ("your second brain.") with gradient text-clip — same trick as Hero's "Your centre of truth"
- Body: relaxed leading, `ink-soft` color

**Atmosphere**
- Aurora blurs (orange + crimson + violet radial blobs, 80px blur) behind the recorder
- Faint grid background with radial mask
- `fade-up` staggered entrance animations
- Theme toggle pill (sun/moon, gradient knob) — top-right

## Core flow

1. **Capture (`/`)** — Oversized gradient record button at center, live waveform ring, big timer numerals. Aurora behind. Secondary "type instead" toggle. `captured_at` stamped on tap.
2. **Processing** — Audio → ElevenLabs `scribe_v2` → Lovable AI (`gemini-3-flash-preview`) → `{title, subject, summary, body, tags[]}`.
3. **Review (`/review/$draftId`)** — Editable serif title, subject + tag chips (clay/violet), body. "Send to Notion" (gradient) / "Discard" (ghost). Local draft autosave.
4. **Library (`/library`)** — Reverse-chron list, filter by subject/tag chips, status dots (synced=clay, draft=ink-soft, failed=crimson). `/library/$noteId` for detail + re-sync.
5. **Settings (`/settings`)** — Notion parent page picker, formatting prompt, theme.

## Technical

**Data model**
- `notes` — title, subject, summary, body, tags text[], raw_transcript, source (voice|typed), audio_duration_s, captured_at, status (draft|synced|failed), notion_page_id, notion_page_url
- `user_settings` — notion_database_id, notion_parent_page_id, formatting_prompt
- RLS per user.

**Notion DB schema** (auto-created on first run)
Title · Subject (select) · Tags (multi_select) · Captured (datetime) · Summary (rich_text) · Source (select) · Duration (number). Page body = formatted note + collapsible raw transcript.

**Server functions**
`transcribeAudio` · `formatNote` (infers subject + 2–5 lowercase tags) · `bootstrapNotion` · `syncToNotion`.

**Capture** — `MediaRecorder` audio/webm;opus, `AnalyserNode` for waveform, 10-min cap.

**Auth** — Lovable Cloud email; `_authenticated` layout gates app.

## Phases (status)

1. ✅ Cloud enabled · ✅ ElevenLabs linked · ✅ Notion linked
2. **→ Now:** design tokens (Notion Canvas palette + serif/sans + aurora/grid utilities), route shell, email auth, `notes` + `user_settings` migration with RLS
3. Capture screen + `transcribeAudio`
4. `formatNote` + review screen with editable chips
5. `bootstrapNotion` first-run + `syncToNotion` + settings
6. Library, filters, detail view, polish (fade-up motion, error toasts)

## Out of scope
WhatsApp/Telegram ingestion, sharing, full-text search, realtime streaming STT.
