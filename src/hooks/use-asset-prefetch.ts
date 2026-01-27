import { useCallback } from 'react';

export function useAssetPrefetch() {
  const prefetchAsset = useCallback((assetId: string | undefined) => {
    if (!assetId) return;
    const img = new window.Image();
    img.src = `/api/assets/${assetId}`;
  }, []);

  return prefetchAsset;
}
