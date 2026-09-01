import type { Metadata } from 'next';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Disclaimer, Breadcrumbs, PendingNote } from '@/components/primitives';
import { PlanCard } from '@/components/cards';
import { PlanComparison, FinalCta } from '@/components/blocks';
import { plans } from '@/content/plans';
import { coverageItems } from '@/content/coverage';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Plans', href: '/plans' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'Individual & Family Cyber Insurance Plans',
    description:
      'Choose between Individual and Family personal cyber insurance. Compare who is covered and what each plan can help with. Subject to policy terms.',
  },
  '/plans',
);

/** §8.4 — H1 is specified: "Choose the Cover That Fits Your Life." */
export default function PlansPage() {
  const titlesFor = (ids: string[]) =>
    ids.map((id) => coverageItems.find((c) => c.id === id)?.title ?? id);

  return (
    <>
      <PageHero
        eyebrow="Plans"
        title="Choose the cover that fits your life."
        lead="Two plans, both quote-driven. The deciding question is not how many people live in your home — it is how many of them can move money or approve something."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      <Section>
        <Shell>
          <ul className="grid gap-5 lg:grid-cols-2">
            {plans.map((p) => (
              <li key={p.id}>
                <PlanCard plan={p} featured={p.id === 'family'} coverageTitles={titlesFor(p.whatsIncluded)} />
              </li>
            ))}
          </ul>

          {/* §8.4/§16 — no invented sums insured, limits or prices. */}
          <div className="mt-8">
            <PendingNote>
              Sum insured options, per-member limits and premiums are set by the insurer and
              confirmed on your quote. We do not publish figures we cannot verify against a specific
              policy.
            </PendingNote>
          </div>
        </Shell>
      </Section>

      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="Side by side"
            title="Individual vs Family"
            lead="The core sections are the same in both. What changes is how many people they cover, and one section that only matters if there are dependents."
          />
          <div className="mt-10">
            <PlanComparison />
          </div>
          <Disclaimer kind="facilitation" className="mt-8" />
        </Shell>
      </Section>

      <FinalCta title="Still deciding which plan fits?" body="Tell us how your household lives online and we will tell you which plan is the right shape — including if the answer is the cheaper one." />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
