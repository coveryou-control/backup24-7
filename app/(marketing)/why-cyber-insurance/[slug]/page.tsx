import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, CTAButton, Panel, Breadcrumbs, Disclaimer } from '@/components/primitives';
import { IconTile } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import { riskProfiles, riskProfileBySlug } from '@/content/risks';
import { coverageItems } from '@/content/coverage';
import { planById } from '@/content/plans';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

/**
 * §8.2 — one template, two segment pages (individuals / families).
 *
 * Structure: why it applies → the specific exposures → practical steps that have
 * nothing to do with buying insurance → then, and only then, where cover fits.
 * The practical-steps block is deliberate: a broker that tells you how to reduce
 * your risk is more credible than one that only tells you to insure it.
 */

export function generateStaticParams() {
  return riskProfiles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = riskProfileBySlug(slug);
  if (!profile) return {};
  return pageMetadata(profile.seo, `/why-cyber-insurance/${slug}`);
}

export default async function RiskProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = riskProfileBySlug(slug);
  if (!profile) notFound();

  const plan = planById(profile.plan);
  const relevant = profile.relevantCoverage
    .map((id) => coverageItems.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Why Cyber Insurance?', href: '/why-cyber-insurance' },
    { name: profile.title, href: `/why-cyber-insurance/${profile.slug}` },
  ];

  return (
    <>
      <PageHero eyebrow={profile.eyebrow} title={profile.title} lead={profile.lead}>
        <Breadcrumbs trail={trail} />
      </PageHero>

      {/* Context */}
      <Section>
        <Shell narrow>
          <SectionHeading eyebrow="The situation" title="Why this applies to you" />
          <div className="mt-6 space-y-5 text-[15px] leading-[1.75] text-muted">
            {profile.context.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </Shell>
      </Section>

      {/* Exposures */}
      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="Where the risk sits"
            title="The specific exposures"
            lead="Not abstractions — the actual parts of an ordinary week where something can go wrong."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.exposures.map((e) => (
              <li key={e.title}>
                <Panel className="h-full">
                  <IconTile name={e.icon} tone="muted" />
                  <h3 className="mt-5 text-[15px] font-semibold text-ink">{e.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">{e.detail}</p>
                </Panel>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      {/* Practical steps + where cover fits */}
      <Section>
        <Shell>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Before you insure anything"
                title="Things worth doing regardless"
                lead="None of these cost much, and all of them reduce the chance of ever needing a policy. We would rather you did them."
              />
              <ul className="mt-8 space-y-3.5">
                {profile.practicalSteps.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <Check size={15} strokeWidth={2.4} className="mt-1 shrink-0 text-primary" />
                    <span className="text-[14.5px] leading-[1.7] text-muted">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading
                eyebrow="Where insurance fits"
                title="What a policy can add"
                lead="The sections of a personal cyber policy most relevant to this situation."
              />
              <ul className="mt-8 space-y-3">
                {relevant.map((c) => (
                  <li key={c.id}>
                    <Link href={`/coverage/${c.slug}`} className="group block">
                      <Panel className="flex items-start gap-3 p-5">
                        <div>
                          <h3 className="text-[14.5px] font-semibold text-ink">{c.title}</h3>
                          <p className="mt-1.5 text-[13px] leading-[1.6] text-muted">{c.summary}</p>
                        </div>
                        <ArrowRight
                          size={15}
                          strokeWidth={2.2}
                          className="ml-auto mt-1 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
                        />
                      </Panel>
                    </Link>
                  </li>
                ))}
              </ul>

              {plan && (
                <div className="mt-6 rounded-panel border border-primary/20 bg-primary/[0.05] p-6">
                  <p className="text-[13.5px] leading-[1.7] text-muted">
                    For this situation, the <span className="font-semibold text-ink">{plan.name}</span>{' '}
                    is usually the right shape. {plan.tagline}
                  </p>
                  <CTAButton href={`/get-a-quote?plan=${plan.id}`} className="mt-5">
                    Get a Quote
                  </CTAButton>
                </div>
              )}

              <Disclaimer kind="coverage" className="mt-6" />
            </div>
          </div>
        </Shell>
      </Section>

      <FinalCta />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
