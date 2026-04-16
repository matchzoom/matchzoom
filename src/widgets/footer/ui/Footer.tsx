const linkClass =
  'transition-ui text-[0.875rem] text-gray-700 underline-offset-2 hover:text-gray-900 hover:underline';

export function Footer() {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-5 lg:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[1.125rem] font-bold text-gray-900">마주봄</p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <a href="mailto:support@majuboom.kr" className={linkClass}>
                문의하기
              </a>
            </li>
            <li>
              <a href="#" className={linkClass}>
                이용약관
              </a>
            </li>
            <li>
              <a href="#" className={linkClass}>
                개인정보처리방침
              </a>
            </li>
          </ul>
        </div>
        <small className="mt-8 block text-[0.75rem] text-gray-500">
          © 2026 마주봄. 공공데이터포털 활용 서비스
        </small>
      </div>
    </footer>
  );
}
