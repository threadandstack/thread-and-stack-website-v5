
# Xero handoff for diagnostic bookings

Keep the embedded Stripe checkout exactly as it is. When a booking flips to `paid` (in both `confirm-power-hour-checkout` and `payments-webhook`), also push it to Xero: find-or-create the contact, create an AUTHORISED invoice with a discount line if a coupon was used, and mark it paid against a Stripe clearing bank account so it reconciles cleanly.

## A note on naming

Everything the buyer, Xero, or Stripe sees will say **Diagnostic** — invoice line items, invoice references, PaymentIntent descriptions, admin UI labels, transactional emails. The existing internal names (`power_hour_bookings` table, `create-power-hour-checkout` / `confirm-power-hour-checkout` edge functions, `PowerHourBookingDrawer` component, `/power-hour/thank-you` route) stay as they are — renaming those is a much bigger refactor with real risk (existing bookings, Stripe metadata already referencing `power_hour_*`, deep links, the return URL in production Stripe sessions). Happy to do that rename as a separate, dedicated pass if you want; it should not be tangled with the Xero work.

Concretely, in this plan:
- Invoice line 1 description: `AI Diagnostic — 1:1 with Brendan`.
- Invoice `Reference`: `Diagnostic — {source}{coupon?}`.
- PaymentIntent + Stripe invoice `description`: `AI Diagnostic`.
- Admin Xero card label: "Diagnostic bookings".

I will also update the two existing places in `create-power-hour-checkout` that currently pass `productDescription` (which resolves to the Stripe product name) to instead use the fixed string `"AI Diagnostic"` if the product name still reads "Thread & Stack Diagnostic" or similar — I'll verify the current product name and only override if it isn't already right.

## One-time setup (you'll do this)

1. Xero app is created and `XERO_CLIENT_ID` / `XERO_CLIENT_SECRET` are saved.
2. Confirm the redirect URI on the Xero app is exactly:
   `https://uohhfesyumigbpqjpacl.supabase.co/functions/v1/xero-oauth-callback`
3. In Xero → **Accounting → Advanced → Chart of Accounts**, note two account codes:
   - A **revenue** account for consulting income (e.g. `200 Sales`).
   - A **bank/clearing** account representing Stripe payouts (e.g. `Stripe Clearing`). Payments get applied here; Xero's bank rules then match real Stripe payouts to it.
4. Once the code is built, click a one-time "Connect Xero" button in the admin area to authorise the org. That stores the refresh token; nothing else is manual after that.

## What gets built

### Secrets
- `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET` — done.
- `XERO_REVENUE_ACCOUNT_CODE` (default `200`) and `XERO_STRIPE_CLEARING_ACCOUNT_CODE` — settable as secrets so you can change without a redeploy.

### DB (one migration)
- `xero_connection` table (single row): `tenant_id`, `tenant_name`, `refresh_token`, `access_token`, `access_token_expires_at`, `updated_at`. Service-role only.
- `power_hour_bookings` (existing table — kept for compatibility): add nullable `xero_contact_id`, `xero_invoice_id`, `xero_invoice_number`, `xero_synced_at`, `xero_sync_error`, `discount_amount` (integer pence, so the sync doesn't have to re-derive coupon math).

### Edge functions (new)
- `xero-oauth-start` — admin-only: returns the Xero authorise URL with `offline_access accounting.contacts accounting.transactions` scopes and a state nonce.
- `xero-oauth-callback` (`verify_jwt = false`) — exchanges the code, fetches `/connections` to pick the tenant, writes to `xero_connection`. Redirects back to `/admin` with a success flag.
- `_shared/xero.ts` — helper: `getXeroAccessToken()` auto-refreshes when <60s to expiry using the stored refresh token, rotates the stored refresh token on every refresh, plus `xeroFetch(path, init)` that injects `Authorization` and `Xero-Tenant-Id`.
- `sync-booking-to-xero` — internal, invoked with service-role:
  - Input: `bookingId`. Idempotent: if `xero_invoice_id` already set, exits.
  - **Contact match:** `GET /Contacts?where=EmailAddress=="…"`. If none, fallback on exact `Name`. If none, `POST /Contacts` with name + email + optional company from `role_org`.
  - **Invoice:** `POST /Invoices` with `Type: ACCREC`, `Status: AUTHORISED`, contact, `Reference: "Diagnostic — {source}{coupon?}"`, dated today.
    - Line 1: `AI Diagnostic — 1:1 with Brendan`, qty 1, £395.00, `AccountCode: XERO_REVENUE_ACCOUNT_CODE`, `TaxType: NONE` (not VAT registered).
    - Line 2 (only if coupon): `Discount ({couponCode})`, qty 1, `-<discountGBP>`, same account, `TaxType: NONE`.
  - **Payment:** `POST /Payments` against the invoice, `Account: { Code: XERO_STRIPE_CLEARING_ACCOUNT_CODE }`, `Amount: amount_paid/100`, `Reference: stripe_session_id`.
  - Stores contact/invoice ids + number + `xero_synced_at`. On failure, writes `xero_sync_error` and returns 500 (booking + Stripe payment untouched).

### Wiring into paid handlers
In `confirm-power-hour-checkout` and `payments-webhook`, inside the existing `justPaid` branch, fire `supabase.functions.invoke("sync-booking-to-xero", { body: { bookingId } })` alongside the email jobs in the same `Promise.allSettled`. Xero failure never blocks the buyer or admin email.

### Admin UI (small)
- On `/admin`, add a "Xero" card:
  - Status pill: "Not connected" / "Connected to {org name}".
  - "Connect Xero" / "Reconnect" button → hits `xero-oauth-start`, opens the returned URL.
- Diagnostic bookings list shows `xero_invoice_number` linking to `https://go.xero.com/AccountsReceivable/View.aspx?InvoiceID={id}`, plus any `xero_sync_error` and a per-row "Retry Xero sync" button.

## Deliberately out of scope
- **Renaming the internal `power_hour_*` tables/functions/component/route to `diagnostic_*`.** Real risk (breaks existing bookings, Stripe metadata references, production return URLs); do it as its own pass.
- **Recording the Stripe fee** as a bank fee line — Xero's Stripe bank feed handles this. Clearing-account approach keeps invoices gross.
- **Backfilling the two orphan payments** (Jocelyn, Cali) — separate manual pass; easy to add an admin action later.
- **VAT.** Every line `TaxType: NONE`. One variable to flip if you register later.
- **Auto-emailing invoices from Xero.** Off — your own transactional emails carry the invoice number.

## Order of implementation
1. Migration (columns + `xero_connection` with grants).
2. `_shared/xero.ts` + OAuth start/callback functions.
3. Add `XERO_REVENUE_ACCOUNT_CODE` + `XERO_STRIPE_CLEARING_ACCOUNT_CODE` secrets; you complete the one-time Xero connect.
4. `sync-booking-to-xero` + wire into `confirm-power-hour-checkout` and `payments-webhook`.
5. Admin UI card + retry button.
6. End-to-end sandbox test: Stripe checkout with the £100-off coupon → verify contact + invoice + payment appear in your Xero demo org, then a full-price run.
