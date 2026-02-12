

# Cookie Consent Banner for GDPR Compliance

## What this does
Adds a cookie consent banner that appears site-wide for first-time visitors, allowing them to accept or decline non-essential cookies (primarily Google Tag Manager / GA4 tracking). Their choice is remembered via localStorage so the banner only appears once.

## How it works
- A new `CookieConsent` component renders as a fixed banner at the bottom of the screen
- On first visit, GTM scripts are blocked until the user accepts cookies
- If the user declines, GTM remains disabled for that session and future visits
- The choice is stored in `localStorage` (not a cookie itself, avoiding circular consent issues)
- A link to the existing Privacy Policy page is included in the banner

## User experience
- Small, non-intrusive banner at the bottom of the page with "Accept" and "Decline" buttons
- Brief explanation: "We use cookies to analyse site traffic and improve your experience"
- Link to `/privacy` for full details
- Banner disappears after a choice is made and doesn't return

## Technical details

### 1. New component: `src/components/CookieConsent.tsx`
- Checks `localStorage` for a `cookie-consent` key on mount
- If no choice stored, shows the banner
- "Accept" sets `cookie-consent: accepted` and initialises GTM
- "Decline" sets `cookie-consent: declined` and does nothing further
- Styled to match the existing design system (muted background, small text, accent buttons)

### 2. Update `index.html`
- Remove the existing inline GTM script from the `<head>` so it doesn't fire before consent
- Remove the GTM `<noscript>` iframe from `<body>`

### 3. New utility: `src/lib/gtm.ts`
- A small helper function `loadGTM()` that dynamically injects the GTM script when called
- Only called after the user clicks "Accept"
- Also called on page load if `localStorage` already contains `cookie-consent: accepted`

### 4. Update `src/App.tsx`
- Add `<CookieConsent />` inside the router so it renders on every page

### 5. Consent check on return visits
- On mount, if consent was previously accepted, GTM loads automatically
- If declined, nothing loads — no tracking scripts run

