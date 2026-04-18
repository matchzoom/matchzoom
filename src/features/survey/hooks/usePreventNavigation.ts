'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getPreviousUrl } from '@/shared/utils/urlHistory';

/**
 * 폼에 변경사항이 있을 때 의도치 않은 페이지 이탈을 막는 훅.
 * - 새로고침 / 탭 닫기 (beforeunload)
 * - 내부 링크 클릭 (anchor click)
 * - 브라우저 뒤로가기 (popstate)
 *
 * POPSTATE 이탈 시 history.go() 대신 router.push(previousUrl)로 이동하여
 * Next.js App Router와 호환성을 보장한다.
 */
export function usePreventNavigation(isDirty: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  const [isBlocking, setIsBlocking] = useState(false);
  const isDirtyRef = useRef(isDirty);
  const pendingActionRef = useRef<(() => void) | null>(null);

  isDirtyRef.current = isDirty;

  useEffect(() => {
    if (!isDirty) return;
    if (history.state?.blocked !== true) {
      history.pushState({ blocked: true }, '', location.href);
    }
  }, [isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      e.preventDefault();
    };

    const handleAnchorClick = (e: MouseEvent) => {
      if (!isDirtyRef.current) return;
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && anchor.href.startsWith(location.origin) && !anchor.target) {
        e.preventDefault();
        const href = anchor.href;
        pendingActionRef.current = () => {
          router.push(href);
        };
        setIsBlocking(true);
      }
    };

    const handlePopState = () => {
      if (!isDirtyRef.current) return;
      history.pushState({ blocked: true }, '', location.href);
      setTimeout(() => {
        pendingActionRef.current = () => {
          router.replace(getPreviousUrl());
        };
        setIsBlocking(true);
      }, 0);
    };

    addEventListener('beforeunload', handleBeforeUnload);
    addEventListener('click', handleAnchorClick, true);
    addEventListener('popstate', handlePopState);

    return () => {
      removeEventListener('beforeunload', handleBeforeUnload);
      removeEventListener('click', handleAnchorClick, true);
      removeEventListener('popstate', handlePopState);
    };
  }, [router, pathname]);

  const onStay = useCallback(() => {
    pendingActionRef.current = null;
    setIsBlocking(false);
  }, []);

  const onLeave = useCallback(() => {
    isDirtyRef.current = false;
    setIsBlocking(false);
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  }, []);

  return { isBlocking, onStay, onLeave };
}
