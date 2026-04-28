'use client';

import { useCallback, useEffect, useRef } from 'react';

type UseIntersectionObserverOptions = {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
};

export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  rootMargin = '0px 0px 200px 0px',
  threshold = 0,
}: UseIntersectionObserverOptions): (node: HTMLElement | null) => void {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) onIntersectRef.current();
        },
        { rootMargin, threshold },
      );

      observerRef.current.observe(node);
    },
    [enabled, rootMargin, threshold],
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return sentinelRef;
}
