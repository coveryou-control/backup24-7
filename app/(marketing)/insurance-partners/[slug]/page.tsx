import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Disclaimer, Breadcrumbs, PendingNote } from '@/components/primitives';
import { FinalCta } from '@/components/blocks';
import { publishableInsurers, insurerBySlug, productsForInsurer } from '@/content/partners';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

/**
 * §8.5 — a short trust/intro page per insurer, linking to the product page.
 *
 * `generateStaticParams` returns only APPROVED insurers, so while both partners
 * are pending these routes do not exist at all — a 404 is more honest than a
 * page of PLACEHOLDERs (§11).
 */
export function generateStaticParams() {
  return publishableInsurers().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const insurer = insurerBySlug(slug);
  if (!insurer || insurer.approvalStatus !== 'approved') return {};
  return pageMetadata(insurer.seo, `/insurance-partners/${slug}`);
}

export default async function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insurer = insurerBySlug(slug);
  if (!insurer || insurer.approvalStatus !== 'approved' || !insurer.active) notFound();

  const products = productsForInsurer(insurer.id).filter((p) => p.approvalStatus === 'approved');

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Insurance Partners', href: '/insurance-partners' },
    { name: insurer.name, href: `/insurance-partners/${insurer.slug}` },
  ];

  return (
    <>
      <PageHero eyebrow="Insurance partner" title={insurer.name} lead={insurer.description}>
        <Breadcrumbs trail={trail} />
      </PageHero>

      <Section>
        <Shell>
          <SectionHeading
            eyebrow="Products"
            title={`Personal cyber insurance from ${insurer.name}`}
            lead="The products from this partner that we can help individuals and families explore."
          />

          {products.length > 0 ? (
            <ul className="mt-10 space-y-3">
              {products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="panel panel-hover flex items-center justify-between gap-6 p-6"
                  >
                    <span className="text-[15px] font-semibold text-ink">{p.name}</span>
                    <ArrowRight size={16} strokeWidth={2.2} className="shrink-0 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <PendingNote>
                Product details for this partner are being confirmed. Contact us and we will walk you
                through the options available today.
              </PendingNote>
            </div>
          )}

          <Disclaimer kind="facilitation" className="mt-10" />
        </Shell>
      </Section>

      <FinalCta />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
