import { Button } from '@/shared/ui/Button';

type LandingBottomCtaProps = {
  onCtaClick: () => void;
};

export function LandingBottomCta({ onCtaClick }: LandingBottomCtaProps) {
  return (
    <section
      aria-labelledby="bottom-cta-heading"
      className="border-t border-gray-200 py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-5 lg:px-6">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <h2
            id="bottom-cta-heading"
            className="text-[1.375rem] font-bold leading-[1.4] text-gray-900"
          >
            지금 바로 우리 아이 직종 찾기
          </h2>
          <Button size="lg" variant="primary" onClick={onCtaClick}>
            검사 시작하기
          </Button>
        </div>
      </div>
    </section>
  );
}
