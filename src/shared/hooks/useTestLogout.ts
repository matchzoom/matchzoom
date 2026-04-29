import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testLogout } from '@/shared/api/authApi';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';

export function useTestLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testLogout,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.currentUser, null);
      window.location.href = '/';
    },
  });
}
