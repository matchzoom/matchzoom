'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getMatchResult } from '@/shared/api/matchApi';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import type { MatchResult } from '@/shared/types/match';

export function useMatchResult(
  options?: Omit<UseQueryOptions<MatchResult | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.matchResult,
    queryFn: getMatchResult,
    ...options,
  });
}
