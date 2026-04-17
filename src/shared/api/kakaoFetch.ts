import { coreFetch } from './coreFetch';

/**
 * 카카오 인증 서버(kauth.kakao.com) 호출용.
 * 토큰 발급/갱신에 사용.
 */
export const kauthFetch = async <T>(
  endpoint: string, // e.g. '/oauth/token'
  options: RequestInit = {},
): Promise<T> => {
  return coreFetch<T>('https://kauth.kakao.com' + endpoint, options);
};

/**
 * 카카오 API 서버(kapi.kakao.com) 호출용.
 * 유저 정보 조회, 로그아웃에 사용.
 */
export const kapiFetch = async <T>(
  endpoint: string, // e.g. '/v2/user/me'
  accessToken: string,
): Promise<T> => {
  const headers = new Headers({ Authorization: `Bearer ${accessToken}` });
  return coreFetch<T>('https://kapi.kakao.com' + endpoint, { headers });
};
