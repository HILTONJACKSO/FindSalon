import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FindSalon - Your Glow, Curated.',
    short_name: 'FindSalon',
    description: 'Book the most prestigious beauty artisans in your city.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfaf5',
    theme_color: '#F26419',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
