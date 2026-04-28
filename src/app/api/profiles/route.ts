import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { CreateProfileBodySchema, type Profile } from '@/shared/types/profile';
import { TEST_USER_ID, TEST_PROFILE } from '@/shared/constants/testUser';

export const GET = createAuthorizedRoute(async ({ userId }) => {
  if (userId === TEST_USER_ID) return TEST_PROFILE;

  const rows = await supabaseFetch<Profile[]>(
    `/rest/v1/profiles?user_id=eq.${userId}&select=*`,
  );
  return rows[0] ?? null;
});

export const POST = createAuthorizedRoute(async ({ userId, body }) => {
  const parsed = CreateProfileBodySchema.safeParse(body);
  if (!parsed.success) {
    const err = new Error('입력값이 올바르지 않습니다.') as Error & {
      status: number;
    };
    err.status = 400;
    throw err;
  }

  const rows = await supabaseFetch<Profile[]>(
    '/rest/v1/profiles?on_conflict=user_id',
    {
      method: 'POST',
      body: JSON.stringify({ ...parsed.data, user_id: Number(userId) }),
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    },
  );
  return rows[0];
});
