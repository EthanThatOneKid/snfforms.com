import { Sparkles } from 'lucide-react';

const conciergeUrl = 'https://concierge-snfforms.vercel.app/';

export function ConciergeFab() {
  return (
    <a
      href={conciergeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open SNF AI Concierge"
      title="Talk with SNF AI Concierge"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 ring-1 ring-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:right-6 sm:bottom-6 sm:gap-2.5 sm:px-5 sm:py-3"
    >
      <Sparkles className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">AI Concierge</span>
    </a>
  );
}
