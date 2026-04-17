import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/shared/utils/session';

const PROTECTED = ['/profile', '/survey'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!PROTECTED.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // session JWT 검증 — 만료·위변조 시 null
  const sessionToken = request.cookies.get('session')?.value;
  const session = sessionToken ? await verifySession(sessionToken) : null;

  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/survey/:path*'],
};
