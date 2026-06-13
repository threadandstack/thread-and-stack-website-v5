## What I'm changing and why

### 1. Move the toggle affordance onto the main title (not the eyebrow)
The pre-title triangle reads as decoration. Putting the disclosure on the H2 makes the whole title feel like the thing you click, which is the Notion behaviour we want.

- The triangle sits to the **left of the title**, vertically centred against the cap-height of the first line.
- It's sized to feel like part of the heading (around 0.55em of the title), in the clay tone, and rotates 0° → 90° on open with a 300ms ease.
- The eyebrow goes back to being a quiet label with no icon.

### 2. "Central yet left-aligned" title block
Each section's header lives in a fixed-width column (around `max-w-2xl`, ~640px) that is `mx-auto` centred on the page. Inside that column, everything is `text-left`:

```text
            ┌────────── max-w-2xl (centred) ──────────┐
            │ EYEBROW                                  │
            │ ▸ Big italic title runs here, left edge  │
            │   shared with eyebrow and divider        │
            │ ───── (clay divider, left-aligned)       │
            │ One-line preview when closed.            │
            └──────────────────────────────────────────┘
```

This gives every section the same left edge, so as you scroll the page the titles form a visual spine, while still being optically centred on the page.

### 3. Reveal behaviour — my recommendation
I considered three options and want to flag the trade-offs before committing:

- **Hover-to-peek + click-to-lock** (what you suggested): elegant on desktop, but on touch there is no hover, so the first tap has to act as a click. It also gets twitchy when the mouse passes over several titles quickly — they pop open and shut.
- **Scroll-to-open**: opens sections as they enter the viewport. Removes user agency and re-floods the page with everything you originally wanted to suppress. I would not recommend this — it defeats the purpose of the toggles.
- **Click-to-toggle, with a hover *telegraph*** (my recommendation): clicking is the only thing that actually opens or closes a section. On hover, the title gets a subtle signal that it's interactive — triangle tints to clay, divider line breathes out from 64px to ~120px, and a "Reveal" micro-label fades in next to the divider. Nothing structural moves, so the page stays calm and the interaction is identical on touch.

I'd build option 3. If after seeing it you still want the actual peek-on-hover, it's a small follow-up: add a 250ms hover-intent timer that previews the body at ~30% height, and lock to full open on click. Happy to do that as a v2.

### 4. Fix the panel feather clipping content
The current 56px mask gradient sits on top of the section's first/last elements, so headings and cards inside fade out instead of appearing fully. Two changes:

- **Increase the panel's internal top/bottom padding** to ~96px (md) / 64px (sm), so the feather lives in empty space, never over content.
- **Shrink the mask feather** slightly (32–40px) and apply it only to the background tint layer, not to the content layer. The tint feathers; the content stays at full opacity.

Mechanically this means splitting the panel into two stacked layers inside the same container:

```text
┌─ panel wrapper (relative) ─────────────────┐
│  ┌─ tint layer (absolute inset-0) ─────┐   │   ← mask-image feathers this only
│  │  bg gradient, ~2.8% foreground      │   │
│  └─────────────────────────────────────┘   │
│  ┌─ content layer (relative, pt/pb-24)─┐   │
│  │  children render here, full opacity │   │
│  └─────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

The clay hairline at the very top of the panel stays — it's the bit that makes the content feel like it's spilling out of the divider.

## Files touched

- `src/components/home-draft2/CollapsibleSection.tsx` — full rework of the header layout (left-aligned centred column, triangle on title), hover telegraph, and the split tint/content panel with corrected padding.
- No changes needed in `HomePageDraft2.tsx` or the individual section files — the API stays the same (`eyebrow`, `title`, `preview`, `defaultOpen`, `children`).

## Open question for you

Are you happy with **click-to-toggle + hover telegraph** as the v1, or do you want me to go straight to the **hover-peek + click-to-lock** version with the hover-intent timer? My vote is the first — it's calmer and works identically on mobile — but it's your call.
