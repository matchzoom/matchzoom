'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';

import { cn } from '@/shared/utils/cn';

type ProfileDropdownProps = {
  isLogoutPending: boolean;
  onLogout: () => void;
  isTestUser: boolean;
};

export function ProfileDropdown({
  isLogoutPending,
  onLogout,
  isTestUser,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  const itemClass =
    'flex w-full cursor-pointer items-center justify-center px-4 py-2 text-[0.875rem] font-semibold text-gray-700 hover:bg-gray-100';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="사용자 메뉴 열기"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[6px] border border-gray-200 text-gray-700 hover:bg-gray-100"
      >
        <User size={20} strokeWidth={1.5} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 w-40 rounded-[8px] border border-gray-200 bg-white py-1"
        >
          <Link
            href="/profile?tab=result"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            프로필
          </Link>
          <Link
            href="/profile?tab=scraps"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            스크랩 공고
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={isLogoutPending}
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className={cn(
              itemClass,
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {isLogoutPending
              ? '로그아웃 중...'
              : isTestUser
                ? '게스트 계정 로그아웃'
                : '로그아웃'}
          </button>
        </div>
      )}
    </div>
  );
}
