import { NextResponse } from 'next/server';

import { supabaseFetch } from '@/shared/api/supabaseFetch';
import type {
  FitLevel,
  JobPosting,
  PaginatedJobPostings,
} from '@/shared/types/job';

type PerfTestRow = {
  id: number;
  company_name: string;
  title: string;
  location: string;
  salary: string;
  deadline: string;
  emp_type: string;
  req_career: string;
  fit_level: string;
};

function toJobPosting(row: PerfTestRow): JobPosting {
  return {
    id: row.id,
    companyName: row.company_name,
    title: row.title,
    location: row.location,
    salary: row.salary,
    deadline: row.deadline,
    empType: row.emp_type,
    reqCareer: row.req_career,
    reqEduc: '학력 무관',
    envConditions: [],
    fitLevel: row.fit_level as FitLevel,
    detailUrl: undefined,
    bookmarked: false,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10)),
    );

    // limit+1개 조회 → 실제 limit 초과 여부로 hasMore 판단
    const rows = await supabaseFetch<PerfTestRow[]>(
      `/rest/v1/perf_test_items?select=*&order=id.asc&offset=${offset}&limit=${limit + 1}`,
    );

    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit).map(toJobPosting);

    const result: PaginatedJobPostings = {
      items,
      total: 0,
      offset,
      hasMore,
    };

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '서버 오류가 발생했습니다.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
