import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Info } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Disclaimer, Breadcrumbs, Panel } from '@/components/primitives';
import { IconTile } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import { coverageItems, coverageBySlug } from '@/content/coverage';
import { planById } from '@/content/plans';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

/**
 * §8.3 — one template for all six coverage pages.
 *
 * Structure: what it means → what the section typically helps with → what
 * commonly surprises people → related cover.
 *
 * That third block is the one most insurance sites leave out, and it is the
 * reason this positioning is credible. It is rendered from `watchOut` in the
 * content layer, so it can never be quietly dropped from a page.
 */

export function generateStaticParams() {
  return coverageItems.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = coverageBySlug(slug);
  if (!item) return {};
  return pageMetadata(item.seo, `/coverage/${slug}`);
}

export default async function CoverageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = coverageBySlug(slug);
  if (!item) notFound();

  const related = coverageItems.filter((c) => c.id !== item.id).slice(0, 3);
  const plans = item.relatedPlans.map(planById).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Coverage', href: '/coverage' },
    { name: item.title, href: `/coverage/${item.slug}` },
  ];

  return (
    <>
      <PageHero eyebrow="Coverage" title={item.title} lead={item.summary}>
        <Breadcrumbs trail={trail} />
      </PageHero>

      <Section>
        <Shell>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div>
              <SectionHeading as="h2" eyebrow="In plain English" title="What this actually means" />
              <p className="mt-6 text-[15px] leading-[1.75] text-muted">{item.detail}</p>

              {/* What commonly surprises people */}
              <div className="mt-12">
                <SectionHeading
                  as="h2"
                  eyebrow="Read this part twice"
                  title="What commonly surprises people"
                  lead="These are the conditions we most often have to explain to someone who bought a policy elsewhere."
                />
                <ul className="mt-6 space-y-3">
                  {item.watchOut.map((w) => (
                    <li
                      key={w}
                      className="flex items-start gap-3 rounded-card border border-white/10 bg-white/[0.025] p-4"
                    >
                      <Info size={15} strokeWidth={2.2} className="mt-0.5 shrink-0 text-white/40" />
                      <span className="text-[13.5px] leading-[1.65] text-muted">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Disclaimer kind="coverage" className="mt-10" />
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-[104px] lg:self-start">
              <Panel hover={false} className="border-primary/20 bg-primary/[0.04] p-6">
                <IconTile name={item.icon} />
                <h2 className="mt-5 text-[15px] font-semibold text-ink">
                  What this section typically helps with
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {item.typicallyHelps.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[13.5px] text-muted">
                      <Check size={14} strokeWidth={2.4} className="mt-[3px] shrink-0 text-primary" />
                      {h}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[12px] leading-[1.6] text-subtle">
                  What is actually included, and up to what limit, is set by the policy you are
                  issued.
                </p>
              </Panel>

              {plans.length > 0 && (
                <Panel hover={false} className="mt-4 p-6">
                  <h2 className="text-[15px] font-semibold text-ink">Included in</h2>
                  <ul className="mt-4 space-y-2.5">
                    {plans.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/plans/${p.id}`}
                          className="inline-flex items-center gap-1.5 text-[13.5px] text-primary hover:underline"
                        >
                          {p.name}
                          <ArrowRight size={14} strokeWidth={2.2} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}

              <Panel hover={false} className="mt-4 p-6">
                <h2 className="text-[15px] font-semibold text-ink">Related cover</h2>
                <ul className="mt-4 space-y-2.5">
                  {related.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/coverage/${c.slug}`}
                        className="inline-flex items-center gap-1.5 text-[13.5px] text-primary hover:underline"
                      >
                        {c.title}
                        <ArrowRight size={14} strokeWidth={2.2} />
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/coverage/what-is-not-covered"
                      className="inline-flex items-center gap-1.5 text-[13.5px] text-primary hover:underline"
                    >
                      What is not covered
                      <ArrowRight size={14} strokeWidth={2.2} />
                    </Link>
                  </li>
                </ul>
              </Panel>
            </aside>
          </div>
        </Shell>
      </Section>

      <FinalCta />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
