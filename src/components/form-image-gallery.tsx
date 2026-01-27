'use client';

import { NormalizedCatalogItem } from '@/lib/sheets';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useAssetPrefetch } from '@/hooks/use-asset-prefetch';
import { cn } from '@/lib/utils';

interface FormImageGalleryProps {
  form: NormalizedCatalogItem;
  className?: string;
  imageClassName?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
  hoverEffect?: boolean;
}

export function FormImageGallery({
  form,
  className,
  imageClassName = 'object-contain',
  buttonClassName = 'h-8 w-8 text-xs',
  activeButtonClassName = 'bg-white text-black ring-2 ring-black/10 scale-110',
  inactiveButtonClassName = 'bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm',
  hoverEffect = false,
}: FormImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const prefetchAsset = useAssetPrefetch();

  // If there's no second file, always show the first
  const activeFile = activeImageIndex === 0 ? form.file0 : form.file1;
  const imageUrl = `/api/assets/${activeFile}`;
  const hasMultipleImages = !!form.file1;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-muted flex items-center justify-center',
        className
      )}
    >
      {/* Placeholder always rendered underneath */}
      <div className="absolute inset-0 flex items-center justify-center p-8 z-0">
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center text-foreground transition-opacity',
            hoverEffect ? 'opacity-10 group-hover:opacity-20' : 'opacity-10'
          )}
        >
          <FileText size={120} strokeWidth={1} />
        </div>
        {hoverEffect && (
          <div className="z-10 text-center">
            <span className="block text-3xl font-bold text-foreground/20 uppercase tracking-widest">
              {form.formId}
            </span>
          </div>
        )}
      </div>

      {!imageError && activeFile && (
        <Image
          key={activeFile}
          src={imageUrl}
          alt={form.description}
          fill
          className={cn(
            'z-10 transition-transform duration-500',
            imageClassName,
            hoverEffect && 'group-hover:scale-105'
          )}
          onError={() => setImageError(true)}
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}

      {hasMultipleImages && (
        <div
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform items-center gap-2 z-20"
          onClick={(e) => e.preventDefault()}
        >
          {[0, 1].map((idx) => (
            <button
              key={idx}
              onClick={(e) => {
                // Stop propagation if inside a link/card that shouldn't click
                if (hoverEffect) {
                  // If used in card, prevent navigating
                  e.preventDefault();
                }
                setActiveImageIndex(idx);
              }}
              onMouseEnter={() => {
                const file = idx === 0 ? form.file0 : form.file1;
                prefetchAsset(file);
              }}
              className={cn(
                'flex items-center justify-center rounded-full font-bold shadow-sm transition-all',
                buttonClassName,
                activeImageIndex === idx
                  ? activeButtonClassName
                  : inactiveButtonClassName
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
