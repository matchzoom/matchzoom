import Image from 'next/image';
import { Button } from '@/shared/ui/Button';

type HeroSectionProps = {
  onCtaClick: () => void;
};

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-hero-bg py-16 md:py-20 lg:py-0"
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-10">
          {/* 좌: 텍스트 */}
          <div className="flex flex-col items-start gap-6">
            <h1
              id="hero-heading"
              className="text-[1.75rem] font-bold leading-[1.35] text-gray-900 md:text-[2rem]"
            >
              나에게 맞는 일,
              <br />
              함께 찾아볼까요?
            </h1>
            <p className="text-[1rem] leading-[1.6] text-gray-700">
              개인의 특성을 바탕으로 AI가 적합한 직종과 채용공고를 분석해드려요
            </p>
            <div className="flex flex-col items-start gap-3">
              <Button size="lg" variant="primary" onClick={onCtaClick}>
                내게 맞는 일 찾아보기
              </Button>
              <p className="text-[0.8125rem] text-gray-500">
                3분이면 충분해요 · 바로 결과 확인 가능
              </p>
            </div>
          </div>

          {/* 우: 이미지 */}
          <div className="hidden shrink-0 lg:block">
            <Image
              src="/images/main/main_section_01.png"
              alt=""
              width={620}
              height={520}
              className="h-auto w-[460px]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
