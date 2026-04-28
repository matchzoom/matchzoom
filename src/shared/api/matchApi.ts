import { bffFetch } from '@/shared/api/bffFetch';
import type { MatchResult } from '@/shared/types/match';

export const generateMatch = (): Promise<MatchResult> =>
  bffFetch<MatchResult>('/match', { method: 'POST' });

export const getMatchResult = (): Promise<MatchResult | null> =>
  bffFetch<MatchResult | null>('/match', { method: 'GET' });
