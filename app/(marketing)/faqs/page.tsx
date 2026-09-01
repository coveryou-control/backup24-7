import type { Metadata } from 'next';

import { PageHero } from '@/components/Hero';
import { Shell, Section, Disclaimer, Breadcrumbs } from '@/components/primitives';
import { FinalCta } from '@/components/blocks';
import FAQAccordion from '@/components/FAQAccordion';
import { faqs, faqsByCategory, faqCategoryLabels } from '@/content/audiences';
import type { FaqCategory } from '@/content/types';
import { pageMetadata, breadcrumbSchema, faqPageSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'FAQs', href: '/faqs' },
];

const CATEGORIES: FaqCategory[] = ['general', 'individuals-families', 'coverage', 'purchase', 'claims'];

export const metadata: Metadata = pageMetadata(
  {
    title: 'Personal Cyber Insurance FAQs',
    description:
      'Answers about personal cyber insurance: what it covers, the Individual and Family plans, UPI and online-banking fraud, exclusions, quotes and claims.',
  },
  '/faqs',
);

/**
 * §8.10 — grouped FAQs.
 *
 * §12 requires FAQPage structured data, and it is emitted HERE only. The same
 * questions also appear on the homepage and on product pages; duplicating the
 * schema across them is a common cause of Search Console warnings.
 */
export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title="Questions, answered plainly"
        lead="Cyber insurance comes with a lot of jargon. These are the questions people actually ask us, answered without it."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      <Section>
        <Shell>
          <div className="grid gap-10 lg:grid-cols-[0.24fr_0.76fr] lg:gap-16">
            <nav aria-label="FAQ categories" className="lg:sticky lg:top-[104px] lg:self-start">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-subtle">
                Jump to
              </p>
              <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <a
                      href={`#${c}`}
                      className="inline-block rounded-card px-3 py-2 text-[13.5px] text-muted transition-colors hover:bg-white/[0.04] hover:text-primary"
                    >
                      {faqCategoryLabels[c]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-14">
              {CATEGORIES.map((c) => {
                const items = faqsByCategory(c);
                if (!items.length) return null;
                return (
                  <section key={c} id={c} className="scroll-mt-28">
                    <h2 className="text-[22px] font-extrabold tracking-tight text-ink md:text-[26px]">
                      {faqCategoryLabels[c]}
                    </h2>
                    <div className="mt-5">
                      <FAQAccordion items={items} />
                    </div>
                  </section>
                );
              })}

              <div className="space-y-3">
                <Disclaimer kind="coverage" />
                <Disclaimer kind="advisory" />
              </div>
            </div>
          </div>
        </Shell>
      </Section>

      <FinalCta title="Still have a question?" body="If your question is not here, it is probably a good one. Ask us directly and we will give you a straight answer." />

      <JsonLd data={breadcrumbSchema(TRAIL)} />
      <JsonLd data={faqPageSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
    </>
  );
}
