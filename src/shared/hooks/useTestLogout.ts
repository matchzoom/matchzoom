import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testLogout } from '@/shared/api/authApi';
import { CURRENT_USER_QUERY_KEY } from './useCurrentUser';

export function useTestLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testLogout,
    onSuccess: () => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      window.location.href = '/';
    },
  });
}
