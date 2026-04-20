'use client';

import { useQuery } from '@tanstack/react-query';
import { getMatchResult } from '../api/matchApi';

export function useMatchResult() {
  return useQuery({
    queryKey: ['match-result'],
    queryFn: getMatchResult,
  });
}
