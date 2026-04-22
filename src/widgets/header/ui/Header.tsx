'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';

import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useLogout } from '@/shared/hooks/useLogout';
import { useTestLogin } from '@/shared/hooks/useTestLogin';
import { useTestLogout } from '@/shared/hooks/useTestLogout';
import { Button } from '@/shared/ui/Button';

export function Header() {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const { data: user } = useCurrentUser();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const { mutate: testLogin, isPending: isTestLoginPending } = useTestLogin();
  const { mutate: testLogout, isPending: isTestLogoutPending } =
    useTestLogout();

  return (
    <header
      className={`border-b ${isLanding ? 'border-primary-border bg-hero-bg' : 'border-gray-100'}`}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:h-[72px] md:px-5 lg:px-6">
        <Link
          href="/"
          className="cursor-pointer rounded-sm text-[1.7rem] font-bold leading-none text-gray-900"
        >
          마주
          <span className="ml-[2px] inline-flex h-[1.4em] w-[1.4em] items-center justify-center rounded-full bg-primary text-[0.9em] font-bold text-static-white">
            봄
          </span>
        </Link>

        {!user && (
          <nav aria-label="로그인 메뉴" className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="md"
              disabled={isTestLoginPending}
              onClick={() => testLogin()}
            >
              {isTestLoginPending ? '로그인 중...' : '테스트 계정으로 로그인'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                window.location.href = '/api/oauth/kakao/authorize';
              }}
            >
              로그인
            </Button>
          </nav>
        )}

        {user && user.isTestUser && (
          <nav
            aria-label="테스트 계정 메뉴"
            className="flex items-center gap-3"
          >
            <Link
              href="/profile"
              aria-label="프로필 페이지로 이동"
              className="transition-ui flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              <User size={20} strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <Button
              variant="ghost"
              size="md"
              disabled={isTestLogoutPending}
              onClick={() => testLogout()}
            >
              {isTestLogoutPending ? '로그아웃 중...' : '테스트 계정 로그아웃'}
            </Button>
          </nav>
        )}

        {user && !user.isTestUser && (
          <nav aria-label="사용자 메뉴" className="flex items-center gap-3">
            <Link
              href="/profile"
              aria-label="프로필 페이지로 이동"
              className="transition-ui flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              <User size={20} strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <Button
              variant="secondary"
              size="md"
              disabled={isLogoutPending}
              onClick={() => logout()}
            >
              {isLogoutPending ? '로그아웃 중...' : '로그아웃'}
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
