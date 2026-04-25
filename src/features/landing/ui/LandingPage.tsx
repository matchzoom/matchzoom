import { HeroSection } from './HeroSection';
import { ServiceIntroSection } from './ServiceIntroSection';

type LandingPageProps = {
  isLoggedIn: boolean;
};

export function LandingPage({ isLoggedIn }: LandingPageProps) {
  return (
    <>
      <HeroSection isLoggedIn={isLoggedIn} />
      <ServiceIntroSection />
    </>
  );
}
