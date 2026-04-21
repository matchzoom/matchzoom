import { QueryProvider } from '@/shared/providers/query-provider';
import { NavigationTracker } from '@/shared/providers/NavigationTracker';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 테마 초기화: localStorage → 시스템 설정 순으로 결정. React 하이드레이션 전에 실행되어 FOUC 방지 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(d?'dark':'light');document.documentElement.classList.add(t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          본문 바로가기
        </a>
        <QueryProvider>
          <NavigationTracker />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
