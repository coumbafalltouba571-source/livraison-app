import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://livraison-app-bxgz.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const date = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: date,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/boutique`,
      lastModified: date,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/tarifs`,
      lastModified: date,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/help`,
      lastModified: date,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/legal/terms`,
      lastModified: date,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/legal/privacy`,
      lastModified: date,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
