import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from '@/lib/Providers';
import Footer from '@/components/shared/Footer';

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
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
