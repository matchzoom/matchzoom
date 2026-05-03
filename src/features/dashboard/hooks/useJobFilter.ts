'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import type { FitLevel } from '@/shared/types/job';
import { parseFitLevel } from '../utils/parseFitLevel';

export function useJobFilter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sigungu, setSigungu] = useState<string | null>(
    searchParams.get('sigungu') || null,
  );
  const [fitLevel, setFitLevel] = useState<FitLevel | null>(
    parseFitLevel(searchParams.get('fitLevel')),
  );

  // 뒤로가기/앞으로가기 시 URL과 동기화
  useEffect(() => {
    setSigungu(searchParams.get('sigungu') || null);
    setFitLevel(parseFitLevel(searchParams.get('fitLevel')));
  }, [searchParams]);

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
