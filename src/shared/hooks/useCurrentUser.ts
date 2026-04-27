import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/shared/api/userApi';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';

/**
 * 로그인한 유저 정보를 가져오는 React Query 훅.
 *
 * - 미인증 상태(401)에서는 null을 반환한다 (에러로 throw하지 않음)
 * - 컴포넌트 어디서든 호출 가능 — 전역 유저 상태 역할
 */
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
