import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { openAiFetch } from '@/shared/api/openAiFetch';
import {
  MatchRequestBodySchema,
  AiMatchResponseSchema,
  type MatchResult,
} from '@/shared/types/match';
import type { Profile } from '@/shared/types/profile';
import { strategies } from '@/features/match/strategies';

export const POST = createAuthorizedRoute(async ({ userId, body }) => {
  // 1. 전략 선택 파라미터 검증
  const parsed = MatchRequestBodySchema.safeParse(body);
  if (!parsed.success) {
    const err = new Error(
      '전략(strategy)을 선택해주세요: wooseok | yujin | areum | jihyun',
    ) as Error & { status: number };
    err.status = 400;
    throw err;
  }

  const strategy = strategies[parsed.data.strategy];

  // 2. 프로필 조회
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

  // 3. 프롬프트 빌드 + OpenAI 호출
  const { system, user } = strategy.buildMessages(profiles[0]);

  if (!system || !user) {
    const err = new Error(
      `${strategy.name}님의 프롬프트가 아직 작성되지 않았습니다.`,
    ) as Error & { status: number };
    err.status = 501;
    throw err;
  }

  const raw = await openAiFetch([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ]);

  // 4. 응답 검증
  const aiResult = AiMatchResponseSchema.parse(JSON.parse(raw));

  // 5. match_results upsert
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
