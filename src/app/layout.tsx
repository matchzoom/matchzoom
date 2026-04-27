import type { Metadata } from 'next';
import localFont from 'next/font/local';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { QueryProvider } from '@/shared/providers/query-provider';
import { NavigationTracker } from '@/shared/providers/NavigationTracker';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { getServerSession } from '@/shared/utils/serverSession';
import type { CurrentUser } from '@/shared/types/user';
import { TEST_USER } from '@/shared/utils/testUser';
import { QUERY_KEYS } from '@/shared/utils/queryKeys';
import './globals.css';

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/pretendard-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/pretendard-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/pretendard-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'sans-serif',
  ],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://matchzoom.vercel.app';
const description =
  '장애인·보호자를 위한 AI 직종 탐색 서비스. 내 장애 유형·능력에 맞는 직종을 추천받고, 채용공고 적합도를 한눈에 확인하세요.';

export const metadata: Metadata = {
  title: {
    default: '마주봄',
    template: '%s | 마주봄',
  },
  description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: '마주봄',
    title: '마주봄',
    description,
    images: [
      {
        url: '/images/og_img.png',
        width: 1200,
        height: 630,
        alt: '마주봄 — AI 직종 탐색 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '마주봄',
    description,
    images: ['/images/og_img.png'],
  },
};

async function getInitialUser(): Promise<CurrentUser | null> {
  try {
    const session = await getServerSession();
    if (!session) return null;
    if (session.isTestUser) return TEST_USER;

    const rows = await supabaseFetch<
      Array<{ id: number; nickname: string; created_at: string }>
    >(
      `/rest/v1/users?id=eq.${session.userId}&select=id,nickname,created_at&limit=1`,
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getInitialUser();

  const queryClient = new QueryClient();
  queryClient.setQueryData(QUERY_KEYS.currentUser, initialUser);
  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <head>
        {/* 테마 초기화: localStorage 저장값 우선, 없으면 OS 설정 사용. React 하이드레이션 전에 실행되어 FOUC 방지 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s||(d?'dark':'light');document.documentElement.classList.add(t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          본문 바로가기
        </a>
        <QueryProvider>
          <HydrationBoundary state={dehydratedState}>
            <NavigationTracker />
            <Header initialUser={initialUser} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
