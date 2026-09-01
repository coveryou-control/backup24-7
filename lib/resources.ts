import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Resource, ResourceCategory } from '@/content/types';

/**
 * Reads the MDX articles in content/resources at build time.
 *
 * Server-only (uses node:fs), so it must never be imported from a client
 * component. Pages that need article data are server components.
 */

const DIR = path.join(process.cwd(), 'content', 'resources');

export const resourceCategoryLabels: Record<ResourceCategory, string> = {
  'cyber-insurance-basics': 'Cyber Insurance Basics',
  'personal-cyber-risk': 'Personal Cyber Risk',
  'cyber-attacks': 'Cyber Attacks',
  insurance: 'Insurance',
};

export const resourceCategories: ResourceCategory[] = [
  'cyber-insurance-basics',
  'personal-cyber-risk',
  'cyber-attacks',
  'insurance',
];

interface LoadedResource {
  meta: Resource;
  body: string;
}

function parse(file: string): LoadedResource | null {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const { data, content } = matter(raw);

  if (!data.slug || !data.title) return null;

  return {
    meta: {
      title: data.title,
      slug: data.slug,
      category: data.category,
      excerpt: data.excerpt ?? '',
      readingTime: data.readingTime ?? '',
      heroVisual: data.heroVisual ?? 'PLACEHOLDER',
      relatedPlans: data.relatedPlans ?? [],
      relatedAudience: data.relatedAudience ?? [],
      author: data.author ?? 'Backup24/7',
      reviewer: data.reviewer ?? 'PLACEHOLDER',
      lastReviewed: data.lastReviewed ?? '',
      seo: {
        title: data.seoTitle ?? data.title,
        description: data.seoDescription ?? data.excerpt ?? '',
      },
    },
    body: content,
  };
}

export function getAllResources(): Resource[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map(parse)
    .filter((r): r is LoadedResource => r !== null)
    .map((r) => r.meta)
    .sort((a, b) => b.lastReviewed.localeCompare(a.lastReviewed));
}

export function getResource(slug: string): LoadedResource | null {
  if (!fs.existsSync(DIR)) return null;
  const file = fs.readdirSync(DIR).find((f) => f.endsWith('.mdx') && parse(f)?.meta.slug === slug);
  return file ? parse(file) : null;
}

export function getResourcesByCategory(category: ResourceCategory): Resource[] {
  return getAllResources().filter((r) => r.category === category);
}
