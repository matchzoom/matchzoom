'use client';

import { useState } from 'react';

import { MOCK_JOB_POSTINGS } from '@/shared/utils/mockData';

export function useScrapedJobs() {
  const [jobs, setJobs] = useState(() =>
    MOCK_JOB_POSTINGS.filter((j) => j.bookmarked),
  );

  const toggleBookmark = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    console.warn('[마주봄 목업] 스크랩 해제:', id);
  };

  return { scrapedJobs: jobs, toggleBookmark };
}
