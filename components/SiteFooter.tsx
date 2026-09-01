import Link from 'next/link';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Shell } from './primitives';
import {
  site,
  contact,
  legal,
  disclaimers,
  footerNav,
  telHref,
  mailHref,
  waHref,
  IS_PREVIEW,
} from '@/content/site';

/**
 * §6 footer + §11 persistent compliance line.
 *
 * The legal entity and IRDAI registration must be visible on every page, which
 * is why this is not optional furniture. While the registration is still a
 * PLACEHOLDER the footer says so openly — §11 forbids shipping it as fact.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-black/40">
      <Shell className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
          <div>
            <span className="text-[17px] font-extrabold tracking-tight text-ink">
              Backup<span className="text-primary">24/7</span>
            </span>
            <p className="mt-4 max-w-[32ch] text-[13px] leading-[1.7] text-muted">
              {site.positioning} We help individuals and families understand online risk and find
              cover that fits.
            </p>

            <ul className="mt-6 space-y-2.5">
              <li>
                <a href={telHref} className="inline-flex items-center gap-2.5 text-[13px] text-muted transition-colors hover:text-primary">
                  <Phone size={14} strokeWidth={1.9} />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={mailHref} className="inline-flex items-center gap-2.5 text-[13px] text-muted transition-colors hover:text-primary">
                  <Mail size={14} strokeWidth={1.9} />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[13px] text-muted transition-colors hover:text-primary"
                >
                  <MessageCircle size={14} strokeWidth={1.9} />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {footerNav.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-subtle">
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-muted transition-colors hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 space-y-3 border-t border-hairline pt-8 text-[12px] leading-[1.65] text-subtle">
          {IS_PREVIEW && (
            <p className="rounded-card border border-primary/20 bg-primary/[0.06] px-4 py-2.5 text-primary/85">
              Preview build — the legal entity, registration details, insurer partners and product
              information below are placeholders pending verification, and are not accurate. Search
              indexing is disabled.
            </p>
          )}

          <p>
            <span className="text-muted">{legal.entity}</span> · IRDAI Registration No.{' '}
            {legal.irdaiRegistration} · {legal.brokerCategory} · Insurance is the subject matter of
            solicitation.
          </p>

          {/* §11 — the persistent site-wide compliance line. */}
          <p className="max-w-[92ch]">{disclaimers.facilitation}</p>
          <p className="max-w-[92ch]">{disclaimers.advisory}</p>

          <p className="pt-2">
            © {year} {legal.entity}. Backup24/7 is a brand under which personal cyber insurance
            solutions are distributed.
          </p>
        </div>
      </Shell>
    </footer>
  );
}
