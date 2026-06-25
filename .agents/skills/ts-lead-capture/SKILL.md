---
name: ts-lead-capture
description: Thread & Stack lead capture standard — every lead form must triple-fire (Notion sync + visitor confirmation email + admin email to br@brendanrodgers.uk), include GDPR consent, honeypot, role/organisation fields, and UTM attribution. Load when building or editing any form that captures a lead, signup, or enquiry.
---

# Thread & Stack Lead Capture Standard

Every form that captures a person on threadandstack.com follows this template. No exceptions.

## Mandatory triple-fire (fire-and-forget)

On successful submission, dispatch three side effects in parallel from the edge function (do not await on the client):

1. **Notion sync** — `supabase/functions/sync-lead-to-notion` — appends to the Leads database with source, UTM, role, organisation.
2. **Visitor confirmation email** — `supabase/functions/send-transactional-email` — branded confirmation to the submitter.
3. **Admin notification email** — to **br@brendanrodgers.uk** — short alert with the lead's name, source, and UTM.

If any one fails, the others still send and the client still sees success. Log failures to the function logs; never block the user.

## Form fields (standard set)

- `name` (required)
- `email` (required, validated)
- `role` (required) — British English label "Role"
- `organisation` (required) — British English spelling, never "organization" or "company"
- `message` (optional, free text)
- `source` (hidden) — short slug identifying the form, e.g. `homepage-hero`, `unleash-your-team-draft2-waitlist`
- UTM params (hidden, auto-populated from URL): `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`

## GDPR consent

- Explicit checkbox, unticked by default.
- Label: "I agree to be contacted by Thread & Stack and have read the [Privacy Policy](/privacy-policy)."
- Submission blocked until ticked. Required for EU compliance.

## Honeypot

- Invisible field named `website` or `company_url` — bots fill it, humans don't.
- If filled, return 200 OK to the bot but do not process the lead. See `mem://security/anti-spam-honeypot-implementation`.

## Preferred UI

Default to the **`DiagnosticDrawer`** with `initialMode="intro"` (`src/components/home-draft2/DiagnosticDrawer.tsx`). It implements the full qualification form (first/last name, email, role, company, website, annual revenue, employees), GDPR consent, honeypot, and the triple-fire. The primary CTA uses the primary warm gradient. A secondary "I'm ready to book my Diagnostic session now" link sits below.

Open it from any CTA with:
```tsx
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Book a free intro call</Button>
<DiagnosticDrawer
  open={open}
  onOpenChange={setOpen}
  source="my-page-cta"
  initialMode="intro"
  theme="light"
/>
```

The legacy `ContactDrawer` ("Let's Work Together") is being phased out — do not wire new CTAs to it. Use a custom inline form only when the surrounding UX genuinely requires it (e.g. a waitlist where the form *is* the page).

## Confirmation UX

After success, redirect to a dedicated `/thank-you/*` route so GA4/GTM fires a clean conversion event. See `mem://ux/conversion-tracking-thank-you-flow` for the mapping.

## References

- `src/components/ContactDrawer.tsx`
- `supabase/functions/sync-lead-to-notion/index.ts`
- `supabase/functions/send-transactional-email/index.ts`
- `mem://standards/lead-treatment-default`
- `mem://compliance/gdpr-consent-requirement`
- `mem://forms/role-organisation-field-standard`
- `mem://strategy/lead-generation-attribution-mapping`
