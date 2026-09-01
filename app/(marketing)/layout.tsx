import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import StickyMobileBar from '@/components/StickyMobileBar';

/**
 * Shell for every public page.
 *
 * `pb-[76px] lg:pb-0` reserves the sticky mobile bar's height so it never
 * overlaps the footer's compliance line — that text is a regulatory requirement
 * (§11), not decoration — and never causes layout shift (§14).
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-card focus:bg-primary focus:px-4 focus:py-2 focus:text-[13px] focus:font-bold focus:text-on-primary"
      >
        Skip to content
      </a>

      <SiteHeader />
      <main id="main" className="pb-[76px] lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <StickyMobileBar />
    </>
  );
}
