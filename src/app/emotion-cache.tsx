'use client';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ReactNode, useMemo } from 'react';

let emotionCache: ReturnType<typeof createCache> | null = null;

function getEmotionCache() {
  if (emotionCache === null) {
    emotionCache = createCache({ key: 'emotion' });
  }
  return emotionCache;
}

export function EmotionCacheProvider({ children }: { children: ReactNode }) {
  const cache = useMemo(() => getEmotionCache(), []);
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
