'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Menu } from 'lucide-react';

import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { ROUTES } from '@/shared/constants/routes';
import { useLogout } from '@/shared/hooks/useLogout';
import { useTestLogin } from '@/shared/hooks/useTestLogin';
import { useTestLogout } from '@/shared/hooks/useTestLogout';
import { useDarkMode } from '@/shared/hooks/useDarkMode';
import { Button } from '@/shared/ui/Button';
import type { CurrentUser } from '@/shared/types/user';
import { DarkModeToggle } from './DarkModeToggle';
import { MobileLoginDrawer } from './MobileLoginDrawer';
import { ProfileDropdown } from './ProfileDropdown';

type HeaderProps = {
  initialUser?: CurrentUser | null;
};

export function Header({ initialUser }: HeaderProps) {
  const pathname = usePathname();
  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: fetchedUser } = useCurrentUser();
  const user = fetchedUser ?? initialUser;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setLoginDrawerOpen(false);
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
    setLoginDrawerOpen(false);
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
              <ProfileDropdown
                isLogoutPending={isLogoutPendingCombined}
                onLogout={handleLogout}
                isTestUser={!!user.isTestUser}
              />
            )}
          </div>

          {/* 모바일 우측 영역 */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && <DarkModeToggle theme={theme} onToggle={toggleTheme} />}

            {user ? (
              <ProfileDropdown
                isLogoutPending={isLogoutPendingCombined}
                onLogout={handleLogout}
                isTestUser={!!user.isTestUser}
              />
            ) : (
              <Button
                size="icon"
                variant="ghost"
                aria-label="메뉴 열기"
                aria-expanded={loginDrawerOpen}
                aria-controls="mobile-login-menu"
                onClick={() => setLoginDrawerOpen(true)}
              >
                <Menu size={24} strokeWidth={1.5} aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {loginDrawerOpen && !user && (
        <MobileLoginDrawer
          onClose={() => setLoginDrawerOpen(false)}
          onTestLogin={handleGuestLogin}
          onKakaoLogin={handleKakaoLogin}
          isTestLoginPending={isTestLoginPending}
        />
      )}
    </>
  );
}
