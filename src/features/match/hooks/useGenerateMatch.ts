'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateMatch } from '../api/matchApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';

export function useGenerateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => generateMatch(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.matchResult });
    },
  });
}
