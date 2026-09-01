import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { HomeHero } from '@/components/Hero';
import { Shell, Section, SectionHeading, CTAButton, Disclaimer, Panel, Eyebrow } from '@/components/primitives';
import {
  CoverageCard,
  ScenarioCard,
  AudienceCard,
  PlanCard,
  ArticleCard,
  ProcessSteps,
  Timeline,
  IconTile,
} from '@/components/cards';
import { TrustStrip, PartnerGrid, FinalCta } from '@/components/blocks';
import FAQAccordion from '@/components/FAQAccordion';

import { coverageItems } from '@/content/coverage';
import { plans } from '@/content/plans';
import { audiences, scenarios, incidentTimeline, processSteps, trustPoints, faqs } from '@/content/audiences';
import { site } from '@/content/site';
import { getAllResources, resourceCategoryLabels } from '@/lib/resources';

export const metadata: Metadata = {
  title: 'Personal Cyber Insurance for Individuals & Families in India',
  description: site.description,
  alternates: { canonical: '/' },
};

/**
 * §9 — the homepage, in the specified order. It is the reference implementation
 * for every pattern used on the rest of the site.
 *
 * The journey it follows (§1): understand the risk → understand cyber insurance
 * → see what it protects → choose Individual or Family → understand the process
 * → trust Backup24/7 → get a quote. Education before conversion throughout; the
 * only hard sell is the closing band.
 */
