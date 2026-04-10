

# Site Performance, SEO and Security Hardening

## Context

Claude's analysis flagged real issues: a 2.37MB monolithic JS bundle, no sitemap, missing CSP header, and a heavy Google Fonts payload. Some of these are solvable within Lovable's architecture (React SPA on Lovable hosting), others have constraints worth noting.

## What We Can Fix

### 1. Route-based code splitting (biggest bundle impact)

Currently all 40+ page components are eagerly imported in `App.tsx`. Converting these to `React.lazy()` with `Suspense` boundaries will split the 2.37MB bundle into per-route chunks. Only the homepage code loads on first visit; other pages load on navigation.

**Approach**: Replace all page imports in `App.tsx` with lazy imports, wrap `Routes` in a `Suspense` fallback. Group admin pages together since they share dependencies.

### 2. Generate a static sitemap.xml

Create a build-time script that reads the route definitions from the codebase and generates a `public/sitemap.xml` with all public routes (excluding admin, private, legacy redirects, and variant pages). Add a `Sitemap:` directive to `robots.txt`.

### 3. Trim Google Fonts payload

The current font request loads:
- **Crimson Pro**: 9 weights (400-900 + 3 italic) — only `font-semibold` and `font-bold` italic are used
- **Crimson Text**: 3 weights + 1 italic — used as `font-serif` fallback
- **Inter**: 4 weights (300-600)

We can cut this to:
- **Crimson Pro**: 400, 500, 600, 700 + italic for 400, 500, 600 (drop 800, 900)
- **Crimson Text**: 400, 600 + italic 400
- **Inter**: 400, 500, 600 (drop 300)
- Add `&display=swap` (already present) and `&text=` subsetting isn't practical here, but weight reduction alone saves ~40% of the font payload

### 4. Add preload hints for critical resources

Add `<link rel="preload">` for the primary font files and the hero image/logo to improve LCP.

### 5. CSP meta tag

Since Lovable hosting doesn't expose server config for response headers, we can add a `<meta http-equiv="Content-Security-Policy">` tag in `index.html`. This covers most CSP directives (though not `frame-ancestors`). The policy will allowlist the domains actually used: Google Fonts, Supabase, Cloudflare, GTM.

### 6. Update robots.txt with sitemap reference

Add `Sitemap: https://threadandstack.com/sitemap.xml` to `robots.txt` and also disallow admin routes from crawling.

## What We Cannot Fix in Lovable

- **SSR/SSG**: Lovable is a client-side React SPA. There is no server-side rendering option. The `<div id="root"></div>` pattern is structural. This is the main LCP limiter on slow mobile connections, and it's an architecture constraint.
- **Server-side response headers**: Lovable hosting doesn't expose header configuration. CSP via meta tag is the best available option. HSTS and other headers come from Cloudflare.
- **Lighthouse CI in deployment pipeline**: Not available in Lovable's build system.

## Files Changed

| File | Change |
|---|---|
| `src/App.tsx` | Convert ~40 page imports to `React.lazy()`, add `Suspense` wrapper |
| `index.html` | Trim font weights, add preload hints, add CSP meta tag |
| `public/robots.txt` | Add Sitemap directive, disallow `/admin/` |
| `public/sitemap.xml` | New static file with all public routes |

## Expected Impact

- **Bundle**: Initial load drops from ~2.37MB to roughly 400-600KB (core framework + homepage only)
- **LCP**: Improved by reduced parse/execute time, though still limited by client-side rendering
- **SEO**: Sitemap returns 200, crawlers find all routes, admin pages excluded
- **Security**: CSP header present, security score improves
- **Fonts**: ~40% reduction in font download size

