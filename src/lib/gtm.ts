const GTM_ID = 'GTM-KXN493L8';

export function loadGTM() {
  // Prevent loading twice
  if (document.querySelector(`script[src*="googletagmanager.com/gtm.js"]`)) {
    return;
  }

  // Push gtm.start event
  window.dataLayer = window.dataLayer || [];

  // GTM does not define window.gtag, so custom events would be dropped.
  // This shim pushes the raw arguments object, which is what the Google tag
  // running inside the container reads.
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer!.push(arguments);
    };

  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  // Inject GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}

// Window.dataLayer type is declared in useAnalytics.ts
