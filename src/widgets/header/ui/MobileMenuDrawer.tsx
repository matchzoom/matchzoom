'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { X, MessageCircle, User } from 'lucide-react';

import { useModalAccessibility } from '@/shared/hooks/useModalAccessibility';
import { Button, buttonVariants } from '@/shared/ui/Button';
import { cn } from '@/shared/utils/cn';
import type { CurrentUser } from '@/shared/types/user';

type MobileMenuDrawerProps = {
  user: CurrentUser | null | undefined;
  onClose: () => void;
  onGuestLogin: () => void;
  onKakaoLogin: () => void;
  isGuestLoginPending: boolean;
  onLogout: () => void;
  isLogoutPending: boolean;
};

export function MobileMenuDrawer({
  user,
  onClose,
  onGuestLogin,
  onKakaoLogin,
  isGuestLoginPending,
  onLogout,
  isLogoutPending,
}: MobileMenuDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  useModalAccessibility(drawerRef, onClose);

  return (
    <div
      ref={drawerRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={user ? '메뉴' : '로그인'}
      className="fixed inset-0 z-50 flex flex-col bg-white"
    >
      {/* 상단 닫기 버튼 */}
      <div className="flex h-14 shrink-0 items-center px-2">
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={onClose}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm text-gray-700 hover:bg-gray-100"
        >
          <X size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {/* 중앙 로고 */}
      <div className="flex flex-1 items-center justify-center">
        <Link
          href="/"
          onClick={onClose}
          className="cursor-pointer text-[3.5rem] font-bold leading-none text-gray-900"
        >
          마주
          <span className="ml-[2px] inline-flex h-[1.4em] w-[1.4em] items-center justify-center rounded-full bg-primary text-[0.9em] font-bold text-static-white">
            봄
          </span>
        </Link>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex shrink-0 flex-col gap-3 px-4 pb-10">
        {!user ? (
          <>
            <Button
              variant="outline"
              size="lg"
              disabled={isGuestLoginPending}
              onClick={onGuestLogin}
              className="w-full justify-center"
            >
              {isGuestLoginPending ? '로그인 중...' : '게스트 계정으로 로그인'}
            </Button>
            <Button
              variant="kakao"
              size="lg"
              onClick={onKakaoLogin}
              className="w-full justify-center"
            >
              <MessageCircle
                size={16}
                strokeWidth={0}
                fill="currentColor"
                aria-hidden="true"
              />
              카카오로 로그인
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/profile"
              onClick={onClose}
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'w-full justify-center',
              )}
            >
              <User size={20} strokeWidth={1.5} aria-hidden="true" />
              프로필
            </Link>
            <Button
              variant="outline"
              size="lg"
              disabled={isLogoutPending}
              onClick={onLogout}
              className="w-full justify-center"
            >
              {isLogoutPending
                ? '로그아웃 중...'
                : user.isTestUser
                  ? '게스트 계정 로그아웃'
                  : '로그아웃'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
