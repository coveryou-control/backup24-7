import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Phone, MessageCircle, ArrowRight } from 'lucide-react';

import { Shell, CTAButton, Panel, Disclaimer } from '@/components/primitives';
import { contact, telHref, waHref } from '@/content/site';

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'We have received your enquiry.',
  robots: { index: false, follow: false },
};

/**
 * §10.5 — thank-you page. H1 is specified.
 *
 * Note what is deliberately absent: any promise about claim outcomes, and any
 * specific response-time commitment. §11 forbids the first; the second is left
 * out until the team confirms a turnaround they can actually keep.
 */
export default function ThankYouPage() {
  return (
    <Shell narrow className="py-20 md:py-28">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-pill bg-primary/10 text-primary">
          <Check size={30} strokeWidth={2.2} />
        </span>

        <h1 className="mt-7 text-[28px] font-extrabold leading-[1.15] tracking-tight text-ink md:text-[38px]">
          You’re one step closer to better cyber protection.
        </h1>

        <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-[1.75] text-muted">
          We’ve received your enquiry. Our team will review what you shared and contact you about
          suitable options — on the channel you asked for.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-pill bg-primary px-7 text-[13px] font-bold uppercase tracking-wide text-on-primary transition-colors hover:bg-primary-hover"
          >
            <MessageCircle size={17} strokeWidth={2.2} />
            WhatsApp us
          </a>
          <a
            href={telHref}
            className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-pill px-7 text-[13px] font-bold uppercase tracking-wide text-ink ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/[0.06]"
          >
            <Phone size={16} strokeWidth={2.2} />
            Call {contact.phoneDisplay}
          </a>
        </div>

        <p className="mt-6 text-[12px] text-subtle">{contact.officeHours}</p>
      </div>

      <Panel hover={false} className="mt-14 p-6 text-left">
        <h2 className="text-[16px] font-semibold text-ink">While you wait, these are worth five minutes</h2>
        <ul className="mt-4 space-y-2.5">
          {[
            { label: 'What cyber insurance can help protect', href: '/coverage' },
            {
              label: 'What is not covered — worth reading before you buy anything',
              href: '/coverage/what-is-not-covered',
            },
            { label: 'What to do if an incident happens', href: '/claims' },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex items-center gap-1.5 text-[13.5px] text-primary hover:underline"
              >
                {l.label}
                <ArrowRight size={14} strokeWidth={2.2} />
              </Link>
            </li>
          ))}
        </ul>
      </Panel>

      <Disclaimer kind="facilitation" className="mt-8" />

      <div className="mt-10 text-center">
        <CTAButton href="/" variant="ghost">
          Back to home
        </CTAButton>
      </div>
    </Shell>
  );
}
