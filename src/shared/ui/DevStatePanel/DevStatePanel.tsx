'use client';

import { useRouter } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

import { useMockState } from '@/shared/providers/mock-state-provider';
import type { UserState } from '@/shared/types/user';

const STATES: { value: UserState; label: string; desc: string }[] = [
  { value: 'guest', label: '비로그인', desc: '랜딩 화면 A' },
  {
    value: 'loggedIn',
    label: '로그인 (검사 전)',
    desc: '랜딩 화면 A (로그인됨)',
  },
  { value: 'surveyed', label: '로그인 + 검사 완료', desc: '대시보드 화면 B' },
];

export function DevStatePanel() {
  const { userState, setUserState, theme, setTheme } = useMockState();
  const isDark = theme === 'dark';
  const router = useRouter();

  const goToProfile = (state: UserState) => {
    setUserState(state);
    router.push('/profile');
  };

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

      {/* 사용자 상태 버튼 */}
      <div className="flex flex-col gap-2">
        {STATES.map(({ value, label, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => setUserState(value)}
            className={clsx(
              'transition-ui flex flex-col items-start rounded-md border px-3 py-2 text-left',
              userState === value
                ? 'border-primary bg-primary-bg text-primary'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100',
            )}
          >
            <span className="text-[0.8125rem] font-semibold leading-tight">
              {label}
            </span>
            <span
              className={clsx(
                'mt-0.5 text-[0.75rem]',
                userState === value ? 'text-primary' : 'text-gray-400',
              )}
            >
              {desc}
            </span>
          </button>
        ))}
      </div>

      <div className="my-3 border-t border-gray-200" />

      {/* 프로필 페이지 이동 */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => goToProfile('loggedIn')}
          className="transition-ui flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-[0.8125rem] font-semibold text-gray-700 hover:bg-gray-100"
        >
          프로필 (검사 전)
        </button>
        <button
          type="button"
          onClick={() => goToProfile('surveyed')}
          className="transition-ui flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-[0.8125rem] font-semibold text-gray-700 hover:bg-gray-100"
        >
          프로필 (검사 완료)
        </button>
      </div>

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
            'relative h-6 w-11 shrink-0 rounded-[12px]',
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
