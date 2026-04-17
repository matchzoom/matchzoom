import { NextResponse } from 'next/server';

import { kapiFetch } from '@/shared/api/kakaoFetch';
import { getAuthCookie, clearAuthCookies } from '@/shared/utils/authCookies';

export async function POST() {
  const accessToken = await getAuthCookie('kakaoAccessToken');

  if (accessToken) {
    try {
      // 카카오 서버 세션 무효화
      await kapiFetch('/v1/user/logout', accessToken);
    } catch (error) {
      // 카카오 로그아웃 실패해도 쿠키는 삭제
      console.error('[카카오 로그아웃 실패]', error);
    }
  }

  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
