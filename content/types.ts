/**
 * Content contracts — §5 of the build brief.
 *
 * Every page renders from these. Content is typed and local now, and portable to
 * a CMS later without touching a single page component.
 *
 * Anything the owner still has to supply is marked PLACEHOLDER in the data files
 * and catalogued in PLACEHOLDERS.md. Per §11, a PLACEHOLDER must never ship as
 * fact — the render layer degrades instead of inventing.
 */

export interface SEO {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: FaqCategory;
}

export type FaqCategory = 'general' | 'individuals-families' | 'coverage' | 'purchase' | 'claims';

export type PlanId = 'individual' | 'family';

/** content/partners — only rendered when approvalStatus === 'approved'. */
export interface Insurer {
  id: string;
  slug: string;
  name: string;
  /** PLACEHOLDER until usage rights verified → falls back to the text name. */
  logo: string | null;
  description: string;
  products: string[];
  active: boolean;
  displayOrder: number;
  approvalStatus: 'approved' | 'pending';
  seo: SEO;
}

/** content/plans — Individual and Family. Quote-driven, never priced here. */
export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  whoItsFor: string[];
  whatsIncluded: string[];
  familyNote?: string;
  /** PLACEHOLDER — no invented figures (§8.4). */
  sumInsuredNote: string;
  cta: string;
  seo: SEO;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  insurerId: string;
  heroTitle: string;
  heroDescription: string;
  suitableFor: PlanId[];
  problemAddressed: string;
  keyCoverage: string[];
  potentialBenefits: string[];
  optionalCovers?: string[];
  importantExclusions: string[];
  eligibility: string[];
  informationRequired: string[];
  faqs: FAQ[];
  claimsInfo: string;
  relatedArticles: string[];
  approvalStatus: 'approved' | 'pending';
  seo: SEO;
  lastReviewed: string;
}

/** content/audiences — "who it's for" segments, not industries. */
export interface Audience {
  id: string;
  type: string;
  description: string;
  riskAreas: string[];
  relevantPlans: PlanId[];
  href: string;
}

export interface CoverageItem {
  id: string;
  slug: string;
  title: string;
  /** Always conditional language — potential / eligible / covered / subject to. */
  summary: string;
  detail: string;
  /** What this section of a policy typically responds to. */
  typicallyHelps: string[];
  /** The conditions people are most often surprised by. */
  watchOut: string[];
  relatedPlans: PlanId[];
  icon: string;
  seo: SEO;
}

export type ResourceCategory =
  | 'cyber-insurance-basics'
  | 'personal-cyber-risk'
  | 'cyber-attacks'
  | 'insurance';

/** Frontmatter contract for content/resources/*.mdx. */
export interface Resource {
  title: string;
  slug: string;
  category: ResourceCategory;
  excerpt: string;
  readingTime: string;
  heroVisual: string;
  relatedPlans: PlanId[];
  relatedAudience: string[];
  author: string;
  reviewer: string;
  lastReviewed: string;
  seo: SEO;
}

export interface ScenarioCardData {
  id: string;
  title: string;
  body: string;
  icon: string;
}
