import { bffFetch } from './bffFetch';
import type { CurrentUser } from '@/shared/types/user';

/** 로그인한 유저 정보 조회 (BFF) */
export const getCurrentUser = (): Promise<CurrentUser> =>
  bffFetch<CurrentUser>('/users/me', { method: 'GET' });
