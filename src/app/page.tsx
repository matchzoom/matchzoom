'use client';

import { useMockState } from '@/shared/providers/mock-state-provider';
import { DevStatePanel } from '@/shared/ui/DevStatePanel';
import { DashboardView } from '@/features/dashboard';
import {
  HeroSection,
  ServiceIntroSection,
  TrustSection,
  LandingBottomCta,
} from '@/features/landing';

function LandingView() {
  const handleCtaClick = () => {
    console.warn('[마주봄 목업] "검사 시작" CTA 클릭 → /survey로 이동 예정');
  };

  return (
    <>
      <HeroSection onCtaClick={handleCtaClick} />
      <ServiceIntroSection />
      <TrustSection />
      <LandingBottomCta onCtaClick={handleCtaClick} />
    </>
  );
}

export default function Home() {
  const { userState } = useMockState();

  return (
    <>
      {userState === 'surveyed' ? <DashboardView /> : <LandingView />}
      <DevStatePanel />
    </>
  );
}
