// GA4 Analytics Hook — Centralized tracking for all custom events


declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type EventParams = Record<string, string | number | boolean | undefined>;

export const trackEvent = (eventName: string, params?: EventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log(`[GA4] ${eventName}`, params);
  }
};

// Conversion Events
export const trackNewsletterSignup = (email?: string) => {
  trackEvent('newsletter_signup', {
    method: 'email',
    content_type: 'newsletter',
  });
};

export const trackContactFormSubmit = (source: string) => {
  trackEvent('contact_form_submit', {
    source,
    content_type: 'lead',
  });
};

export const trackCtaClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location,
  });
};

// Engagement Events
export const trackServiceView = (serviceName: string) => {
  trackEvent('service_view', {
    service_name: serviceName,
    content_type: 'service',
  });
};

export const trackCaseStudyView = (projectTitle: string) => {
  trackEvent('case_study_view', {
    project_title: projectTitle,
    content_type: 'case_study',
  });
};

export const trackBlogRead = (postTitle: string, postSlug: string) => {
  trackEvent('blog_read', {
    post_title: postTitle,
    post_slug: postSlug,
    content_type: 'blog',
  });
};

// Navigation Events
export const trackNavClick = (navItem: string, location: 'header' | 'mobile' | 'floating') => {
  trackEvent('nav_click', {
    nav_item: navItem,
    location,
  });
};

export const trackFooterLinkClick = (linkName: string, linkType: 'internal' | 'social' | 'legal') => {
  trackEvent('footer_link_click', {
    link_name: linkName,
    link_type: linkType,
  });
};

// Scroll Depth Tracking Hook
export const useScrollDepthTracking = (pageName: string) => {
  if (typeof window === 'undefined') return;

  const milestones = [25, 50, 75, 100];
  const trackedMilestones = new Set<number>();

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    milestones.forEach((milestone) => {
      if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
        trackedMilestones.add(milestone);
        trackEvent('scroll_depth', {
          page_name: pageName,
          percent_scrolled: milestone,
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
};
