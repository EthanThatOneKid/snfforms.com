import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { companyInfo } from '@/lib/company';

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: companyInfo.name,
              description: companyInfo.description,
              url: companyInfo.website,
              telephone: companyInfo.contact.phone,
              email: companyInfo.contact.email,
              faxNumber: companyInfo.contact.fax,
              foundingDate: '1994',
              address: {
                '@type': 'PostalAddress',
                streetAddress: companyInfo.location.address,
                addressLocality: companyInfo.location.city,
                addressRegion: companyInfo.location.state,
                postalCode: companyInfo.location.zip,
                addressCountry: 'US',
              },
              image: 'https://snfforms.com/hero.jpg',
              logo: 'https://snfforms.com/brand-logo.png',
              slogan: companyInfo.mission,
              knowsAbout: [
                'Medical Forms',
                'Healthcare Printing',
                'Skilled Nursing Facility Forms',
                'CMS Forms',
                'Medical Supplies',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: companyInfo.name,
              url: companyInfo.website,
              description: companyInfo.description,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${companyInfo.website}/forms?query={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
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
