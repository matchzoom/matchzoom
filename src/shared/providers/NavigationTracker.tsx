'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pushUrlHistory } from '@/shared/utils/urlHistory';

export function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pushUrlHistory(pathname);
  }, [pathname]);

  return null;
}
