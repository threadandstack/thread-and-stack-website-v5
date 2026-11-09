# Notion-controlled agent documents

## Created

The **LLMs.txt** page now exists in the publishing library with **Live - Non Blog** status. It contains a public-page index and agent guidance, excluding password-gated portfolios, private proposals and administration pages.

## Proposed sync

- Refresh the Notion document every five minutes in the background and serve saved Markdown, never a live Notion request when an agent reads it.
- Keep the last successful version if Notion is unavailable or the document fails validation.
- Support an independently editable **LLMs-full.txt** page in the same library. Do not automatically include all website pages, since that risks exposing retired or restricted material.
- Validate the short index against the llms.txt format before replacing the saved version.
- Check an initial sync and the public text response end to end, including an edit-and-refresh check.

## Hosting limitation and delivery

The previous explanation overstated what the current hosting can do. The website is a static app: `/llms.txt` and `/llms-full.txt` are published files. A scheduled function cannot overwrite those hosted files. No supported root-path proxy was found.

The implementation can expose automatically refreshed plain-text documents at a separate public endpoint. The existing root files can link to that endpoint after a website update, but their own contents will remain publication-time snapshots.

To have **the root URLs themselves** update without publishing, an external reverse proxy under your control is required, or a separately scoped migration to server-rendered hosting. Neither change is included here. No user-agent redirects or JavaScript-only text pages will be added.

## Technical details

- Add a protected-write, public-read document cache and two edge functions: scheduled Notion-to-Markdown sync and cache-only text delivery.
- Verify the existing Notion connection configuration before selecting gateway credentials. Leave existing blog sync behaviour unchanged.
- Use the managed scheduling authentication setup. Five-minute refresh means 288 checks daily and up to five minutes of expected content delay; recurring checks can increase Cloud costs even when content is unchanged.
- Add tests for publication status, allowed document names, format validation and rejection of restricted links.
- Update the static-document generation to use validated cache snapshots rather than overwrite Notion-managed content with hardcoded copy.
- Do not publish the website automatically.

## Approval scope

Proceed with the separate automatically refreshed endpoint and publication-time root snapshots. Root-URL live updates remain dependent on additional hosting setup.