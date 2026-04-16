const SERVICE_ITEMS = [
  {
    number: '01',
    title: '특성 검사',
    description: '선호 활동, 신체 조건 등 간단한 항목을 편하게 선택해요',
  },
  {
    number: '02',
    title: 'AI 직종 매칭',
    description: '공공 데이터 기반으로 잘 맞는 직종을 3단계로 알려드려요',
  },
  {
    number: '03',
    title: '공고 적합도 판별',
    description: '채용공고를 넣으면 우리 아이에게 맞는지 분석해드려요',
  },
] as const;

export function ServiceIntroSection() {
  return (
    <section
      aria-labelledby="service-intro-heading"
      className="py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-5 lg:px-6">
        <h2
          id="service-intro-heading"
          className="mb-8 text-[1.375rem] font-bold leading-[1.4] text-gray-900 md:mb-10"
        >
          이렇게 도와드려요
        </h2>
        <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
          {SERVICE_ITEMS.map((item) => (
            <li
              key={item.number}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              <span
                className="mb-4 block text-[0.75rem] font-semibold text-primary"
                aria-hidden="true"
              >
                {item.number}
              </span>
              <h3 className="mb-2 text-[1rem] font-semibold leading-[1.5] text-gray-900">
                {item.title}
              </h3>
              <p className="text-[0.875rem] leading-[1.6] text-gray-500">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
