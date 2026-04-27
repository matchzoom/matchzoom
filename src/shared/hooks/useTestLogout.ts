import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testLogout } from '@/shared/api/authApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
import {
  STORAGE_KEY_JOB_SIGUNGU_FILTER,
  STORAGE_KEY_JOB_FITLEVEL_FILTER,
} from '@/shared/utils/storageKeys';

export function useTestLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testLogout,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.currentUser, null);
      localStorage.removeItem(STORAGE_KEY_JOB_SIGUNGU_FILTER);
      localStorage.removeItem(STORAGE_KEY_JOB_FITLEVEL_FILTER);
      window.location.href = '/';
    },
  });
}
