'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getMatchResult } from '../api/matchApi';
import type { MatchResult } from '@/shared/types/match';

export function useMatchResult(
  options?: Omit<UseQueryOptions<MatchResult | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['match-result'],
    queryFn: getMatchResult,
    ...options,
  });
}
