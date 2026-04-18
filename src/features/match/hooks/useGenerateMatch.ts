'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateMatch } from '../api/matchApi';
import type { MatchRequestBody } from '@/shared/types/match';

export function useGenerateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MatchRequestBody) => generateMatch(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-result'] });
    },
  });
}
