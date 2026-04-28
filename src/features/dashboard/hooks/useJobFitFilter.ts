'use client';

import { useState, useEffect, useMemo } from 'react';
import type { FitLevel, JobPosting } from '@/shared/types/job';
import { STORAGE_KEY_JOB_FITLEVEL_FILTER } from '@/shared/constants/storageKeys';

const STORAGE_KEY = STORAGE_KEY_JOB_FITLEVEL_FILTER;

const FIT_LEVEL_ORDER: FitLevel[] = ['잘 맞아요', '도전해볼 수 있어요'];

export function useJobFitFilter(postings: JobPosting[]) {
  const [selectedFitLevel, setSelectedFitLevel] = useState<FitLevel | null>(
    () => {
      if (typeof window === 'undefined') return null;
      return (localStorage.getItem(STORAGE_KEY) as FitLevel) ?? null;
    },
  );

  useEffect(() => {
    if (selectedFitLevel === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, selectedFitLevel);
    }
  }, [selectedFitLevel]);

  const availableFitLevels = useMemo(() => {
    const set = new Set<FitLevel>();
    for (const posting of postings) {
      if (posting.fitLevel) set.add(posting.fitLevel);
    }
    return FIT_LEVEL_ORDER.filter((f) => set.has(f));
  }, [postings]);

  useEffect(() => {
    if (postings.length > 0 && availableFitLevels.length < 2) {
      setSelectedFitLevel(null);
      return;
    }
    if (
      selectedFitLevel !== null &&
      postings.length > 0 &&
      !availableFitLevels.includes(selectedFitLevel)
    ) {
      setSelectedFitLevel(null);
    }
  }, [availableFitLevels, selectedFitLevel, postings]);

  const filteredPostings = useMemo(() => {
    if (!selectedFitLevel) return postings;
    return postings.filter((p) => p.fitLevel === selectedFitLevel);
  }, [postings, selectedFitLevel]);

  const handleSelectFitLevel = (fitLevel: FitLevel | null) => {
    setSelectedFitLevel((prev) => (prev === fitLevel ? null : fitLevel));
  };

  return {
    availableFitLevels,
    selectedFitLevel,
    filteredPostings,
    handleSelectFitLevel,
  };
}
