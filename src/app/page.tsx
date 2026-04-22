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

  const isLoading = userLoading || (!!user && profileLoading);

  if (!isLoading && user && profile) return <DashboardView />;

  return (
    <div
      className={
        isLoading
          ? 'pointer-events-none [&_button]:opacity-0 [&_h1]:text-transparent [&_h3]:text-transparent [&_img]:opacity-0 [&_p]:text-transparent [&_span]:opacity-0 [&_.step-image-frame]:opacity-0'
          : undefined
      }
    >
      <LandingView isLoggedIn={!isLoading && !!user} />
    </div>
  );
}
