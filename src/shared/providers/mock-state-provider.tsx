'use client';

import { createContext, useContext, useState, useEffect } from 'react';

import type { UserState } from '@/shared/types/user';

type MockStateContextValue = {
  userState: UserState;
  setUserState: (state: UserState) => void;
};

const MockStateContext = createContext<MockStateContextValue>({
  userState: 'guest',
  setUserState: () => {},
});

export function MockStateProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<UserState>('guest');

  useEffect(() => {
    console.warn('[마주봄 목업] 현재 사용자 상태:', userState);
    console.warn(
      '[마주봄 목업] DevPanel에서 상태를 전환하거나 setUserState("guest" | "loggedIn" | "surveyed")로 변경할 수 있습니다.',
    );
  }, [userState]);

  return (
    <MockStateContext.Provider value={{ userState, setUserState }}>
      {children}
    </MockStateContext.Provider>
  );
}

export function useMockState() {
  return useContext(MockStateContext);
}
