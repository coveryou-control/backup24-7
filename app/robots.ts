import type { MetadataRoute } from 'next';
import { site, IS_PREVIEW } from '@/content/site';

/**
 * §12 — robots.
 *
 * While IS_PREVIEW is true the whole site is disallowed: the legal entity, IRDAI
 * registration and insurer product details are PLACEHOLDERs, and §11 forbids
 * shipping those as fact. Flip IS_PREVIEW with the launch checklist (§16).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: IS_PREVIEW
      ? { userAgent: '*', disallow: '/' }
      : { userAgent: '*', allow: '/', disallow: ['/api/', '/thank-you', '/get-a-quote'] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
