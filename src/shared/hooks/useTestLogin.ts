import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testLogin } from '@/shared/api/authApi';
import { CURRENT_USER_QUERY_KEY } from './useCurrentUser';
import { TEST_USER } from '@/shared/utils/testUser';

export function useTestLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testLogin,
    onSuccess: () => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, TEST_USER);
    },
  });
}
