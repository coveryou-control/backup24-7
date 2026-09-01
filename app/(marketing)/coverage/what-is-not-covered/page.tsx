import type { Metadata } from 'next';
import { Info } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, Disclaimer, Breadcrumbs, Panel, PendingNote } from '@/components/primitives';
import { FinalCta } from '@/components/blocks';
import { exclusionCategories, limitTypes } from '@/content/coverage';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Coverage', href: '/coverage' },
  { name: 'What is not covered', href: '/coverage/what-is-not-covered' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'What Cyber Insurance Does Not Cover',
    description:
      'Exclusions, limits, deductibles and waiting periods explained openly. What personal cyber insurance typically does not cover.',
  },
  '/coverage/what-is-not-covered',
);

/**
 * §8.3 — the exclusions page. H1 is specified.
 *
 * Only generic CATEGORIES appear here. Specific exclusions are
 * PLACEHOLDER (verify vs policy wording) and are stated as pending rather than
 * invented — §11 forbids shipping a PLACEHOLDER as fact.
 */
export default function WhatIsNotCoveredPage() {
  return (
    <>
      <PageHero
        eyebrow="Full transparency"
        title="Cyber insurance doesn’t mean everything is covered."
        lead="Every policy has boundaries. We would rather you understood them while you are choosing than at the point of a claim. Here is how those boundaries usually work."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      {/* The three things people confuse */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="How limits actually work"
            title="Three different things people confuse"
            lead="Most disappointment at claim time comes from mixing these up. They are not the same."
          />
          <ul className="mt-12 grid gap-4 lg:grid-cols-3">
            {limitTypes.map((l) => (
              <li key={l.title}>
                <Panel hover={false} className="h-full">
                  <h3 className="text-[17px] font-semibold text-ink">{l.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.65] text-muted">{l.body}</p>
                </Panel>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      {/* Exclusion categories */}
      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="Common exclusion categories"
            title="What typically falls outside cover"
            lead="These categories appear in most personal cyber policies in some form. The exact wording differs by insurer and product, and the policy you are issued is what decides."
          />

          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {exclusionCategories.map((c) => (
              <li key={c.title}>
                <Panel hover={false} className="h-full p-5">
                  <h3 className="flex items-start gap-2.5 text-[14.5px] font-semibold text-ink">
                    <Info size={15} strokeWidth={2.2} className="mt-[3px] shrink-0 text-white/35" />
                    {c.title}
                  </h3>
                  <p className="mt-2 pl-[26px] text-[13px] leading-[1.6] text-muted">{c.body}</p>
                </Panel>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <PendingNote>
              We have not listed specific exclusions here, because they differ between insurers and
              products — and publishing a list that does not match your policy would be worse than
              publishing nothing. When we discuss a specific product with you, we go through its
              actual exclusions from the wording itself.
            </PendingNote>
          </div>

          <Disclaimer kind="coverage" className="mt-8" />
        </Shell>
      </Section>

      {/* What insurance is not */}
      <Section>
        <Shell narrow>
          <SectionHeading
            eyebrow="Worth saying plainly"
            title="What insurance is not"
            lead="Cyber insurance is a financial product. It is useful, and it is not a substitute for any of these."
          />
          <ul className="mt-8 space-y-5">
            {[
              {
                title: 'It is not security',
                body: 'A policy does not stop an incident happening. Two-factor authentication, unique passwords, updated devices and backups do that work. Insurance deals with what happens afterwards.',
              },
              {
                title: 'It is not a guarantee of payment',
                body: 'A claim is assessed against the policy wording and the facts of the incident. We help you present it properly; the insurer decides it.',
              },
              {
                title: 'It is not unlimited',
                body: 'Every policy has a ceiling, and individual sections usually have lower ones. Part of choosing cover is deciding what level of loss you actually need protection against.',
              },
            ].map((i) => (
              <li key={i.title} className="border-l-2 border-white/15 pl-5">
                <h3 className="text-[16px] font-semibold text-ink">{i.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.7] text-muted">{i.body}</p>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      <FinalCta title="Want someone to walk you through the wording?" />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