export default function HomePage() {
  const resources = getAllResources().slice(0, 3);
  const homepageFaqs = faqs.slice(0, 6);

  const titlesFor = (ids: string[]) =>
    ids.map((id) => coverageItems.find((c) => c.id === id)?.title ?? id);

  return (
    <>
      {/* 2 — Hero */}
      <HomeHero />

      {/* 3 — Trust strip */}
      <TrustStrip />

      {/* 4 — What Is Cyber Insurance? */}
      <Section id="what-is">
        <Shell>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Start here"
                title="What is cyber insurance?"
                lead="It can help you manage certain financial consequences of cyber incidents — online fraud, identity theft, phishing, extortion or ransomware, data loss, and certain related costs."
              />
              <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.7] text-muted">
                It does not stop an incident from happening. What it can do is help with some of the
                cost and disruption that follow one — investigating what happened, restoring what
                can be restored, and the loss itself, to the extent the policy covers it.
              </p>
              <CTAButton href="/why-cyber-insurance" variant="ghost" className="mt-8">
                Understand cyber insurance
              </CTAButton>
            </div>

            <Panel hover={false} className="p-7">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-subtle">
                Personal cyber policies commonly deal with
              </p>
              <ul className="mt-6 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                {coverageItems.map((c) => (
                  <li key={c.id} className="flex items-start gap-2.5">
                    <Check size={15} strokeWidth={2.4} className="mt-[3px] shrink-0 text-primary" />
                    <span className="text-[14px] text-ink/80">{c.title}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-[12px] text-subtle">
                Not every policy covers every item, and every section has its own conditions.
              </p>
            </Panel>
          </div>
        </Shell>
      </Section>

      {/* 5 — Why You Need It */}
      <Section tone="raised" className="!py-16 md:!py-20">
        <Shell>
          <div className="mx-auto max-w-[48ch] text-center">
            <Eyebrow className="mx-auto">Why you need it</Eyebrow>
            <p className="mt-5 text-[24px] font-extrabold leading-[1.2] tracking-tight text-ink md:text-[34px]">
              One wrong tap can cost you<span className="text-primary">.</span>
            </p>
            <p className="mx-auto mt-5 max-w-[54ch] text-[14px] leading-[1.7] text-muted">
              Bank and UPI apps, saved cards, wallets, online shopping, email, social media, photos
              and documents in the cloud. Your money and your identity now live behind a handful of
              logins — and they are all reachable from one device.
            </p>
            <CTAButton
              href="/why-cyber-insurance/cyber-risks-for-individuals"
              variant="ghost"
              className="mt-8"
            >
              Explore cyber risks
            </CTAButton>
          </div>
        </Shell>
      </Section>

      {/* 6 — What Could Go Wrong? */}
      <Section id="risks">
        <Shell>
          <SectionHeading
            eyebrow="Real situations"
            title="What could go wrong?"
            lead="These are the situations people actually come to us about. None of them are unusual, and none require anyone to have been careless."
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

      {/* 7 — "Imagine This" timeline */}
      <Section tone="raised">
        <Shell>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Imagine this"
                title="Imagine your account is drained tomorrow morning."
                lead="Not a disaster film — just an ordinary Tuesday where a balance is wrong and nobody can tell you why yet. Here is how that usually unfolds."
              />
              <div className="mt-8 rounded-panel border border-primary/15 bg-primary/[0.05] p-6">
                <p className="text-[13.5px] leading-[1.7] text-muted">
                  Depending on the policy, cyber insurance may help with parts of this: eligible
                  financial loss, the cost of investigating what happened, restoring data, and
                  certain legal or administrative expenses.
                </p>
                <Disclaimer kind="coverage" className="mt-4" />
              </div>
              <CTAButton href="/how-it-works" variant="ghost" className="mt-8">
                See how cyber insurance works
              </CTAButton>
            </div>
            <Timeline items={incidentTimeline} />
          </div>
        </Shell>
      </Section>

      {/* 8 — What Can Cyber Insurance Help Protect? */}
      <Section id="coverage">
        <Shell>
          <SectionHeading
            eyebrow="What it can cover"
            title="What cyber insurance can help protect"
            lead="A cyber policy is built from sections, and not every policy includes every one. These are the six that matter most in personal life."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coverageItems.map((c) => (
              <li key={c.id}>
                <CoverageCard item={c} />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <Disclaimer kind="coverage" className="lg:max-w-[62ch]" />
            <CTAButton href="/coverage" variant="ghost">
              Explore full coverage
            </CTAButton>
          </div>
        </Shell>
      </Section>

      {/* 9 — Individual or Family? */}
      <Section id="plans" tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="Choose your cover"
            title="Individual or family?"
            lead="The deciding question is not how many people live in your home. It is how many of them can move money or approve something."
          />
          <ul className="mt-12 grid gap-5 lg:grid-cols-2">
            {plans.map((p) => (
              <li key={p.id}>
                <PlanCard
                  plan={p}
                  featured={p.id === 'family'}
                  coverageTitles={titlesFor(p.whatsIncluded)}
                />
              </li>
            ))}
          </ul>
          <Link
            href="/plans"
            className="mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:underline"
          >
            Compare the two plans side by side
            <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
        </Shell>
      </Section>

      {/* 10 — Who Is Backup24/7 For? */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="Who it is for"
            title="Built for however you live online"
            lead="Not tied to any profession or industry. If your everyday life runs online, the exposure applies to you."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a) => (
              <li key={a.id}>
                <AudienceCard audience={a} />
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      {/* 11 — How It Works */}
      <Section id="how-it-works" tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="The process"
            title="How it works"
            lead="Four steps, and a person to talk to at every one of them. Nothing is automated and nothing is decided without you."
          />
          <div className="mt-12">
            <ProcessSteps steps={processSteps} />
          </div>
          <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <Disclaimer kind="facilitation" className="lg:max-w-[62ch]" />
            <CTAButton href="/get-a-quote">Get started</CTAButton>
          </div>
        </Shell>
      </Section>

      {/* 12 — Why Backup24/7? */}
      <Section>
        <Shell>
          <SectionHeading
            eyebrow="Why Backup24/7"
            title="Cyber protection for everyday life"
            lead="We are an insurance broker, not a security company and not a comparison site. We help you understand the risk and place cover that actually fits."
          />
          <ul className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {trustPoints.map((t) => (
              <li key={t.title} className="flex gap-4">
                <IconTile name="check" />
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">{t.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-muted">{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Shell>
      </Section>

      {/* 13 — Insurance Partners */}
      <Section tone="raised">
        <Shell>
          <SectionHeading
            eyebrow="Insurance partners"
            title="Who provides the insurance"
            lead="Backup24/7 is a brand offered through an insurance broker. The policy itself is issued by the insurance company, which decides underwriting and claims."
          />
          <div className="mt-12">
            <PartnerGrid />
          </div>
        </Shell>
      </Section>

      {/* 14 — Cyber Knowledge Hub */}
      {resources.length > 0 && (
        <Section id="resources">
          <Shell>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Cyber knowledge hub"
                title="Understand before you decide"
                lead="Plain-language explanations of how personal cyber risk actually works."
                className="lg:max-w-[58ch]"
              />
              <CTAButton href="/resources" variant="ghost" className="shrink-0">
                Browse all resources
              </CTAButton>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((r) => (
                <li key={r.slug}>
                  <ArticleCard resource={r} categoryLabel={resourceCategoryLabels[r.category]} />
                </li>
              ))}
            </ul>
          </Shell>
        </Section>
      )}

      {/* 15 — FAQs */}
      <Section id="faqs" tone="raised">
        <Shell>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading
              eyebrow="Questions"
              title="The questions people ask first"
              lead="If you are new to personal cyber insurance, start here."
              className="lg:sticky lg:top-[104px] lg:self-start"
            >
              <CTAButton href="/faqs" variant="ghost" className="mt-8">
                See all FAQs
              </CTAButton>
            </SectionHeading>
            <FAQAccordion items={homepageFaqs} />
          </div>
        </Shell>
      </Section>

      {/* 16 — Final CTA band */}
      <FinalCta />
    </>
  );
}

