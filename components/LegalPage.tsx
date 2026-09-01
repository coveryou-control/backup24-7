import Link from 'next/link';
import { Info } from 'lucide-react';
import { Shell, Breadcrumbs } from './primitives';
import { legalDocs } from '@/content/legal';
import { contact, IS_PREVIEW } from '@/content/site';

/**
 * §8.14 — shared template for the three legal pages.
 *
 * These are linked from the footer and from every form, so they must exist
 * rather than 404. But draft legal text presented as final is worse than no
 * text, which is why every one of them states openly that it has not been
 * reviewed by a legal advisor while the build is in preview.
 */
export default function LegalPage({ slug }: { slug: keyof typeof legalDocs }) {
  const doc = legalDocs[slug];

  const trail = [
    { name: 'Home', href: '/' },
    { name: doc.title, href: `/${doc.slug}` },
  ];

  return (
    <Shell narrow className="py-[104px]">
      <Breadcrumbs trail={trail} />

      <h1 className="mt-8 text-[30px] font-extrabold leading-[1.15] tracking-tight text-ink md:text-[40px]">
        {doc.title}
      </h1>
      <p className="mt-4 text-[16px] leading-[1.7] text-muted">{doc.intro}</p>
      <p className="mt-4 text-[12px] text-subtle">Last updated: {doc.lastUpdated}</p>

      {IS_PREVIEW && (
        <div className="mt-8 flex gap-3 rounded-card border border-primary/25 bg-primary/[0.06] p-5">
          <Info size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-primary" />
          <div className="text-[13px] leading-[1.65] text-primary/90">
            <p className="font-semibold">Draft — not reviewed by a legal advisor.</p>
            <p className="mt-1.5">
              This document is a structural starting point so the page exists and is linked. It is not
              legal advice and must be reviewed and approved before publication, with particular
              attention to DPDP Act obligations, IRDAI requirements and the prescribed grievance
              escalation path.
            </p>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-10">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[20px] font-extrabold tracking-tight text-ink md:text-[24px]">
              {section.heading}
            </h2>

            <div className="mt-4 space-y-4">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="text-[14.5px] leading-[1.75] text-muted">
                  {p}
                </p>
              ))}
            </div>

            {section.bullets && (
              <ul className="mt-4 space-y-2.5">
                {section.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[14.5px] leading-[1.7] text-muted">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="panel mt-14 p-6">
        <h2 className="text-[16px] font-semibold text-ink">Questions about this?</h2>
        <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">
          Write to{' '}
          <a href={`mailto:${contact.email}`} className="font-medium text-primary hover:underline">
            {contact.email}
          </a>{' '}
          and a person will answer you. You can also{' '}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            contact us here
          </Link>
          .
        </p>
      </div>
    </Shell>
  );
}
