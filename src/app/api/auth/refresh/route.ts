import { NextResponse } from 'next/server';

import { kauthFetch } from '@/shared/api/kakaoFetch';
import {
  getAuthCookie,
  setAuthCookies,
  clearAuthCookies,
} from '@/shared/utils/authCookies';
import { verifySession, signSession } from '@/shared/utils/session';

export async function POST() {
  const sessionToken = await getAuthCookie('session');
  const refreshToken = await getAuthCookie('kakaoRefreshToken');

  // session JWT 검증으로 현재 userId 확인
  const session = sessionToken ? await verifySession(sessionToken) : null;

  if (!session || !refreshToken) {
    return NextResponse.json({ error: '세션 없음' }, { status: 401 });
  }

  try {
    // 카카오 액세스 토큰 갱신
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.KAKAO_REST_API_KEY!,
      refresh_token: refreshToken,
      client_secret: process.env.KAKAO_CLIENT_SECRET!,
    });

    const raw = await kauthFetch<Record<string, unknown>>('/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const newAccessToken = String(raw.access_token);
    const accessTokenMaxAge = Number(raw.expires_in);
    // 카카오는 refresh_token이 갱신된 경우에만 새 값을 내려줌
    const newRefreshToken = raw.refresh_token
      ? String(raw.refresh_token)
      : refreshToken;
    const refreshTokenMaxAge = raw.refresh_token_expires_in
      ? Number(raw.refresh_token_expires_in)
      : 60 * 60 * 24 * 30;

    // session JWT도 함께 재발급 (만료 시각 갱신)
    const newSessionJwt = await signSession(session.userId);

    const response = NextResponse.json({ ok: true });
    setAuthCookies({
      response,
      sessionJwt: newSessionJwt,
      kakaoAccessToken: newAccessToken,
      kakaoRefreshToken: newRefreshToken,
      accessTokenMaxAge,
      refreshTokenMaxAge,
    });

    return response;
  } catch (error) {
    console.error('[토큰 갱신 실패]', error);
    await clearAuthCookies();
    return NextResponse.json({ error: '토큰 갱신 실패' }, { status: 401 });
  }
}
