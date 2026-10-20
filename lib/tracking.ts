declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

interface LeadParams {
  content_name: string;
  cta_position: string;
}

export function trackLead({ content_name, cta_position }: LeadParams) {
  // Meta Pixel — Contact event
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Contact", {
      content_name,
      content_category: cta_position,
    });
  }

  // GA4 — generate_lead event
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "generate_lead", {
      content_name,
      cta_position,
    });
  }
}
