'use client';

import { useState, useEffect } from 'react';

export function useBreakpointLimit(): number {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const lgQuery = window.matchMedia('(min-width: 1024px)');
    const smQuery = window.matchMedia('(min-width: 640px)');

    const update = () => {
      if (lgQuery.matches) setColumns(3);
      else if (smQuery.matches) setColumns(2);
      else setColumns(1);
    };

    update();
    lgQuery.addEventListener('change', update);
    smQuery.addEventListener('change', update);

    return () => {
      lgQuery.removeEventListener('change', update);
      smQuery.removeEventListener('change', update);
    };
  }, []);

  return columns;
}
