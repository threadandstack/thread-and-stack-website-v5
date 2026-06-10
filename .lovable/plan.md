## Replace "Knowledge Lake" with "Knowledge Base"

### Goal
Remove the branded/conflicting "Knowledge Lake" term everywhere it functions as a product or system name. Replace with "Knowledge Base" (plain, universally understood). Keep a medium depth of water metaphor in select poetic copy where the imagery is the point.

### What changes

| File | What to replace |
|------|-----------------|
| `src/components/home-draft2/Hero.tsx` | "Knowledge Lake" → "Knowledge Base" |
| `src/components/home-draft2/Problem.tsx` | "knowledge lake" → "knowledge base"; "the lake" → "the base" |
| `src/components/home-draft2/Scorecard.tsx` | "Knowledge Lake Starter" → "Knowledge Base Starter"; "five-layer lake" → "five-layer base" |
| `src/components/home-draft2/Engagements.tsx` | "Knowledge Lake Starter" → "Knowledge Base Starter"; "the lake" → "the base"; "five-layer Knowledge Lake" → "five-layer Knowledge Base" |
| `src/components/home-draft2/FAQ.tsx` | "You own the lake" → "You own the base"; "The lake keeps growing" → "The base keeps growing" |
| `src/pages/proposal/SFFireProposalPage.tsx` | "knowledge lake" → "knowledge base" |
| `src/pages/proposal/LSSProposalPage.tsx` | "knowledge lake" → "knowledge base"; "Knowledge lake" (table row) → "Knowledge base"; "Notion knowledge lake" → "Notion knowledge base" |

### What stays (medium metaphor depth)

- **LSS Proposal heading**: "From walls and dams to lakes and rivers" — kept as a poetic metaphor, not a product name.
- **LSS Pull quote**: "Own the lake. Let the rivers come and go." — kept; the water imagery is the literary device here.
- **Problem.tsx Compound phase**: "the deeper the base becomes — filling with knowledge, resource, and value" — the water logic remains in the verb "filling" even though "lake" is replaced by "base".

### Not in scope

- No changes to Notion page titles, database names, or external links. Those are outside the code.
- No changes to the "Knowledge Infrastructure Build" tier name (it already avoids "Lake").