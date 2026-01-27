import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

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
    description: 'SNF Printing',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col bg-white font-sans dark:bg-black">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
