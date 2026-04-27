'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getMatchResult } from '../api/matchApi';
import type { MatchResult } from '@/shared/types/match';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';

export function useMatchResult(
  options?: Omit<UseQueryOptions<MatchResult | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.matchResult,
    queryFn: getMatchResult,
    ...options,
  });
}
