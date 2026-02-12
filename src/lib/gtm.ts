const GTM_ID = 'GTM-KXN493L8';

export function loadGTM() {
  // Prevent loading twice
  if (document.querySelector(`script[src*="googletagmanager.com/gtm.js"]`)) {
    return;
  }

  // Push gtm.start event
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  // Inject GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}

// Window.dataLayer type is declared in useAnalytics.ts
