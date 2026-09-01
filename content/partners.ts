import type { Insurer, Product } from './types';

/**
 * §8.5 / §8.6 — insurers and their products.
 *
 * BOTH ARE `approvalStatus: 'pending'` AND `active: false`, deliberately.
 *
 * §11 requires, before launch: confirmation that each partner offers a
 * personal/family cyber product, verified product names, coverage, exclusions,
 * limits and sums insured, and logo usage rights. None of that exists yet, so
 * nothing here may render. `publishableInsurers()` and `publishableProducts()`
 * return empty arrays, and the pages that consume them degrade to an honest
 * "being confirmed" state instead of showing unverified detail.
 *
 * To go live: verify the facts, set logo + approvalStatus: 'approved' + active,
 * and the partner pages, product pages, trust strip and sitemap all appear.
 */
export const insurers: Insurer[] = [
  {
    id: 'tata-aig',
    slug: 'tata-aig',
    name: 'Tata AIG',
    logo: null, // PLACEHOLDER — usage rights not verified
    description:
      'PLACEHOLDER (verify — confirm this partner offers a personal/family cyber product, and use insurer-approved wording).',
    products: ['tata-aig-cyber-insurance'],
    active: false,
    displayOrder: 1,
    approvalStatus: 'pending',
    seo: {
      title: 'Tata AIG — Insurance Partner',
      description:
        'About our insurance partner. Cover is subject to eligibility, underwriting and policy terms.',
    },
  },
  {
    id: 'icici-lombard',
    slug: 'icici-lombard',
    name: 'ICICI Lombard',
    logo: null, // PLACEHOLDER — usage rights not verified
    description:
      'PLACEHOLDER (verify — confirm this partner offers a personal/family cyber product, and use insurer-approved wording).',
    products: ['icici-lombard-cyber-insurance'],
    active: false,
    displayOrder: 2,
    approvalStatus: 'pending',
    seo: {
      title: 'ICICI Lombard — Insurance Partner',
      description:
        'About our insurance partner. Cover is subject to eligibility, underwriting and policy terms.',
    },
  },
];

/** §8.5 — render only approved, active insurers. */
export function publishableInsurers(): Insurer[] {
  return insurers
    .filter((i) => i.active && i.approvalStatus === 'approved')
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function insurerBySlug(slug: string) {
  return insurers.find((i) => i.slug === slug);
}

/** Logos are gated separately from the record (§8.5): null logo → text name. */
export function canShowLogo(insurer: Insurer): boolean {
  return Boolean(insurer.logo) && insurer.approvalStatus === 'approved';
}

const PENDING = 'PLACEHOLDER (verify vs insurer documentation)';

export const products: Product[] = [
  {
    id: 'tata-aig-cyber-insurance',
    slug: 'tata-aig-cyber-insurance',
    name: PENDING,
    insurerId: 'tata-aig',
    heroTitle: PENDING,
    heroDescription: PENDING,
    suitableFor: ['individual', 'family'],
    problemAddressed: PENDING,
    keyCoverage: [PENDING],
    potentialBenefits: [PENDING],
    optionalCovers: [PENDING],
    importantExclusions: [PENDING],
    eligibility: [PENDING],
    informationRequired: [
      'Your name and contact details',
      'Your city',
      'Whether you want Individual or Family cover',
      'Whether this is a new policy or a renewal',
    ],
    faqs: [],
    claimsInfo:
      'The claims process is the same whichever insurer issues your policy: notify promptly, secure affected accounts, preserve evidence, provide documentation, and work through the assessment.',
    relatedArticles: ['how-upi-fraud-happens', 'what-is-identity-theft'],
    approvalStatus: 'pending',
    seo: {
      title: 'Cyber Insurance Product — Tata AIG',
      description: 'Product details are being confirmed with the insurer.',
    },
    lastReviewed: '2026-09-01',
  },
  {
    id: 'icici-lombard-cyber-insurance',
    slug: 'icici-lombard-cyber-insurance',
    name: PENDING,
    insurerId: 'icici-lombard',
    heroTitle: PENDING,
    heroDescription: PENDING,
    suitableFor: ['individual', 'family'],
    problemAddressed: PENDING,
    keyCoverage: [PENDING],
    potentialBenefits: [PENDING],
    optionalCovers: [PENDING],
    importantExclusions: [PENDING],
    eligibility: [PENDING],
    informationRequired: [
      'Your name and contact details',
      'Your city',
      'Whether you want Individual or Family cover',
      'Whether this is a new policy or a renewal',
    ],
    faqs: [],
    claimsInfo:
      'The claims process is the same whichever insurer issues your policy: notify promptly, secure affected accounts, preserve evidence, provide documentation, and work through the assessment.',
    relatedArticles: ['individual-vs-family-cover'],
    approvalStatus: 'pending',
    seo: {
      title: 'Cyber Insurance Product — ICICI Lombard',
      description: 'Product details are being confirmed with the insurer.',
    },
    lastReviewed: '2026-09-01',
  },
];

export function publishableProducts(): Product[] {
  return products.filter((p) => p.approvalStatus === 'approved');
}

export function productBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsForInsurer(insurerId: string): Product[] {
  return products.filter((p) => p.insurerId === insurerId);
}
