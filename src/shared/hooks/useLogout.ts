import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/shared/api/authApi';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.currentUser, null);
      window.location.href = '/';
    },
  });
}
