'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getMatchResult } from '../api/matchApi';
import type { MatchResult } from '@/shared/types/match';

export const MATCH_RESULT_QUERY_KEY = ['match-result'] as const;

export function useMatchResult(
  options?: Omit<UseQueryOptions<MatchResult | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: MATCH_RESULT_QUERY_KEY,
    queryFn: getMatchResult,
    ...options,
  });
}
