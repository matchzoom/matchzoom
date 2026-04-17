'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

import { useMockState } from '@/shared/providers/mock-state-provider';
import type { UserState } from '@/shared/types/user';

type ScenarioEntry = {
  userState: UserState;
  pathname: string;
  label: string;
  desc: string;
};

const SCENARIOS: ScenarioEntry[] = [
  { userState: 'guest', pathname: '/', label: '비로그인', desc: '랜딩 화면 A' },
  {
    userState: 'loggedIn',
    pathname: '/',
    label: '로그인 (검사 전)',
    desc: '랜딩 화면 A (로그인됨)',
  },
  {
    userState: 'surveyed',
    pathname: '/',
    label: '로그인 + 검사 완료',
    desc: '대시보드 화면 B',
  },
  {
    userState: 'loggedIn',
    pathname: '/profile',
    label: '프로필 (검사 전)',
    desc: '/profile 검사 전',
  },
  {
    userState: 'surveyed',
    pathname: '/profile',
    label: '프로필 (검사 완료)',
    desc: '/profile 검사 완료',
  },
];

export function DevStatePanel() {
  const { userState, setUserState, theme, setTheme } = useMockState();
  const isDark = theme === 'dark';
  const router = useRouter();
  const pathname = usePathname();

  const activate = (scenario: ScenarioEntry) => {
    setUserState(scenario.userState);
    router.push(scenario.pathname);
  };

  const isActive = (scenario: ScenarioEntry) =>
    userState === scenario.userState && pathname === scenario.pathname;

  return (
    <div
      role="region"
      aria-label="개발용 상태 전환 패널"
      className="fixed bottom-6 right-6 z-[9999] w-[200px] rounded-lg border border-gray-200 bg-white p-4"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
    >
      <p className="mb-3 text-[0.75rem] font-semibold text-gray-500">
        목업 상태 전환 (개발용)
      </p>

      <div className="flex flex-col gap-2">
        {SCENARIOS.map((scenario) => {
          const active = isActive(scenario);
          return (
            <button
              key={`${scenario.userState}-${scenario.pathname}`}
              type="button"
              onClick={() => activate(scenario)}
              className={clsx(
                'transition-ui flex cursor-pointer flex-col items-start rounded-md border px-3 py-2 text-left',
                active
                  ? 'border-primary bg-primary-bg text-primary'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100',
              )}
            >
              <span className="text-[0.8125rem] font-semibold leading-tight">
                {scenario.label}
              </span>
              <span
                className={clsx(
                  'mt-0.5 text-[0.75rem]',
                  active ? 'text-primary' : 'text-gray-400',
                )}
              >
                {scenario.desc}
              </span>
            </button>
          );
        })}
      </div>

      <div className="my-3 border-t border-gray-200" />

      {/* 컴포넌트 쇼케이스 이동 */}
      <button
        type="button"
        onClick={() => router.push('/dev/components')}
        className={clsx(
          'transition-ui flex w-full cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-[0.8125rem] font-semibold',
          pathname === '/dev/components'
            ? 'border-primary bg-primary-bg text-primary'
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100',
        )}
      >
        컴포넌트 쇼케이스
      </button>

      <div className="my-3 border-t border-gray-200" />

      {/* 다크/라이트 모드 토글 */}
      <div className="flex items-center justify-between">
        <span className="text-[0.75rem] font-semibold text-gray-500">
          {isDark ? '다크 모드' : '라이트 모드'}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={clsx(
            'relative h-6 w-11 shrink-0 cursor-pointer rounded-[12px]',
            isDark ? 'bg-primary' : 'bg-gray-300',
          )}
          style={{ transition: 'background-color 150ms ease' }}
        >
          <span
            className="absolute top-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white"
            style={{
              left: isDark ? '22px' : '3px',
              transition: 'left 150ms ease',
            }}
          >
            {isDark ? (
              <Moon
                size={10}
                strokeWidth={1.5}
                className="text-primary"
                aria-hidden="true"
              />
            ) : (
              <Sun
                size={10}
                strokeWidth={1.5}
                className="text-gray-400"
                aria-hidden="true"
              />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
