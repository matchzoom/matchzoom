import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { getJobPostingsData } from '@/features/dashboard/api/jobPostingsServerApi';
import type { FitLevel } from '@/shared/types/job';

export const GET = createAuthorizedRoute(async ({ userId, request }) => {
  const { searchParams } = new URL(request.url);
  const offset = Math.max(0, Number(searchParams.get('offset') ?? 0));
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get('limit') ?? 12)),
  );
  const sigungu = searchParams.get('sigungu');
  const fitLevel = searchParams.get('fitLevel') as FitLevel | null;

  return getJobPostingsData(userId, { offset, limit, sigungu, fitLevel });
});
