import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { openAiFetch } from '@/shared/api/openAiFetch';
import { AiMatchResponseSchema, type MatchResult } from '@/shared/types/match';
import type { Profile } from '@/shared/types/profile';
import { matchStrategy } from '@/features/match/strategies';

export const GET = createAuthorizedRoute(async ({ userId }) => {
  const rows = await supabaseFetch<MatchResult[]>(
    `/rest/v1/match_results?user_id=eq.${userId}&select=*`,
  );
  return rows[0] ?? null;
});

export const POST = createAuthorizedRoute(async ({ userId }) => {
  // 1. 프로필 조회
  const profiles = await supabaseFetch<Profile[]>(
    `/rest/v1/profiles?user_id=eq.${userId}&select=*`,
  );

  if (!profiles[0]) {
    const err = new Error(
      '프로필이 없습니다. 먼저 검사를 완료해주세요.',
    ) as Error & { status: number };
    err.status = 404;
    throw err;
  }

  // 2. 프롬프트 빌드 + OpenAI 호출
  const { system, user } = matchStrategy.buildMessages(profiles[0]);

  const raw = await openAiFetch([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ]);

  // 3. 응답 검증
  const aiResult = AiMatchResponseSchema.parse(JSON.parse(raw));

  // 4. match_results upsert
  const rows = await supabaseFetch<MatchResult[]>(
    '/rest/v1/match_results?on_conflict=user_id',
    {
      method: 'POST',
      body: JSON.stringify({
        user_id: Number(userId),
        radar_chart: aiResult.radar_chart,
        summary_text: aiResult.summary_text,
        top3_jobs: aiResult.top3_jobs,
      }),
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    },
  );

  return rows[0];
});
