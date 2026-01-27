'use client';

import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/forms?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2 py-6">
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          'rounded-full px-5 py-2 text-sm font-medium transition-all border',
          !activeCategory
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5'
        )}
      >
        All Forms
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={cn(
            'rounded-full px-5 py-2 text-sm font-medium transition-all border',
            activeCategory === category
              ? 'bg-primary text-primary-foreground border-primary shadow-md'
              : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
