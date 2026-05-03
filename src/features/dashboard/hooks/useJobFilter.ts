'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import type { FitLevel } from '@/shared/types/job';
import { parseFitLevel } from '../utils/parseFitLevel';

function readFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    sigungu: params.get('sigungu') || null,
    fitLevel: parseFitLevel(params.get('fitLevel')),
  };
}

export function useJobFilter() {
  const pathname = usePathname();

  const [sigungu, setSigungu] = useState<string | null>(null);
  const [fitLevel, setFitLevel] = useState<FitLevel | null>(null);

  // 마운트 시 URL에서 초기값 읽기
  useEffect(() => {
    const { sigungu: s, fitLevel: f } = readFiltersFromUrl();
    setSigungu(s);
    setFitLevel(f);
  }, []);

  // 뒤로가기/앞으로가기 시 URL과 동기화
  useEffect(() => {
    const handlePopState = () => {
      const { sigungu: s, fitLevel: f } = readFiltersFromUrl();
      setSigungu(s);
      setFitLevel(f);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateUrl = useCallback(
    (newSigungu: string | null, newFitLevel: FitLevel | null) => {
      const params = new URLSearchParams();
      if (newSigungu) params.set('sigungu', newSigungu);
      if (newFitLevel) params.set('fitLevel', newFitLevel);
      const qs = params.toString();
      window.history.replaceState(
        null,
        '',
        qs ? `${pathname}?${qs}` : pathname,
      );
    },
    [pathname],
  );

  const handleSelectSigungu = useCallback(
    (value: string | null) => {
      const newValue = sigungu === value ? null : value;
      setSigungu(newValue);
      updateUrl(newValue, fitLevel);
    },
    [sigungu, fitLevel, updateUrl],
  );

  const handleSelectFitLevel = useCallback(
    (value: FitLevel | null) => {
      const newValue = fitLevel === value ? null : value;
      setFitLevel(newValue);
      updateUrl(sigungu, newValue);
    },
    [fitLevel, sigungu, updateUrl],
  );

  return { sigungu, fitLevel, handleSelectSigungu, handleSelectFitLevel };
}
