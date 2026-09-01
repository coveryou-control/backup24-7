import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { PageHero } from '@/components/Hero';
import {
  Shell,
  Section,
  SectionHeading,
  CTAButton,
  Disclaimer,
  Breadcrumbs,
  Panel,
  PendingNote,
} from '@/components/primitives';
import { IconTile, ProcessSteps } from '@/components/cards';
import { PlanComparison, FinalCta } from '@/components/blocks';
import { plans, planById } from '@/content/plans';
import { coverageItems } from '@/content/coverage';
import { processSteps } from '@/content/audiences';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';

/** §8.4 — one template, two plan pages. */
export function generateStaticParams() {
  return plans.map((p) => ({ plan: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ plan: string }>;
}): Promise<Metadata> {
  const { plan } = await params;
  const found = planById(plan);
  if (!found) return {};
  return pageMetadata(found.seo, `/plans/${plan}`);
}

export default async function PlanPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan: planId } = await params;
  const plan = planById(planId);
  if (!plan) notFound();

  const included = plan.whatsIncluded
    .map((id) => coverageItems.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Plans', href: '/plans' },
    { name: plan.name, href: `/plans/${plan.id}` },
  ];

  return (
    <>
      <PageHero eyebrow="Plan" title={plan.name} lead={plan.tagline}>
        <Breadcrumbs trail={trail} />
      </PageHero>

      {/* Who it is for */}
      <Section>
        <Shell>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Who it is for"
                title="Is this the right shape for you?"
                lead="If most of these describe your situation, this is the plan we would start from."
              />
              <ul className="mt-8 space-y-3.5">
                {plan.whoItsFor.map((w) => (
                  <li key={w} className="flex items-start gap-3">
                    <Check size={15} strokeWidth={2.4} className="mt-1 shrink-0 text-primary" />
                    <span className="text-[14.5px] leading-[1.7] text-muted">{w}</span>
                  </li>
                ))}
              </ul>

              {plan.familyNote && (
                <div className="mt-8">
                  <PendingNote>{plan.familyNote}</PendingNote>
                </div>
              )}

              <CTAButton href={`/get-a-quote?plan=${plan.id}`} className="mt-8">
                {plan.cta}
              </CTAButton>
            </div>

            <div>
              <SectionHeading
                eyebrow="What it can help with"
                title="The sections included"
                lead="Every one is conditional on the policy wording, and each has its own limits."
              />
              <ul className="mt-8 space-y-3">
                {included.map((c) => (
                  <li key={c.id}>
                    <Link href={`/coverage/${c.slug}`} className="group block">
                      <Panel className="flex items-start gap-4 p-5">
                        <IconTile name={c.icon} />
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

              <div className="mt-6">
                <PendingNote>{plan.sumInsuredNote}</PendingNote>
              </div>

              <Disclaimer kind="coverage" className="mt-6" />
            </div>
          </div>
        </Shell>
      </Section>

      {/* How to get covered */}
      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="How to get covered"
            title="Four steps, and a person at each one"
            lead="Nothing is automated, and nothing is decided without you."
          />
          <div className="mt-12">
            <ProcessSteps steps={processSteps} />
          </div>
          <Disclaimer kind="facilitation" className="mt-12" />
        </Shell>
      </Section>

      {/* Comparison */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="Compare"
            title="How this differs from the other plan"
            lead="The core sections are the same in both. What changes is how many people they cover."
          />
          <div className="mt-10">
            <PlanComparison />
          </div>
        </Shell>
      </Section>

      <FinalCta title={`Get a quote for the ${plan.name}`} />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
