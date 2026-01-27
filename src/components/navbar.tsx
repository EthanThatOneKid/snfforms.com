import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-md dark:bg-black/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-transparent.svg"
              alt="SNF Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="hidden text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:block">
              SNF Printing
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/forms"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Forms
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Contact
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
