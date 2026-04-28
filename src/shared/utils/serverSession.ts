import { cache } from 'react';
import { cookies } from 'next/headers';
import { verifySession } from './session';
import { AUTH_COOKIE_KEYS } from './authCookies';
import { TEST_USER_ID } from '@/shared/constants/testUser';

export type ServerSession = {
  userId: string;
  isTestUser: boolean;
};

/**
 * 서버 컴포넌트에서 session JWT를 검증하고 userId를 반환한다.
 * React.cache로 감싸져 있어 같은 요청 내에서 layout/page가 각자 호출해도 한 번만 실행된다.
 */
export const getServerSession = cache(
  async (): Promise<ServerSession | null> => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(AUTH_COOKIE_KEYS.SESSION)?.value;
      if (!token) return null;

      const session = await verifySession(token);
      if (!session?.userId) return null;

      return {
        userId: session.userId,
        isTestUser: session.userId === TEST_USER_ID,
      };
    } catch {
      return null;
    }
  },
);
