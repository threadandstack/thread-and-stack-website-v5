

# Multi-Password Portfolio Access Tracking

## What This Does

Instead of one password, you'll have a database table of password codes, each linked to a label (e.g. "linkedin-outreach", "client-acme", "event-brighton"). When someone enters a code, the system logs which code was used, when, and from where — giving you attribution data on who's viewing your portfolio and from which funnel.

## Database

**New table: `portfolio_access_codes`**

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| code | text (unique) | The password/code itself |
| label | text | Human-readable source label (e.g. "LinkedIn DM — April") |
| active | boolean | Enable/disable codes without deleting |
| created_at | timestamptz | When the code was created |

**New table: `portfolio_access_logs`**

| Column | Type | Purpose |
|---|---|---|
| id | uuid | Primary key |
| code_id | uuid (FK) | Which code was used |
| portfolio | text | Which portfolio was accessed (e.g. "creative", "notion") |
| user_agent | text | Browser/device info |
| created_at | timestamptz | Timestamp of access |

RLS: Public insert on logs (no auth needed), admin-only select on both tables. Codes table is admin-only for all operations.

## Edge Function Update: `verify-portfolio-password`

- Instead of comparing against a single env var, query `portfolio_access_codes` for a matching active code
- On match, insert a row into `portfolio_access_logs` with the code ID, portfolio name, and user agent
- Return `{ valid: true, label: "..." }` so the frontend can store the source label
- The existing `PORTFOLIO_PASSWORD` secret stays as a fallback master password

## Frontend Changes: `PasswordGate.tsx`

- Pass a `portfolio` prop (e.g. "creative") to identify which portfolio is being accessed
- Send `portfolio` and `userAgent` to the edge function alongside the password
- On success, store the returned `label` in sessionStorage for optional GA4 event tracking
- Fire a `trackEvent('portfolio_unlocked', { source: label, portfolio })` on successful unlock

## Admin Management

You'll manage codes directly via the backend — add rows to `portfolio_access_codes` with your chosen codes and labels. No admin UI needed initially, but one could be added to the existing admin dashboard later.

## Files Changed

| File | Change |
|---|---|
| Migration | Create `portfolio_access_codes` and `portfolio_access_logs` tables with RLS |
| `supabase/functions/verify-portfolio-password/index.ts` | Query DB instead of env var, log access |
| `src/components/PasswordGate.tsx` | Add `portfolio` prop, send metadata, track GA4 event |
| `src/pages/CreativePortfolioPage.tsx` | Pass `portfolio="creative"` to PasswordGate |

