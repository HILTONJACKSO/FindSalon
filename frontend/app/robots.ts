import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/owner/', '/profile/', '/admin/'],
    },
    sitemap: 'https://findsalon.com/sitemap.xml',
  };
}
