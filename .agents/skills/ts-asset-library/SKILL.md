---
name: ts-asset-library
description: Thread & Stack image, logo, and asset conventions — current logo set (ungradiented + Indigo/Grey/Black/White SVGs), retired gradient blue logo, photography directories, Notion mock screenshots, focal-point picker, asset-pointer (.asset.json) workflow. Load when adding, swapping, or referencing any image or logo asset.
---

# Thread & Stack Asset Library

## Logos — current set

Active logos live in `src/assets/logos/` as SVG. Each name follows `{Colour}_TS_{Form}.svg`:

| Colour | Stacked | Wordmark | SocialSq |
|---|---|---|---|
| Grey | ✅ default | ✅ | ✅ |
| Indigo | ✅ accent / hover | ✅ | ✅ |
| Black | ✅ | ✅ | ✅ |
| White | ✅ (dark bg) | ✅ | ✅ |

Default usage: **Grey Stacked** in nav (collapses to wordmark on scroll), hover transitions to **Indigo**. On dark/Night backgrounds use **White**.

## Retired logos — do not re-import

- **Gradient blue logo** (legacy 2024 mark, blue gradient swoosh): removed from active use. Do not import even if you find it in `public/` archives.
- Any pre-rebrand "T&S" wordmark from before Crimson Pro adoption.

When in doubt, the `/brand-book` route is the authoritative list of in-use logos.

## Photography

| Path | Subject | Use |
|---|---|---|
| `src/assets/photos/workshop/` | Workshop / facilitation shots (brendan-1 → brendan-25) | Service pages, About, journal |
| `src/assets/photos/shoreditch/` | Shoreditch studio environmental (brendan-26 → brendan-37) | Hero panels, narrative break-outs |
| `src/assets/photos/portraits/` | Founder portraits (brendan-4 → brendan-17) | About, CV, social, journal author |

Format: WebP for hero/banner, JPG for headshots above 600px square (WebP compression artifacts show on faces — see `mem://technical/hero-focal-point-management`).

Preferred founder portrait: `brendan-34-square.jpg` (1000×1000, JPG).

## Notion mocks

`src/assets/notion-mock/` — interactive screenshots of Notion workspaces used on the Notion & Systems consultancy page. Always present inside a Tilt3D card with rounded corners and soft shadow.

## Service pillar cards

**Landscape orientation only** (16:9 or 3:2). Portrait crops break the masonry rhythm. See `mem://design/offers-grid-styling`.

## Focal-point management

Use the focal-point picker pattern (`mem://technical/hero-focal-point-management`) to set `object-position` per image when faces or focal elements need to stay on-screen across breakpoints. Don't eyeball it.

## Asset-pointer workflow (.asset.json)

Binary files above ~100KB should live on the Lovable CDN via `.asset.json` pointers, not in the git repo. Use the `migrate-to-assets` skill for the full workflow. Quick version:

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

## Global named assets

See `mem://assets/global-and-fiction-assets` for the OG image path, favicon set, and any other globally-referenced asset paths.

## References

- `src/components/BrandBook.tsx` (live logo + photography catalogue)
- `mem://assets/global-and-fiction-assets`
- `mem://design/offers-grid-styling`
- `mem://technical/hero-focal-point-management`
