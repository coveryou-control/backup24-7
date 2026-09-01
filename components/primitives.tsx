'use client';

/**
 * Marked as a client module deliberately.
 *
 * CTAButton accepts an `onClick`, and without this directive the module is
 * compiled into the server graph when a page imports it — so the handler passed
 * from a client component (the quote form's Continue button) was silently
 * dropped and the step never advanced. These are all presentational leaves with
 * no server-only dependencies, so there is no cost to living in the client
 * graph, and server components can still render them.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { disclaimers, type DisclaimerKind } from '@/content/site';

/**
 * §7 layout + typography primitives.
 *
 * Everything on the site composes from these, so spacing, type scale and the
 * accent can never drift page to page. All colour and font values resolve
 * through the tokens in styles/tokens.css — no hex or font names here (§4).
 */

export function Shell({
  className,
  narrow,
  children,
}: {
  className?: string;
  narrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6 md:px-10',
        narrow ? 'max-w-[760px]' : 'max-w-shell',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  tone = 'base',
  className,
  children,
}: {
  id?: string;
  tone?: 'base' | 'raised';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative border-t border-hairline py-20 md:py-28',
        tone === 'raised' && 'bg-white/[0.015]',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  /** Used to stagger entrance animations via animationDelay. */
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={style}
      className={cn(
        'font-display text-[11px] font-bold uppercase tracking-[0.18em] text-primary',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = 'h2',
  align = 'left',
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  as?: 'h1' | 'h2';
  align?: 'left' | 'center';
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow className={align === 'center' ? 'mx-auto' : undefined}>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          'mt-4 font-sans font-extrabold leading-[1.1] tracking-tight text-ink',
          Tag === 'h1'
            ? 'text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px]'
            : 'text-[26px] md:text-[38px]',
          align === 'center' ? 'mx-auto max-w-[26ch]' : 'max-w-[24ch]',
        )}
      >
        {title}
      </Tag>
      {lead && (
        <div
          className={cn(
            'mt-5 text-[15px] leading-[1.7] text-muted',
            align === 'center' ? 'mx-auto max-w-[62ch]' : 'max-w-[62ch]',
          )}
        >
          {lead}
        </div>
      )}
      {children}
    </div>
  );
}

/** §7 CTAButton. One dominant CTA per section (§0) — `primary` is that one. */
export function CTAButton({
  href,
  children,
  variant = 'primary',
  className,
  onClick,
  type,
  disabled,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'inverse';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const styles = {
    primary: 'bg-primary text-on-primary hover:bg-primary-hover',
    ghost: 'text-ink ring-1 ring-inset ring-white/20 hover:bg-white/[0.06]',
    inverse: 'bg-white text-on-primary hover:bg-white/90',
  }[variant];

  const classes = cn(
    'group inline-flex max-w-full items-center justify-center gap-2.5 rounded-pill px-7 py-3.5',
    'text-center text-[13px] font-bold uppercase tracking-wide',
    'whitespace-normal sm:whitespace-nowrap transition-colors duration-200',
    'disabled:cursor-not-allowed disabled:opacity-50',
    styles,
    className,
  );

  const inner = (
    <>
      {children}
      <ArrowRight
        size={17}
        strokeWidth={2.4}
        className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type ?? 'button'} onClick={onClick} disabled={disabled} className={classes}>
      {inner}
    </button>
  );
}

/** The supplied theme's liquid-glass plate. */
export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('liquid-glass rounded-panel p-5', className)}>{children}</div>;
}

export function Panel({
  className,
  hover = true,
  children,
}: {
  className?: string;
  hover?: boolean;
  children: React.ReactNode;
}) {
  return <div className={cn('panel p-6', hover && 'panel-hover', className)}>{children}</div>;
}

/**
 * §7/§11 — the only route compliance text takes to the page.
 * Takes a key, never free text, so no page can invent its own wording.
 */
export function Disclaimer({ kind, className }: { kind: DisclaimerKind; className?: string }) {
  return (
    <p className={cn('max-w-measure text-[12px] leading-[1.6] text-subtle', className)}>
      {disclaimers[kind]}
    </p>
  );
}

/** §7 Breadcrumbs. The JSON-LD is emitted by the page, from the same trail. */
export function Breadcrumbs({ trail }: { trail: { name: string; href: string }[] }) {
  if (!trail.length) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-subtle">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-muted">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.href} className="transition-colors hover:text-primary">
                    {c.name}
                  </Link>
                  <span aria-hidden="true" className="text-white/25">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** A PLACEHOLDER-aware note. Renders the honest state instead of fake facts. */
export function PendingNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-card border border-primary/20 bg-primary/[0.06] px-4 py-3 text-[13px] leading-[1.6] text-primary/85">
      {children}
    </p>
  );
}

/**
 * §7 — Stats and Testimonial exist as components but render nothing until real,
 * approved content is supplied. §16 forbids fabricating either.
 */
export function Stats({ items }: { items?: { value: string; label: string }[] }) {
  if (!items?.length) return null;
  return (
    <ul className="grid gap-8 sm:grid-cols-3">
      {items.map((s) => (
        <li key={s.label}>
          <span className="block text-[34px] font-extrabold leading-none text-ink">{s.value}</span>
          <span className="mt-2 block text-[14px] text-subtle">{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function Testimonial({
  quote,
  attribution,
}: {
  quote?: string;
  attribution?: string;
}) {
  if (!quote) return null;
  return (
    <figure className="panel p-7">
      <blockquote className="text-[17px] leading-[1.6] text-ink">“{quote}”</blockquote>
      {attribution && <figcaption className="mt-4 text-[13px] text-subtle">{attribution}</figcaption>}
    </figure>
  );
}
