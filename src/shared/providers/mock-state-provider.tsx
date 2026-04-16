'use client';

import { createContext, useContext, useState, useEffect } from 'react';

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
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
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
