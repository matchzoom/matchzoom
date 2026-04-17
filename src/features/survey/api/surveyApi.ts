import { bffFetch } from '@/shared/api/bffFetch';
import type { CreateProfileBody, Profile } from '@/shared/types/profile';

export const submitSurvey = (body: CreateProfileBody): Promise<Profile> =>
  bffFetch<Profile>('/profiles', {
    method: 'POST',
    body: JSON.stringify(body),
  });
