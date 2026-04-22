import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/shared/api/authApi';
import { CURRENT_USER_QUERY_KEY } from './useCurrentUser';
import {
  STORAGE_KEY_JOB_SIGUNGU_FILTER,
  STORAGE_KEY_JOB_FITLEVEL_FILTER,
} from '@/shared/utils/storageKeys';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      localStorage.removeItem(STORAGE_KEY_JOB_SIGUNGU_FILTER);
      localStorage.removeItem(STORAGE_KEY_JOB_FITLEVEL_FILTER);
      window.location.href = '/';
    },
  });
}
