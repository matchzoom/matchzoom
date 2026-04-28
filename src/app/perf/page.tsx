'use client';

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  memo,
  startTransition,
} from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { BarChart2 } from 'lucide-react';
import type { FitLevel, JobPosting } from '@/shared/types/job';
import { JobCard } from '@/features/dashboard/ui/JobCard';
import { VirtualJobList } from '@/features/dashboard/ui/VirtualJobList';

// ─── 상수 ───────────────────────────────────────────────────────────────────

const INITIAL_LIMIT = 12;
const PAGE_SIZE = 12;

// ─── 타입 ───────────────────────────────────────────────────────────────────

type PerfTestItem = {
  id: number;
  company_name: string;
  title: string;
  location: string;
  salary: string;
  deadline: string;
  emp_type: string;
  req_career: string;
  fit_level: FitLevel;
};

type PerfTestPage = {
  items: JobPosting[];
  nextOffset: number | null;
  elapsedMs: number;
};

type Metrics = {
  loadedItems: number;
  domNodes: number;
  renderMs: number | null;
  longTasks: number;
  tbtMs: number;
};

type Mode = 'normal' | 'virtual';

const INITIAL_METRICS: Metrics = {
  loadedItems: 0,
  domNodes: 0,
  renderMs: null,
  longTasks: 0,
  tbtMs: 0,
};

// ─── 유틸 ───────────────────────────────────────────────────────────────────

const noop = () => {};

function toJobPosting(item: PerfTestItem): JobPosting {
  return {
    id: item.id,
    companyName: item.company_name,
    title: item.title,
    location: item.location,
    salary: item.salary,
    deadline: item.deadline,
    empType: item.emp_type,
    reqCareer: item.req_career,
    reqEduc: '',
    envConditions: [],
    fitLevel: item.fit_level,
    detailUrl: '',
    bookmarked: false,
  };
}

