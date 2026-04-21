import Image from 'next/image';

type DecoStyle = 'fill-bottom' | 'fill-center' | 'fill-top';

const STEPS: {
  number: string;
  title: string;
  description: string;
  reverse: boolean;
  bg: string;
  deco: DecoStyle;
  image: string | null;
  imageClass?: string;
  innerPad?: string;
}[] = [
  {
    number: '01',
    title: '특성 검사',
    description: '선호 활동, 신체 조건 등\n간단한 항목을 편하게 선택해요',
    reverse: false,
    bg: 'bg-white',
    deco: 'fill-bottom',
    image: '/images/main/step_01.png',
    imageClass: 'object-cover object-top',
    innerPad: 'p-3',
  },
  {
    number: '02',
    title: 'AI 직종 매칭',
    description: '공공 데이터 기반으로\n잘 맞는 직종을 3단계로 알려드려요',
    reverse: true,
    bg: 'bg-gray-50',
    deco: 'fill-center',
    image: '/images/main/step_02.png',
    innerPad: 'px-[5px]',
  },
  {
    number: '03',
    title: '공고 적합도 판별',
    description: '채용공고를 넣으면\n우리 아이에게 맞는지 분석해드려요',
    reverse: false,
    bg: 'bg-white',
    deco: 'fill-top',
    image: '/images/main/step_03.png',
    innerPad: 'px-[5px]',
  },
];

function NumberDeco({
  number,
  deco,
  reverse,
}: {
  number: string;
  deco: DecoStyle;
  reverse: boolean;
}) {
  const side = reverse ? '-left-8' : '-right-8';
  const base = `pointer-events-none absolute select-none text-[16rem] font-bold leading-none text-primary-bg-strong md:text-[22rem] ${side}`;

  if (deco === 'fill-bottom') {
    return <span className={`${base} -bottom-10`}>{number}</span>;
  }
  if (deco === 'fill-center') {
    return <span className={`${base} top-1/2 -translate-y-1/2`}>{number}</span>;
  }
  return <span className={`${base} -top-20`}>{number}</span>;
}

export function ServiceIntroSection() {
  return (
    <section aria-labelledby="service-intro-heading">
      <h2 id="service-intro-heading" className="sr-only">
        이렇게 도와드려요
      </h2>
      {STEPS.map((step) => (
        <div key={step.number} className={step.bg}>
          <div className="relative overflow-hidden">
            <NumberDeco
              number={step.number}
              deco={step.deco}
              reverse={step.reverse}
            />

            <div
              className={`relative mx-auto flex max-w-[960px] items-center gap-12 px-4 py-10 md:px-5 md:py-12 lg:px-6 lg:py-14 ${
                step.reverse ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <h3 className="text-[1.5rem] font-bold leading-[1.35] text-gray-900 md:text-[1.75rem]">
                  {step.title}
                </h3>
                <p className="whitespace-pre-line text-[1rem] leading-[1.7] text-gray-500">
                  {step.description}
                </p>
              </div>

              <div className="hidden shrink-0 lg:block">
                <div
                  className={`h-[300px] w-[560px] overflow-hidden rounded-lg border border-gray-200 bg-white p-1.5 ${step.innerPad ?? ''}`}
                >
                  <div className="relative h-full w-full overflow-hidden rounded">
                    {step.image ? (
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        sizes="560px"
                        className={step.imageClass ?? 'object-cover object-top'}
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-[0.875rem] text-gray-400">
                        스크린샷 {step.number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
