## Notion Masterclass — Hero & Problem section refinements

Three focused tweaks to `src/pages/NotionMasterclassPage.tsx`. No new files, no dependency changes.

### 1. Tighten hero copy

Make the hero punchier and less wordy — keep the editorial italic feel but reduce visual length.

- **Headline**: drop the second line's verbosity.
  - From: *"The Notion Masterclass for founders who want a system that sticks."*
  - To: *"The Notion Masterclass for founders who want a system that sticks."* (keep), but tighten the line break — remove "for founders who want" mid-line padding by restructuring as two short lines: line 1 *"The Notion Masterclass"*, line 2 *"for founders who want a system that sticks."* — already mostly there; reduce max-width so it breaks tighter.
- **Sub-paragraph**: shorten from three clauses to one.
  - From: *"Ninety minutes to swap a tangle of tabs, half-built templates and 'I'll fix it later' workarounds for one Notion workspace that quietly runs the day-to-day of your business."*
  - To: *"Ninety minutes to turn a tangle of tabs and half-built templates into one workspace that quietly runs your business."*
- **Fine print**: trim slightly.
  - To: *"Includes the recording, workspace template, and £100 credit toward Notion & Systems Consultancy."*
- Reduce hero vertical padding a touch (`pt-32 md:pt-40 lg:pt-44`) since copy is shorter, keeping breathing room without feeling sparse.

### 2. Give "The Problem" the indigo treatment

Currently uses `bg-muted/30`. Convert to the same dark indigo tier as the Framework section so the page now has a clear two-tier rhythm: light (hero) → indigo (problem) → light (who it's for) → light (what you'll master) → light (testimonial) → indigo (framework) → …

Apply to the existing `{/* THE PROBLEM */}` section:

- Wrapper: `relative py-24 px-6 bg-indigo text-indigo-foreground overflow-hidden`
- Add the same soft glow accents used in the Framework section (two absolute `blur-3xl` white circles at low opacity) to preserve the subtle indigo glow aesthetic.
- Eyebrow: `text-indigo-foreground/60`
- Headline: `text-indigo-foreground`, with the emphasised word *"system"* set to `text-white` (or `text-indigo-foreground` with underline accent) instead of `text-accent`, since accent indigo on indigo background loses contrast. Use a soft white `Emphasis` underline for the brand cue.
- Body copy: `text-indigo-foreground/80`.

### 3. Fade backgrounds rather than hard edges

Replace abrupt `bg-muted/30` and `bg-indigo` block transitions with gradient fades so each band blends into the next.

Approach: add a thin gradient "fader" strip at the top and bottom of the tinted sections that transitions from the previous/next section's background colour into the section's own colour. Simple, no extra components needed:

```tsx
{/* Top fade */}
<div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
{/* Bottom fade */}
<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
```

For the indigo tier sections, the fade strips use `from-background` (the surrounding light background) so the indigo blends in/out softly instead of a hard edge. Apply to:

- The Problem (newly indigo)
- The Framework (already indigo)
- The "What you'll master" (`bg-muted/30`) — use `from-background` fades so the muted strip dissolves into the white sections above/below.
- The Final CTA indigo band (lines beyond what's shown — same treatment).

Each section needs `relative overflow-hidden` (most already do) and the fade divs placed as the first children inside the section, behind content (`-z-0` on faders or simply place them before the content div which already has `relative`).

### Out of scope

- No copy changes outside the hero.
- No new components, routes, or data changes.
- The indigo glow accents and existing scroll-fade `Reveal` behaviour are preserved exactly.

### File touched

- `src/pages/NotionMasterclassPage.tsx`
