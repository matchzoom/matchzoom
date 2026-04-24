'use client';

import { useQuery } from '@tanstack/react-query';

import { getBookmarks } from '../api/bookmarksApi';

export const BOOKMARKS_QUERY_KEY = ['bookmarks'] as const;

export function useScrapedJobs() {
  return useQuery({
    queryKey: BOOKMARKS_QUERY_KEY,
    queryFn: getBookmarks,
  });
}
