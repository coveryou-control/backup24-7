import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Disclaimer, Breadcrumbs, Panel } from '@/components/primitives';
import { CoverageCard } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import { coverageItems } from '@/content/coverage';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Coverage', href: '/coverage' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'What Personal Cyber Insurance Covers',
    description:
      'The sections of a personal cyber policy explained: online financial fraud, identity theft, phishing, harassment, extortion and data loss. Subject to policy terms.',
  },
  '/coverage',
);

/** §8.3 — coverage overview, with the exclusions page given prominence. */
export default function CoveragePage() {
  return (
    <>
      <PageHero
        eyebrow="Coverage"
        title="What cyber insurance can help protect"
        lead="A cyber policy is built from sections, and you do not automatically get all of them. Here is what each one deals with, in plain English — and what it does not."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      <Section>
        <Shell>
          <SectionHeading
            eyebrow="The sections"
            title="What a personal cyber policy is made of"
            lead="Every description below is conditional, because the policy wording decides what is covered — not this page."
          />

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coverageItems.map((c) => (
              <li key={c.id}>
                <CoverageCard item={c} />
              </li>
            ))}
          </ul>

          <Disclaimer kind="coverage" className="mt-10" />
        </Shell>
      </Section>

      {/* §8.3 requires a prominent link to the exclusions page. */}
      <Section tone="raised">
        <Shell>
          <Link href="/coverage/what-is-not-covered" className="group block">
            <Panel className="p-7 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                    Read this before you buy anything
                  </p>
                  <h2 className="mt-3 max-w-[26ch] text-[22px] font-extrabold leading-[1.15] tracking-tight text-ink md:text-[30px]">
                    Cyber insurance does not mean everything is covered.
                  </h2>
                  <p className="mt-3 max-w-[58ch] text-[14px] leading-[1.7] text-muted">
                    Exclusions, limits, deductibles and waiting periods — set out openly, while you
                    are still choosing rather than at the point of a claim.
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-primary">
                  What is not covered
                  <ArrowRight
                    size={16}
                    strokeWidth={2.4}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Panel>
          </Link>
        </Shell>
      </Section>

      <FinalCta title="Not sure which sections you need?" />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
