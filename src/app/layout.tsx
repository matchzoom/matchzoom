import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { QueryProvider } from '@/shared/providers/query-provider';
import { NavigationTracker } from '@/shared/providers/NavigationTracker';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { verifySession } from '@/shared/utils/session';
import { AUTH_COOKIE_KEYS } from '@/shared/utils/authCookies';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import type { CurrentUser } from '@/shared/types/user';
import { TEST_USER_ID, TEST_USER } from '@/shared/utils/testUser';
import './globals.css';

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
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_KEYS.SESSION)?.value;
    if (!token) return null;

    const session = await verifySession(token);
    if (!session?.userId) return null;

    if (session.userId === TEST_USER_ID) return TEST_USER;

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
          <Header initialUser={initialUser} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
