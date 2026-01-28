import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-8 lg:max-w-xl">
            <div className="inline-flex w-fit items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Serving Healthcare for 30+ Years
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
              Your Reliable Medical{' '}
              <span className="text-blue-600 dark:text-blue-400">Forms</span>{' '}
              Provider
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              The most reliable printing business in Huntington Beach,
              California. SNF Printing has been facilitating the health care
              industry for over 30 years. We provide the easiest access to a
              variety of medical forms and supplies. Our role is to efficiently
              provide product on call so that our valued clients can do their
              jobs without delay. We thank you for the opportunity to serve your
              needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/catalog"
                className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
              >
                View Form Catalog
              </Link>
              <Link
                href="/contact"
                className="flex h-12 items-center justify-center rounded-full border border-zinc-200 px-8 text-base font-semibold text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900 active:scale-95"
              >
                Contact Sales
              </Link>
            </div>
          </div>
          <div className="relative aspect-square w-full sm:aspect-video lg:aspect-square">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20" />
            <Image
              src="/hero-ultra.png"
              alt="Medical Professional using Forms"
              fill
              className="rounded-3xl object-cover shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
