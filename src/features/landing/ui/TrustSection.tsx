const TRUST_ORGS = [
  '한국고용정보원',
  '한국장애인고용공단',
  '공공데이터포털',
] as const;

export function TrustSection() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="border-t border-gray-200 bg-gray-50 py-12 md:py-16"
    >
      <div className="mx-auto max-w-[1200px] px-4 md:px-5 lg:px-6">
        <p
          id="trust-heading"
          className="mb-6 text-[0.875rem] font-semibold text-gray-500"
        >
          공공 데이터 기반 서비스
        </p>
        <ul className="flex flex-wrap gap-3" aria-label="데이터 출처 기관 목록">
          {TRUST_ORGS.map((org) => (
            <li key={org}>
              <span className="inline-flex h-8 items-center rounded-sm border border-gray-200 bg-white px-3 text-[0.8125rem] font-semibold text-gray-700">
                {org}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
