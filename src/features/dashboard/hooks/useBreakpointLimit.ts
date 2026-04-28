'use client';

import { useState, useEffect } from 'react';

function getColumns(): 1 | 2 | 3 {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

export function useBreakpointLimit(): 1 | 2 | 3 {
  const [columns, setColumns] = useState<1 | 2 | 3>(getColumns);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setColumns(getColumns()), 100);
    };
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
      clearTimeout(timer);
    };
  }, []);

  return columns;
}
