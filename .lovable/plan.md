# Brain — Voice Notes → Notion

A standalone, mobile-first PWA. Tap to record (or type), get a clean, auto-tagged note, and have it land in your Notion "Brain" database automatically.

## Core experience

1. **Capture (home)** — One giant record button. Tap to start, tap to stop. Live waveform + timer. Secondary "type a note" tab. `captured_at` timestamp recorded the moment you start.
2. **Processing** — Audio → ElevenLabs Scribe → Lovable AI structures into `{ title, subject, summary, body, tags }`.
3. **Review** — Edit inline. Subject + tag chips are editable. "Save to Notion" or "Discard". Auto-saves a local draft.
4. **Library** — Reverse-chronological list. Filter by subject/tag. Tap to view, edit, or re-sync.

## Design direction

**Palette** — Warm off-white + black + crimson + electric blue-indigo.
- `--background`: `oklch(0.97 0.01 80)`
- `--foreground`: `oklch(0.15 0 0)`
- `--primary`: `oklch(0.55 0.22 25)` (crimson)
- `--accent`: `oklch(0.48 0.28 270)` (electric indigo)

**Typography** — `Instrument Serif` display + `Inter` body. Big confident headlines, generous whitespace.

**Vibe** — Swiss-editorial meets recording studio. Oversized timer numerals. Single bold accent per screen. Subtle framer-motion micro-interactions.

## Routes

- `/` — Capture
- `/review/$draftId` — Review formatted note
- `/library` — All notes with filters
- `/library/$noteId` — Single note
- `/settings` — Notion DB target, formatting prompt
- `/login` — Email auth

## Technical approach

**Stack additions**
- Lovable Cloud (auth, DB, server functions)
- Lovable Notion connector — **reusing existing connection** in this workspace
- ElevenLabs `scribe_v2` — **reusing existing `ELEVENLABS_API_KEY`**
- Lovable AI Gateway with `google/gemini-3-flash-preview` for structured output via tool-calling
- `framer-motion`

**Data model**
- `notes` — `id, user_id, title, subject, summary, body, tags (text[]), raw_transcript, source (voice|typed), audio_duration_s, captured_at, status (draft|synced|failed), notion_page_id, notion_page_url, created_at, updated_at`
- `user_settings` — `user_id, notion_database_id, notion_parent_page_id, formatting_prompt`
- RLS: each user owns their rows.

**Server functions**
- `transcribeAudio` — audio blob → ElevenLabs Scribe transcript
- `formatNote` — transcript + captured_at → `{ title, subject, summary, body, tags[] }`. Prompt instructs the model to infer one short subject and 2–5 lowercase tags.
- `bootstrapNotion` — first-run: creates "Brain" DB under a parent page the user picks
- `syncToNotion` — creates Notion page in the Brain DB with all properties

**Notion DB schema**
- `Title` (title)
- `Subject` (select, grows over time)
- `Tags` (multi_select, grows over time)
- `Captured` (date with time)
- `Summary` (rich_text)
- `Source` (select: voice | typed)
- `Duration (s)` (number)
- Page body: formatted note + collapsible "Raw transcript".

**Auth** — Lovable Cloud email auth. Routes protected via `_authenticated` layout.

**Capture** — `MediaRecorder` (audio/webm;opus), live waveform via `AnalyserNode`. Max 10 minutes/note.

## What I'll need from you during build

1. Approve enabling **Lovable Cloud**.
2. On first run inside the app, pick the **Notion parent page** for the Brain DB (uses existing connection).

## Build phases

1. **Foundations** — Enable Cloud, link existing Notion connection + ELEVENLABS_API_KEY to this project, design tokens, routes, email auth, DB schema with RLS.
2. **Capture + transcribe** — Recording UI, waveform, timer, `transcribeAudio`.
3. **Format + review** — `formatNote` with subject/tag inference, review screen with editable chips, draft persistence.
4. **Notion sync** — `bootstrapNotion` first-run flow, `syncToNotion`, settings screen.
5. **Library + polish** — Filters, detail view, animations, empty states, 429/402 error handling.

## Out of scope

- WhatsApp/Telegram ingestion
- Multi-user sharing, full-text search
- Realtime streaming transcription
