# 마주봄 (matchzoom)

장애인·보호자를 위한 AI 직종 탐색 및 채용공고 적합도 판별 서비스

## 핵심 기능

- **AI 직종 매칭** — 신체·인지 특성 설문 기반으로 적합 직종 Top 3 추천 (NCS 공공데이터 연동)
- **채용공고 적합도** — 한국장애인고용공단 실시간 공고를 프로필 기반 점수로 정렬
- **레이더 차트** — 반복작업 / 대인관계 / 신체활동 / 손작업 / 환경민감도 5축 시각화

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS v4 |
| Component | shadcn/ui 패턴 (cva + cn) |
| Data Fetching | TanStack Query v5 |
| Form | react-hook-form + Zod v4 |
| DB | Supabase (PostgreSQL + pgvector) |
| AI | OpenAI GPT + Worknet NCS API |
| Deploy | Vercel |

## Architecture

```
Client (use client)
  → bffFetch (HttpOnly 쿠키 자동 포함)
    → Next.js BFF Route Handler (JWT 검증)
      → supabaseFetch (Secret key, RLS 우회)
        → Supabase PostgreSQL
```

FSD(Feature-Sliced Design) 레이어 구조:

```
src/
├── app/        ← Next.js 라우팅 전용
├── widgets/    ← 독립 UI 블록 (GNB, Footer)
├── features/   ← 사용자 시나리오 단위 기능
└── shared/     ← 공유 코드 (ui, api, hooks, utils, types)
```

## Getting Started

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버
pnpm dev
```

## Scripts

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm type-check   # TypeScript 검증
pnpm lint         # ESLint
pnpm test         # Vitest (watch)
pnpm test:run     # Vitest (CI)
```

## Environment Variables

```bash
SUPABASE_URL=
SUPABASE_SECRET_KEY=
KAKAO_REST_API_KEY=
KAKAO_CLIENT_SECRET=
KAKAO_REDIRECT_URI=
SESSION_SECRET=
OPENAI_API_KEY=
WORK24_API_KEY=
JOB_API_BASE_URL=
JOB_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Pages

| 라우트 | 화면 |
|--------|------|
| `/` | 랜딩 (비로그인) / 대시보드 (로그인+검사완료) |
| `/survey` | 특성 검사 폼 |
| `/profile` | 프로필 뷰 |

## License

Private
