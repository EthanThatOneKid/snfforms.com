import { MetadataRoute } from 'next';
import { companyInfo } from '@/lib/company';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: companyInfo.name,
    short_name: companyInfo.name,
    description: companyInfo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon0.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon1.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
