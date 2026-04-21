'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { getProfile } from '@/features/profile/api/profileApi';
import { DashboardView } from '@/features/dashboard';
import { HeroSection, ServiceIntroSection } from '@/features/landing';

function LandingView({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  const handleCtaClick = () => {
    if (isLoggedIn) {
      router.push('/survey');
    } else {
      window.location.href = '/api/oauth/kakao/authorize';
    }
  };

  return (
    <>
      <HeroSection onCtaClick={handleCtaClick} />
      <ServiceIntroSection />
    </>
  );
}

export default function Home() {
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: getProfile,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  if (userLoading) return null;
  if (user && profileLoading) return <DashboardView />;

  if (user && profile) return <DashboardView />;

  return <LandingView isLoggedIn={!!user} />;
}
