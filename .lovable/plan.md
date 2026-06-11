# Mobile interactivity for the hero LogoTilt

Bring the desktop "discovery moment" to touch devices without permissions, prompts, or aimless idle motion. The logo pins inside the hero on small screens and tilts in response to scroll — the one gesture every mobile user makes within the first second. Touch drag remains silently available on top for anyone who happens to try it.

## Behaviour

**Desktop (≥768px)** — unchanged. Mouse-move drives the existing 3D tilt, indigo radial reveal, and drop shadows.

**Mobile (<768px)**
1. **Sticky pin during the hero.** The logo's wrapper becomes `sticky` near the top of the viewport while the user scrolls the first ~100vh. Once the hero section scrolls past, the logo releases and flows away naturally with the rest of the page.
2. **Scroll-linked tilt.** An IntersectionObserver + scroll listener measures the logo's position relative to the viewport centre. That progress (roughly -1 → 0 → +1 as the hero scrolls past) drives the same `--tx`, `--ty`, `--sx`, `--sy` CSS variables the desktop hover already uses. The same indigo-glow reveal and shadow logic light up — no new visual language.
   - Tilt range: ±8° X / ±6° Y (slightly stronger than mouse so the effect reads clearly on small viewports).
   - The radial mask centre (`--mx`, `--my`) sweeps diagonally with scroll so the indigo glow travels across the mark.
3. **Touch drag bonus.** `onTouchMove` / `onTouchEnd` mirror the existing `onMouseMove` / `onMouseLeave` handlers. A finger drag temporarily overrides the scroll-driven values, then releases back to scroll control after touch end. No hint, no affordance — pure easter egg for the curious.

## Edge cases & guardrails

- `prefers-reduced-motion: reduce` → disable scroll-linked tilt and touch drag; logo stays still. Sticky pin remains so layout is consistent.
- The sticky pin uses a hero-scoped container so it never bleeds into sections below.
- All transforms route through the existing CSS variables, so the indigo mask, shadows, and 200ms easing stay identical to desktop — no parallel animation system.
- Scroll listener is `passive: true` and throttled via `requestAnimationFrame` to keep the hero buttery on low-end devices.
- Breakpoint switch (resize crossing 768px) cleanly tears down the scroll listener and observer.

## Files

- `src/components/home-draft2/LogoTilt.tsx` — add the mobile branch (sticky wrapper, scroll listener, touch handlers, reduced-motion guard). Desktop path untouched.
- `src/components/home-draft2/Hero.tsx` — no change expected; the sticky behaviour lives inside `LogoTilt` so the Hero layout stays as-is. If the existing `fade-up mb-8` wrapper interferes with `position: sticky`, move the sticky onto the wrapper inside `LogoTilt` itself.

## Out of scope

- Gyroscope / `deviceorientation` (ruled out — permission prompt feels invasive).
- Auto-orbit or idle drift (ruled out — reads as a gimmick).
- Any new visual element, hint pill, or affordance text near the logo.
