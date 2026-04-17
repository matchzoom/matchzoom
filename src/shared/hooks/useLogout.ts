import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/shared/api/authApi';
import { CURRENT_USER_QUERY_KEY } from './useCurrentUser';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      window.location.href = '/';
    },
  });
}
