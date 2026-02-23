import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { breadcrumbListJsonLd } from '@/lib/json-ld';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLd = breadcrumbListJsonLd(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        className="flex mb-6 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              <Home className="mr-2 h-3 w-3" />
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.href}>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 mx-1" />
                <Link
                  href={item.href}
                  className={`ml-1 text-xs font-semibold uppercase tracking-wider transition-colors hover:text-primary ${
                    index === items.length - 1
                      ? 'text-foreground pointer-events-none'
                      : 'text-muted-foreground'
                  }`}
                  aria-current={index === items.length - 1 ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
