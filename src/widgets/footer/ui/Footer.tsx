import { FooterLinks } from './FooterLinks';

export function Footer() {
  return (
    <footer className="bg-footer-bg py-8">
      <div className="mx-auto max-w-[1200px] px-4 md:px-5 lg:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[1.7rem] font-bold text-static-white">
            마주
            <span className="ml-[2px] inline-flex h-[1.4em] w-[1.4em] items-center justify-center rounded-full bg-static-white text-[0.9em] font-bold text-footer-bg">
              봄
            </span>
          </p>
          <FooterLinks />
        </div>
        <small className="mt-4 block text-[0.75rem] text-footer-text">
          © 2026 마주봄. 공공데이터포털 활용 서비스
        </small>
      </div>
    </footer>
  );
}
