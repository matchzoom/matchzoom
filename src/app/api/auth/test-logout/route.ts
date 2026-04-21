import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/shared/utils/authCookies';

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
