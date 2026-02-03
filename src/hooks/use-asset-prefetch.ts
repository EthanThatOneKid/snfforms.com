import { useCallback } from 'react';
import { getAssetImageSrc } from '@/lib/utils';

export function useAssetPrefetch() {
  const prefetchAsset = useCallback((assetIdOrUrl: string | undefined) => {
    if (!assetIdOrUrl) return;
    const url = getAssetImageSrc(assetIdOrUrl);
    if (!url) return;
    const img = new window.Image();
    img.src = url;
  }, []);

  return prefetchAsset;
}
