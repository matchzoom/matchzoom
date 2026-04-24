import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { testLogin } from '@/shared/api/authApi';
import { CURRENT_USER_QUERY_KEY } from './useCurrentUser';

export function useTestLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: testLogin,
    onSuccess: () => {
      router.refresh();
      return queryClient.invalidateQueries({
        queryKey: CURRENT_USER_QUERY_KEY,
      });
    },
  });
}
