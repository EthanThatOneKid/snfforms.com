import { Metadata } from 'next';
import { companyInfo } from '@/lib/company';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Terms of Service
      </h1>
      <p className="mt-4 text-zinc-500 dark:text-zinc-400">
        Last updated: January 1, 2026
      </p>

      <div className="mt-10 space-y-12 text-base leading-7 text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            1. Agreement to Terms
          </h2>
          <p className="mt-4">
            These Terms of Service constitute a legally binding agreement made
            between you, whether personally or on behalf of an entity
            (&quot;you&quot;) and {companyInfo.name} (&quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;), concerning your access to and
            use of our website. By accessing the site, you have read,
            understood, and agreed to be bound by all of these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            2. Intellectual Property Rights
          </h2>
          <p className="mt-4">
            Unless otherwise indicated, the Site is our proprietary property and
            all source code, databases, functionality, software, website
            designs, audio, video, text, photographs, and graphics on the Site
            (collectively, the &quot;Content&quot;) and the trademarks, service
            marks, and logos contained therein (the &quot;Marks&quot;) are owned
            or controlled by us or licensed to us, and are protected by
            copyright and trademark laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            3. User Representations
          </h2>
          <p className="mt-4">
            By using the Site, you represent and warrant that: (1) all
            registration information you submit will be true, accurate, current,
            and complete; (2) you will maintain the accuracy of such information
            and promptly update such registration information as necessary; (3)
            you have the legal capacity and you agree to comply with these Terms
            of Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            4. Products and Services
          </h2>
          <p className="mt-4">
            We make every effort to display as accurately as possible the
            colors, features, specifications, and details of the products
            available on the Site. However, we do not guarantee that the colors,
            features, specifications, and details of the products will be
            accurate, complete, reliable, current, or free of other errors, and
            your electronic display may not accurately reflect the actual colors
            and details of the products.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            5. Governing Law
          </h2>
          <p className="mt-4">
            These Terms shall be governed by and defined following the laws of
            the State of {companyInfo.location.state}. {companyInfo.name} and
            yourself irrevocably consent that the courts of{' '}
            {companyInfo.location.state} shall have exclusive jurisdiction to
            resolve any dispute which may arise in connection with these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            6. Contact Us
          </h2>
          <p className="mt-4">
            In order to resolve a complaint regarding the Site or to receive
            further information regarding use of the Site, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
