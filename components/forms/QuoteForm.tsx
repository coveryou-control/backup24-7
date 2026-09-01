'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Info } from 'lucide-react';

import { CTAButton, Disclaimer } from '../primitives';
import {
  TextField,
  MobileField,
  SelectField,
  RadioCards,
  ChipMultiSelect,
  ConsentField,
  FormProgress,
} from './fields';
import { consentText } from '@/content/site';
import { AnalyticsEvent, track } from '@/lib/analytics';

/**
 * §10.1 — Get a Quote, four steps, progressive qualification.
 *
 * Design decisions worth keeping:
 *   - Contact details are captured at STEP 2, not last. Someone who abandons at
 *     step 3 is still a reachable lead. Asking for the phone number last is the
 *     most common way a quote funnel loses qualified people.
 *   - Step 3 is entirely optional and uses ranges, never exact figures (§10.6).
 *   - The plan arrives pre-selected from ?plan= (§10.1) so the journey is not
 *     re-asked. If it is already known, step 1 is skipped.
 *   - Nothing is cleared on a validation error, and back navigation is always
 *     available.
 */

const mobileRe = /^(?:\+?91[-\s]?)?[6-9]\d{9}$/;

/** Field schemas, declared once and reused by both the full and per-step schemas. */
const f = {
  planType: z.enum(['individual', 'family'], { message: 'Please choose Individual or Family' }),
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  mobile: z.string().trim().regex(mobileRe, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address').max(160),
  city: z.string().trim().min(2, 'Please enter your city').max(80),
  contactPreference: z.enum(['call', 'whatsapp', 'email'], {
    message: 'Please tell us how to reach you',
  }),
  consent: z.literal(true, { message: 'Please agree to be contacted so we can respond' }),
};

const schema = z.object({
  planType: f.planType,
  name: f.name,
  mobile: f.mobile,
  email: f.email,
  city: f.city,

  familyMembers: z.string().optional(),
  includesDependents: z.string().optional(),

  policyIntent: z.string().optional(),
  hasExistingCover: z.string().optional(),
  concerns: z.array(z.string()).optional(),
  transactionBand: z.string().optional(),

  contactPreference: f.contactPreference,
  consent: f.consent,

  website: z.string().max(0).optional(),
});

type Values = z.infer<typeof schema>;

/**
 * Each step is gated by its OWN schema, parsed against the current values.
 *
 * The obvious approach — `trigger(fieldNames)` against the full schema — is not
 * reliable here: the full schema is invalid until the final step by design
 * (contactPreference and consent are only collected at step 4), and reasoning
 * about how the resolver reports that back through `trigger` is exactly the kind
 * of implicit behaviour that silently breaks a funnel. Parsing the step's own
 * schema is deterministic, and the failure mode is visible.
 */
const STEP_SCHEMAS = [
  z.object({ planType: f.planType }),
  z.object({ name: f.name, mobile: f.mobile, email: f.email, city: f.city }),
  z.object({}),
  z.object({ contactPreference: f.contactPreference, consent: f.consent }),
];

const LABELS = ['Plan', 'About you', 'Requirements', 'Contact'];

const CONCERNS = [
  { value: 'online-banking', label: 'Online banking / UPI' },
  { value: 'shopping', label: 'Online shopping' },
  { value: 'social-media', label: 'Social media' },
  { value: 'family-devices', label: 'Family devices' },
  { value: 'general', label: 'General peace of mind' },
];

const BANDS = [
  { value: 'under-25k', label: 'Under ₹25,000 a month' },
  { value: '25k-1l', label: '₹25,000 – ₹1 lakh a month' },
  { value: '1l-5l', label: '₹1 – 5 lakh a month' },
  { value: 'over-5l', label: 'More than ₹5 lakh a month' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

export default function QuoteForm() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      concerns: [],
      website: '',
    },
  });

  const planType = watch('planType');
  const concerns = watch('concerns') ?? [];
  const consent = watch('consent');
  const contactPreference = watch('contactPreference');

  /**
   * §10.1 — pre-select the plan from the card the visitor arrived from, and
   * carry the campaign into the payload so the journey is not re-asked.
   *
   * Read from `window.location` in an effect rather than with
   * `useSearchParams()`. The hook forces this subtree behind a Suspense
   * boundary, and in that configuration the form rendered as server HTML and
   * never hydrated — every handler in it was dead. Reading the query after
   * mount keeps the whole form a plain, reliably-hydrated client component.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const plan = params.get('plan');
    if (plan === 'individual' || plan === 'family') {
      setValue('planType', plan);
      setStep(1); // the answer to step 1 is already known
    }

    const out: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'].forEach((k) => {
      const v = params.get(k);
      if (v) out[k] = v;
    });
    if (Object.keys(out).length) setUtm(out);
  }, [setValue]);

  useEffect(() => {
    if (!started) return;
    track(AnalyticsEvent.QUOTE_STARTED, { plan_type: planType });
  }, [started, planType]);

  function markStarted() {
    if (!started) setStarted(true);
  }

  function next() {
    const result = STEP_SCHEMAS[step].safeParse(getValues());

    if (!result.success) {
      clearErrors();
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === 'string') {
          setError(path as keyof Values, { type: 'manual', message: issue.message });
        }
      });
      // Move focus to the first error so screen-reader users are not stranded.
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>('[role="alert"]')
          ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
      return;
    }

    track(AnalyticsEvent.QUOTE_STEP_COMPLETED, {
      quote_step: (step + 1) as 1 | 2 | 3 | 4,
      plan_type: planType,
    });

    setStep((s) => Math.min(s + 1, LABELS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const onSubmit = handleSubmit(async (values) => {
    if (values.website) {
      // Honeypot: accept silently so bots learn nothing.
      router.push('/thank-you');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const requirement = [
      values.policyIntent && `Intent: ${values.policyIntent}`,
      values.hasExistingCover && `Existing cover: ${values.hasExistingCover}`,
      values.concerns?.length && `Concerns: ${values.concerns.join(', ')}`,
      values.transactionBand && `Transacts: ${values.transactionBand}`,
    ]
      .filter(Boolean)
      .join(' · ');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'quote',
          source: window.location.pathname,
          page: window.location.pathname,
          planType: values.planType,
          familyMembers: values.familyMembers ? Number(values.familyMembers) : undefined,
          includesDependents:
            values.includesDependents === undefined ? undefined : values.includesDependents === 'yes',
          city: values.city,
          utm: Object.keys(utm).length ? utm : undefined,
          contact: { name: values.name, mobile: values.mobile, email: values.email },
          requirement: requirement || undefined,
          contactPreference: values.contactPreference,
          consent: true,
        }),
      });

      const json = (await res.json()) as { ok: boolean; leadId?: string; error?: string };

      if (!res.ok || !json.ok) {
        setSubmitError(json.error ?? 'We could not submit your enquiry. Please try again, or call us.');
        setSubmitting(false);
        return;
      }

      track(AnalyticsEvent.QUOTE_SUBMITTED, {
        lead_id: json.leadId,
        plan_type: values.planType,
        form_type: 'quote',
      });

      router.push('/thank-you');
    } catch {
      setSubmitError('Something went wrong on our side. Please try again, or call us.');
      setSubmitting(false);
    }
  });

  const isFamily = planType === 'family';
  const last = step === LABELS.length - 1;

  return (
    <form
      onSubmit={onSubmit}
      onChange={markStarted}
      noValidate
      className="panel p-6 sm:p-8"
    >
      <FormProgress steps={LABELS} current={step} onStepClick={(i) => i < step && setStep(i)} />

      <div className="mt-8">
        {/* ------------------------------------------------------ step 1 */}
        {step === 0 && (
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-ink">
              Who are you covering?
            </h2>
            <p className="mt-2 text-[13.5px] text-muted">
              This decides which questions are worth asking — and which we can skip.
            </p>

            <RadioCards
              label="Plan type"
              className="mt-6"
              options={[
                { value: 'individual', label: 'Individual', description: 'Just you.' },
                { value: 'family', label: 'Family', description: 'Your household, including dependents.' },
              ]}
              value={planType}
              onChange={(v) => setValue('planType', v as 'individual' | 'family', { shouldValidate: true })}
              error={errors.planType?.message}
            />
          </div>
        )}

        {/* ------------------------------------------------------ step 2 */}
        {step === 1 && (
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-ink">About you</h2>
            <p className="mt-2 text-[13.5px] text-muted">
              Just enough to come back to you with something useful.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <TextField
                label="Full name"
                required
                autoComplete="name"
                error={errors.name?.message}
                registration={register('name')}
              />
              <MobileField label="Mobile number" error={errors.mobile?.message} registration={register('mobile')} />
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
                required
                autoComplete="address-level2"
                error={errors.city?.message}
                registration={register('city')}
              />

              {isFamily && (
                <>
                  <SelectField
                    label="How many people to cover?"
                    options={['2', '3', '4', '5', '6 or more'].map((v) => ({ value: v, label: v }))}
                    registration={register('familyMembers')}
                  />
                  <SelectField
                    label="Includes children or dependents?"
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                    ]}
                    registration={register('includesDependents')}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------ step 3 */}
        {step === 2 && (
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-ink">
              A few optional details
            </h2>
            <p className="mt-2 text-[13.5px] text-muted">
              Every field on this step is optional. Skip it if you would rather talk it through.
            </p>

            <div className="mt-6 space-y-6">
              <SelectField
                label="Is this a new policy or a renewal?"
                options={[
                  { value: 'new', label: 'New policy' },
                  { value: 'renewal', label: 'Renewal' },
                  { value: 'unsure', label: 'Not sure yet' },
                ]}
                registration={register('policyIntent')}
              />

              <SelectField
                label="Do you already have cyber insurance?"
                options={[
                  { value: 'no', label: 'No' },
                  { value: 'yes', label: 'Yes' },
                  { value: 'unsure', label: 'Not sure' },
                ]}
                registration={register('hasExistingCover')}
              />

              <ChipMultiSelect
                label="What are you most concerned about?"
                options={CONCERNS}
                values={concerns}
                onToggle={(v) =>
                  setValue('concerns', concerns.includes(v) ? concerns.filter((c) => c !== v) : [...concerns, v])
                }
              />

              <SelectField
                label="Roughly how much do you transact online?"
                hint="A range is enough. We never need exact figures."
                options={BANDS}
                registration={register('transactionBand')}
              />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------ step 4 */}
        {step === 3 && (
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-ink">
              How should we reach you?
            </h2>
            <p className="mt-2 text-[13.5px] text-muted">
              A person from our team will get in touch. We will not call at odd hours.
            </p>

            <div className="mt-6 space-y-6">
              <RadioCards
                label="Preferred contact method"
                columns={3}
                options={[
                  { value: 'call', label: 'Call me' },
                  { value: 'whatsapp', label: 'WhatsApp me' },
                  { value: 'email', label: 'Email me' },
                ]}
                value={contactPreference}
                onChange={(v) =>
                  setValue('contactPreference', v as 'call' | 'whatsapp' | 'email', { shouldValidate: true })
                }
                error={errors.contactPreference?.message}
              />

              <ConsentField
                checked={consent === true}
                onChange={(v) => setValue('consent', v as true, { shouldValidate: true })}
                text={consentText}
                error={errors.consent?.message}
              />

              <Disclaimer kind="facilitation" />
            </div>
          </div>
        )}
      </div>

      {/* Honeypot — off-screen, never focusable. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="q-website">Website</label>
        <input id="q-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {submitError && (
        <p role="alert" className="mt-6 flex items-start gap-2 rounded-card bg-danger/10 p-4 text-[13.5px] text-danger">
          <Info size={15} strokeWidth={2.2} className="mt-0.5 shrink-0" />
          {submitError}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-hairline pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="rounded-pill px-4 py-2.5 text-[13px] font-bold uppercase tracking-wide text-muted transition-colors hover:text-ink"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {last ? (
          <CTAButton type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Enquiry'}
          </CTAButton>
        ) : (
          <CTAButton type="button" onClick={next}>
            Continue
          </CTAButton>
        )}
      </div>
    </form>
  );
}
