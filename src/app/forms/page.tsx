import { getForms } from '@/lib/sheets';
import { Metadata } from 'next';
import { FormCard } from '@/components/form-card';
import { CategoryFilter } from '@/components/category-filter';
import { Search } from '@/components/search';
import { Suspense } from 'react';

interface CatalogPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export const metadata: Metadata = {
  title: 'Forms Catalog',
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category, q } = await searchParams;
  const allForms = await getForms();

  const categories = Array.from(
    new Set(allForms.map((f) => f.category))
  ).filter(Boolean);

  let filteredForms = category
    ? allForms.filter(
        (f) => f.category.toLowerCase() === category.toLowerCase()
      )
    : allForms;

  if (q) {
    filteredForms = filteredForms.filter(
      (f) =>
        f.formId.toLowerCase().includes(q.toLowerCase()) ||
        f.description.toLowerCase().includes(q.toLowerCase())
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Forms Catalog
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Browse our extensive collection of precision-printed medical and
          administrative forms.
        </p>

        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Suspense
            fallback={
              <div className="h-10 w-full animate-pulse bg-muted rounded-lg" />
            }
          >
            <Search />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <div className="h-20 w-full animate-pulse bg-muted rounded-lg" />
          }
        >
          <CategoryFilter categories={categories} />
        </Suspense>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {category || 'All Forms'}
              {q && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (Search: &quot;{q}&quot;)
                </span>
              )}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredForms.length} items)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredForms.map((form) => (
              <FormCard key={form.formId} form={form} />
            ))}
          </div>

          {filteredForms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <svg
                  className="w-12 h-12 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground">
                No forms found
              </h3>
              <p className="mt-1 text-muted-foreground">
                Try selecting a different category or clearing your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
