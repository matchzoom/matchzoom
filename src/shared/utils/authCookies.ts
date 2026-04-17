import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const AUTH_COOKIE_KEYS = {
  SESSION: 'session', // 서명된 JWT — userId 포함
  KAKAO_ACCESS_TOKEN: 'kakaoAccessToken',
  KAKAO_REFRESH_TOKEN: 'kakaoRefreshToken',
} as const;

export type AuthCookieKey =
  (typeof AUTH_COOKIE_KEYS)[keyof typeof AUTH_COOKIE_KEYS];

// SameSite=Strict: 외부 사이트에서 유입된 요청에 쿠키를 절대 포함하지 않음
// 외부 링크 클릭으로 바로 /profile 진입 시 쿠키가 전송되지 않아 로그인 페이지로 리다이렉트됨
// (의도된 동작 — 보안 우선)
const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
} as const;

// session JWT: 30일 (kakaoRefreshToken 만료와 맞춤)
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

interface SetAuthCookiesOptions {
  response: NextResponse;
  sessionJwt: string; // signSession()으로 생성한 JWT
  kakaoAccessToken: string;
  kakaoRefreshToken: string;
  accessTokenMaxAge: number; // seconds — 카카오 expires_in
  refreshTokenMaxAge: number; // seconds — 카카오 refresh_token_expires_in
}

/**
 * 로그인/토큰 갱신 시 호출.
 * Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict
 */
export const setAuthCookies = ({
  response,
  sessionJwt,
  kakaoAccessToken,
  kakaoRefreshToken,
  accessTokenMaxAge,
  refreshTokenMaxAge,
}: SetAuthCookiesOptions): void => {
  response.cookies.set(AUTH_COOKIE_KEYS.SESSION, sessionJwt, {
    ...COOKIE_BASE,
    maxAge: SESSION_MAX_AGE,
  });
  response.cookies.set(AUTH_COOKIE_KEYS.KAKAO_ACCESS_TOKEN, kakaoAccessToken, {
    ...COOKIE_BASE,
    maxAge: accessTokenMaxAge,
  });
  response.cookies.set(
    AUTH_COOKIE_KEYS.KAKAO_REFRESH_TOKEN,
    kakaoRefreshToken,
    {
      ...COOKIE_BASE,
      maxAge: refreshTokenMaxAge,
    },
  );
};

/** BFF Route Handler 내부에서 단일 쿠키를 읽을 때 사용 */
export const getAuthCookie = async (
  key: AuthCookieKey,
): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
};

/** 로그아웃 시 모든 인증 쿠키를 삭제 */
export const clearAuthCookies = async (): Promise<void> => {
  const cookieStore = await cookies();
  for (const key of Object.values(AUTH_COOKIE_KEYS)) {
    cookieStore.set({ name: key, value: '', path: '/', maxAge: 0 });
  }
};
