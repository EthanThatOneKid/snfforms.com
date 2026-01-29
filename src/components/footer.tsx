import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-transparent.svg"
                alt="SNF Logo"
                width={32}
                height={32}
                className="h-8 w-auto hover-rotate-logo"
              />
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                SNF Printing
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
              Facilitating the health care industry for over 30 years with
              premium form solutions and medical supplies.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/forms"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href="mailto:sales@snfforms.com"
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  sales@snfforms.com
                </a>
              </li>
              <li>
                <p>15532 Computer Lane</p>
                <p>Huntington Beach, CA</p>
              </li>
              <li>
                <p>
                  Phone:{' '}
                  <a
                    href="tel:+17149016868"
                    className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    (714) 901-6868
                  </a>
                </p>
              </li>
              <li>
                <p>Fax: (714) 901-6858</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} SNF Printing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
