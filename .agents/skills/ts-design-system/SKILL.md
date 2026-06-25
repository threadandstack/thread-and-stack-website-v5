---
name: ts-design-system
description: Thread & Stack visual system — colours, gradients, typography, Tilt3D floating cards, pill buttons, FAQ accordion, drawer/lightbox, bottom CTA, and animation rules. Load when styling any page or component on threadandstack.com (light or Night theme).
---

# Thread & Stack Design System

The brand book route `/brand-book` is the living source of truth and self-demonstrates every pattern. This skill is the agent-side index. When something here disagrees with `/brand-book`, the page wins — re-read `src/components/BrandBook.tsx` and update this file.

## 1. Themes

| Theme | Background | Accent | Use |
|---|---|---|---|
| Light (default) | `#FFFFFF` | Indigo `#1340E8` | Marketing pages, default |
| Night | `#181B24` (cool blue-grey) | Orange `#FF6200` | Dark-mode variant of every page |
| Per-page override | inherits Night | e.g. light-blue `#5DE0E6` → navy `#004AAD` gradient on `/narratives-and-strategy-services` | Use sparingly, scope locally via CSS variables on a wrapper, never edit global tokens |

Tokens live in `src/index.css` as HSL CSS variables (`--accent`, `--background`, `--card`, `--clay`, `--orange`, `--violet`). Never hardcode `text-white`/`bg-black` — use `text-accent`, `bg-card`, `bg-gradient-primary` etc.

Every page must work in light AND Night — no light-only components.

## 2. Gradients (catalogue)

- **Default indigo**: `linear-gradient(90deg, #1340E8, #4E6CFF)`
- **Night orange**: `linear-gradient(90deg, #FF6200, #FF9248)`
- **Narratives light-blue**: `linear-gradient(90deg, #5DE0E6, #004AAD)`

Pass gradients as props (e.g. `ctaGradient`, `logoHoverGradient` on `Navigation`) rather than hardcoding per page.

## 3. Typography

- **Crimson Pro** (`font-serif-pro`) — editorial headings, Marginalia-style emphasis, pull quotes. Use *less bold* than instinctive: weight 500–600, never 700+.
- **Inter** — body, UI, buttons, captions.
- Targeted serif: a single serif word or phrase inside an Inter line beats a fully serif heading.
- Italic + slight baseline shift for hero accent word (see Hero / brand book section 05).

## 4. Cards & 3D float (Tilt3D)

`import { Tilt3D } from "@/components/Tilt3D"` — wraps a card in a perspective container that gently tilts toward the mouse (max 8°/6°). Use for:
- Service pillar cards, portfolio masonry tiles, journal cards, Notion mock screenshots.

Rules:
- Gentle mouse-follow only. **No skew transforms**, no aggressive rotate, no parallax layers inside.
- Pair with `rounded-2xl bg-card shadow-[0_8px_30px_rgba(0,0,0,0.06)]` (light) / `shadow-[0_8px_30px_rgba(0,0,0,0.4)]` (night).
- Never put `translate-y` transitions on images inside Tilt3D — causes GPU compositing artifacts on photos. Use opacity transitions only.

## 5. Pill buttons

- Fully rounded (`rounded-full`), Inter, medium weight.
- Hover: gradient fill (per theme) + reveal icon that slides in from the right (`group-hover:translate-x-0`, starts `translate-x-2 opacity-0`).
- Primary CTA uses theme gradient; secondary is outline with `border-accent/30`.
- Match the pill nav system: see `src/components/Navigation.tsx`.

## 6. FAQ pattern (locked in)

`import { FAQ } from "@/components/FAQ"` — `<FAQ items={[{q,a}]} title="..." />`. Do not re-implement accordions; reuse this. Soft chevron, card background, no hard borders between items.

## 7. Drawers & lightbox (the "swish" reveal)

- Lead capture → `ContactDrawer` (`open`, `onOpenChange`, `source`). Default to this over inline forms.
- Service/portfolio exploration → side drawer pattern with the same easing.
- Loading state in portfolio drawer uses the custom liquid-fill loader (see `mem://ux/portfolio-drawer-and-loader-animation`).

## 8. Bottom-of-page CTA

`import { CTA } from "@/components/home-draft2/CTA"` — `<CTA theme="light" | "dark" />`. Every marketing page ends with this block. Don't author new bottom-CTA components.

## 9. Animation philosophy

- Scroll-triggered fade-in starting at **40% opacity** (not 0), translating <= 10px.
- One well-timed motion per section, not micro-interactions on every element.
- No bouncy springs on marketing pages.

## 10. Iconography

- Lucide-react is the canonical icon set. Match stroke width 1.5 across a single section.
- Future icon libraries (e.g. Phosphor duotone) are evaluated against Lucide; do not mix two sets on the same surface.

## 11. Soft-card aesthetic non-negotiables

- Rounded edges (`rounded-2xl` or `rounded-3xl`), soft shadow, **no hard 1px borders** as the primary edge treatment.
- No thread dividers / horizontal rules — use whitespace or a soft flowing curve instead.

## References

- `src/components/Tilt3D.tsx`
- `src/components/ContactDrawer.tsx`
- `src/components/FAQ.tsx`
- `src/components/home-draft2/CTA.tsx`
- `src/components/Navigation.tsx`
- `src/index.css` (token definitions, themes)
- `/brand-book` (live demo of every pattern)
