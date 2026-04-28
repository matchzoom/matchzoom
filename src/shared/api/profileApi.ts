import { bffFetch } from '@/shared/api/bffFetch';
import type { Profile } from '@/shared/types/profile';

export const getProfile = (): Promise<Profile | null> =>
  bffFetch<Profile | null>('/profiles', { method: 'GET' });
