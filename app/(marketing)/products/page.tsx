import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Disclaimer, Breadcrumbs, PendingNote } from '@/components/primitives';
import { FinalCta } from '@/components/blocks';
import { publishableProducts } from '@/content/partners';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'Personal Cyber Insurance Products',
    description:
      'Cyber insurance products available through our insurance partners for individuals and families. Subject to eligibility and policy terms.',
  },
  '/products',
);

export default function ProductsPage() {
  const products = publishableProducts();

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Personal cyber insurance products"
        lead="Each product below comes from one of our insurance partners. Which one suits you depends on your situation, not on which sounds most comprehensive."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      <Section>
        <Shell>
          {products.length > 0 ? (
            <>
              <SectionHeading eyebrow="Available options" title="What we can help you explore" />
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
            </>
          ) : (
            <PendingNote>
              Product information is being confirmed with our insurance partners. We publish
              coverage, exclusions and eligibility only once they have been verified against the
              insurer&rsquo;s own documentation. In the meantime, talk to us and we will walk you
              through the options available today.
            </PendingNote>
          )}

          <Disclaimer kind="coverage" className="mt-10" />
          <Disclaimer kind="facilitation" className="mt-4" />
        </Shell>
      </Section>

      <FinalCta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
