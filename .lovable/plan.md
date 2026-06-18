## Plan: make Thread & Stack crawlable at the actual URLs

Claude and ChatGPT are seeing the key problem correctly: the public routes still return a mostly empty React shell to non-JavaScript crawlers. `/llms-full.txt` is useful, but it does not replace crawlable HTML at `/services`, `/blog`, `/notion-hackathon-london`, etc.

### What I’ll change

1. **Add static HTML snapshots for public routes**
   - Use a Vite-compatible prerender step that renders the app after build and writes real HTML into `dist/<route>/index.html`.
   - Keep the live site as a React app for users, but give crawlers full page content in the initial HTML.

2. **Prerender every indexable route**
   - Include main navigation and sitemap routes.
   - Include blog index and published blog post routes.
   - Exclude private/admin/proposal/onboarding/thank-you/variant routes already blocked in `robots.txt`.

3. **Keep `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt` aligned**
   - Ensure the prerender route list matches the sitemap and LLM files.
   - Add the full LLM document reference where helpful without relying on it as the only crawl path.

4. **Fix stale positioning risk**
   - Review the generated summaries in `scripts/generate-llms-full.ts` against the current public positioning, because Perplexity surfaced older language and the file currently contains some service names that may not match the new site direction.
   - Keep copy factual and current, with the two-pillar positioning from project memory unless the page itself says otherwise.

5. **Validate crawler-visible output**
   - Run the generator/build flow locally.
   - Check sample generated HTML for `/`, `/services`, `/blog`, and `/notion-hackathon-london` to confirm the body contains readable content without executing JavaScript.
   - Confirm `robots.txt` and `sitemap.xml` remain accessible and point to `https://threadandstack.com`.

### Technical approach

- Prefer `vite-plugin-prerender` if it works cleanly with the existing Vite setup.
- If that proves brittle, add a small custom post-build Playwright prerender script that:
  - serves the built app locally,
  - visits each public route,
  - waits for content to render,
  - writes the rendered DOM to route-specific `index.html` files.
- Keep this as a build-time step only. No backend migration and no move to Next.js/Remix in this pass.

### Outcome

Fresh crawls of real URLs should return meaningful HTML body content, page-level metadata, structured data, sitemap coverage, and LLM-friendly plain text rather than only the JavaScript shell.