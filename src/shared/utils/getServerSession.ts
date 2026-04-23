import { cache } from 'react';
import { cookies } from 'next/headers';
import { verifySession } from '@/shared/utils/session';
import { AUTH_COOKIE_KEYS } from '@/shared/utils/authCookies';
import { TEST_USER_ID } from '@/shared/utils/testUser';

export type ServerSession = {
  userId: string;
  isTestUser: boolean;
} | null;

export const getServerSession = cache(async (): Promise<ServerSession> => {
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
});
