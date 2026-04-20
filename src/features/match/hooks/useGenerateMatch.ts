'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateMatch } from '../api/matchApi';

export function useGenerateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => generateMatch(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-result'] });
    },
  });
}
