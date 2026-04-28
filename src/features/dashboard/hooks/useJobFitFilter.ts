'use client';

import { useEffect, useState } from 'react';

import type { FitLevel } from '@/shared/types/job';
import { STORAGE_KEY_JOB_FITLEVEL_FILTER } from '@/shared/constants/storageKeys';

const STORAGE_KEY = STORAGE_KEY_JOB_FITLEVEL_FILTER;

export function useJobFitFilter(availableFitLevels: FitLevel[]) {
  const [selectedFitLevel, setSelectedFitLevel] = useState<FitLevel | null>(
    null,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as FitLevel | null;
    if (stored !== null) setSelectedFitLevel(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (selectedFitLevel === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, selectedFitLevel);
    }
  }, [selectedFitLevel, hydrated]);

  useEffect(() => {
    if (
      selectedFitLevel !== null &&
      availableFitLevels.length > 0 &&
      !availableFitLevels.includes(selectedFitLevel)
    ) {
      setSelectedFitLevel(null);
    }
  }, [availableFitLevels, selectedFitLevel]);

  const handleSelectFitLevel = (fitLevel: FitLevel | null) => {
    setSelectedFitLevel((prev) => (prev === fitLevel ? null : fitLevel));
  };

  return { selectedFitLevel, handleSelectFitLevel };
}
