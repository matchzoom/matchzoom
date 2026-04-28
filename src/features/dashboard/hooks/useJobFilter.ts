'use client';

import { useState, useEffect } from 'react';
import type { FitLevel } from '@/shared/types/job';
import {
  STORAGE_KEY_JOB_SIGUNGU_FILTER,
  STORAGE_KEY_JOB_FITLEVEL_FILTER,
} from '@/shared/utils/storageKeys';

export function useJobFilter() {
  const [selectedSigungu, setSelectedSigungu] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY_JOB_SIGUNGU_FILTER) ?? null;
  });

  const [selectedFitLevel, setSelectedFitLevel] = useState<FitLevel | null>(
    () => {
      if (typeof window === 'undefined') return null;
      return (
        (localStorage.getItem(STORAGE_KEY_JOB_FITLEVEL_FILTER) as FitLevel) ??
        null
      );
    },
  );

  useEffect(() => {
    if (selectedSigungu === null) {
      localStorage.removeItem(STORAGE_KEY_JOB_SIGUNGU_FILTER);
    } else {
      localStorage.setItem(STORAGE_KEY_JOB_SIGUNGU_FILTER, selectedSigungu);
    }
  }, [selectedSigungu]);

  useEffect(() => {
    if (selectedFitLevel === null) {
      localStorage.removeItem(STORAGE_KEY_JOB_FITLEVEL_FILTER);
    } else {
      localStorage.setItem(STORAGE_KEY_JOB_FITLEVEL_FILTER, selectedFitLevel);
    }
  }, [selectedFitLevel]);

  const handleSelectSigungu = (sigungu: string | null) => {
    setSelectedSigungu((prev) => {
      const next = prev === sigungu ? null : sigungu;
      if (next !== prev) setSelectedFitLevel(null);
      return next;
    });
  };

  const handleSelectFitLevel = (fitLevel: FitLevel | null) => {
    setSelectedFitLevel((prev) => (prev === fitLevel ? null : fitLevel));
  };

  return {
    selectedSigungu,
    selectedFitLevel,
    handleSelectSigungu,
    handleSelectFitLevel,
    resetFitLevelIfInvalid: (availableFitLevels: FitLevel[]) => {
      if (
        selectedFitLevel !== null &&
        !availableFitLevels.includes(selectedFitLevel)
      ) {
        setSelectedFitLevel(null);
      }
    },
    resetSigunguIfInvalid: (availableSigungu: string[]) => {
      if (
        selectedSigungu !== null &&
        availableSigungu.length > 0 &&
        !availableSigungu.includes(selectedSigungu)
      ) {
        setSelectedSigungu(null);
      }
    },
  };
}
