import { FooterLinks } from './FooterLinks';

export function Footer() {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="mx-auto max-w-[1200px] px-4 md:px-5 lg:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[1.125rem] font-bold text-gray-900">마주봄</p>
          <FooterLinks />
        </div>
        <small className="mt-8 block text-[0.75rem] text-gray-500">
          © 2026 마주봄. 공공데이터포털 활용 서비스
        </small>
      </div>
    </footer>
  );
}
