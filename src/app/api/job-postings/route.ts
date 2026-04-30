import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { getJobPostingsPage } from '@/features/dashboard/api/jobPostingsServerApi';
import { parseFitLevel } from '@/features/dashboard/utils/parseFitLevel';

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
