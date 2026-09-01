'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { primaryNav, primaryCta, contact, telHref, waHref } from '@/content/site';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, track } from '@/lib/analytics';

/**
 * §6 header + mobile nav.
 *
 * The primary bar carries eight links plus the CTA, which only fits from `xl`.
 * Below that it collapses to the hamburger rather than cramming — a squeezed
 * nine-item bar is worse than a burger at 1024px.
 *
 * `logo` is a text wordmark per §4 (PLACEHOLDER until /public/logo.svg lands).
 */

function Wordmark() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Backup24/7 home">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink"
        aria-hidden="true"
      >
        <path d="M13 2.2 22 5.5v6.6c0 5-3.7 8.9-9 10.2-5.3-1.3-9-5.2-9-10.2V5.5Z" />
        <path d="M8.6 13h2.2l1.4-3 1.6 5.4 1.2-2.4h2.4" className="text-primary" stroke="currentColor" />
      </svg>
      <span className="text-[17px] font-extrabold tracking-tight text-ink">
        Backup<span className="text-primary">24/7</span>
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [lifted, setLifted] = useState(false);

  /**
   * The overlay's open state is DERIVED from the route it was opened on, rather
   * than reset by an effect on `pathname`.
   *
   * Closing it with `useEffect(() => setOpen(false), [pathname])` sets state
   * synchronously inside an effect, which React 19 flags as a cascading render.
   * Storing the path instead means navigation closes the menu by definition —
   * including browser back/forward — with no effect and no extra render.
   */
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (value: boolean) => setOpenPath(value ? pathname : null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Growing past the breakpoint must not leave the overlay stranded.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* z-50: the header must stay above the z-40 overlay so the close button
          is always reachable. A z-index on the button itself cannot escape the
          header's own stacking context. */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          lifted && 'border-b border-hairline bg-bg/92 backdrop-blur-md',
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-shell items-center justify-between gap-6 px-6 md:px-10">
          <Wordmark />

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-6">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'whitespace-nowrap text-[14px] font-medium transition-colors duration-200 hover:text-primary',
                      isActive(item.href) ? 'text-primary' : 'text-ink/80',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={primaryCta.href}
              onClick={() =>
                track(AnalyticsEvent.CTA_CLICK, { cta_label: primaryCta.label, cta_location: 'header' })
              }
              className="hidden rounded-pill bg-primary px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-on-primary transition-colors hover:bg-primary-hover sm:inline-block"
            >
              {primaryCta.label}
            </Link>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="-mr-2 flex h-11 w-11 items-center justify-center text-ink xl:hidden"
            >
              {open ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        id="mobile-nav"
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-md transition-opacity duration-300 xl:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <nav aria-label="Mobile" className="flex min-h-full flex-col px-8 pb-10 pt-[92px]">
          <ul className="space-y-0.5">
            {primaryNav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2.5 text-[22px] font-extrabold tracking-tight text-ink transition-colors hover:text-primary"
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? 'none' : 'translateY(10px)',
                    transition:
                      'opacity .4s cubic-bezier(.16,1,.3,1), transform .4s cubic-bezier(.16,1,.3,1)',
                    transitionDelay: open ? `${60 + i * 40}ms` : '0ms',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-3 border-t border-hairline pt-6">
            <Link
              href={primaryCta.href}
              className="flex w-full items-center justify-center rounded-pill bg-primary px-6 py-3.5 text-[13px] font-bold uppercase tracking-wide text-on-primary"
            >
              {primaryCta.label}
            </Link>
            <div className="flex gap-3">
              <a
                href={telHref}
                onClick={() => track(AnalyticsEvent.PHONE_CLICK, { cta_location: 'mobile_nav' })}
                className="flex flex-1 items-center justify-center gap-2 rounded-pill ring-1 ring-inset ring-white/20 px-4 py-3 text-[13px] text-ink"
              >
                <Phone size={15} strokeWidth={1.9} />
                Call
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(AnalyticsEvent.WHATSAPP_CLICK, { cta_location: 'mobile_nav' })}
                className="flex flex-1 items-center justify-center gap-2 rounded-pill ring-1 ring-inset ring-white/20 px-4 py-3 text-[13px] text-ink"
              >
                <MessageCircle size={15} strokeWidth={1.9} />
                WhatsApp
              </a>
            </div>
            <p className="pt-1 text-[12px] text-subtle">{contact.officeHours}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
