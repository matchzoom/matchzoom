import { NextResponse } from 'next/server';
import { signSession } from '@/shared/utils/session';
import { TEST_USER_ID } from '@/shared/constants/testUser';

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST() {
  const sessionJwt = await signSession(TEST_USER_ID);
  const response = NextResponse.json({ ok: true });
  response.cookies.set('session', sessionJwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
