import { bffFetch } from '@/shared/api/bffFetch';
import type { MatchRequestBody } from '@/shared/types/match';
import type { MatchResult } from '@/shared/types/match';

export const generateMatch = (body: MatchRequestBody): Promise<MatchResult> =>
  bffFetch<MatchResult>('/match', {
    method: 'POST',
    body: JSON.stringify(body),
  });
