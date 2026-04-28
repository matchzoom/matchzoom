import { NextResponse } from 'next/server';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import type { FitLevel } from '@/shared/types/job';

export type PerfTestItem = {
  id: number;
  company_name: string;
  title: string;
  location: string;
  salary: string;
  deadline: string;
  emp_type: string;
  req_career: string;
  fit_level: FitLevel;
  created_at: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10) || 0;
  const limit = parseInt(searchParams.get('limit') ?? '12', 10) || 12;

  const start = performance.now();
  // limit+1개 요청해서 다음 페이지 존재 여부 판단 (별도 count 쿼리 불필요)
  const raw = await supabaseFetch<PerfTestItem[]>(
    `/rest/v1/perf_test_items?select=*&offset=${offset}&limit=${limit + 1}&order=id.asc`,
  );
  const elapsedMs = Math.round(performance.now() - start);

  const hasMore = raw.length > limit;
  const items = hasMore ? raw.slice(0, limit) : raw;
  const nextOffset = hasMore ? offset + limit : null;

  return NextResponse.json({ items, nextOffset, elapsedMs });
}
