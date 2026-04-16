'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';

import type { UserState } from '@/shared/types/user';

type Theme = 'light' | 'dark';

type MockStateContextValue = {
  userState: UserState;
  setUserState: (state: UserState) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const MockStateContext = createContext<MockStateContextValue>({
  userState: 'guest',
  setUserState: () => {},
  theme: 'light',
  setTheme: () => {},
});

const DARK_VARS: [string, string][] = [
  ['--white', '#1F2937'],
  ['--bg', '#0A0A0A'],
  ['--surface', '#111827'],
  ['--border', '#374151'],
  ['--text', '#F9FAFB'],
  ['--gray-900', '#F9FAFB'],
  ['--gray-700', '#E5E7EB'],
  ['--gray-500', '#9CA3AF'],
  ['--gray-400', '#6B7280'],
  ['--gray-300', '#4B5563'],
  ['--gray-200', '#374151'],
  ['--gray-100', '#1F2937'],
  ['--gray-50', '#111827'],
  ['--primary-bg', '#0F1A38'],
  ['--primary-tag', '#0F1A38'],
  ['--primary-bg-strong', '#1A2A50'],
  ['--primary-border', '#2A3F7A'],
];

export function MockStateProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<UserState>('guest');
  // SSR/CSR 불일치 방지: 서버와 클라이언트 모두 'light'로 시작
  const [theme, setTheme] = useState<Theme>('light');
  // 첫 렌더(하이드레이션)에서 DOM 덮어쓰기 방지용 플래그
  const hasMounted = useRef(false);

  // 하이드레이션 후 인라인 스크립트가 설정한 html 클래스를 읽어 실제 테마로 동기화
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  // 테마 변경 시 DOM 반영 + localStorage 저장 (첫 렌더는 skip — 인라인 스크립트가 이미 설정)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      DARK_VARS.forEach(([key, value]) => root.style.setProperty(key, value));
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      DARK_VARS.forEach(([key]) => root.style.removeProperty(key));
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    console.warn('[마주봄 목업] 현재 사용자 상태:', userState);
  }, [userState]);

  return (
    <MockStateContext.Provider
      value={{ userState, setUserState, theme, setTheme }}
    >
      {children}
    </MockStateContext.Provider>
  );
}

export function useMockState() {
  return useContext(MockStateContext);
}
