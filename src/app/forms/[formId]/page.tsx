import { getFormById } from '@/lib/sheets';
import { getAssetUrl, getFormAssetUrls } from '@/lib/utils';
import { productJsonLd } from '@/lib/json-ld';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FormPreview } from '@/components/form-preview';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/breadcrumb';

interface PageProps {
  params: Promise<{
    formId: string;
  }>;
  searchParams: Promise<{
    facility?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { formId } = await params;
  const { facility } = await searchParams;
  const form = await getFormById(formId);

  if (!form) {
    return {
      title: 'Form Not Found',
    };
  }

  const title = facility
    ? `${form.formId} - ${form.description} | Used by ${facility}`
    : `${form.formId} - ${form.description}`;

  const description = facility
    ? `Precision medical form ${form.formId} (${form.description}). Used by ${facility}. Size: ${form.size}, Unit: ${form.unit}.`
    : `Order form ${form.formId}: ${form.description}. Size: ${form.size}, Unit: ${form.unit}.`;

  const { images } = getFormAssetUrls(form);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export default async function FormPage({ params, searchParams }: PageProps) {
  const { formId } = await params;
  const { facility } = await searchParams;
  const form = await getFormById(formId);

  if (!form) {
    notFound();
  }

  const jsonLd = productJsonLd(form);

  const breadcrumbItems = [
    { label: 'Forms', href: '/forms' },
    { label: form.category, href: `/forms?category=${form.category}` },
    { label: form.formId, href: `/forms/${form.formId}` },
  ];

  return (
    <div className="bg-background pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Image Preview */}
          <div>
            <FormPreview form={form} />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase text-primary ring-1 ring-inset ring-primary/20 tracking-wider">
                  {form.category}
                </span>
                <span className="text-sm font-mono text-muted-foreground uppercase tracking-tight font-bold">
                  {form.formId}
                </span>
              </div>
              {facility && (
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/60">
                  Used by {facility}
                </p>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
                {form.description}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm uppercase text-muted-foreground border-t border-border pt-6 font-semibold tracking-wide mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-foreground/40 leading-none">
                  Size
                </span>
                <span className="text-foreground">{form.size || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-foreground/40 leading-none">
                  Paper
                </span>
                <span className="text-foreground">{form.paper || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-foreground/40 leading-none">
                  Color
                </span>
                <span className="text-foreground">{form.color || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-foreground/40 leading-none">
                  Sides
                </span>
                <span className="text-foreground">{form.sides || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-foreground/40 leading-none">
                  Unit
                </span>
                <span className="text-foreground">{form.unit || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-border">
              {/* Future implementation: Order/Contact logic */}
              {form.pdf0 && (
                <a
                  href={getAssetUrl(form.pdf0)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-8 py-3 text-xs font-bold uppercase tracking-widest text-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:translate-y-[-1px] active:translate-y-[0] active:scale-[0.98]"
                >
                  <FileText size={16} />
                  Preview PDF
                </a>
              )}
              <Link
                href="/contact"
                className="flex w-full items-center justify-center rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:translate-y-[-1px] active:translate-y-[0] active:scale-[0.98]"
              >
                Contact to Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
