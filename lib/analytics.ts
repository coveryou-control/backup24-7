'use client';

/**
 * §13 — one `track()` wrapper so the analytics platform is swappable.
 *
 * HARD RULE: never send PII. No name, mobile, email, city or message content.
 * IDs, page paths and non-identifying context only. The dev-time guard below
 * fails loudly rather than leaking quietly.
 */

export const AnalyticsEvent = {
  // Navigation
  PAGE_VIEW: 'page_view',
  CTA_CLICK: 'cta_click',
  SCROLL_DEPTH: 'scroll_depth',
  PARTNER_CLICK: 'partner_click',
  PLAN_VIEW: 'plan_view',

  // Lead
  QUOTE_STARTED: 'quote_started',
  QUOTE_STEP_COMPLETED: 'quote_step_completed',
  QUOTE_SUBMITTED: 'quote_submitted',
  QUOTE_ABANDONED: 'quote_abandoned',
  CONTACT_SUBMITTED: 'contact_submitted',

  // Intent
  COVERAGE_VIEWED: 'coverage_viewed',
  PLAN_COMPARED: 'plan_compared',
  PRODUCT_VIEWED: 'product_viewed',
  CLAIMS_VIEWED: 'claims_viewed',
  FAQ_INTERACTION: 'faq_interaction',
  RESOURCE_VIEWED: 'resource_viewed',
  WHATSAPP_CLICK: 'whatsapp_click',
  PHONE_CLICK: 'phone_click',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

/** Only non-identifying context is permitted. */
export interface AnalyticsProps {
  cta_label?: string;
  cta_location?: string;
  page_path?: string;
  plan_type?: 'individual' | 'family';
  quote_step?: 1 | 2 | 3 | 4;
  coverage_id?: string;
  product_id?: string;
  partner_id?: string;
  resource_slug?: string;
  faq_index?: number;
  scroll_percent?: 25 | 50 | 75 | 100;
  lead_id?: string;
  form_type?: 'quote' | 'contact' | 'claims';
}

const FORBIDDEN = ['name', 'email', 'mobile', 'phone', 'city', 'message', 'address', 'ip', 'consent'];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
  }
}

export function track(event: AnalyticsEventName, props: AnalyticsProps = {}): void {
  if (typeof window === 'undefined') return;

  if (process.env.NODE_ENV !== 'production') {
    const leaked = Object.keys(props).filter((k) =>
      FORBIDDEN.some((bad) => k.toLowerCase().includes(bad)),
    );
    if (leaked.length) {
      console.error(`[analytics] refusing to send PII in "${event}": ${leaked.join(', ')}`);
      return;
    }
  }

  // Platform-agnostic: whichever of these exists gets the event.
  if (typeof window.plausible === 'function') {
    window.plausible(event, { props: props as Record<string, unknown> });
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props });
}
