import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { getJobPostingsPage } from '@/features/dashboard/api/jobPostingsServerApi';
import type { FitLevel } from '@/shared/types/job';

function parseFitLevel(v: string | null): FitLevel | null {
  if (
    v === '잘 맞아요' ||
    v === '도전해볼 수 있어요' ||
    v === '힘들 수 있어요'
  ) {
    return v;
  }
  return null;
}

export const GET = createAuthorizedRoute(async ({ userId, request }) => {
  const { searchParams } = new URL(request.url);
  const cursor = Math.max(0, Number(searchParams.get('cursor') ?? '0'));
  const limit = Math.max(
    1,
    Math.min(50, Number(searchParams.get('limit') ?? '12')),
  );
  const sigungu = searchParams.get('sigungu') || null;
  const fitLevel = parseFitLevel(searchParams.get('fitLevel'));

  return getJobPostingsPage(userId, { cursor, limit, sigungu, fitLevel });
});
