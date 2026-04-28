# Notion Masterclass — Page Plan

A new landing page at **`/notion-masterclass`** that mirrors the structure of `notionconsultants.com/masterclass`, restyled in the Thread & Stack brand language (Crimson Pro + Inter, indigo `#1340E8`, soft cards, no thread dividers, scroll fades from 40% opacity).

> **Heads up — memory conflict:** Project memory says workshops are a retired service pillar. This page reintroduces a paid live workshop product. I'll treat it as an intentional exception (separate masterclass product, not part of the "two-pillar" services) and won't link it from the main nav unless you ask. Confirm if you'd like me to update the memory after.

## Positioning

- **Product:** 90-minute live online masterclass on building a Notion system that works for solo founders.
- **Audience:** Founders & solo operators drowning in scattered tools (the "creative tax" angle).
- **Working title (open to change):** *"The Founder's Notion Masterclass — 90 minutes to a system that actually sticks."*
- **Price:** single price, placeholder `£149` — confirm number before launch.

## Page structure (top to bottom)

1. **Hero** — split layout
   - Left: editorial Crimson Pro italic headline, supporting Inter paragraph, primary CTA "Save my seat — £149", secondary "What you'll leave with" anchor link.
   - Right: frosted card on a workshop photo (uses existing `src/assets/photos/workshop/*.webp`). Optional video play button placeholder for a future trailer.
2. **The Opportunity / The Problem** — "creative tax" framing: most founders don't have a Notion problem, they have a *system* problem. Soft card with supporting copy + small inline illustration.
3. **Who this is for** — 3–4 soft cards (founders, solo operators, makers building a stack, consultants productising). Indigo ring bullets per the list-item branding rule.
4. **What you'll master** — 4-up grid of outcomes (Crimson Pro mini-headings + Inter body). Examples:
   - Designing a Notion architecture that scales with you
   - Capture → Process → Publish workflows
   - Killing the 12-tool tax
   - Templates you can reuse the next day
5. **Testimonial #1** — pull-quote card with avatar, sourced from existing Testimonials data (placeholder until you supply a workshop-specific quote).
6. **Your framework** — single editorial section explaining the workshop's spine (e.g. the "Thread → Stack → Ship" framework), with a simple SVG/figure placeholder.
7. **Your instructor** — Brendan bio block, portrait from `src/assets/photos/portraits/`, Notion Certified Consultant badge per the credential badge rule.
8. **Testimonial #2** — second pull-quote card.
9. **Pricing** — single soft card: title, what's included list, **£149**, primary CTA "Save my seat". Below a divider note: *"All attendees receive the recording, the workspace template, and a £100 credit toward Notion & Systems Consultancy."*
10. **Bonus material** — "What you take home" — 3–4 bullets (workshop recording, Notion workspace template, 30-day implementation checklist, private follow-up Q&A).
11. **FAQ** — reuse the existing `<FAQ />` component pattern with masterclass-specific questions (format, refunds, level required, recording access).
12. **Final CTA band** — large repeat CTA + secondary "Ask a question" opening the new drawer in question mode.
13. **Footer** — existing global Footer.

## New lead-capture drawer

A dedicated drawer component **`MasterclassRegisterDrawer`** modelled on `ContactDrawer`:

- Two modes via prop: `"register"` (default) and `"question"`.
- Fields: Name, Email, Role/Organisation (per the standardised form field rule), "What's your biggest Notion frustration right now?" (textarea), GDPR consent checkbox, honeypot field.
- Submission goes to a new Supabase table `masterclass_registrations` (columns: id, created_at, name, email, role_org, message, mode, utm_source/medium/campaign, consent_given). RLS: insert-only for anon, select restricted to authenticated admins.
- After submit: success state in-drawer + UTM-aware redirect to a thank-you route (using the existing thank-you flow pattern) for GA4 tracking. New thank-you key: `masterclass_register`.
- Lead also synced to Notion via the existing `sync-lead-to-notion` edge function (extend it to accept a `source: 'masterclass'` tag) so it lands in the same lead pipeline.

## Styling rules applied

- Crimson Pro italic for hero + section headings; Inter for body and UI.
- Indigo `#1340E8` accent, `#181B24` for any night-mode hero variant (not used by default here).
- Soft rounded cards (`rounded-2xl`), soft shadows, no hard borders, no thread dividers.
- Scroll-triggered fade-up animations starting at 40% opacity (matches site-wide `IntersectionObserver` pattern in `Hero.tsx`).
- `PillButton` for all CTAs with the existing hover-reveal interaction.
- Pull-quote cards use the soft-card pattern from `Testimonials.tsx`.

## Tracking

- `trackServiceView('Notion Masterclass')` on mount.
- `trackCtaClick('Save my seat', '<section>')` on every primary CTA.
- Scroll-depth tracking via `useScrollDepthTracking('notion-masterclass')`.
- UTM params captured from the URL and persisted with the form submission.

## Technical changes

```text
NEW   src/pages/NotionMasterclassPage.tsx
NEW   src/components/MasterclassRegisterDrawer.tsx
EDIT  src/App.tsx                          // add /notion-masterclass route (lazy-loaded)
EDIT  supabase/functions/sync-lead-to-notion/index.ts  // accept source: 'masterclass'
NEW   supabase migration: masterclass_registrations table + RLS
```

Reuses: `Navigation`, `Footer`, `FAQ`, `PillButton`, `Card`, `Emphasis`, existing photo assets in `src/assets/photos/workshop` and `src/assets/photos/portraits`, GDPR consent checkbox pattern, honeypot pattern, GA4 thank-you redirect flow.

## Open items I'll need from you (can finalise after build)

1. Final price (placeholder £149).
2. Final headline + subhead — I'll draft, you tweak.
3. Workshop date/time, or "next cohort TBA — register for the waitlist".
4. Whether to add a nav entry now or keep it unlinked for direct-share / paid traffic only.
