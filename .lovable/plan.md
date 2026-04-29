I found the likely root cause: the app’s `index.html` has a strict Content Security Policy that does not allow Stripe’s scripts or checkout iframe domains.

Currently it allows scripts from the site itself, Google Tag Manager, and Google Analytics only:

```text
script-src ... https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com
frame-src ... google/youtube/vimeo/loom
connect-src ... supabase/google/notion
```

But Embedded Checkout needs at minimum Stripe script/frame/connect permissions. That means Chrome/Dia can be working perfectly with no VPN/ad blocker, while the browser still refuses to load Stripe because the site itself tells it not to.

## Plan

1. Update the Content Security Policy in `index.html`
   - Add Stripe script domains, especially `https://js.stripe.com`.
   - Add Stripe frame domains, especially `https://js.stripe.com` and `https://checkout.stripe.com`.
   - Add Stripe connection domains such as `https://api.stripe.com` and any required Stripe telemetry endpoints used by Stripe.js.
   - Keep the existing Google, Notion, media, and font allowances intact.

2. Improve the checkout error messaging
   - Replace the generic “network/ad-blocker issue” wording with a clearer message that includes possible site security-policy blocking.
   - Keep the friendly fallback but avoid implying the user’s browser/network is definitely at fault.

3. Improve retry/reset behaviour
   - Keep the Stripe loader reset already added.
   - Also reset `submitting` when returning from checkout failure to the form so the drawer cannot get stuck in a disabled “Starting checkout…” state.

4. Verify in preview
   - Open `/charity-meetup-april26`.
   - Fill the drawer form and consent checkbox.
   - Click “Continue to payment”.
   - Confirm that the embedded Stripe checkout form loads instead of the fallback error.
   - Check console/network for CSP or Stripe loading errors.

## Test card after the form loads

Use Stripe’s test card in the embedded form:

```text
Card: 4242 4242 4242 4242
Expiry: any future date
CVC: any 3 digits
Postcode: any valid-looking postcode/ZIP
```

For declined-payment testing later:

```text
Card: 4000 0000 0000 0002
```

## Expected result

The checkout should stop failing at the Stripe.js load step. If the next error appears after this, it will likely be a payment/session-level issue rather than the browser refusing to load Stripe’s assets.