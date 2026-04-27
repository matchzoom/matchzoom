'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import type { PaginatedJobPostings } from '@/shared/types/job';
import { VirtualJobList } from '@/features/dashboard/ui/VirtualJobList';
import { JobCard } from '@/shared/ui/JobCard';
import { useBreakpointLimit } from '@/features/dashboard/hooks/useBreakpointLimit';

const INITIAL_LIMIT = 12;
const SUBSEQUENT_LIMIT = 12;

async function fetchPerfPage(
  offset: number,
  limit: number,
  signal?: AbortSignal,
): Promise<PaginatedJobPostings> {
  const res = await fetch(`/api/perf-test?offset=${offset}&limit=${limit}`, {
    signal,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<PaginatedJobPostings>;
}

type Mode = 'virtual' | 'plain';

export default function PerfPage() {
  const [mode, setMode] = useState<Mode>('virtual');
  const [domCount, setDomCount] = useState(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [longTasks, setLongTasks] = useState<{ duration: number }[]>([]);

  const listAreaRef = useRef<HTMLDivElement>(null);
  const plainSentinelRef = useRef<HTMLDivElement>(null);
  const renderStartRef = useRef(0);
  const rafRef = useRef<number>(0);
  const hasNextPageRef = useRef(false);
  const isFetchingRef = useRef(false);
  const fetchNextPageRef = useRef<() => void>(() => {});
  const columns = useBreakpointLimit();

  const {
    data,
    isPending,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['perf-test'],
    queryFn: ({ pageParam, signal }) => {
      const limit =
        (pageParam as number) === 0 ? INITIAL_LIMIT : SUBSEQUENT_LIMIT;
      return fetchPerfPage(pageParam as number, limit, signal);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.offset + lastPage.items.length;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
  }, [hasNextPage]);
  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);
  useEffect(() => {
    fetchNextPageRef.current = fetchNextPage;
  }, [fetchNextPage]);

  // DOM 노드 수 — RAF 루프로 실시간 측정
  useLayoutEffect(() => {
    const measure = () => {
      const area = listAreaRef.current;
      if (area) setDomCount(area.querySelectorAll('*').length);
      rafRef.current = requestAnimationFrame(measure);
    };
    rafRef.current = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Long Task 감지
  useEffect(() => {
    let obs: PerformanceObserver | null = null;
    try {
      obs = new PerformanceObserver((list) => {
        const entries = list
          .getEntries()
          .map((e) => ({ duration: e.duration }));
        setLongTasks((prev) => [...prev, ...entries]);
      });
      obs.observe({ entryTypes: ['longtask'] });
    } catch {
      // Long Tasks API 미지원 환경
    }
    return () => obs?.disconnect();
  }, []);

  // Plain 모드 바닥 감지 (IntersectionObserver)
  useEffect(() => {
    if (mode !== 'plain') return;
    const sentinel = plainSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPageRef.current &&
          !isFetchingRef.current
        ) {
          fetchNextPageRef.current();
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [mode]);

  const measureRender = useCallback((action: () => void) => {
    setLongTasks([]);
    renderStartRef.current = performance.now();
    action();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRenderTime(performance.now() - renderStartRef.current);
      });
    });
  }, []);

  const switchMode = useCallback(
    (m: Mode) => measureRender(() => setMode(m)),
    [measureRender],
  );

  const longTaskTotal = longTasks.reduce((a, b) => a + b.duration, 0);

  // ── 로딩 상태 ──────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#4166E7] border-t-transparent" />
        <p className="text-sm text-gray-500">
          Supabase에서 데이터를 불러오는 중…
        </p>
      </div>
    );
  }

  // ── 에러 상태 ──────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-base font-semibold text-red-600">데이터 로드 실패</p>
        <p className="text-sm text-gray-500">
          {error instanceof Error ? error.message : '알 수 없는 오류'}
        </p>
        <div className="mt-2 rounded-lg bg-gray-100 p-4 text-left text-xs text-gray-600">
          <p className="mb-1 font-semibold">확인 사항:</p>
          <ol className="list-decimal space-y-1 pl-4">
            <li>
              Supabase SQL Editor에서 아래 페이지의 SQL로 테이블을 생성했는지
              확인
            </li>
            <li>
              <code>.env.local</code>의 SUPABASE_URL, SUPABASE_SECRET_KEY가
              올바른지 확인
            </li>
          </ol>
        </div>
      </div>
    );
  }

  // ── 정상 렌더링 ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 고정 메트릭 바 */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1200px] px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-gray-900">⚡ 성능 비교</span>

            {/* 모드 토글 */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => switchMode('virtual')}
                className={`rounded px-2.5 py-0.5 font-medium transition-colors ${
                  mode === 'virtual'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                가상 스크롤
              </button>
              <button
                onClick={() => switchMode('plain')}
                className={`rounded px-2.5 py-0.5 font-medium transition-colors ${
                  mode === 'plain'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                일반 렌더링
              </button>
            </div>

            <div className="h-4 w-px bg-gray-200" />

            {/* 지표 */}
            <Metric
              label="로드된 아이템"
              value={`${allItems.length}개`}
              danger={false}
            />
            <Metric
              label="DOM 노드"
              value={domCount.toLocaleString()}
              danger={domCount > 800}
            />
            {renderTime !== null && (
              <Metric
                label="렌더 시간"
                value={`${renderTime.toFixed(1)}ms`}
                danger={renderTime > 100}
              />
            )}
            <Metric
              label="Long Task"
              value={`${longTasks.length}회 / ${longTaskTotal.toFixed(0)}ms`}
              danger={longTasks.length > 0}
            />
          </div>
        </div>
      </div>

      {/* 설명 배너 */}
      <div className="mx-auto max-w-[1200px] px-4 pt-6">
        <div
          className={`rounded-lg border p-4 ${
            mode === 'virtual'
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              mode === 'virtual' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {mode === 'virtual' ? '🟢 가상 스크롤 모드' : '🔴 일반 렌더링 모드'}{' '}
            — {allItems.length}개 로드됨 · {columns}열
          </p>
          <p
            className={`mt-1 text-xs ${
              mode === 'virtual' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {mode === 'virtual'
              ? '뷰포트에 보이는 행만 DOM에 존재합니다. 아이템이 늘어도 DOM 노드 수가 거의 일정합니다.'
              : `로드된 ${allItems.length}개 전체가 DOM에 렌더링됩니다. 스크롤할수록 DOM 노드가 급증합니다.`}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            💡 DevTools → Performance 탭에서 기록 후 Long Tasks(빨간 사선)와
            Main Thread 점유율을 직접 비교하세요.
          </p>
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="mx-auto max-w-[1200px] px-4 py-6">
        <div ref={listAreaRef}>
          {mode === 'virtual' ? (
            <VirtualJobList
              items={allItems}
              columns={columns}
              onBookmarkToggle={() => {}}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          ) : (
            <>
              <div
                role="list"
                aria-label="채용공고 목록 (일반 렌더링)"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  gap: 24,
                }}
              >
                {allItems.map((job, i) => (
                  <div
                    key={job.id}
                    role="listitem"
                    aria-setsize={allItems.length}
                    aria-posinset={i + 1}
                  >
                    <JobCard job={job} onBookmarkToggle={() => {}} />
                  </div>
                ))}
              </div>

              {/* 바닥 감지 sentinel */}
              <div
                ref={plainSentinelRef}
                style={{ height: 1, marginTop: 200 }}
              />

              {isFetchingNextPage && (
                <div className="flex justify-center py-6">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#4166E7] border-t-transparent" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-400">{label}</span>
      <span
        className={`font-bold tabular-nums ${danger ? 'text-red-600' : 'text-green-600'}`}
      >
        {value}
      </span>
    </div>
  );
}
