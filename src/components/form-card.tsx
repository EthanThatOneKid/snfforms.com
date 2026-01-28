import { NormalizedCatalogItem } from '@/lib/sheets';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { FormImageGallery } from './form-image-gallery';

interface FormCardProps {
  form: NormalizedCatalogItem;
}

export function FormCard({ form }: FormCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/5 dark:hover:bg-primary/5">
      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase text-primary ring-1 ring-inset ring-primary/20 tracking-wider">
            {form.category}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tight font-semibold">
            {form.formId}
          </span>
        </div>

        <h3 className="text-sm font-bold text-foreground line-clamp-2 min-h-[40px] leading-tight">
          {form.description}
        </h3>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[10px] uppercase text-muted-foreground border-t border-border/40 pt-4 mt-auto font-semibold tracking-wide">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-foreground/40 leading-none">
              Size
            </span>
            <span className="truncate">{form.size || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-foreground/40 leading-none">
              Paper
            </span>
            <span className="truncate">{form.paper || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-foreground/40 leading-none">
              Color
            </span>
            <span className="truncate">{form.color || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-foreground/40 leading-none">
              Sides
            </span>
            <span className="truncate">{form.sides || 'N/A'}</span>
          </div>
        </div>

        <Link
          href={`/forms/${form.formId}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:translate-y-[-1px] active:translate-y-[0] active:scale-[0.98]"
        >
          View Details
          <ChevronRight size={14} />
        </Link>
      </div>

      <Link href={`/forms/${form.formId}`}>
        <FormImageGallery
          form={form}
          className="aspect-[4/5] border-t border-border/50 bg-muted group-hover:bg-muted/50 transition-colors cursor-pointer"
          imageClassName="object-cover"
          buttonClassName="h-6 w-6 text-[10px]"
          hoverEffect={true}
        />
      </Link>
    </div>
  );
}
