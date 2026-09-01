import type { Metadata } from 'next';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Breadcrumbs, PendingNote } from '@/components/primitives';
import { ArticleCard } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import { getAllResources, getResourcesByCategory, resourceCategories, resourceCategoryLabels } from '@/lib/resources';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Resources', href: '/resources' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'Cyber Knowledge Hub',
    description:
      'Plain-language guides on personal cyber risk and cyber insurance: UPI fraud, phishing, identity theft, and choosing between Individual and Family cover.',
  },
  '/resources',
);

const CATEGORY_INTROS: Record<string, string> = {
  'cyber-insurance-basics': 'Start here if the whole subject is new.',
  'personal-cyber-risk': 'How risk actually shows up in everyday life.',
  'cyber-attacks': 'What the common incidents are, and how they reach you.',
  insurance: 'How policies work: what they cover, what they exclude, how claims run.',
};

/** §8.9 — grouped by category rather than reverse-chronological. This is reference material, not a blog. */
export default function ResourcesPage() {
  const all = getAllResources();

  return (
    <>
      <PageHero
        eyebrow="Cyber knowledge hub"
        title="Understand before you decide"
        lead="Personal cyber risk is explained badly almost everywhere. These are plain-language explanations, written for people rather than for security teams."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      {all.length === 0 ? (
        <Section>
          <Shell narrow>
            <PendingNote>
              Articles are being written. Educational content is reviewed before it is published, the
              same as everything else on this site.
            </PendingNote>
          </Shell>
        </Section>
      ) : (
        resourceCategories.map((category, i) => {
          const items = getResourcesByCategory(category);
          if (!items.length) return null;

          return (
            <Section key={category} tone={i % 2 === 1 ? 'raised' : 'base'}>
              <Shell>
                <SectionHeading
                  eyebrow={`${items.length} article${items.length === 1 ? '' : 's'}`}
                  title={resourceCategoryLabels[category]}
                  lead={CATEGORY_INTROS[category]}
                />
                <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((r) => (
                    <li key={r.slug}>
                      <ArticleCard resource={r} categoryLabel={resourceCategoryLabels[r.category]} />
                    </li>
                  ))}
                </ul>
              </Shell>
            </Section>
          );
        })
      )}

      <FinalCta
        title="Read enough? Let’s talk about your situation."
        body="Reading only gets you so far. A short conversation will tell you more than another article."
      />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
