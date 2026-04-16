'use client';

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
  const { userState, setUserState } = useMockState();

  return (
    <div
      role="region"
      aria-label="개발용 상태 전환 패널"
      className="fixed bottom-6 right-6 z-[9999] rounded-lg border border-gray-200 bg-white p-4"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
    >
      <p className="mb-3 text-[0.75rem] font-semibold text-gray-500">
        목업 상태 전환 (개발용)
      </p>
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
    </div>
  );
}
