import type { Metadata } from 'next';
import { site, legal, contact, IS_PREVIEW } from '@/content/site';
import type { SEO } from '@/content/types';

/**
 * §12 — SEO helpers.
 *
 * While IS_PREVIEW is true the whole site is noindex: the legal entity, IRDAI
 * registration and insurer product details are still PLACEHOLDERs, and §11
 * forbids shipping those as fact. Indexing turns on with the launch checklist,
 * not before.
 */

export function pageMetadata(seo: SEO, path: string): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical ?? path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${site.url}${path}`,
      siteName: site.name,
      type: 'website',
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
    robots: IS_PREVIEW ? { index: false, follow: false } : undefined,
  };
}

/** Site-wide Organization / InsuranceAgency JSON-LD. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'InsuranceAgency',
    name: site.name,
    legalName: legal.entity,
    url: site.url,
    description: site.description,
    areaServed: 'IN',
    telephone: contact.phone,
    email: contact.email,
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.href}`,
    })),
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}

export function articleSchema(a: {
  title: string;
  description: string;
  path: string;
  author: string;
  lastReviewed: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: `${site.url}${a.path}`,
    author: { '@type': 'Organization', name: a.author },
    publisher: { '@type': 'Organization', name: site.name },
    dateModified: a.lastReviewed,
  };
}

/** Renders a JSON-LD block. Server-safe. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
