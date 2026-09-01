import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { coverageItems } from '@/content/coverage';
import { plans } from '@/content/plans';
import { publishableInsurers, publishableProducts } from '@/content/partners';
import { riskProfiles } from '@/content/risks';
import { getAllResources } from '@/lib/resources';

/**
 * §12 — generated sitemap.
 *
 * Insurer, product, coverage, plan and article routes all come from the content
 * layer, so adding an entity adds its URL automatically. Unapproved insurers and
 * products are excluded because the `publishable*` helpers filter them out — the
 * same gate that stops their pages existing at all.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${site.url}${path}`;

  const staticRoutes: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['/', 1.0, 'weekly'],
    ['/why-cyber-insurance', 0.9, 'monthly'],
    ['/why-cyber-insurance/why-you-need-cyber-insurance', 0.9, 'monthly'],
    ['/coverage', 0.9, 'monthly'],
    ['/coverage/what-is-not-covered', 0.8, 'monthly'],
    ['/plans', 0.9, 'monthly'],
    ['/insurance-partners', 0.7, 'monthly'],
    ['/products', 0.7, 'monthly'],
    ['/how-it-works', 0.8, 'monthly'],
    ['/claims', 0.8, 'monthly'],
    ['/resources', 0.7, 'weekly'],
    ['/faqs', 0.7, 'monthly'],
    ['/about', 0.6, 'yearly'],
    ['/contact', 0.7, 'yearly'],
    ['/privacy-policy', 0.3, 'yearly'],
    ['/terms', 0.3, 'yearly'],
    ['/disclaimer', 0.4, 'yearly'],
  ];

  return [
    ...staticRoutes.map(([path, priority, changeFrequency]) => ({
      url: url(path),
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...riskProfiles.map((r) => ({
      url: url(`/why-cyber-insurance/${r.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...coverageItems.map((c) => ({
      url: url(`/coverage/${c.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...plans.map((p) => ({
      url: url(`/plans/${p.id}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...publishableInsurers().map((i) => ({
      url: url(`/insurance-partners/${i.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...publishableProducts().map((p) => ({
      url: url(`/products/${p.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...getAllResources().map((r) => ({
      url: url(`/resources/${r.slug}`),
      lastModified: new Date(r.lastReviewed || now),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
