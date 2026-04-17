import { NextRequest, NextResponse } from 'next/server';

import { kauthFetch, kapiFetch } from '@/shared/api/kakaoFetch';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { setAuthCookies } from '@/shared/utils/authCookies';
import { signSession } from '@/shared/utils/session';
import { KakaoTokenSchema, KakaoUserSchema } from '@/shared/types/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  try {
    // Step 1: code → 카카오 토큰 교환
    const tokenBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY!,
      redirect_uri: process.env.KAKAO_REDIRECT_URI!,
      code,
      client_secret: process.env.KAKAO_CLIENT_SECRET!,
    });

    const rawTokens = await kauthFetch('/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody.toString(),
    });

    const tokens = KakaoTokenSchema.parse(rawTokens);

    // Step 2: 카카오 유저 프로필 조회
    const rawUser = await kapiFetch('/v2/user/me', tokens.access_token);
    const kakaoUser = KakaoUserSchema.parse(rawUser);

    const kakaoId = String(kakaoUser.id);
    const nickname = kakaoUser.kakao_account?.profile?.nickname ?? '사용자';

    // Step 3: Supabase users 테이블 upsert (kakao_id 기준)
    const users = await supabaseFetch<{ id: number }[]>('/rest/v1/users', {
      method: 'POST',
      body: JSON.stringify({ kakao_id: kakaoId, nickname }),
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    });

    const userId = String(users[0].id);

    // Step 4: session JWT 서명
    const sessionJwt = await signSession(userId);

    // Step 5: HttpOnly 쿠키 저장 후 /profile로 redirect
    // Set-Cookie: session=...; SameSite=Strict; HttpOnly; Secure
    const response = NextResponse.redirect(new URL('/profile', request.url));
    setAuthCookies({
      response,
      sessionJwt,
      kakaoAccessToken: tokens.access_token,
      kakaoRefreshToken: tokens.refresh_token,
      accessTokenMaxAge: tokens.expires_in,
      refreshTokenMaxAge: tokens.refresh_token_expires_in,
    });

    return response;
  } catch (error) {
    console.error('[카카오 로그인 실패]', error);
    return NextResponse.redirect(new URL('/?error=login_failed', request.url));
  }
}
