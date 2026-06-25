# Brand Book + Skills Overhaul

A two-part pass: (1) section-by-section corrections to `/brand-book` so it self-demonstrates every pattern using live components, and (2) updates to the five `ts-` skills so they're usable in cold sessions without memory.

## Order of work

1. **Audit pass (read-only)** before any edits:
  - `src/components/BrandBook.tsx` — current state of every section.
  - `src/components/ContactDrawer.tsx` — confirm which version is live (old "Let's Work Together" vs new "Start with a free 30-minute introductory call").
  - `src/components/home-draft2/CTA.tsx` — confirm it's the warm-card / gradient-text version we want to embed in section 10.
  - `src/components/Navigation.tsx` — locate orange→violet gradient (`#F39848` → `#BA67E4`) to replace.
  - `src/components/Tilt3D.tsx` + demo tiles — icon colour audit.
  - `src/pages/NarrativesStrategyServicesPage.tsx` — light-blue gradient to swap for primary warm.
  - `src/assets/logos/` — confirm no gradient blue variant remains; grep for any imports.
  - `src/assets/photos/{workshop,shoreditch,portraits}/` — full file list for section 12 inventory.
  - `src/index.css` — confirm `--orange`, destructive, secondary lavender tokens.
  - Blog/journal renderer (`src/components/RelatedBlogs.tsx`, `src/pages/BlogPostPage.tsx`, `supabase/functions/fetch-blog-post/`) — extract block-type rendering rules for section 13.
  - Site-wide grep for solid orange italic display text ("AI Ops Consultant", "Leave with a plan.") to retrofit gradient text treatment.

## PART 1 — Brand Book (`src/components/BrandBook.tsx`)

**Section 01 — Brand essence.** Remove "Stories that land. Systems that stick." Replace with the fragmentation framing: the problem is operational fragmentation, the founder who has hired specialists but has nobody accountable to the whole picture. Creative tax = one expression of fragmentation. Use "Transformation doesn't work until it works." only as a closing line, not a headline. Reframe services: primary = operations, systems & strategy consultancy for 5–50 teams; Narratives & Strategy = retained secondary offer (not equal). Update Brendan's positioning to: strategist, systems thinker, AI ops consultant, behavioural-science-informed integrator.

**Section 02 — Logos.** Remove the gradient blue logo entirely (no swatch, no "retired" callout). Grep + delete any remaining imports. Display only the 12 current variants (Grey/Indigo/Black/White × Stacked/Wordmark/SocialSq).

**Section 03 — Colour.** Rename Light theme → **Light mode**, Night theme → **Dark mode**. Remove destructive red + secondary lavender from primary palette swatches; move to a small "Utility tokens — not in active use" subsection noting destructive = form error states, with a note that a success-green companion should be re-added when form state communication is revisited. Keep tokens in CSS; only the visual palette display changes.

**Section 04 — Gradients.** Consolidated catalogue:

1. **Primary warm** — `linear-gradient(95deg, hsl(320 85% 55%), hsl(var(--orange)))` (`#ED2AAC` → `#F39848`). All CTAs, pill buttons, gradient text.
2. **Default indigo** — `linear-gradient(90deg, #1340E8, #4E6CFF)`. Brand mark hover only.
3. **Dark mode orange** — `linear-gradient(90deg, #FF6200, #FF9248)`.

Remove Narratives light-blue. Globally replace orange→violet (`#F39848` → `#BA67E4`) with primary warm — in `Navigation.tsx` and any page-level CTAs using it. Swap Narratives page light-blue → primary warm.

**Section 04a (new) — Gradient text treatment.** Document the rule and CSS (`background-clip: text; -webkit-background-clip: text; color: transparent`). Retrofit existing solid-orange italic display words ("AI Ops Consultant", "Leave with a plan.", any others surfaced by grep). Live demo: Crimson Pro italic display sentence with 1–2 gradient words. Flag tacky instances via code comment rather than silent revert.

**Section 05 — Typography.** Remove the non-italic Crimson Pro 500 display example (not in use). Replace with an italic 500–600 emphasis-word example matching live usage. Document weight rule: display 500–600, body 400–500, never 700+ on Crimson Pro.

**Section 06 — Cards & Tilt3D.** Switch demo tile icon colour from indigo → orange (both modes). Align card title weight to section 05.

**Section 07 — Pill buttons.** Replace current demos with: (1) Primary CTA — primary warm gradient, white text, hover icon slide; (2) Secondary — outline-only, border colour context-aware (indigo on light, orange on dark); (3) Dark-mode primary — same primary warm gradient (mode-agnostic). Remove "Narratives gradient" and standalone "Night gradient" buttons. Add note about context-matching secondary outline.

