import { NormalizedCatalogItem } from '@/lib/sheets';
import { FormImageGallery } from './form-image-gallery';

export function FormPreview({ form }: { form: NormalizedCatalogItem }) {
  return (
    <FormImageGallery
      form={form}
      className="aspect-[4/5] rounded-xl border border-border"
      imageClassName="object-contain"
      hoverEffect={false}
    />
  );
}
