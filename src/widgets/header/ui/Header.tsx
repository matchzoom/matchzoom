'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, MessageCircle, Menu } from 'lucide-react';

import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { ROUTES } from '@/shared/constants/routes';
import { useLogout } from '@/shared/hooks/useLogout';
import { useTestLogin } from '@/shared/hooks/useTestLogin';
import { useTestLogout } from '@/shared/hooks/useTestLogout';
import { useDarkMode } from '@/shared/hooks/useDarkMode';
import { Button, buttonVariants } from '@/shared/ui/Button';
import { cn } from '@/shared/utils/cn';
import type { CurrentUser } from '@/shared/types/user';
import { DarkModeToggle } from './DarkModeToggle';
import { MobileMenuDrawer } from './MobileMenuDrawer';

type HeaderProps = {
  initialUser?: CurrentUser | null;
};

export function Header({ initialUser }: HeaderProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: fetchedUser } = useCurrentUser();
  // fetchedUser가 undefined(로딩 중)이면 서버에서 내려준 initialUser 사용
  const user = fetchedUser ?? initialUser;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const { mutate: testLogin, isPending: isTestLoginPending } = useTestLogin();
  const { mutate: testLogout, isPending: isTestLogoutPending } =
    useTestLogout();
  const { theme, toggle: toggleTheme, mounted } = useDarkMode();

  const handleKakaoLogin = () => {
    window.location.href = ROUTES.KAKAO_AUTHORIZE;
  };

  const handleGuestLogin = () => {
    testLogin();
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    if (user?.isTestUser) {
      testLogout();
    } else {
      logout();
    }
  };

  const isLogoutPendingCombined = user?.isTestUser
    ? isTestLogoutPending
    : isLogoutPending;

  return (
    <>
      <header
        className={`transition-ui fixed inset-x-0 top-0 z-40 border-b border-gray-200 ${scrolled ? 'bg-white' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:h-[72px] md:px-5 lg:px-6">
          {/* 로고 */}
          <Link
            href="/"
            className="cursor-pointer rounded-sm text-[1.7rem] font-bold leading-none text-gray-900"
          >
            마주
            <span className="ml-[2px] inline-flex h-[1.4em] w-[1.4em] items-center justify-center rounded-full bg-primary text-[0.9em] font-bold text-static-white">
              봄
            </span>
          </Link>

          {/* 데스크탑 우측 영역 */}
          <div className="hidden items-center gap-3 md:flex">
            {mounted && <DarkModeToggle theme={theme} onToggle={toggleTheme} />}

            {!user && (
              <nav aria-label="로그인 메뉴" className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  disabled={isTestLoginPending}
                  onClick={() => testLogin()}
                >
                  {isTestLoginPending
                    ? '로그인 중...'
                    : '게스트 계정으로 로그인'}
                </Button>
                <Button variant="kakao" size="md" onClick={handleKakaoLogin}>
                  <MessageCircle
                    size={16}
                    strokeWidth={0}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                  카카오로 로그인
                </Button>
              </nav>
            )}

            {user && (
              <nav aria-label="사용자 메뉴" className="flex items-center gap-2">
                <Link
                  href="/profile"
                  aria-label="프로필 페이지로 이동"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'md' }),
                  )}
                >
                  <User size={20} strokeWidth={1.5} aria-hidden="true" />
                  프로필
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  disabled={isLogoutPendingCombined}
                  onClick={handleLogout}
                >
                  {isLogoutPendingCombined
                    ? '로그아웃 중...'
                    : user.isTestUser
                      ? '게스트 계정 로그아웃'
                      : '로그아웃'}
                </Button>
              </nav>
            )}
          </div>

          {/* 모바일 우측 영역: 항상 다크모드 토글 + 햄버거 */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && <DarkModeToggle theme={theme} onToggle={toggleTheme} />}
            <button
              type="button"
              aria-label="메뉴 열기"
              aria-expanded={drawerOpen}
              aria-controls="mobile-menu"
              onClick={() => setDrawerOpen(true)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm text-gray-700 hover:bg-gray-100"
            >
              <Menu size={24} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 드로어 */}
      {drawerOpen && (
        <MobileMenuDrawer
          user={user}
          onClose={() => setDrawerOpen(false)}
          onGuestLogin={handleGuestLogin}
          onKakaoLogin={handleKakaoLogin}
          isGuestLoginPending={isTestLoginPending}
          onLogout={handleLogout}
          isLogoutPending={isLogoutPendingCombined}
        />
      )}
    </>
  );
}
