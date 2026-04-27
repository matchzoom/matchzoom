import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/shared/api/userApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';

export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.currentUser,
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch {
        // 401(미인증)은 에러로 올리지 않고 null 반환
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5분간 fresh
  });
}
