import { QueryProvider } from '@/shared/providers/query-provider';
import './globals.css';

export const metadata = {
  title: '마주봄',
  description:
    '장애인·보호자를 위한 AI 직종 탐색 및 채용공고 적합도 판별 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <a href="#main-content" className="skip-link">
          본문 바로가기
        </a>
        <QueryProvider>
          <main id="main-content">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
