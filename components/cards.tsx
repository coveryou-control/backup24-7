import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Database,
  Fingerprint,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  Users,
  Info,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Panel } from './primitives';
import type { Audience, CoverageItem, Insurer, Plan, Resource, ScenarioCardData } from '@/content/types';
import { canShowLogo } from '@/content/partners';

/**
 * §7 card family. One visual chassis so a grid of mixed cards still reads as a
 * single system. Cards are presentational — content arrives as props.
 */

const ICONS: Record<string, LucideIcon> = {
  card: CreditCard,
  id: Fingerprint,
  mail: Mail,
  shield: ShieldCheck,
  lock: Lock,
  database: Database,
  user: UserRound,
  users: Users,
  bag: ShoppingBag,
  check: BadgeCheck,
  info: Info,
};

export function IconTile({
  name,
  tone = 'primary',
}: {
  name: string;
  tone?: 'primary' | 'muted';
}) {
  const Icon = ICONS[name] ?? ShieldCheck;
  return (
    <span
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-card',
        tone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-white/[0.06] text-subtle',
      )}
    >
      <Icon size={18} strokeWidth={1.8} />
    </span>
  );
}

/** §7 CoverageCard — wording is already conditional in the content layer. */
export function CoverageCard({ item }: { item: CoverageItem }) {
  return (
    <Link href={`/coverage/${item.slug}`} className="group block h-full">
      <Panel className="flex h-full flex-col">
        <IconTile name={item.icon} />
        <h3 className="mt-5 text-[16px] font-semibold text-ink">{item.title}</h3>
        <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">{item.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium text-primary">
          Learn more
          <ArrowRight size={14} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Panel>
    </Link>
  );
}

/** §7 ScenarioCard — calm and factual, muted icon rather than an alarm colour. */
export function ScenarioCard({ scenario }: { scenario: ScenarioCardData }) {
  return (
    <Panel className="h-full">
      <IconTile name={scenario.icon} tone="muted" />
      <h3 className="mt-5 text-[16px] font-semibold text-ink">{scenario.title}</h3>
      <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">{scenario.body}</p>
    </Panel>
  );
}

/** §7 RiskCard — a compact risk-area chip list used on the risk pages. */
export function RiskCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel className="h-full">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-muted">
            <Check size={14} strokeWidth={2.4} className="mt-[3px] shrink-0 text-primary" />
            {i}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** §7 AudienceCard. */
export function AudienceCard({ audience }: { audience: Audience }) {
  return (
    <Link href={audience.href} className="group block h-full">
      <Panel className="flex h-full items-start gap-4">
        <IconTile name={audience.id === 'families' || audience.id === 'parents' ? 'users' : 'user'} />
        <div>
          <h3 className="text-[15px] font-semibold text-ink">{audience.type}</h3>
          <p className="mt-1.5 text-[13px] leading-[1.6] text-muted">{audience.description}</p>
          <p className="mt-3 text-[12px] text-subtle">{audience.riskAreas.join(' · ')}</p>
        </div>
      </Panel>
    </Link>
  );
}

/**
 * §7/§9.9 PlanCard. The CTA pre-selects the plan in the quote flow via
 * ?plan=, which §10.1 requires so the customer is not asked twice.
 */
export function PlanCard({
  plan,
  featured = false,
  coverageTitles,
}: {
  plan: Plan;
  featured?: boolean;
  coverageTitles: string[];
}) {
  return (
    <div
      className={cn(
        'panel flex h-full flex-col p-7',
        featured && 'border-primary/30 bg-primary/[0.04]',
      )}
    >
      <div className="flex items-center gap-3">
        <IconTile name={plan.id === 'family' ? 'users' : 'user'} />
        <h3 className="text-[19px] font-extrabold tracking-tight text-ink">{plan.name}</h3>
      </div>

      <p className="mt-4 text-[14px] leading-[1.65] text-muted">{plan.tagline}</p>

      <p className="mt-6 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-subtle">
        What it can help with
      </p>
      <ul className="mt-4 space-y-2.5">
        {coverageTitles.map((t) => (
          <li key={t} className="flex items-start gap-2.5 text-[13.5px] text-muted">
            <Check size={14} strokeWidth={2.4} className="mt-[3px] shrink-0 text-primary" />
            {t}
          </li>
        ))}
      </ul>

      {plan.familyNote && (
        <p className="mt-5 text-[12px] leading-[1.6] text-subtle">{plan.familyNote}</p>
      )}

      <div className="mt-auto pt-7">
        <Link
          href={`/get-a-quote?plan=${plan.id}`}
          className="group inline-flex w-full items-center justify-between gap-2.5 rounded-pill bg-primary px-6 py-3.5 text-[13px] font-bold uppercase tracking-wide text-on-primary transition-colors hover:bg-primary-hover"
        >
          {plan.cta}
          <ArrowRight size={17} strokeWidth={2.4} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href={`/plans/${plan.id}`}
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
        >
          More about this plan
          <ArrowRight size={14} strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  );
}

