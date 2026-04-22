'use client';

import { useState, useEffect, useRef } from 'react';

type Theme = 'dark' | 'light';

export function useDarkMode() {
  // SSR/CSR 불일치 방지: 서버와 클라이언트 모두 'light'로 시작
  const [theme, setTheme] = useState<Theme>('light');
  // 첫 렌더(하이드레이션)에서 DOM 덮어쓰기 방지용 플래그
  const hasMounted = useRef(false);

  // 하이드레이션 후 인라인 스크립트가 설정한 html 클래스를 읽어 실제 테마로 동기화
  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );
  }, []);

  // 테마 변경 시 DOM 반영 + localStorage 저장 (첫 렌더는 skip — 인라인 스크립트가 이미 설정)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggle };
}
