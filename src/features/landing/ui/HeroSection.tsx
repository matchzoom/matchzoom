import { Button } from '@/shared/ui/Button';

type HeroSectionProps = {
  onCtaClick: () => void;
};

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-hero-bg py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-5 lg:px-6">
        <div className="flex flex-col items-start gap-6 md:max-w-[640px]">
          <h1
            id="hero-heading"
            className="text-[1.75rem] font-bold leading-[1.35] text-gray-900 md:text-[2rem]"
          >
            우리 아이에게 맞는 일,
            <br />
            같이 찾아볼까요?
          </h1>
          <p className="text-[1rem] leading-[1.6] text-gray-700">
            자녀의 특성을 입력하면 AI가 적합한 직종과 채용공고를 찾아드려요
          </p>
          <div className="flex flex-col items-start gap-3">
            <Button size="lg" variant="primary" onClick={onCtaClick}>
              무료로 검사 시작하기
            </Button>
            <p className="text-[0.8125rem] text-gray-500">
              약 3분 소요 · 회원가입 없이 체험 가능
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
