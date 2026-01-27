import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://snfforms.com'),
  title: 'SNF Printing',
  description:
    'SNF Printing provides precision printing and easy access to medical forms and supplies for the healthcare industry for over 30 years.',
  icons: {
    icon: '/brand-logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SNF Printing',
    description:
      'Precision printing and easy access to medical forms and supplies for the healthcare industry.',
    images: ['/hero.jpg'],
  },
  openGraph: {
    title: 'SNF Printing',
    description:
      'Precision printing and easy access to medical forms and supplies for the healthcare industry.',
    images: ['/hero.jpg'],
  },
  appleWebApp: {
    title: 'SNF Printing',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
