'use client';

import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // 마운트 후 인라인 스크립트가 설정한 html 클래스를 읽어 상태 동기화 (localStorage 미기록)
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );
    setMounted(true);
  }, []);

  // DOM 조작 + localStorage 저장은 사용자가 명시적으로 전환할 때만 실행
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.toggle('dark', next === 'dark');
    root.classList.toggle('light', next === 'light');
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return { theme, toggle, mounted };
}
