# Brand consolidation, round 2

A mix of bug fixes (gradients that didn't apply, invisible pill buttons, dark-mode pill colours on the journal) and two new design decisions (refreshed logo colourway + a tertiary palette token).

## 1. Tokens & utilities (`src/index.css`, `tailwind.config.ts`)

- Add a **tertiary** semantic token pair for communication/system messages:
  - `--tertiary: 145 60% 38%` (positive green), `--tertiary-foreground`
  - Mirror in `.dark` (slightly lighter to read on `#181B24`)
  - Expose as `tertiary` / `tertiary-foreground` in Tailwind config alongside `destructive`
- Retire the unused **secondary lavender** override — collapse `--secondary` back to a neutral grey so legacy `bg-secondary` usages stay readable but no longer skew lavender
- Audit `.text-gradient-warm`: confirm `background-clip: text` + `color: transparent` are both present (the brand-book "fragmentation" word currently renders as plain colour, suggesting the utility class is missing `-webkit-background-clip` or being overridden by `h3` italic colour)
- Add a `.bg-gradient-warm` utility for fills (pill buttons, CTA backgrounds) so we stop hardcoding the gradient in component classNames

## 2. Pill button / CTA fixes (the "invisible buttons" bug)

Likely cause: the gradient was applied via a Tailwind arbitrary value that doesn't compile, or the button variant lost its `bg-*` class when we swapped tokens. Fix path:

- Patch `src/components/ui/pill-button.tsx` and `src/components/ui/button.tsx` so the **primary** variant uses `bg-gradient-warm` (new utility) with `text-white` and a visible focus ring in both themes
- Outline variant: use `border-accent text-accent` — in dark mode `--accent` is orange, so the outline reads correctly. The "orange outline shows as black" symptom suggests the variant currently uses `border-foreground` or a literal hex
- Verify in the brand book section 07 demo and on the bottom CTA block

## 3. Bottom CTA block (`src/components/home-draft2/CTA.tsx`)

- Remove the hard 1px border (homepage version has no outline — soft shadow only)
- Make sure its primary button uses the same fixed pill variant

## 4. Journal dark-mode pills (`src/pages/BlogPage.tsx` / `RelatedBlogs.tsx` / category chip component)

- Locate the category-chip render. Currently "Case Study" and "Strategy" categories fall through to a default that's pure orange in dark mode and doesn't pick up the warm gradient
- Add explicit dark-mode variants per category so:
  - **Case Study**: orange-tinted background in both themes, but dark mode uses `bg-accent/15 text-accent` instead of solid orange
  - **Strategy**: indigo in light, soft blue-tint in dark (not orange)
  - Same readability treatment for any other category currently missing a dark variant

## 5. Hover-turns-orange regressions

- Journal **Subscribe** button: replace `hover:bg-orange` (or equivalent) with `hover:bg-gradient-warm` / accent
- **Featured** pill in the player 2 / featured posts area: same fix
- Grep for `hover:.*orange` and `hover:bg-\[#FF` across the repo to catch siblings

## 6. Homepage titles still missing the gradient

The previous pass missed these — add `text-gradient-warm` to:

- "Agents" / "Custom agents that solve a hassle" → `AgentsSection.tsx`
- "Certified embedded" / "Notion certified" / "Fluent in AI frameworks" → `Credentials.tsx`
- "Hard questions" → `FAQ.tsx` heading on the home-draft2 variant

## 7. Brand book "fragmentation" word

Root-cause the `.text-gradient-warm` class — once fixed in §1, this resolves automatically. If the issue is the parent `h3` colour winning over the span, add `!text-transparent` to the utility.

## 8. Logo refresh — Indigo set → Magenta-Orange

The current `Indigo_TS_*.svg` files use Indigo (`#1340E8`). We'll generate a new **Warm** set in the magenta-orange gradient so they match the rest of the brand:

- New files: `Warm_TS_Stacked.svg`, `Warm_TS_Wordmark.svg`, `Warm_TS_SocialSq.svg` — SVGs with `<linearGradient>` from `#ED2AAC` to `#F39848` applied to the mark
- Leave the existing Indigo files in place but mark **deprecated** in `BrandBook.tsx` (so any external links keep working)
- Swap consumer call-sites (Nav hover, brand book inventory) to the new Warm set
- Update `mem://design/new-logo-direction` and the `ts-asset-library` skill

## 9. Site-wide orange-text sweep

Grep targets to convert to `text-gradient-warm` (or `text-accent` where a gradient would be inappropriate, e.g. inline within a paragraph):

- `text-[#FF6200]`, `text-orange-*`, `bg-orange-*`, `border-orange-*`, `from-orange`, `to-orange`
- Skip: `text-destructive` (red is correct), tertiary green (new), and Notion callout backgrounds

## Verification

- `tsgo` typecheck after each batch
- Visit `/brand-book`, `/journal`, `/` in both light and dark via Playwright; screenshot the buttons, pills, and titles called out above
- Confirm "fragmentation" reads as gradient, primary pill buttons are visible, journal category pills have correct dark-mode styling

## Out of scope

- Redesigning the logo mark itself (only re-colouring to the warm gradient)
- Reworking any page layouts; this pass is colour/token/component-only
