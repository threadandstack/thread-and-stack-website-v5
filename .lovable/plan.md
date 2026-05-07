## Goal

Create a general-purpose lead magnet landing page modelled on `/charity-meetup-april26`, repositioned for any purpose-driven / impact-focused team. Same resources, same email gate, same Power-Hour offer — but with a new headline, framing, and a 15% off coupon (`IMPACT15`).

## New route

- `src/pages/UnleashYourTeamPage.tsx` mounted at:
  - `/unleash-your-team` (canonical)
  - `/Unleash-Your-Team` (case-insensitive convenience, mirroring the existing pattern)
- Registered in `src/App.tsx` alongside the charity meetup routes (lazy-loaded).

## Page content

Built from the same components as `CharityMeetupApril26Page` (avatar + logo, gradient headline, email-gate card, three resource cards, 4 C's / 4 D's framework, LinkedIn + email CTAs, Footer, `PowerHourBookingDrawer`).

Differences:

- **Eyebrow**: "For purpose-driven teams · AI that frees you up"
- **Headline (gradient)**: *"Unleash your team's power"* with sub-line: *"AI workflows that free your team to be more strategic and creative."*
- **Intro copy** — reframed for impact-led orgs (charities, social enterprises, mission-driven teams). Names the "creative tax" / admin chaos and positions AI as a way to reclaim time for strategy and creative work, not to replace people. Removes Charity Meetup / Oliver Wyman / Dawn Newton references.
- **Resources**: same three Notion links and copy (already evergreen).
- **Email gate**: same component pattern; lead `source = "unleash-your-team-resources"` so we can attribute leads separately. Same consent + honeypot + sessionStorage unlock key (`unleash-your-team-resources-unlocked`).
- **Power-Hour offer card**: copy updated to "15% off — for purpose-driven teams". Shows £395 → £335.75 (15% off), voucher `IMPACT15`, no "first 10 claimed" line (we can frame it as an ongoing offer for impact-led teams). Opens `PowerHourBookingDrawer` with `source="unleash-your-team"` and `defaultCoupon="IMPACT15"`.
- **Frameworks (4 C's / 4 D's)** and **Stay connected** sections kept verbatim — they're brand-level.

## Coupon plumbing — `IMPACT15` (15% off)

The existing flow only supports the £100 flat-rate `CHARITYMEETUP100` coupon. We need to add a second coupon without breaking the first.

### `src/components/PowerHourBookingDrawer.tsx`

- Replace the single-coupon constants with a small lookup:
  ```ts
  const COUPONS = {
    CHARITYMEETUP100: { kind: "amount", amountOff: 10000, label: "£100 off" },
    IMPACT15:         { kind: "percent", percentOff: 15,  label: "15% off" },
  } as const;
  ```
- Compute `displayedTotal` from the matched coupon (flat amount or percent of `FULL_PRICE`, rounded to nearest pence).
- Update the green confirmation row to show the coupon's own label (e.g. "Coupon IMPACT15 — 15% off") instead of the hard-coded charity copy.
- `couponLooksValid` becomes "is the normalized code a key in `COUPONS`".

### `supabase/functions/create-power-hour-checkout/index.ts`

- Replace the single `COUPON_CODE` / `COUPON_DISCOUNT_PENCE` constants with a `COUPONS` map keyed by code, each entry holding either `{ kind: "amount", amountOff }` or `{ kind: "percent", percentOff }`, plus a `maxUses` (keep `CHARITYMEETUP100` at 10; `IMPACT15` set to a higher cap, e.g. 100, since it's an ongoing impact-org offer).
- Validation flow:
  1. Normalise the code; reject if not in the map.
  2. Use the existing `count_coupon_redemptions` RPC against the normalized code; reject if `>= maxUses` for that coupon.
- Stripe coupon creation: derive a deterministic Stripe coupon id per code + env, e.g. `impact15_v1_${env}` / keep `charitymeetup100_v2_${env}`. For percent coupons, create with `percent_off: 15` instead of `amount_off`. For amount coupons, keep current behaviour.
- Pass through `coupon_code: couponNormalized` on the booking insert and metadata as today, so attribution works for both.

The `count_coupon_redemptions` RPC already takes the code as an argument, so no DB migration is required — `IMPACT15` redemptions will be counted naturally as bookings come in with that code stored in `power_hour_bookings.coupon_code`.

## Tracking / attribution

- Lead capture uses `source: "unleash-your-team-resources"`.
- Power-Hour bookings from this page will land with `source: "unleash-your-team"` and `coupon_code: "IMPACT15"`, so you can pull them out the same way you pulled the charity meetup numbers.

## Out of scope

- No changes to the existing `/charity-meetup-april26` page or its coupon.
- No new database columns or migrations.
- No new edge function — we extend the existing `create-power-hour-checkout`.
- No sitemap / nav changes (this is a direct-link lead magnet, like the charity page).
