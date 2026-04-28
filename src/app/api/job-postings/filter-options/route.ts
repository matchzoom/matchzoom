import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { getJobPostingsFilterOptions } from '@/features/dashboard/api/jobPostingsServerApi';

export const GET = createAuthorizedRoute(({ userId }) =>
  getJobPostingsFilterOptions(userId),
);
