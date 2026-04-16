'use client';

import { useState, useMemo } from 'react';

import { MOCK_JOB_POSTINGS } from '@/shared/utils/mockData';

export function useJobPostings() {
  const [postings, setPostings] = useState(MOCK_JOB_POSTINGS);
  const [fitFilter, setFitFilter] = useState<string>('전체');
  const [workTypeFilter, setWorkTypeFilter] = useState<string>('전체');
  const [locationFilter, setLocationFilter] = useState<string>('전체');

  const filteredPostings = useMemo(() => {
    return postings.filter((job) => {
      if (fitFilter !== '전체' && job.fitLevel !== fitFilter) return false;
      if (workTypeFilter !== '전체' && job.workType !== workTypeFilter)
        return false;
      if (locationFilter !== '전체' && !job.location.includes(locationFilter))
        return false;
      return true;
    });
  }, [postings, fitFilter, workTypeFilter, locationFilter]);

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

  return {
    postings: filteredPostings,
    filters: { fitFilter, workTypeFilter, locationFilter },
    setFitFilter,
    setWorkTypeFilter,
    setLocationFilter,
    toggleBookmark,
  };
}
