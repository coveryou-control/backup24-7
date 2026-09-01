import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, CTAButton, Panel, Breadcrumbs } from '@/components/primitives';
import { ScenarioCard, CoverageCard, IconTile } from '@/components/cards';
import { FinalCta } from '@/components/blocks';
import { coverageItems } from '@/content/coverage';
import { scenarios } from '@/content/audiences';
import { riskProfiles } from '@/content/risks';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

const TRAIL = [
  { name: 'Home', href: '/' },
  { name: 'Why Cyber Insurance?', href: '/why-cyber-insurance' },
];

export const metadata: Metadata = pageMetadata(
  {
    title: 'Why Cyber Insurance? Personal Cover Explained',
    description:
      'What personal cyber insurance is, why everyday people need it, and how online risk actually works. Explained in plain language.',
  },
  '/why-cyber-insurance',
);

/** §8.2 — the education hub. */
export default function WhyCyberInsurancePage() {
  return (
    <>
      <PageHero
        eyebrow="Understand the risk"
        title="Why cyber insurance?"
        lead="If you are not sure what cyber insurance is, or whether it applies to you, start here. No jargon, and no assumption that you already know the vocabulary."
      >
        <Breadcrumbs trail={TRAIL} />
      </PageHero>

      {/* Insurance vs security — the misunderstanding worth clearing first */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="A common mix-up"
            title="Cyber insurance is not cyber security"
            lead="People often think these are the same purchase. They solve different halves of the problem, and you generally want both."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Panel hover={false} className="p-7">
              <IconTile name="lock" tone="muted" />
              <h3 className="mt-5 text-[18px] font-semibold text-ink">Cyber security</h3>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-muted">
                Reduces the chance of something happening. Two-factor authentication, unique
                passwords, updated devices, backups, and knowing what a suspicious message looks
                like.
              </p>
              <p className="mt-3 text-[13px] text-subtle">
                We do not sell this. We will happily tell you to do it.
              </p>
            </Panel>

            <Panel hover={false} className="border-primary/25 bg-primary/[0.04] p-7">
              <IconTile name="shield" />
              <h3 className="mt-5 text-[18px] font-semibold text-ink">Cyber insurance</h3>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-muted">
                Deals with the consequences when something happens anyway. Eligible financial loss,
                the cost of investigating, restoring data, and certain legal or administrative
                expenses — to the extent the policy covers them.
              </p>
              <p className="mt-3 text-[13px] text-subtle">This is what we help with.</p>
            </Panel>
          </div>
        </Shell>
      </Section>

      {/* What it can help with */}
      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="In practice"
            title="What a personal policy deals with"
            lead="Six sections, each with its own conditions and limits. Not every policy includes every one."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coverageItems.map((c) => (
              <li key={c.id}>
                <CoverageCard item={c} />
              </li>
            ))}
          </ul>
          <CTAButton href="/coverage" variant="ghost" className="mt-10">
            Explore full coverage
          </CTAButton>
        </Shell>
      </Section>

      {/* Risk by segment */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="Risk by situation"
            title="It looks different depending on your household"
            lead="One person and a family do not carry the same exposure. Pick the closer match."
          />

          <ul className="mt-12 grid gap-5 lg:grid-cols-2">
            {riskProfiles.map((r) => (
              <li key={r.slug}>
                <Link href={`/why-cyber-insurance/${r.slug}`} className="group block h-full">
                  <Panel className="flex h-full flex-col p-7">
                    <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                      {r.eyebrow}
                    </p>
                    <h3 className="mt-3 text-[20px] font-extrabold tracking-tight text-ink">
                      {r.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-[1.7] text-muted">{r.lead}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-medium text-primary">
                      Read more
                      <ArrowRight
                        size={14}
                        strokeWidth={2.2}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Panel>
                </Link>
              </li>
            ))}
          </ul>

          <Panel hover={false} className="mt-5 p-7">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-[17px] font-semibold text-ink">
                  Start with the digital footprint
                </h3>
                <p className="mt-2 max-w-[58ch] text-[13.5px] leading-[1.65] text-muted">
                  Before the risks, it helps to see how much of your life is actually online — and
                  how one compromise cascades into the rest.
                </p>
              </div>
              <CTAButton
                href="/why-cyber-insurance/why-you-need-cyber-insurance"
                variant="ghost"
                className="shrink-0"
              >
                Why you need it
              </CTAButton>
            </div>
          </Panel>
        </Shell>
      </Section>

      {/* Scenarios */}
      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="Real situations"
            title="What could go wrong?"
            lead="Described calmly, because that is how these actually happen — quietly, and usually to someone who was paying attention."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s) => (
              <li key={s.id}>
                <ScenarioCard scenario={s} />
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      {/* Honest limits */}
      <Section>
        <Shell narrow>
          <SectionHeading
            eyebrow="Being straight with you"
            title="When insurance is not your first move"
            lead="We would rather tell you this than sell you something you do not need yet."
          />
          <ul className="mt-8 space-y-4">
            {[
              'If two-factor authentication is off on your email, that is a better use of the next ten minutes than reading policy wordings.',
              'If you have no backup of your photos and documents at all, fix that first. It costs almost nothing and prevents more loss than any policy.',
              'If you are about to change banks, phones or numbers, it may be worth arranging cover once the new setup is in place.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={15} strokeWidth={2.4} className="mt-1 shrink-0 text-primary" />
                <span className="text-[14.5px] leading-[1.7] text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      <FinalCta />
      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  );
}
