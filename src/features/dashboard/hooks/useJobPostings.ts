'use client';

import { useState } from 'react';

import { MOCK_JOB_POSTINGS } from '@/shared/utils/mockData';

export function useJobPostings() {
  const [postings, setPostings] = useState(MOCK_JOB_POSTINGS);

  const toggleBookmark = (id: number) => {
    setPostings((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, bookmarked: !job.bookmarked } : job,
      ),
    );
    const job = postings.find((j) => j.id === id);
    if (job) {
      console.warn(
        `[마주봄 목업] 북마크 ${job.bookmarked ? '해제' : '추가'}:`,
        job.title,
      );
    }
  };

  return { postings, toggleBookmark };
}