**Section 08 — FAQ.** Confirmed correct, no changes.

**Section 09 — Drawers & lightbox.** Wire the demo to the correct production `ContactDrawer` (the full intro-call form with First/Last name, email, role, company, website, revenue, employees, GDPR, primary-warm CTA, secondary Diagnostic link). If two versions exist, identify the live one and archive the old.

**Section 10 — Bottom CTA.** Replace mocked block with live `import { CTA } from "@/components/home-draft2/CTA"`.

**Section 11 — Animation.** Confirmed correct.

**Section 12 — Photography.** Render the full inventory of `workshop/`, `shoreditch/`, `portraits/` — every image, not curated.

**Section 13 — Notion translations.** Build a block-by-block visual reference table covering minimum: paragraph, H1/H2/H3, callout (with emoji), quote, toggle (accordion), bookmark/link preview, image (full-width), divider. Each row: block type · live rendered example · CSS notes · exceptions. Extract real rules from blog renderer. Add expandable embed/link to the `ts-notion-content` skill.

**Section 14 — Voice & copy.** Expand significantly: full hard-ban list with sub-categories (meta-commentary, generic openings/closings, overused transitions with usage limits — once per 800 words, never on LinkedIn — buzzword clichés). Channel minimums: LinkedIn 3+ proper nouns / zero restricted transitions; Newsletter & Journal 5+ proper nouns / max one. Add "only Brendan could write this" test as a named principle. Add Core Voice principles (Strategist/Coach tension, wandering sentence, bold as hammer, truth over polish, specificity as trust). Update identity framing. Add expandable embed/link to `ts-copy-voice` skill.

**Section 15 — Downloads.** Populate: logo grid (12 variants, filename + use context + right-click-to-save), asset path reference table (photos by bucket, Notion mocks, icon sets), retired-asset notice (gradient blue logo — do not reintroduce).

## PART 2 — Skills (`.agents/skills/{name}/SKILL.md`)

`**ts-design-system**` — New gradient catalogue (primary warm replaces indigo default for CTAs). Remove Narratives light-blue. Add gradient text treatment with CSS. Rename Light/Night → Light/Dark mode. Remove destructive red + secondary lavender as active UI. Icons in cards default to orange, not indigo. Remove retired gradient blue logo references. Remove OG/favicon path refs (brand book is now canonical). Inline critical rules previously only behind `mem://`.

`**ts-copy-voice**` — Embed full hard-ban list (all categories). Add channel minimums. Add "only Brendan could write this" test. Add Core Voice principles section. Update identity to strategist / systems thinker / AI ops consultant / behavioural-science-informed integrator (drop "designer" primary). Replace brand-line framing with the fragmentation problem narrative. Keep the pre-publish re-fetch instruction but inline the hard-ban so cold sessions work.

`**ts-notion-content**` — Add "Block translation reference" mirroring brand book section 13. Inline media-persistence, cache-first, no-direct-Notion-API rules so the skill is cold-session usable. Cross-reference brand book section 13.

`**ts-asset-library**` — Point to `/brand-book` section 15 as canonical, but embed a one-line lookup table inline. Remove global/fiction project asset path refs. Explicit retired list: gradient blue logo — do not use, do not reintroduce.

**Cross-cutting** — For every `mem://` reference across `ts-design-system` and `ts-copy-voice`, assess if losing it would fail silently. If yes, inline the essential rule and keep `mem://` as supplementary.

## Verification

1. `skills--apply_draft` once per skill (5 calls).
2. Typecheck — flag any errors from gradient consolidation or component swap.
3. Playwright `/brand-book` in light + dark mode. Confirm: primary warm gradient on CTAs · gradient text on headline accent words · correct ContactDrawer opens from §09 · live CTA renders in §10 · photography grid complete · Notion block translation table populated.

## Out of scope (flag, don't fix here unless trivial)

- Re-adding a success-green token (deferred to next form-state pass).
- Building the `ts-proposals` skill (separate request).
- Editing the live Narratives page beyond the gradient swap.

## Open question

Should I also retrofit gradient text treatment site-wide in this pass (homepage, service pages, proposals), or limit retrofit to the named instances ("AI Ops Consultant", "Leave with a plan.") and flag others for a follow-up? Site-wide is safer for brand consistency but expands the diff considerably. **Answer: Yes, Sitewide.**