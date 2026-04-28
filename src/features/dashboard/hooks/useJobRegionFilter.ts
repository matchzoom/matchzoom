'use client';

import { useEffect, useState } from 'react';

import { STORAGE_KEY_JOB_SIGUNGU_FILTER } from '@/shared/constants/storageKeys';

const STORAGE_KEY = STORAGE_KEY_JOB_SIGUNGU_FILTER;

export function useJobRegionFilter(availableSigungu: string[]) {
  const [selectedSigungu, setSelectedSigungu] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setSelectedSigungu(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (selectedSigungu === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, selectedSigungu);
    }
  }, [selectedSigungu, hydrated]);

  useEffect(() => {
    if (
      selectedSigungu !== null &&
      availableSigungu.length > 0 &&
      !availableSigungu.includes(selectedSigungu)
    ) {
      setSelectedSigungu(null);
    }
  }, [availableSigungu, selectedSigungu]);

  const handleSelectSigungu = (sigungu: string | null) => {
    setSelectedSigungu((prev) => (prev === sigungu ? null : sigungu));
  };

  return { selectedSigungu, handleSelectSigungu };
}
