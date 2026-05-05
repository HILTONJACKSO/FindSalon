import type { Metadata } from 'next';
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
  title: 'FindSalon - Your Glow, Curated.',
  description: 'Book the most prestigious beauty artisans in your city.',
  icons: {
    icon: '/logo.jpg',
  },
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
