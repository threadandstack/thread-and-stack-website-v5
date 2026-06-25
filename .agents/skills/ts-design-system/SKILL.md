---
name: ts-design-system
description: Thread & Stack visual system — colours, gradients (primary warm magenta→orange), gradient text treatment, typography, Tilt3D floating cards, pill buttons, FAQ accordion, drawers, bottom CTA, and animation rules. Load when styling any page or component on threadandstack.com (light or dark mode).
---

# Thread & Stack Design System

The brand book route `/brand-book` is the living source of truth and self-demonstrates every pattern. This skill is the agent-side index. When something here disagrees with `/brand-book`, the page wins — re-read `src/components/BrandBook.tsx` and update this file.

## 1. Modes

| Mode | Background | Accent | Use |
|---|---|---|---|
| Light (default) | `#FFFFFF` | Indigo `#1340E8` | Marketing pages, default |
| Dark | `#181B24` (cool blue-grey) | Orange `#FF6200` | Dark-mode variant of every page |

Every page must work in both modes. Tokens live in `src/index.css` as HSL CSS variables (`--accent`, `--background`, `--card`, `--clay`, `--orange`). Never hardcode `text-white` / `bg-black` — use `text-accent`, `bg-card`, `bg-gradient-primary`, etc.

**Utility tokens — not in active use:** `destructive` (red) and `secondary` (lavender) are defined in `src/index.css` but are not active UI colours. Do not surface them as palette swatches. When form-state communication is next addressed, re-add the emerald success token alongside destructive.

## 2. Gradient catalogue

Only three approved families. The primary warm gradient is the **single source of truth** for CTAs and is wired to the global `--gradient-3color` CSS variable.

1. **Primary warm — all CTAs, pill buttons, gradient text accents**
   `linear-gradient(95deg, hsl(320 85% 55%), hsl(var(--orange)))`
   Hex: `#ED2AAC` → `#F39848` (magenta left, orange right). Mode-agnostic.

2. **Default indigo — brand mark hover only**
   `linear-gradient(90deg, #1340E8, #4E6CFF)`

3. **Dark mode orange — accent gradient**
   `linear-gradient(90deg, #FF6200, #FF9248)`

**Retired — do not use:**
- Orange-to-violet nav variant `#F39848` → `#BA67E4`. Replaced by primary warm everywhere.
- Narratives light-blue gradient `#5DE0E6` → `#004AAD`. Created in error. `/narratives-and-strategy-services` now uses the primary warm gradient.

Pass gradients as props (`ctaGradient`, `logoHoverGradient` on `Navigation`) or use the `--gradient-3color` CSS variable. Don't hardcode hex per page.

## 3. Gradient text treatment

Wherever colour is introduced to a heading or display word for emphasis, apply the primary warm gradient as a text gradient. Replaces solid `text-clay` on italic/accent display text.

```css
.text-gradient-warm {
  background-image: linear-gradient(95deg, hsl(320 85% 55%), hsl(var(--orange)));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

Apply subtly — one or two display words per heading. If it reads as tacky on a specific instance, leave a code comment for review rather than silently reverting.

## 4. Typography

- **Crimson Pro** (`font-serif-pro`) — editorial accents, italic emphasis words inside Inter headlines. Weight **500–600**, never 700+. Less bold than instinct asks for.
- **Inter** — body, UI, buttons, captions. Body 400, emphasis 500.
- Targeted serif: a single serif italic word/phrase inside an Inter line beats a fully serif heading.
- Italic Crimson Pro carrying the gradient text treatment is the dominant display pattern.

## 5. Cards & 3D float (Tilt3D)

`import { Tilt3D } from "@/components/Tilt3D"` — wraps a card in a perspective container that gently tilts toward the mouse (max 8°/6°). Use for service pillars, portfolio masonry tiles, journal cards, Notion mock screenshots.

Rules:
- Gentle mouse-follow only. **No skew, no aggressive rotate, no parallax inside.**
- Pair with `rounded-2xl bg-card` + soft shadow tokens.
- **Icons inside cards use `text-clay` (orange in both modes), not indigo.**
- Never put `translate-y` transitions on images inside Tilt3D — GPU compositing artifacts on photos. Use opacity transitions only.

## 6. Pill buttons

Three variants, all `rounded-full`, Inter, medium weight:

1. **Primary CTA** — primary warm gradient fill, white text, reveal icon slides in from right on hover. Mode-agnostic (same on light and dark).
2. **Secondary** — outline only, no fill. Border colour matches the accent colour of its surrounding context: indigo next to indigo elements, orange next to orange/gradient elements.
3. **Dark mode primary** — same primary warm gradient.

There is no separate "Narratives gradient" or "Night gradient" button.

## 7. FAQ pattern (locked)

`import { FAQ } from "@/components/FAQ"`. Do not re-implement accordions. Soft chevron, card background, no hard borders between items. Toggle blocks inside Notion content reuse this pattern.

## 8. Drawers (the "swish" reveal)

- **Lead capture** → `DiagnosticDrawer` with `initialMode="intro"` from `@/components/home-draft2/DiagnosticDrawer`. Full qualification form: first/last name, email, role, company, website, annual revenue, employees, GDPR. Triple-fire on submit (Notion + visitor email + admin email). Secondary "I'm ready to book my Diagnostic session now" link below the primary CTA.
- The legacy `ContactDrawer` ("Let's Work Together") exists for older callsites but is being phased out. New work uses `DiagnosticDrawer`.
- Loading state in portfolio drawer uses the custom liquid-fill loader (see `mem://ux/portfolio-drawer-and-loader-animation`).

## 9. Bottom-of-page CTA

`import { CTA } from "@/components/home-draft2/CTA"`. Every marketing page ends with this block. Warm off-white card, "Start with a call. / Leave with a plan." heading with the second line in gradient text, primary warm gradient CTA pill, secondary outline pill, trust line. **Do not author a new bottom-CTA component.**

## 10. Animation

- Scroll-triggered fade-in from **40% opacity** (not 0), translating ≤ 10px.
- One motion per section, not micro-interactions everywhere.
- No bouncy springs on marketing pages.

## 11. Iconography

- Lucide-react is canonical. Match stroke width 1.5 across a single section.
- Icons inside cards default to `text-clay`.
- Don't mix two icon libraries on the same surface.

## 12. Soft-card non-negotiables

- `rounded-2xl` / `rounded-3xl`, soft shadow, **no hard 1px borders** as the primary edge.
- No horizontal rules / dividers — use whitespace.

## References

- `/brand-book` — canonical live demo and asset reference (sections 01–15).
- `src/components/Tilt3D.tsx`
- `src/components/FAQ.tsx`
- `src/components/home-draft2/CTA.tsx`
- `src/components/home-draft2/DiagnosticDrawer.tsx`
- `src/components/Navigation.tsx`
- `src/index.css` (token definitions, `.text-gradient-warm`)
