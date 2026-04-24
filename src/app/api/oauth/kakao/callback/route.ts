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
    const users = await supabaseFetch<{ id: number }[]>(
      '/rest/v1/users?on_conflict=kakao_id',
      {
        method: 'POST',
        body: JSON.stringify({ kakao_id: kakaoId, nickname }),
        headers: {
          Prefer: 'resolution=merge-duplicates,return=representation',
        },
      },
    );

    const userId = String(users[0].id);

    // Step 4: session JWT 서명
    const sessionJwt = await signSession(userId);

    // Step 5: HttpOnly 쿠키 저장 후 / 로 이동
    // NextResponse.redirect() 대신 200 HTML + JS redirect 사용:
    // SameSite=Strict 쿠키는 카카오→콜백 크로스사이트 리다이렉트 체인에서
    // 307 응답을 따라갈 때 전송되지 않는다. 200 응답으로 쿠키를 확정 저장한 뒤
    // JS로 이동하면 브라우저가 이미 같은 사이트 컨텍스트에 있어 쿠키가 정상 전송된다.
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>window.location.replace('/');</script></body></html>`;
    const response = new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
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
