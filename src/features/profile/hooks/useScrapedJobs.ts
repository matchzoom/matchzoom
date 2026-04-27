'use client';

import { useQuery } from '@tanstack/react-query';

import { getBookmarks } from '../api/bookmarksApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';

export function useScrapedJobs() {
  return useQuery({
    queryKey: QUERY_KEYS.bookmarks,
    queryFn: getBookmarks,
  });
}
