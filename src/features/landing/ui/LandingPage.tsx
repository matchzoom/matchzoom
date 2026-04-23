'use client';

import { useRouter } from 'next/navigation';
import { HeroSection } from './HeroSection';
import { ServiceIntroSection } from './ServiceIntroSection';

type LandingPageProps = {
  isLoggedIn: boolean;
};

export function LandingPage({ isLoggedIn }: LandingPageProps) {
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
