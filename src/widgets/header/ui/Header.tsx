import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/shared/ui/Button';

export function Header() {
  const isAuthed = false;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[56px] max-w-[1200px] items-center justify-between px-4 md:h-[72px] md:px-5 lg:px-6">
        <Link
          href="/"
          className="rounded-sm text-[1.125rem] font-bold leading-none text-gray-900"
        >
          마주봄
        </Link>

        {!isAuthed && (
          <>
            <div className="hidden md:block">
              <Button variant="secondary" size="md">
                로그인
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="메뉴 열기"
              className="md:hidden"
            >
              <Menu size={24} strokeWidth={1.5} aria-hidden="true" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
