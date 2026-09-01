'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';
import { primaryCta, telHref, waHref } from '@/content/site';
import { AnalyticsEvent, track } from '@/lib/analytics';

/**
 * §15 — mobile sticky action bar: Get a Quote, click-to-call, WhatsApp.
 *
 * Hidden on the quote, contact and thank-you routes. Covering a form with a
 * button that leads to the same form is how this pattern usually goes wrong.
 *
 * Fixed positioning plus a spacer in the layout keeps it out of the layout-shift
 * budget (§14): it never reflows content, and the page reserves its height.
 */
export default function StickyMobileBar() {
  const pathname = usePathname();
  const hidden = ['/get-a-quote', '/contact', '/thank-you'];
  if (hidden.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="flex items-stretch gap-2 px-3 py-2.5">
        <a
          href={telHref}
          onClick={() => track(AnalyticsEvent.PHONE_CLICK, { cta_location: 'sticky_bar' })}
          aria-label="Call us"
          className="flex min-h-[48px] w-[52px] shrink-0 items-center justify-center rounded-card text-muted ring-1 ring-inset ring-white/15"
        >
          <Phone size={19} strokeWidth={1.9} />
        </a>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(AnalyticsEvent.WHATSAPP_CLICK, { cta_location: 'sticky_bar' })}
          aria-label="Message us on WhatsApp"
          className="flex min-h-[48px] w-[52px] shrink-0 items-center justify-center rounded-card text-muted ring-1 ring-inset ring-white/15"
        >
          <MessageCircle size={19} strokeWidth={1.9} />
        </a>

        <Link
          href={primaryCta.href}
          onClick={() =>
            track(AnalyticsEvent.CTA_CLICK, { cta_label: primaryCta.label, cta_location: 'sticky_bar' })
          }
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-card bg-primary px-5 text-[13px] font-bold uppercase tracking-wide text-on-primary"
        >
          {primaryCta.label}
        </Link>
      </div>
    </div>
  );
}
