import { z } from 'zod';

/**
 * §10.3 — the lead contract, shared between the client form and /api/lead.
 * One schema, one source of truth for validation on both sides.
 */

/** Indian mobile numbers, with or without a +91 / 0 prefix (§10.6). */
const mobile = z
  .string()
  .trim()
  .regex(/^(?:\+?91[-\s]?)?[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number');

export const planTypeSchema = z.enum(['individual', 'family']);
export const formTypeSchema = z.enum(['quote', 'contact', 'claims']);
export const contactPreferenceSchema = z.enum(['call', 'whatsapp', 'email']);

export const leadSchema = z.object({
  formType: formTypeSchema,
  source: z.string().max(300).default('/'),
  page: z.string().max(300).default('/'),

  planType: planTypeSchema.optional(),
  familyMembers: z.coerce.number().int().min(2).max(20).optional(),
  includesDependents: z.boolean().optional(),
  product: z.string().max(120).optional(),
  city: z.string().trim().max(80).optional(),

  utm: z.record(z.string(), z.string().max(200)).optional(),

  contact: z.object({
    name: z.string().trim().min(2, 'Please enter your name').max(120),
    mobile,
    email: z.string().trim().toLowerCase().email('Enter a valid email address').max(160),
  }),

  requirement: z.string().trim().max(2000).optional(),
  contactPreference: contactPreferenceSchema.optional(),

  /** §10.4 step 1: reject the submission outright if this is not true. */
  consent: z.literal(true, { message: 'Please agree to be contacted so we can respond' }),

  /** Honeypot — humans never see it, so it must arrive empty. */
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** The stored/forwarded record: input plus what the server stamps on. */
export type Lead = LeadInput & {
  leadId: string;
  timestamp: string;
};

/* ------------------------------------------------------------------ quote UI */

/** Step-by-step schemas, so each step validates only its own fields. */
export const quoteStep1 = z.object({ planType: planTypeSchema });

export const quoteStep2 = z.object({
  contact: z.object({
    name: z.string().trim().min(2, 'Please enter your name').max(120),
    mobile,
    email: z.string().trim().toLowerCase().email('Enter a valid email address').max(160),
  }),
  city: z.string().trim().min(2, 'Please enter your city').max(80),
  familyMembers: z.coerce.number().int().min(2).max(20).optional(),
  includesDependents: z.boolean().optional(),
});

export const quoteStep3 = z.object({
  policyIntent: z.enum(['new', 'renewal', 'unsure']).optional(),
  hasExistingCover: z.enum(['yes', 'no', 'unsure']).optional(),
  concerns: z.array(z.string()).optional(),
  transactionBand: z.string().optional(),
});

export const quoteStep4 = z.object({
  contactPreference: contactPreferenceSchema,
  consent: z.literal(true, { message: 'Please agree to be contacted so we can respond' }),
});

export const contactFormSchema = z.object({
  contact: z.object({
    name: z.string().trim().min(2, 'Please enter your name').max(120),
    mobile,
    email: z.string().trim().toLowerCase().email('Enter a valid email address').max(160),
  }),
  city: z.string().trim().max(80).optional(),
  requirement: z.string().trim().max(200).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true, { message: 'Please agree to be contacted so we can respond' }),
});

export const claimsFormSchema = z.object({
  contact: z.object({
    name: z.string().trim().min(2, 'Please enter your name').max(120),
    mobile,
    email: z.string().trim().toLowerCase().email('Enter a valid email address').max(160),
  }),
  message: z.string().trim().min(10, 'Please tell us briefly what has happened').max(2000),
  consent: z.literal(true, { message: 'Please agree to be contacted so we can respond' }),
});

/** Normalise to +91XXXXXXXXXX so every downstream system gets one format. */
export function toE164India(value: string): string {
  return `+91${value.replace(/\D/g, '').slice(-10)}`;
}
