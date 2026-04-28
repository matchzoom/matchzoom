import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import type { User, CurrentUser } from '@/shared/types/user';
import { TEST_USER_ID, TEST_USER } from '@/shared/constants/testUser';

// GET /api/users/me
// 로그인한 유저 정보 반환 (kakao_id 제외)
export const GET = createAuthorizedRoute(async ({ userId }) => {
  if (userId === TEST_USER_ID) return TEST_USER;

  const rows = await supabaseFetch<User[]>(
    `/rest/v1/users?id=eq.${userId}&select=id,nickname,created_at`,
  );

  if (!rows[0]) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { kakao_id, ...currentUser } = rows[0];
  return currentUser satisfies CurrentUser;
});