async function fetchPerfPage(
  offset: number,
  limit: number,
  signal?: AbortSignal,
): Promise<PerfTestPage> {
  const res = await fetch(`/api/perf-test?offset=${offset}&limit=${limit}`, {
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as {
    items: PerfTestItem[];
    nextOffset: number | null;
    elapsedMs: number;
  };
  return {
    items: data.items.map(toJobPosting),
    nextOffset: data.nextOffset,
    elapsedMs: data.elapsedMs,
  };
}

// ─── 페이지 ─────────────────────────────────────────────────────────────────

export default function PerfPage() {
  const [mode, setMode] = useState<Mode>('virtual');
  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS);
  const [columns, setColumns] = useState(3);

  const queryClient = useQueryClient();

  const listRef = useRef<HTMLElement>(null);
  const renderStartRef = useRef(0);
  const longTaskCountRef = useRef(0);
  const longTaskTbtRef = useRef(0);
  const longTaskBaseRef = useRef({ count: 0, tbt: 0 });
  const hasNextPageRef = useRef(false);
  const isFetchingNextPageRef = useRef(false);
  const fetchNextPageRef = useRef<() => void>(() => {});

  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['perf-test'],
      queryFn: ({ pageParam, signal }) =>
        fetchPerfPage(
          pageParam as number,
          pageParam === 0 ? INITIAL_LIMIT : PAGE_SIZE,
          signal,
        ),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
      staleTime: 5 * 60 * 1000,
    });

  const allJobs = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );
  const supabaseMs = data?.pages[0]?.elapsedMs ?? null;

  // ── 반응형 열 수 ──────────────────────────────────────────────────────────
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.innerWidth >= 1024) setColumns(3);
        else if (window.innerWidth >= 640) setColumns(2);
        else setColumns(1);
      }, 100);
    };
    update();
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      clearTimeout(timer);
    };
  }, []);

  // ── 렌더 시간: 새 아이템 도착 시 ─────────────────────────────────────────
  useEffect(() => {
    if (allJobs.length === 0) return;
    const start = performance.now();
    let id2: ReturnType<typeof requestAnimationFrame>;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        startTransition(() => {
          setMetrics((prev) => ({
            ...prev,
            renderMs: Math.round(performance.now() - start),
          }));
        });
      });
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [allJobs.length]);

  // ── 렌더 시간: 모드 전환 후 ──────────────────────────────────────────────
  useEffect(() => {
    const start = renderStartRef.current;
    if (start === 0) return;
    let id2: ReturnType<typeof requestAnimationFrame>;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        setMetrics((prev) => ({
          ...prev,
          renderMs: Math.round(performance.now() - start),
        }));
        renderStartRef.current = 0;
      });
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [mode]);

  // ── DOM 노드 수 ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!listRef.current || allJobs.length === 0) return;
    const id = requestAnimationFrame(() => {
      setMetrics((prev) => ({
        ...prev,
        domNodes: listRef.current?.querySelectorAll('article').length ?? 0,
        loadedItems: allJobs.length,
      }));
    });
    return () => cancelAnimationFrame(id);
  }, [allJobs.length, mode]);

  // ── Long Tasks / TBT ─────────────────────────────────────────────────────
  // [] dep으로 영구 연결 — reconnect 시 모드 전환 렌더가 longtask로 잡히는 문제 방지
  // 리셋은 longTaskBaseRef 오프셋으로 처리 (handleModeChange)
  // startTransition으로 setMetrics 리렌더를 저우선순위 처리 → 피드백 루프 차단
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window))
      return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        longTaskCountRef.current++;
        longTaskTbtRef.current += Math.max(0, entry.duration - 50);
      });
      const displayed =
        longTaskCountRef.current - longTaskBaseRef.current.count;
      const tbtDisplayed = longTaskTbtRef.current - longTaskBaseRef.current.tbt;
      startTransition(() => {
        setMetrics((prev) => ({
          ...prev,
          longTasks: displayed,
          tbtMs: Math.round(tbtDisplayed),
        }));
      });
    });

    try {
      observer.observe({ type: 'longtask', buffered: false });
    } catch {
      // longtask 미지원 브라우저
    }

    return () => observer.disconnect();
  }, []);

  // ── ref 동기화 ────────────────────────────────────────────────────────────
  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
  }, [hasNextPage]);
  useEffect(() => {
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);
  useEffect(() => {
    fetchNextPageRef.current = fetchNextPage;
  }, [fetchNextPage]);

  // ── 스크롤 끝 감지 ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasNextPage) return;

    const checkBottom = () => {
      const remaining =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      if (remaining <= 200 && !isFetchingNextPageRef.current) {
        fetchNextPageRef.current();
      }
    };

    checkBottom();
    window.addEventListener('scroll', checkBottom, { passive: true });
    return () => window.removeEventListener('scroll', checkBottom);
  }, [hasNextPage]);

  // ── 모드 전환 ─────────────────────────────────────────────────────────────
  const handleModeChange = (next: Mode) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    renderStartRef.current = performance.now();
    longTaskBaseRef.current = {
      count: longTaskCountRef.current,
      tbt: longTaskTbtRef.current,
    };
    setMetrics({ ...INITIAL_METRICS, renderMs: null });
    queryClient.resetQueries({ queryKey: ['perf-test'], exact: true });
    setMode(next);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── 스티키 헤더 ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-3">
          {/* 타이틀 + Supabase 응답 + 모드 토글 */}
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2
                size={18}
                strokeWidth={1.5}
                className="text-primary"
                aria-hidden="true"
              />
              <h1 className="text-base font-bold text-gray-900">성능 비교</h1>
              {supabaseMs !== null && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                  Supabase {supabaseMs}ms
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              <ModeButton
                active={mode === 'virtual'}
                onClick={() => handleModeChange('virtual')}
              >
                가상 스크롤
              </ModeButton>
              <ModeButton
                active={mode === 'normal'}
                onClick={() => handleModeChange('normal')}
              >
                일반 렌더링
              </ModeButton>
            </div>
          </div>

          {/* 지표 바 */}
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Metric label="로드된 아이템" value={`${metrics.loadedItems}개`} />
            <Metric
              label="DOM 노드"
              value={`${metrics.domNodes}개`}
              highlight={metrics.domNodes > 200}
            />
            <Metric
              label="렌더 시간"
              value={
                metrics.renderMs !== null ? `${metrics.renderMs}ms` : '측정 중…'
              }
            />
            <Metric
              label="Long Tasks"
              value={`${metrics.longTasks}회 / ${metrics.tbtMs >= 1000 ? `${(metrics.tbtMs / 1000).toFixed(1)}초` : `${metrics.tbtMs}ms`}`}
              highlight={metrics.longTasks > 5 || metrics.tbtMs > 300}
              note="longtask API 기준 (순수 JS 블로킹 > 50ms)"
            />
          </div>
        </div>
      </header>

      {/* ── 본문 ────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        {isPending ? (
          <div
            className="flex min-h-[70vh] flex-col items-center justify-center gap-3"
            aria-busy="true"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
            <p className="text-sm text-gray-400">Supabase에서 불러오는 중…</p>
          </div>
        ) : (
          <>
            {/* 리스트 상단 정보 */}
            <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700">
                <span>
                  모드:{' '}
                  <strong>
                    {mode === 'normal' ? '일반 렌더링' : '가상 스크롤'}
                  </strong>
                </span>
                <span>
                  로드:{' '}
                  <strong>
                    {allJobs.length}개{hasNextPage ? ' (더 있음)' : ' (완료)'}
                  </strong>
                </span>
                <span>
                  열: <strong>{columns}열</strong>
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                💡 DevTools → Performance 탭에서 스크롤 녹화 후 Long Tasks가
                얼마나 쌓이는지, 일반 렌더링과 가상 스크롤을 비교해보세요.
              </p>
            </div>

            {/* 카드 목록 */}
            {mode === 'normal' ? (
              <section ref={listRef} aria-label="일반 렌더링 목록">
                <JobList jobs={allJobs} onBookmarkToggle={noop} />
              </section>
            ) : (
              <section ref={listRef} aria-label="가상 스크롤 목록">
                <VirtualList postings={allJobs} onBookmarkToggle={noop} />
              </section>
            )}

            {isFetchingNextPage && (
              <div className="flex justify-center py-10" aria-busy="true">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
              </div>
            )}

            {!hasNextPage && allJobs.length > 0 && (
              <p className="mt-6 text-center text-xs text-gray-400">
                전체 {allJobs.length}개 로드 완료
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ─── 서브 컴포넌트 ───────────────────────────────────────────────────────────

// metrics 업데이트(PerformanceObserver) 시 가상 목록 리렌더링 차단
// allJobs(state)와 noop(모듈 상수)가 안정적이므로 virtualizer 내부 스크롤 이벤트 외에는 재렌더 없음
const VirtualList = memo(function VirtualList({
  postings,
  onBookmarkToggle,
}: {
  postings: JobPosting[];
  onBookmarkToggle: (job: JobPosting) => void;
}) {
  return (
    <VirtualJobList postings={postings} onBookmarkToggle={onBookmarkToggle} />
  );
});

// metrics 업데이트(PerformanceObserver) 시 카드 목록 리렌더링 차단
const JobList = memo(function JobList({
  jobs,
  onBookmarkToggle,
}: {
  jobs: JobPosting[];
  onBookmarkToggle: (job: JobPosting) => void;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <li key={job.id} className="min-w-0">
          <JobCard job={job} onBookmarkToggle={onBookmarkToggle} />
        </li>
      ))}
    </ul>
  );
});

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
        active
          ? 'bg-primary text-white'
          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Metric({
  label,
  value,
  highlight = false,
  note,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  note?: string;
}) {
  return (
    <div className="flex items-baseline gap-1" title={note}>
      <span className="text-[0.6875rem] text-gray-400">{label}</span>
      <span
        className={`text-xs font-semibold ${highlight ? 'text-red-500' : 'text-gray-800'}`}
      >
        {value}
      </span>
    </div>
  );
}
