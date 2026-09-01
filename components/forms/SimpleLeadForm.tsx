'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info } from 'lucide-react';

import { CTAButton, Disclaimer } from '../primitives';
import { TextField, MobileField, TextAreaField, ConsentField } from './fields';
import { consentText } from '@/content/site';
import { AnalyticsEvent, track } from '@/lib/analytics';

/**
 * §8.13 / §10.2 — the single-step forms.
 *
 * Contact and Claims share one component because they share one payload and one
 * endpoint; only `formType` and the copy differ. That keeps every enquiry
 * arriving in the same shape however it was submitted.
 *
 * The claims variant is deliberately shorter and drops optional fields: someone
 * filling it in may be mid-incident.
 */

const mobileRe = /^(?:\+?91[-\s]?)?[6-9]\d{9}$/;

function makeSchema(variant: 'contact' | 'claims') {
  return z.object({
    name: z.string().trim().min(2, 'Please enter your name').max(120),
    mobile: z.string().trim().regex(mobileRe, 'Enter a valid 10-digit Indian mobile number'),
    email: z.string().trim().toLowerCase().email('Enter a valid email address').max(160),
    city: z.string().trim().max(80).optional(),
    requirement: z.string().trim().max(200).optional(),
    message:
      variant === 'claims'
        ? z.string().trim().min(10, 'Please tell us briefly what has happened').max(2000)
        : z.string().trim().max(2000).optional(),
    consent: z.literal(true, { message: 'Please agree to be contacted so we can respond' }),
    website: z.string().max(0).optional(),
  });
}

export default function SimpleLeadForm({
  variant = 'contact',
  className,
}: {
  variant?: 'contact' | 'claims';
  className?: string;
}) {
  const router = useRouter();
  const isClaims = variant === 'claims';

  const schema = makeSchema(variant);
  type Values = z.infer<ReturnType<typeof makeSchema>>;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { website: '' },
  });

  const consent = watch('consent');

  const onSubmit = handleSubmit(async (values) => {
    if (values.website) {
      router.push('/thank-you');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: variant,
          source: window.location.pathname,
          page: window.location.pathname,
          city: values.city || undefined,
          contact: { name: values.name, mobile: values.mobile, email: values.email },
          requirement: [values.requirement, values.message].filter(Boolean).join(' — ') || undefined,
          consent: true,
        }),
      });

      const json = (await res.json()) as { ok: boolean; leadId?: string; error?: string };

      if (!res.ok || !json.ok) {
        setSubmitError(json.error ?? 'We could not submit your enquiry. Please call us instead.');
        setSubmitting(false);
        return;
      }

      track(AnalyticsEvent.CONTACT_SUBMITTED, { lead_id: json.leadId, form_type: variant });
      router.push('/thank-you');
    } catch {
      setSubmitError('Something went wrong on our side. Please call us instead.');
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          required
          autoComplete="name"
          error={errors.name?.message}
          registration={register('name')}
        />
        <MobileField error={errors.mobile?.message} registration={register('mobile')} />
        <TextField
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          registration={register('email')}
        />
        <TextField
          label="City"
          autoComplete="address-level2"
          error={errors.city?.message}
          registration={register('city')}
        />
      </div>

      {!isClaims && (
        <TextField
          label="What do you need help with?"
          hint="For example: a quote for my family, understanding what is covered, renewing a policy."
          className="mt-5"
          error={errors.requirement?.message}
          registration={register('requirement')}
        />
      )}

      <TextAreaField
        label={isClaims ? 'What has happened?' : 'Message'}
        required={isClaims}
        rows={isClaims ? 5 : 4}
        hint={
          isClaims
            ? 'A short description is enough for now — when you noticed it, what is affected, and whether accounts are still at risk.'
            : undefined
        }
        className="mt-5"
        error={errors.message?.message}
        registration={register('message')}
      />

      <ConsentField
        className="mt-6"
        checked={consent === true}
        onChange={(v) => setValue('consent', v as true, { shouldValidate: true })}
        text={consentText}
        error={errors.consent?.message}
      />

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${variant}-website`}>Website</label>
        <input id={`${variant}-website`} type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {submitError && (
        <p role="alert" className="mt-6 flex items-start gap-2 rounded-card bg-danger/10 p-4 text-[13.5px] text-danger">
          <Info size={15} strokeWidth={2.2} className="mt-0.5 shrink-0" />
          {submitError}
        </p>
      )}

      <CTAButton type="submit" disabled={submitting} className="mt-8 w-full sm:w-auto">
        {submitting
          ? 'Submitting…'
          : isClaims
            ? 'Get Claims Assistance'
            : 'Talk to a Cyber Insurance Expert'}
      </CTAButton>

      <Disclaimer kind={isClaims ? 'claims' : 'advisory'} className="mt-6" />
    </form>
  );
}
