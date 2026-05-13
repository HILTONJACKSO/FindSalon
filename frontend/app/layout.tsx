import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from '@/lib/Providers';
import Footer from '@/components/shared/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'FindSalon - Discover & Book Top Salons in Liberia',
    template: '%s | FindSalon'
  },
  description: 'FindSalon is Liberia’s premier beauty marketplace. Book elite hair stylists, nail technicians, and spa services instantly. Secure appointments with ease.',
  keywords: ['FindSalon', 'FindSalone', 'Salons in Liberia', 'Barbershop Monrovia', 'Hair Braiding Liberia', 'Beauty Services Liberia', 'Salon Booking App'],
  authors: [{ name: 'FindSalon Team' }],
  creator: 'FindSalon',
  publisher: 'FindSalon',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_LR',
    url: 'https://findsalon.com',
    siteName: 'FindSalon',
    title: 'FindSalon - Your Glow, Curated.',
    description: 'Book the most prestigious beauty artisans in your city. Liberia’s premier beauty marketplace.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FindSalon - Liberia’s Premier Beauty Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindSalon - Your Glow, Curated.',
    description: 'Book the most prestigious beauty artisans in your city.',
    images: ['/og-image.jpg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FindSalon',
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#F26419',
};

import Navbar from '@/components/shared/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
        <Providers>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '100px',
                padding: '16px 24px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              },
              success: {
                style: {
                  background: '#5D6B35',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  background: '#9C4A34',
                  color: '#fff',
                },
              },
            }}
          />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
