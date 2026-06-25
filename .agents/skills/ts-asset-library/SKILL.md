---
name: ts-asset-library
description: Thread & Stack image, logo, and asset conventions. Canonical inventory lives at /brand-book §15; this skill embeds the lookup table so an agent can find the right asset without navigating there. Retired gradient blue logo is permanently out. Load when adding, swapping, or referencing any image or logo asset.
---

# Thread & Stack Asset Library

The canonical asset reference is `/brand-book` §15. This skill is the agent-side lookup so cold sessions don't need to navigate there for routine work.

## Quick lookup

| Need | Path |
|---|---|
| Logos (SVG, all variants) | `src/assets/logos/` |
| Workshop photography | `src/assets/photos/workshop/` |
| Shoreditch studio photography | `src/assets/photos/shoreditch/` |
| Portrait photography | `src/assets/photos/portraits/` |
| Preferred founder portrait | `src/assets/photos/brendan-34-square.jpg` (1000×1000 JPG) |
| Notion workspace mocks | `src/assets/notion-mock/` |
| Tool / brand logos | `src/assets/tool-logos/` |
| Journal mark | `src/assets/journal-logo-*.png` |
| Creative pillar marks | `src/assets/thread-stack-creative-*.png` |
| Default OG image | `src/assets/OpenGraph_TS2026.png` |

## Logos — current 12-file set

Active logos in `src/assets/logos/`. Naming: `{Colour}_TS_{Form}.svg`.

| Colour | Stacked | Wordmark | SocialSq |
|---|---|---|---|
| Grey | ✅ default | ✅ | ✅ |
| Indigo | ✅ accent / hover | ✅ | ✅ |
| Black | ✅ | ✅ | ✅ |
| White | ✅ (dark bg) | ✅ | ✅ |

Default usage: **Grey Stacked** in nav (collapses to wordmark on scroll); hover transitions to **Indigo**. On dark backgrounds use **White**.

## Retired — do not reintroduce under any circumstances

- **Gradient blue logo** (legacy 2024 mark, blue gradient swoosh). Not imported anywhere in the active codebase. Do not re-import even if you find it in `public/` archives.
- Any pre-rebrand T&S wordmark from before Crimson Pro adoption.

## Photography

Format guidance:
- **WebP** for hero / banner / lightweight surfaces.
- **JPG** for headshots above 600px square (WebP compression artifacts show on faces — see `mem://technical/hero-focal-point-management`).

The complete photography inventory is rendered live in `/brand-book` §12 via a Vite glob on `src/assets/photos/`. If you add an image to one of the three buckets, the brand book picks it up on next build.

## Notion mocks

`src/assets/notion-mock/` — interactive screenshots of Notion workspaces used on the Notion & Systems consultancy page. Always present inside a Tilt3D card with rounded corners and soft shadow.

## Service pillar cards

**Landscape orientation only** (16:9 or 3:2). Portrait crops break the masonry rhythm. See `mem://design/offers-grid-styling`.

## Focal-point management

Use the focal-point picker pattern (`mem://technical/hero-focal-point-management`) to set `object-position` per image when faces or focal elements need to stay on-screen across breakpoints. Don't eyeball it.

## Asset-pointer workflow (.asset.json)

Binary files above ~100KB should live on the Lovable CDN via `.asset.json` pointers, not in the git repo. Quick version:

```bash
lovable-assets create --file src/assets/foo.png > src/assets/foo.png.asset.json
rm src/assets/foo.png
```

Then import the JSON and use its `.url`:
```tsx
import fooAsset from "@/assets/foo.png.asset.json";
<img src={fooAsset.url} alt="..." />
```

Do not hand-write the pointer JSON.

## References

- `/brand-book` §15 — canonical asset inventory
- `/brand-book` §12 — full photography catalogue
- `mem://design/offers-grid-styling`
- `mem://technical/hero-focal-point-management`
