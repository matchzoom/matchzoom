'use client';

import { useEffect } from 'react';

import { useMockState } from '@/shared/providers/mock-state-provider';
import { DevStatePanel } from '@/shared/ui/DevStatePanel';
import { ProfileView } from '@/features/profile';
import { ProfileEmptyView } from '@/features/profile/ui/ProfileEmptyView';

export default function ProfilePage() {
  const { userState, setUserState } = useMockState();

  // 프로필 페이지는 최소 로그인 상태
  useEffect(() => {
    if (userState === 'guest') {
      setUserState('loggedIn');
    }
  }, [userState, setUserState]);

  return (
    <>
      {userState === 'surveyed' ? <ProfileView /> : <ProfileEmptyView />}
      <DevStatePanel />
    </>
  );
}
