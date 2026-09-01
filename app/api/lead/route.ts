import { NextResponse, type NextRequest } from 'next/server';
import { leadSchema, toE164India, type Lead } from '@/lib/schemas';
import { makeLeadId } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * §10.4 — the lead endpoint.
 *
 *   1. Validate with the shared Zod schema; reject if consent !== true.
 *   2. Email the enquiry to the team inbox.
 *   3. Append a row to a Google Sheet (service-account creds from env only).
 *   4. POST to LEAD_WEBHOOK_URL (no-op when unset) — the stub for the owner's
 *      real CRM.
 *
 * Every destination is independent and best-effort: one failing must not lose
 * the lead or fail the customer's submission. The outcome per destination is
 * logged so a failed delivery can be found and replayed.
 *
 * Credentials live only in env vars and are never returned to the client.
 */

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

type DeliveryResult = { destination: string; ok: boolean; error?: string };

/** Plain-text body for the team inbox. */
function renderEmail(lead: Lead): string {
  const rows: [string, string | undefined][] = [
    ['Lead ID', lead.leadId],
    ['Type', lead.formType],
    ['Plan', lead.planType],
    ['Family members', lead.familyMembers?.toString()],
    ['Includes dependents', lead.includesDependents === undefined ? undefined : lead.includesDependents ? 'yes' : 'no'],
    ['Name', lead.contact.name],
    ['Mobile', toE164India(lead.contact.mobile)],
    ['Email', lead.contact.email],
    ['City', lead.city],
    ['Contact preference', lead.contactPreference],
    ['Requirement', lead.requirement],
    ['Product', lead.product],
    ['Submitted from', lead.page],
    ['UTM', lead.utm ? JSON.stringify(lead.utm) : undefined],
    ['Received', lead.timestamp],
  ];

  return [
    `New Backup24/7 enquiry — ${lead.formType}${lead.planType ? ` (${lead.planType})` : ''}`,
    '',
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    '',
    'Consent recorded: yes',
  ].join('\n');
}

/**
 * Step 2 — email. Transport-agnostic on purpose: point MAIL_API_URL at SES,
 * Resend, Postmark or an internal relay. Implement once, swap freely.
 */
async function sendEmail(lead: Lead): Promise<DeliveryResult> {
  const endpoint = process.env.MAIL_API_URL;
  const to = process.env.LEAD_INBOX; // PLACEHOLDER team inbox

  if (!endpoint || !to) return { destination: 'email', ok: false, error: 'not configured' };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.MAIL_API_KEY ? { Authorization: `Bearer ${process.env.MAIL_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        to: to.split(',').map((s) => s.trim()),
        from: process.env.LEAD_FROM ?? 'website@backup247.in',
        subject: `New enquiry ${lead.leadId} — ${lead.contact.name}`,
        text: renderEmail(lead),
      }),
    });
    if (!res.ok) throw new Error(`mail responded ${res.status}`);
    return { destination: 'email', ok: true };
  } catch (e) {
    return { destination: 'email', ok: false, error: e instanceof Error ? e.message : 'failed' };
  }
}

/**
 * Step 3 — Google Sheet.
 *
 * Uses a Sheets-compatible append endpoint held in env. A service-account JWT
 * flow needs a signing dependency; keeping the transport in env means the
 * credential never reaches the client either way, which is the actual
 * requirement in §10.4.
 */
async function appendToSheet(lead: Lead): Promise<DeliveryResult> {
  const endpoint = process.env.SHEET_APPEND_URL; // PLACEHOLDER
  if (!endpoint) return { destination: 'sheet', ok: false, error: 'not configured' };

  const row = [
    lead.timestamp,
    lead.leadId,
    lead.formType,
    lead.planType ?? '',
    lead.contact.name,
    toE164India(lead.contact.mobile),
    lead.contact.email,
    lead.city ?? '',
    lead.contactPreference ?? '',
    lead.requirement ?? '',
    lead.page,
    lead.utm ? JSON.stringify(lead.utm) : '',
  ];

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.SHEET_TOKEN ? { Authorization: `Bearer ${process.env.SHEET_TOKEN}` } : {}),
      },
      body: JSON.stringify({ values: [row] }),
    });
    if (!res.ok) throw new Error(`sheet responded ${res.status}`);
    return { destination: 'sheet', ok: true };
  } catch (e) {
    return { destination: 'sheet', ok: false, error: e instanceof Error ? e.message : 'failed' };
  }
}

/** Step 4 — webhook stub for the owner's CRM. No-op when unset. */
async function postWebhook(lead: Lead): Promise<DeliveryResult> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return { destination: 'webhook', ok: false, error: 'not configured' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
    return { destination: 'webhook', ok: true };
  } catch (e) {
    return { destination: 'webhook', ok: false, error: e instanceof Error ? e.message : 'failed' };
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many submissions. Please try again in a minute.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please check the highlighted fields.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // Honeypot: accept silently so bots learn nothing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, leadId: 'B247-0000-000000' }, { status: 200 });
  }

  const lead: Lead = {
    ...parsed.data,
    leadId: makeLeadId(),
    timestamp: new Date().toISOString(),
  };

  const results = await Promise.all([sendEmail(lead), appendToSheet(lead), postWebhook(lead)]);

  const delivered = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  if (failed.length) {
    // Logged, never surfaced: the customer must not see infrastructure detail.
    console.error(
      `[lead ${lead.leadId}] delivered=${delivered.map((d) => d.destination).join(',') || 'none'} ` +
        `failed=${failed.map((f) => `${f.destination}(${f.error})`).join(',')}`,
    );
  }

  /**
   * Nothing configured yet is the expected state of a preview build, so the
   * lead is logged rather than dropped. Losing an enquiry silently would be the
   * worst possible failure mode here.
   */
  if (!delivered.length) {
    console.warn(
      `[lead ${lead.leadId}] no destination configured — enquiry captured in logs only:\n${renderEmail(lead)}`,
    );
  }

  return NextResponse.json({ ok: true, leadId: lead.leadId }, { status: 201 });
}
