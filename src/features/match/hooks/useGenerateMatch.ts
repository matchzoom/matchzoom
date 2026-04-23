'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateMatch } from '../api/matchApi';
import { MATCH_RESULT_QUERY_KEY } from './useMatchResult';

export function useGenerateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => generateMatch(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCH_RESULT_QUERY_KEY });
    },
  });
}
