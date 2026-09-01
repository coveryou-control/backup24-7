import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Info } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import {
  Shell,
  Section,
  SectionHeading,
  CTAButton,
  Disclaimer,
  Breadcrumbs,
  Panel,
} from '@/components/primitives';
import { FinalCta } from '@/components/blocks';
import FAQAccordion from '@/components/FAQAccordion';
import { publishableProducts, productBySlug, insurers } from '@/content/partners';
import { planById } from '@/content/plans';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

/**
 * §8.11 — ProductLayout. ONE template for every insurer product.
 *
 * Fixed section order: Hero → Who is this for → Problem addressed → Key coverage
 * → Potential benefits → Optional covers → Important exclusions → Eligibility →
 * Information required → FAQs → Claims info → Get a Quote, with the persistent
 * disclaimer throughout.
 *
 * `generateStaticParams` returns only APPROVED products, so while every value is
 * PLACEHOLDER (verify vs insurer documentation) these routes do not exist. A 404
 * is more honest than a page of unverified coverage claims (§11, §16).
 */
export function generateStaticParams() {
  return publishableProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product || product.approvalStatus !== 'approved') return {};
  return pageMetadata(product.seo, `/products/${slug}`);
}

function ListBlock({
  title,
  items,
  tone = 'default',
}: {
  title: string;
  items: string[];
  tone?: 'default' | 'caution';
}) {
  if (!items.length) return null;
  const Icon = tone === 'caution' ? Info : Check;

  return (
    <div>
      <h3 className="text-[16px] font-semibold text-ink">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13.5px] leading-[1.65] text-muted">
            <Icon
              size={14}
              strokeWidth={2.2}
              className={`mt-[3px] shrink-0 ${tone === 'caution' ? 'text-white/40' : 'text-primary'}`}
            />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product || product.approvalStatus !== 'approved') notFound();

  const insurer = insurers.find((i) => i.id === product.insurerId);
  const plans = product.suitableFor.map(planById).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: product.name, href: `/products/${product.slug}` },
  ];

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow={insurer ? `${insurer.name} · Cyber insurance` : 'Cyber insurance'}
        title={product.heroTitle}
        lead={product.heroDescription}
      >
        <Breadcrumbs trail={trail} />
      </PageHero>

      {/* 2 & 3 — Who is this for / Problem addressed */}
      <Section>
        <Shell>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading as="h2" eyebrow="Who it is for" title="Is this suitable for you?" />
              {plans.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {plans.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/plans/${p.id}`}
                        className="inline-flex items-center gap-1.5 rounded-pill bg-primary/10 px-4 py-2 text-[13px] font-medium text-primary hover:bg-primary/15"
                      >
                        {p.name}
                        <ArrowRight size={13} strokeWidth={2.2} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 text-[14.5px] leading-[1.75] text-muted">
                Suitability depends on more than the plan type. We will tell you honestly if a
                different option fits you better.
              </p>
            </div>

            <div>
              <SectionHeading
                as="h2"
                eyebrow="The problem it addresses"
                title="What it is designed to deal with"
              />
              <p className="mt-6 text-[14.5px] leading-[1.75] text-muted">
                {product.problemAddressed}
              </p>
            </div>
          </div>
        </Shell>
      </Section>

      {/* 4, 5, 6 — Key coverage / benefits / optional covers */}
      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="Key coverage"
            title="What this product covers"
            lead="The sections below describe what this product is designed to respond to. The policy you are issued determines the actual scope, limits and conditions."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            <ListBlock title="Key coverage" items={product.keyCoverage} />
            <ListBlock title="Potential benefits" items={product.potentialBenefits} />
            <ListBlock title="Optional covers" items={product.optionalCovers ?? []} />
          </div>

          <Disclaimer kind="coverage" className="mt-10" />
        </Shell>
      </Section>

      {/* 7, 8, 9 — Exclusions / eligibility / information required */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="The details that matter"
            title="Exclusions, eligibility and what we will need"
            lead="On the same page as the coverage, not in a separate document you receive later."
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            <ListBlock title="Important exclusions" items={product.importantExclusions} tone="caution" />
            <ListBlock title="Eligibility" items={product.eligibility} />
            <ListBlock title="Information required" items={product.informationRequired} />
          </div>

          <Panel hover={false} className="mt-10 border-primary/20 bg-primary/[0.04] p-6">
            <p className="text-[13.5px] leading-[1.7] text-muted">
              This is a summary written for clarity, not the policy itself. Before you commit to
              anything we go through the actual policy wording with you — including the parts that
              are easy to skip.
            </p>
          </Panel>
        </Shell>
      </Section>

      {/* 10 — FAQs */}
      {product.faqs.length > 0 && (
        <Section tone="raised">
          <Shell>
            <SectionHeading eyebrow="About this product" title="Questions about this cover" />
            <div className="mt-10">
              <FAQAccordion items={product.faqs} />
            </div>
          </Shell>
        </Section>
      )}

      {/* 11 & 12 — Claims info / Get a Quote */}
      <Section>
        <Shell narrow>
          <SectionHeading as="h2" eyebrow="If you need to claim" title="How claims work" />
          <p className="mt-6 text-[14.5px] leading-[1.75] text-muted">{product.claimsInfo}</p>

          <div className="mt-6 flex flex-wrap gap-5">
            <Link
              href="/claims"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary hover:underline"
            >
              Full claims process
              <ArrowRight size={15} strokeWidth={2.2} />
            </Link>
            {insurer && (
              <Link
                href={`/insurance-partners/${insurer.slug}`}
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary hover:underline"
              >
                About {insurer.name}
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            )}
          </div>

          <Disclaimer kind="claims" className="mt-8" />
          <Disclaimer kind="facilitation" className="mt-4" />

          <CTAButton href="/get-a-quote" className="mt-8">
            Get a Quote
          </CTAButton>

          <p className="mt-6 text-[12px] text-subtle">Last reviewed: {product.lastReviewed}</p>
        </Shell>
      </Section>

      <FinalCta />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
