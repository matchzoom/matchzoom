'use client';

import { useState, useEffect, useMemo } from 'react';
import type { JobPosting } from '@/shared/types/job';
import { STORAGE_KEY_JOB_SIGUNGU_FILTER } from '@/shared/utils/storageKeys';

const STORAGE_KEY = STORAGE_KEY_JOB_SIGUNGU_FILTER;

function extractSigungu(location: string): string | null {
  const parts = location.trim().split(/\s+/);
  return parts[1] ?? null;
}

export function useJobRegionFilter(
  postings: JobPosting[],
  profileProvinces: string[],
) {
  const [selectedSigungu, setSelectedSigungu] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY) ?? null;
  });

  useEffect(() => {
    if (selectedSigungu === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, selectedSigungu);
    }
  }, [selectedSigungu]);

  const availableSigungu = useMemo(() => {
    const set = new Set<string>();
    for (const posting of postings) {
      const province = posting.location.trim().split(/\s+/)[0];
      if (profileProvinces.length > 0 && !profileProvinces.includes(province))
        continue;
      const sigungu = extractSigungu(posting.location);
      if (sigungu) set.add(sigungu);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ko'));
  }, [postings, profileProvinces]);

  // selectedSigungu가 현재 목록에 없으면 초기화 (postings 로드 완료 후)
  useEffect(() => {
    if (
      selectedSigungu !== null &&
      postings.length > 0 &&
      !availableSigungu.includes(selectedSigungu)
    ) {
      setSelectedSigungu(null);
    }
  }, [availableSigungu, selectedSigungu, postings]);

  const filteredPostings = useMemo(() => {
    if (!selectedSigungu) return postings;
    return postings.filter(
      (p) => extractSigungu(p.location) === selectedSigungu,
    );
  }, [postings, selectedSigungu]);

  const handleSelectSigungu = (sigungu: string | null) => {
    setSelectedSigungu((prev) => (prev === sigungu ? null : sigungu));
  };

  return {
    availableSigungu,
    selectedSigungu,
    filteredPostings,
    handleSelectSigungu,
  };
}
