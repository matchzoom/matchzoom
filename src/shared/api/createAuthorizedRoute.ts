import { NextResponse } from 'next/server';

import { getAuthCookie } from '@/shared/utils/authCookies';
import { verifySession } from '@/shared/utils/session';
import { isApiError } from '@/shared/utils/errorGuards';

/**
 * 인증이 필요한 Route Handler에서 handler로 전달되는 컨텍스트 타입
 *
 * @property userId  - session JWT에서 검증된 users.id (string)
 * @property body    - HTTP 요청 body (GET/DELETE에서는 undefined)
 * @property request - 원본 Request 객체
 */
type HandlerContext<TBody = unknown> = {
  userId: string;
  body?: TBody;
  request: Request;
};

/**
 * ## createAuthorizedRoute
 *
 * 인증이 필요한 Next.js Route Handler를 생성하는 고차 함수.
 *
 * 1. `session` 쿠키에서 JWT를 읽고 서명 검증
 * 2. 쿠키 없음 또는 JWT 위변조 → 401 반환
 * 3. HTTP 메서드에 따라 body 파싱 (GET / DELETE → body 없음)
 * 4. handler 실행 중 에러 → isApiError면 해당 status, 아니면 500 반환
 * 5. handler가 undefined 반환 → 204 No Content 반환
 *
 * @example
 * ```ts
 * // GET
 * export const GET = createAuthorizedRoute(async ({ userId }) => {
 *   const rows = await supabaseFetch(`/rest/v1/profiles?user_id=eq.${userId}&select=*`);
 *   return rows[0] ?? null;
 * });
 *
 * // PATCH
 * export const PATCH = createAuthorizedRoute<UpdateProfileBody>(async ({ userId, body }) => {
 *   return supabaseFetch(`/rest/v1/profiles?user_id=eq.${userId}`, {
 *     method: 'PATCH',
 *     body: JSON.stringify(body),
 *     headers: { Prefer: 'return=representation' },
 *   });
 * });
 * ```
 */
export const createAuthorizedRoute = <TBody = unknown>(
  handler: (ctx: HandlerContext<TBody>) => Promise<unknown>,
) => {
  return async (request: Request) => {
    // session JWT 검증 — 위변조 또는 만료된 토큰은 null
    const sessionToken = await getAuthCookie('session');
    const session = sessionToken ? await verifySession(sessionToken) : null;

    if (!session) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    try {
      let body: unknown;

      if (request.method !== 'GET' && request.method !== 'DELETE') {
        const contentType = request.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
          const text = await request.text();
          body = text ? (JSON.parse(text) as unknown) : undefined;
        }
      }

      const result = await handler({
        userId: session.userId,
        body: body as TBody,
        request,
      });

      if (result === undefined) {
        return new NextResponse(null, { status: 204 });
      }

      return NextResponse.json(result);
    } catch (err) {
      if (isApiError(err)) {
        return NextResponse.json(
          { message: err.message },
          { status: err.status },
        );
      }
      return NextResponse.json(
        { message: '서버 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  };
};
