'use client';

import { useQuery } from '@tanstack/react-query';

import { getBookmarks } from '../api/bookmarksApi';

export function useScrapedJobs() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
  });
}