/**
 * §7/§8.5 PartnerCard. A logo renders only when usage rights are verified;
 * otherwise the insurer name shows as text.
 */
export function PartnerCard({ insurer }: { insurer: Insurer }) {
  return (
    <Link href={`/insurance-partners/${insurer.slug}`} className="group block h-full">
      <Panel className="flex h-full flex-col">
        <div className="flex h-12 items-center">
          {canShowLogo(insurer) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={insurer.logo as string} alt={insurer.name} className="h-9 w-auto object-contain" />
          ) : (
            <span className="text-[19px] font-semibold tracking-tight text-ink">{insurer.name}</span>
          )}
        </div>
        <p className="mt-4 text-[13.5px] leading-[1.65] text-muted">{insurer.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium text-primary">
          About this partner
          <ArrowRight size={14} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Panel>
    </Link>
  );
}

/** §7 ArticleCard. */
export function ArticleCard({
  resource,
  categoryLabel,
}: {
  resource: Resource;
  categoryLabel: string;
}) {
  return (
    <Link href={`/resources/${resource.slug}`} className="group block h-full">
      <Panel className="flex h-full flex-col">
        <div className="flex items-center gap-3">
          <span className="rounded-pill bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
            {categoryLabel}
          </span>
          <span className="text-[12px] text-subtle">{resource.readingTime}</span>
        </div>
        <h3 className="mt-4 text-[16px] font-semibold leading-[1.35] text-ink">{resource.title}</h3>
        <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">{resource.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium text-primary">
          Read article
          <ArrowRight size={14} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Panel>
    </Link>
  );
}

/** §7 ProcessSteps — shared by How It Works and the homepage. */
export function ProcessSteps({
  steps,
}: {
  steps: { n: string; title: string; body: string }[];
}) {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s) => (
        <li key={s.n}>
          <span className="block text-[34px] font-extrabold leading-none text-primary/25">{s.n}</span>
          <h3 className="mt-4 text-[16px] font-semibold text-ink">{s.title}</h3>
          <p className="mt-2 text-[13.5px] leading-[1.65] text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** §7 Timeline — the "Imagine This" sequence. Ends on recovery. */
export function Timeline({
  items,
}: {
  items: { step: number; label: string; detail: string }[];
}) {
  return (
    <ol className="relative">
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-[15px] top-3 w-px bg-gradient-to-b from-primary/40 via-white/15 to-primary/40"
      />
      {items.map((i) => (
        <li key={i.step} className="relative flex gap-5 pb-7 last:pb-0">
          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-white/15 bg-bg text-[12px] font-semibold text-muted">
            {i.step}
          </span>
          <div className="pt-1">
            <h3 className="text-[15px] font-semibold text-ink">{i.label}</h3>
            <p className="mt-1 text-[13.5px] leading-[1.6] text-muted">{i.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** §7 ClaimsSteps — same numbered pattern, claims copy. */
export function ClaimsSteps({ steps }: { steps: { n: string; title: string; body: string }[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((s) => (
        <li key={s.n} className="panel p-5">
          <span className="block text-[22px] font-extrabold leading-none text-primary/30">{s.n}</span>
          <h3 className="mt-3 text-[14px] font-semibold text-ink">{s.title}</h3>
          <p className="mt-1.5 text-[12.5px] leading-[1.6] text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
