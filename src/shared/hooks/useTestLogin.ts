import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testLogin } from '@/shared/api/authApi';
import { CURRENT_USER_QUERY_KEY } from './useCurrentUser';

export function useTestLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });
}
