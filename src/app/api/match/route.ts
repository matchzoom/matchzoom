import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { openAiFetch } from '@/shared/api/openAiFetch';
import { AiMatchCoreSchema, type MatchResult } from '@/shared/types/match';
import type { Profile } from '@/shared/types/profile';
import { matchStrategy } from '@/features/match/strategies';
import { TEST_USER_ID, TEST_MATCH } from '@/shared/constants/testUser';
import { getCachedWorknetData } from '@/features/match/api/worknetApi';
import { buildSummaryText } from '@/features/match/utils/buildSummaryText';

export const GET = createAuthorizedRoute(async ({ userId }) => {
  if (userId === TEST_USER_ID) return TEST_MATCH;

  const rows = await supabaseFetch<MatchResult[]>(
    `/rest/v1/match_results?user_id=eq.${userId}&select=*`,
  );
  return rows[0] ?? null;
});

export const POST = createAuthorizedRoute(async ({ userId }) => {
  // 1. 프로필 조회 + 워크넷 데이터 조회 (병렬)
  const [profiles, worknetData] = await Promise.all([
    supabaseFetch<Profile[]>(`/rest/v1/profiles?user_id=eq.${userId}&select=*`),
    getCachedWorknetData().catch(() => []),
  ]);

  if (!profiles[0]) {
    const err = new Error(
      '프로필이 없습니다. 먼저 검사를 완료해주세요.',
    ) as Error & { status: number };
    err.status = 404;
    throw err;
  }

  // 2. 1차 OpenAI 호출: radar_chart + top3_jobs 생성
  const { system, user } = matchStrategy.buildMessages(profiles[0]);

  const raw = await openAiFetch([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ]);

  const aiCore = AiMatchCoreSchema.parse(JSON.parse(raw));

  // 3. 2차: top3 직종의 NCS 데이터 기반으로 summary_text 생성
  const summaryText = await buildSummaryText(
    aiCore.top3_jobs,
    worknetData,
    aiCore.radar_chart,
  );

  // 4. match_results upsert
  const rows = await supabaseFetch<MatchResult[]>(
    '/rest/v1/match_results?on_conflict=user_id',
    {
      method: 'POST',
      body: JSON.stringify({
        user_id: Number(userId),
        radar_chart: aiCore.radar_chart,
        summary_text: summaryText,
        top3_jobs: aiCore.top3_jobs,
      }),
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    },
  );

  return rows[0];
});
