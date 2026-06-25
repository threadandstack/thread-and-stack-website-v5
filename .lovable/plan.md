# Thread & Stack Skills + Brand Book Overhaul

Two parallel workstreams: (1) author a small library of reusable skills so every future Lovable session applies Thread & Stack patterns correctly, and (2) rewrite `/brand-book` so it actually matches what's shipped on the live site today.

---

## Part 1 — Skills to author

Each lives under `.agents/skills/{name}/SKILL.md`, then is activated with `skills--apply_draft`. Names are scoped with a `ts-` prefix so they're unmistakably project skills.

1. **`ts-design-system`** — the visual core
   - Indigo (#1340E8) light mode + Night theme (#FF6200 on #181B24); the per-page Night variant override pattern (e.g. light-blue #5DE0E6 + #004AAD gradient on Narratives page)
   - Pill button system + reveal-on-hover icon logic, and the gradient catalogue (default indigo, night orange, light-blue cyan→navy)
   - Card-based soft aesthetic: rounded corners, soft shadows, no hard borders, soft flowing dividers (no thread dividers)
   - Typography: Crimson Pro for editorial/Marginalia accents, Inter for body & UI, with the "less bold, more targeted serif" rule
   - **3D floating-card hover** (Tilt3D) — gentle float, mouse-follow, not skewed; the journal-grade version (vs. the static/skewed version we corrected)
   - Animation philosophy: scroll-triggered, start at 40% opacity, gentle
   - FAQ styling lock-in
   - Drawer/lightbox technique for service/portfolio/lead capture
   - Bottom-of-page CTA block pattern
   - References file points at `src/components/Tilt3D.tsx`, `src/components/ContactDrawer.tsx`, `src/components/FAQ.tsx`, `src/components/home-draft2/CTA.tsx`, `src/index.css` tokens

2. **`ts-copy-voice`** — copy & voice rules
   - Hard ban (no em dashes, no "X isn't Y, it's Z", no rule-of-three cadence, no restating the reader's situation)
   - Outcome-first phrasing; creative tax messaging; creative & strategist positioning
   - "Stories that land. Systems that stick." brand line
   - Two-pillar service language (Narratives & Strategy / Notion & Systems) and the retired offers list
   - Pre-publish checklist: re-fetch the live Notion-sourced hard-ban list before substantive copy passes
   - References `mem://standards/hard-ban-prepublish-checklist` and `mem://messaging/*`

3. **`ts-lead-capture`** — default lead treatment
   - Mandatory triple-fire on every lead form: Notion sync + visitor confirmation email + admin notification to br@brendanrodgers.uk (fire-and-forget)
   - GDPR explicit consent checkbox, honeypot field, role/organisation field standard (British English)
   - UTM attribution mapping standard
   - Use `ContactDrawer` over inline forms where possible
   - References `supabase/functions/sync-lead-to-notion`, `supabase/functions/send-transactional-email`, `src/components/ContactDrawer.tsx`

4. **`ts-notion-content`** — Notion CMS & content integration
   - Unified content cache architecture, 5-min sync polling, cache-first reads
   - Notion media persistence proxy (S3 expiry → Supabase Storage)
   - Content fidelity rules for rendering Notion blocks/iframes; allowed CSP domains
   - Blog theme color system (Notion tag → palette)
   - Governance pages (Privacy, Data Guarantee) sync
   - References `supabase/functions/sync-blog-cache`, `persist-notion-media`, `fetch-notion-page`

5. **`ts-asset-library`** — image & logo conventions
   - Logo set in use today: ungradiented logo + B/W/Grey/Indigo Stacked/Wordmark/SocialSq SVGs; the gradient blue logo is retired
   - Photography buckets: `src/assets/photos/{workshop|shoreditch|portraits}/`
   - Notion mock screenshots: `src/assets/notion-mock/`
   - Hero focal-point picker workflow + landscape requirement for service pillar cards
   - Asset-pointer (`.asset.json`) workflow reminder
   - Provides a one-line lookup table so future sessions don't import retired assets

(Proposals skill — e.g. the SF Fire letter-opening pattern — is noted as a future skill but **not** authored in this pass to keep scope tight. Will flag it in the closing message.)

---

## Part 2 — Rewrite `/brand-book`

Current `src/components/BrandBook.tsx` is 1,100 lines and out of date: wrong colors, missing gradients, inconsistent typography (over-bold), no 3D effects documented, retired blue logo shown, missing recent imagery, no drawer/CTA/FAQ patterns.

New structure (single file, but reorganised into clear numbered sections, each rendered with the patterns it documents — i.e. the brand book *demonstrates* the system):

```text
01  Brand essence       — "Stories that land. Systems that stick." + creative tax
02  Logo system         — current ungradiented + B/W/Grey/Indigo SVG sets; remove retired gradient blue
03  Colour              — Indigo light, Night orange, per-page variant (light blue), with hex + HSL + gradient swatches
04  Gradients           — default, night, narratives (90deg #5DE0E6 → #004AAD), with copy-to-clipboard hex
05  Typography          — Crimson Pro display/Marginalia, Inter body; "less bold, targeted serif" rule with examples
06  Cards & 3D float    — live Tilt3D demo tiles; documents the gentle mouse-follow vs the rejected skew
07  Pill buttons        — hover-reveal icon demos in each gradient
08  FAQ pattern         — live accordion example with lock-in note
09  Drawers & lightbox  — trigger button that opens ContactDrawer as live demo
10  Bottom CTA block    — embedded live example
11  Animation rules     — 40%-opacity scroll-in demo strip
12  Photography         — current workshop/shoreditch/portrait grids (pull in the new imagery)
13  Notion translations — keep the strong existing section
14  Voice & copy        — hard-ban list + outcome-first examples (mirrors ts-copy-voice skill)
15  Downloads           — logo zip / asset references
```

Implementation notes:
- Replace `BrandBook.tsx` in-place rather than creating a new route
- Use the live components (`Tilt3D`, `ContactDrawer`, `FAQ`, `CTA`) inside the page so the brand book is self-demonstrating
- Drop the retired gradient blue logo imports
- Wire in workshop/shoreditch/portrait photos already imported but underused
- Use semantic tokens (`bg-card`, `text-accent`, `bg-gradient-primary`) — no hardcoded colors except in the swatch values themselves
- Keep section anchors so the existing TOC nav still works

---

## Technical details

- Skills directory: `.agents/skills/ts-design-system/SKILL.md` etc., each ~80–150 lines with a clear `description` for retrieval matching. After all five are written, call `skills--apply_draft` once per skill (5 calls).
- `src/components/BrandBook.tsx`: full rewrite, target ~900 lines (down from 1,100), structured by the 15 sections above. Memo-import Tilt3D and ContactDrawer locally rather than spinning up new ones.
- No backend changes, no migrations, no new routes.
- Verification: tsgo typecheck + a Playwright screenshot of `/brand-book` in both light and night themes to confirm gradients, 3D tiles, and updated typography render.

---

## Out of scope (intentionally)

- Proposals skill (SF Fire letter-opening pattern) — separate follow-up.
- Touching any page other than `/brand-book` and `src/components/BrandBook.tsx`.
- Changing the active design tokens in `index.css` — the brand book reflects what's already there.
