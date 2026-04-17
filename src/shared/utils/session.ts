import { SignJWT, jwtVerify } from 'jose';

// SESSION_SECRET은 반드시 32자 이상의 랜덤 문자열이어야 한다.
// openssl rand -base64 32 으로 생성
const getSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET 환경 변수 누락');
  return new TextEncoder().encode(secret);
};

export type SessionPayload = {
  userId: string; // users.id (bigint → string)
};

/**
 * userId를 담은 서명된 JWT를 생성한다.
 * 만료: 30일 (kakaoRefreshToken 유효기간과 동일)
 */
export const signSession = async (userId: string): Promise<string> => {
  return new SignJWT({ userId } satisfies SessionPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret());
};

/**
 * session JWT를 검증하고 payload를 반환한다.
 * 만료되었거나 서명이 유효하지 않으면 null을 반환한다.
 */
export const verifySession = async (
  token: string,
): Promise<SessionPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
};
