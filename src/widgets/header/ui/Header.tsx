'use client';

import Link from 'next/link';
import { User } from 'lucide-react';

import { useMockState } from '@/shared/providers/mock-state-provider';
import { Button } from '@/shared/ui/Button';

export function Header() {
  const { userState } = useMockState();
  const isLoggedIn = userState === 'loggedIn' || userState === 'surveyed';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:h-[72px] md:px-5 lg:px-6">
        <Link
          href="/"
          className="rounded-sm text-[1.125rem] font-bold leading-none text-gray-900"
        >
          마주봄
        </Link>

        {!isLoggedIn && (
          <Button variant="secondary" size="md">
            로그인
          </Button>
        )}

        {isLoggedIn && (
          <nav aria-label="사용자 메뉴" className="flex items-center gap-3">
            <Link
              href="/profile"
              aria-label="프로필 페이지로 이동"
              className="transition-ui flex h-9 w-9 items-center justify-center rounded-sm border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              <User size={20} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
