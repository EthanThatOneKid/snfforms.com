import { MessageCircle } from 'lucide-react';

const conciergeUrl = 'https://concierge-snfforms.vercel.app/';

export function ConciergeFab() {
  return (
    <a
      href={conciergeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open SNF Concierge"
      title="Talk with SNF Concierge"
      className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 transition-transform hover:scale-105 hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-white dark:text-zinc-900 dark:shadow-black/30 dark:hover:bg-zinc-200 dark:focus-visible:ring-white"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}
