import { NextResponse } from 'next/server';
import { supabaseFetch } from '@/shared/api/supabaseFetch';

export const GET = async (req: Request) => {
  const secret = process.env.PING_SECRET;
  if (!secret || req.headers.get('x-ping-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await supabaseFetch('/rest/v1/users?select=count&limit=1', {
      cache: 'no-store',
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'ping failed' }, { status: 500 });
  }
};
