# 마주봄 (matchzoom) — 프로젝트 헌법

> Claude가 이 프로젝트에서 작업할 때 반드시 준수해야 하는 규칙.
> 세세한 내용은 `docs/` 폴더 참고.

---

## 1. Project Identity

- 서비스명: 마주봄
- 목적: 장애인·보호자를 위한 AI 직종 탐색 및 채용공고 적합도 판별
- 메인 컬러: `#4166E7`
- 라우트: `/` (랜딩/대시보드), `/profile`, `/survey`
- 현재 페이즈: `status.json` 참고

---

## 2. Tech Stack (비협상)

| 영역            | 기술                                  |
| --------------- | ------------------------------------- |
| Framework       | Next.js 16 App Router                 |
| Language        | TypeScript (strict)                   |
| Styling         | TailwindCSS v4                        |
| Component Base  | shadcn/ui 패턴 (cva + cn)             |
| Data Fetching   | TanStack Query v5                     |
| Global State    | React Context / useState              |
| Form            | react-hook-form + @hookform/resolvers |
| Validation      | Zod v4                                |
| Chart           | Recharts                              |
| DB              | Supabase (PostgreSQL + pgvector)      |
| Deploy          | Vercel                                |
| Package Manager | pnpm                                  |

---

## 3. Path Alias

```
@/*  →  ./src/*
```

- `@/shared/ui/Button` → `src/shared/ui/Button`
- `@/features/survey/` → `src/features/survey/`
- `@/widgets/header/` → `src/widgets/header/`

---

## 4. FSD 레이어 구조 (단방향, 위반 금지)

```
src/
├── app/       ← Next.js 라우팅 전용 (layout, page 파일만)
├── widgets/   ← 독립 UI 블록 (GNB, Footer, 카드 목록 등)
├── features/  ← 사용자 시나리오 단위 기능
└── shared/    ← 전 레이어에서 공유하는 코드
    ├── ui/        ← 재사용 UI 컴포넌트 (Button, Modal 등)
    ├── api/       ← raw fetch 함수만
    ├── hooks/     ← TanStack Query 래퍼 훅
    ├── utils/     ← 순수 함수, 포매터, 상수
    ├── libs/      ← 서드파티 라이브러리 설정·래퍼
    └── types/     ← Zod 스키마 + 추론된 TS 타입
```

**단방향 규칙 (ESLint로 자동 검증):**

- `app` → widgets, features, shared 참조 가능
- `widgets` → features, shared 참조 가능
- `features` → shared 참조 가능
- `shared` → 다른 레이어 참조 불가

---

## 5. 레이어별 책임 경계

### `shared/api/`

- `fetch()` 호출만 담당
- React, 훅, 비즈니스 로직 금지
- `client.ts`에서만 fetch 기본 설정 (base URL, headers)

### `shared/hooks/`

- TanStack Query (`useQuery` / `useMutation`) 래퍼만
- bare fetch 직접 호출 금지
- named export만 사용

### `shared/types/`

- Zod 스키마 + `z.infer<>` 타입 한 파일에 공존
- API 응답 형태 정의 (entities 레이어 대체)

### `shared/utils/`

- 순수 함수, 포매터, 상수
- Zod 스키마 금지 (types/에 위치)
- React 의존 금지

### `features/[x]/`

- 폼 검증 Zod 스키마는 `features/[x]/utils/schema.ts`
- 내부 구조: `ui/`, `api/`, `hooks/`, `utils/`, `types/`

---

## 6. 절대 금지 사항

- `@supabase/supabase-js` 설치 금지 — raw fetch만 사용
- default export 금지 (`src/app/` 라우트 파일 제외)
- 레이어 경계 역방향 참조 금지 (`shared`가 `features`를 import하는 것 등)
- `tailwind.config.ts` theme 수정 금지 — `globals.css` `@theme inline` 블록 사용

---

## 7. Code Conventions

- 커밋 형식: `type: subject #issue-number`
- 브랜치 형식: `feat/#123-feature-name`

### UI / 로직 분리 (필수)

UI는 `ui/` 폴더, 로직은 `hooks/` 폴더에 위치한다.

```
features/survey/
├── ui/
│   └── SurveyForm.tsx       ← UI만 (props 받아서 렌더링, 훅·상태·fetch 금지)
└── hooks/
    └── useSurveyForm.ts     ← 로직만 (데이터 fetch, 상태 관리, 이벤트 핸들링)
```

- `ui/` 컴포넌트: props만 받아서 JSX 반환. `useState`, `useQuery` 등 일체 금지
- `hooks/` 훅: 데이터 fetch, 상태 관리, 이벤트 핸들러 반환 → UI에 props로 전달
- page.tsx → 훅 호출 → UI 컴포넌트에 props 전달 순으로 데이터 흐름

```ts
// page.tsx 또는 상위 컴포넌트
const { data, onSubmit } = useSurveyForm();
return <SurveyForm data={data} onSubmit={onSubmit} />;
```

### 공통 UI는 반드시 shared/ui에서 import

- Button, Modal, Badge, Toast, Input 등 2개 이상 컴포넌트에서 쓰이는 UI → 즉시 `shared/ui/`로 추출
- feature 내부에서 직접 버튼·모달·인풋 마크업 작성 금지
- `shared/ui/` 컴포넌트가 없으면 **먼저 만들고** import

```ts
// 금지
<button className="bg-primary ...">제출</button>

// 필수
import { Button } from '@/shared/ui/Button';
<Button variant="primary">제출</Button>
```

### 훅 단일 책임

- 훅 1개 = 기능 1개
- 이름이 동작을 명확히 설명해야 함: `useBookmarkToggle`, `useJobFilter`, `useProfileForm`
- 하나의 훅 안에서 서로 다른 리소스의 `useQuery` / `useMutation` 혼재 금지

```ts
// 금지
export const useProfilePage = () => {
  const profile = useQuery(...);   // profile fetch
  const jobs = useQuery(...);      // jobs fetch  ← 다른 리소스
  const bookmark = useMutation(...);
};

// 필수 — 각각 분리
export const useProfile = () => useQuery(...);
export const useJobs = () => useQuery(...);
export const useBookmarkToggle = () => useMutation(...);
```

---

## 8. API / Auth Rules (Canonical)

### 전체 요청 흐름

```
Client Component
  ↓ bffFetch (credentials: include — HttpOnly 쿠키 자동 포함)
Next.js BFF Route Handler (app/api/...)
  ↓ createAuthorizedRoute — session JWT 검증 → userId 추출
  ↓ supabaseFetch (Secret key — RLS 우회)
Supabase (PostgreSQL)
```

### 쿠키 (Set-Cookie 헤더)

세 가지 HttpOnly 쿠키를 함께 발급한다:

| 쿠키                | 값                      | 만료  | 역할            |
| ------------------- | ----------------------- | ----- | --------------- |
| `session`           | 서명된 JWT `{ userId }` | 30일  | 유저 식별·인증  |
| `kakaoAccessToken`  | 카카오 액세스 토큰      | 6시간 | 카카오 API 호출 |
| `kakaoRefreshToken` | 카카오 리프레시 토큰    | 60일  | 토큰 갱신       |

모든 쿠키: `HttpOnly; Secure(prod); SameSite=Strict; Path=/`

### 환경 변수 (.env.local)

```bash
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SECRET_KEY=eyJ...           # Secret key (구 service_role)

# 카카오 OAuth
KAKAO_REST_API_KEY=...
KAKAO_CLIENT_SECRET=...
KAKAO_REDIRECT_URI=http://localhost:3000/api/oauth/kakao/callback

# JWT 서명 키 (openssl rand -base64 32)
SESSION_SECRET=...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 핵심 파일

| 파일                                  | 역할                                              |
| ------------------------------------- | ------------------------------------------------- |
| `shared/api/coreFetch.ts`             | timeout(AbortController), 에러 파싱               |
| `shared/api/bffFetch.ts`              | 클라이언트→BFF, 401 시 `/api/auth/refresh` 재시도 |
| `shared/api/supabaseFetch.ts`         | BFF→Supabase, Secret key 주입                     |
| `shared/api/kakaoFetch.ts`            | BFF→카카오 API (kauth / kapi)                     |
| `shared/api/createAuthorizedRoute.ts` | BFF Route Handler HOF, session JWT 검증           |
| `shared/utils/session.ts`             | JWT sign/verify (`jose`)                          |
| `shared/utils/authCookies.ts`         | 쿠키 set/get/clear                                |

### BFF Route Handler 작성 규칙

- 반드시 `createAuthorizedRoute`로 감싼다
- 모든 Supabase 쿼리에 `user_id=eq.{userId}` 필터 필수
- PATCH / DELETE 시 `id` 단독 필터 절대 금지 — 반드시 `&user_id=eq.{userId}` 추가

```ts
export const GET = createAuthorizedRoute(async ({ userId }) => {
  const rows = await supabaseFetch<Profile[]>(
    `/rest/v1/profiles?user_id=eq.${userId}&select=*`,
  );
  return rows[0] ?? null;
});
```

세부 CRUD 패턴 → `docs/CRUD_guide.md`

### 인증 라우트

| 라우트                           | 역할                                             |
| -------------------------------- | ------------------------------------------------ |
| `GET /api/oauth/kakao/authorize` | 카카오 로그인 페이지로 redirect                  |
| `GET /api/oauth/kakao/callback`  | code→토큰 교환→upsert→session JWT 발급→쿠키 저장 |
| `POST /api/auth/refresh`         | 카카오 토큰 갱신 + session JWT 재발급            |
| `POST /api/auth/logout`          | 카카오 세션 무효화 + 쿠키 삭제                   |
| `GET /api/users/me`              | 로그인 유저 정보 조회                            |

### 유저 정보

- 전역 유저 정보는 `useCurrentUser()` 훅 사용 (React Query, `shared/hooks/`)
- Zustand 금지 — 서버 상태 전체 TanStack Query로 관리

```ts
const { data: user } = useCurrentUser();
if (!user) return <GuestView />;
```

### middleware.ts

- `session` JWT 서명 검증으로 보호 경로(`/profile`, `/survey`) 접근 제어
- 만료·위변조 시 `/`로 redirect

---

## 9. Component Rules

- Server Component 기본
- 인터랙티브한 경우에만 `'use client'` 추가

---

## 10. State Management

- 서버 상태: **TanStack Query** (유저 정보 포함 — Zustand 사용 금지)
- UI/전역 상태: React Context
- 폼 상태: react-hook-form (비제어)
- 단순 로컬 UI 상태: useState

---

## 11. UI 작업 규칙

**UI 컴포넌트(`shared/ui/`, `features/*/ui/`, `widgets/`)를 만들 때 반드시:**

1. `docs/UI_guide.md` 전체를 읽고 시작한다
2. 작업 후 `docs/UI_guide.md` **12. 출력 전 자기 점검 체크리스트**를 전부 통과해야 한다
3. CSS 변수 토큰만 사용한다 — 색상 하드코딩 절대 금지
4. 아이콘은 `lucide-react`만 사용, 사이즈 16 / 20 / 24만 허용
5. `forwardRef` 사용 금지 — React 19 방식으로 `ref`를 일반 prop으로 받는다

### 컴포넌트 작성 패턴 (shadcn/ui 방식)

모든 `shared/ui` 컴포넌트는 아래 패턴을 따른다.

```ts
// 1. cva로 variant 정의
const componentVariants = cva('base-classes', {
  variants: { variant: { ... }, size: { ... } },
  defaultVariants: { variant: 'default', size: 'md' },
});

// 2. cn 유틸로 클래스 병합
import { cn } from '@/shared/utils/cn';

// 3. VariantProps 타입 합성
type Props = HTMLAttributes<HTMLElement> & VariantProps<typeof componentVariants> & {
  ref?: Ref<HTMLElement>;
};

// 4. 비제어 — 모든 네이티브 HTML 속성 그대로 전달
export function Component({ variant, size, className, ref, ...props }: Props) {
  return <element ref={ref} {...props} className={cn(componentVariants({ variant, size }), className)} />;
}
```

### 폼 컴포넌트와 react-hook-form

- `shared/ui` 폼 컴포넌트(Input, Checkbox, Radio)는 비제어로 작성 — `ref` prop 그대로 전달
- 폼 로직은 `features/[x]/hooks/use[Feature]Form.ts`에서 `react-hook-form` 사용
- Zod 스키마는 `features/[x]/utils/schema.ts`에 정의 후 `@hookform/resolvers/zod`로 연결

```ts
// features/survey/hooks/useSurveyForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SurveySchema } from '../utils/schema';

export function useSurveyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SurveySchema),
  });
  return { register, handleSubmit, errors };
}

// features/survey/ui/SurveyForm.tsx
const { register, handleSubmit, errors } = useSurveyForm();
<Input {...register('name')} error={errors.name?.message} label="이름" required />
<Checkbox {...register('agree')} error={errors.agree?.message} label="동의합니다" />
```

---

## 12. CRUD 규칙

**CRUD 작업(`app/api/`, `features/*/api/`, `features/*/hooks/`)을 만들 때 반드시:**

1. `docs/CRUD_guide.md` 전체를 읽고 시작한다
2. 데이터 흐름: `Client → bffFetch → BFF Route Handler → supabaseFetch → Supabase`
3. 클라이언트에서 Supabase 직접 호출 절대 금지

### BFF Route Handler

- `createAuthorizedRoute`를 반드시 사용한다 (`src/shared/api/createAuthorizedRoute.ts`)
- `userId` 쿠키가 없으면 자동으로 401 반환
- 모든 Supabase 쿼리에 `user_id=eq.{userId}` 필터 필수

```ts
// app/api/profiles/route.ts
export const GET = createAuthorizedRoute(async ({ userId }) => {
  const rows = await supabaseFetch<Profile[]>(
    `/rest/v1/profiles?user_id=eq.${userId}&select=*`,
  );
  return rows[0] ?? null;
});
```

### Feature API 레이어

- `features/[x]/api/[resource]Api.ts` — `bffFetch` 호출 함수만
- 함수 1개 = API 1개, 이름은 동사+명사: `getProfile`, `updateProfile`

```ts
// features/profile/api/profileApi.ts
export const getProfile = (): Promise<Profile> =>
  bffFetch<Profile>('/profiles', { method: 'GET' });
```

### 테스트 (필수)

모든 BFF Route Handler와 feature API 함수는 **반드시 테스트를 작성**한다.

- 위치: `features/[x]/__tests__/` 또는 `shared/api/__tests__/`
- **3종 세트 필수**: 성공 / 401(미인증) / 에러(Supabase 오류)
- BFF 테스트: `vi.mock('next/headers')` + `vi.mock('@/shared/api/supabaseFetch')`
- Feature API 테스트: `vi.mock('@/shared/api/bffFetch')`
- 테스트 없이 PR 금지

```bash
pnpm test:run   # CI용
pnpm test       # watch 모드
```

세부 패턴은 `docs/CRUD_guide.md` 참고.

---

## 13. PR 생성 절차

**"PR 올려줘" 요청 시 반드시 `/ship` 커맨드를 실행한다.**

```
/ship [작업 내용 간단 설명 (선택)]
```

커맨드가 자동으로 처리하는 항목:

1. 로컬 CI 검증 (`pnpm type-check` / `pnpm lint` / `pnpm build`) — 실패 시 즉시 수정
2. GitHub 이슈 생성 (커밋 타입 기반 라벨 자동 선택)
3. 커밋 (미커밋 변경사항이 있는 경우, conventional commits 형식)
4. PR 생성 (`Closes #이슈번호` 자동 포함)
5. 위키 작성 — 작업 내용을 기존 위키 페이지에 반영하거나 새 페이지 생성 후 push
6. CI 모니터링 — 실패 시 오류 수정 후 재확인, 통과 시 완료 보고

세부 동작은 `.claude/commands/ship.md` 참고.

---

## 관련 문서

- 기획: `docs/PRD.md`
- 아키텍처: `docs/architecture.md`
- 결정 기록: `docs/ADR.md`
- UI 가이드: `docs/UI_guide.md`
- CRUD 가이드: `docs/CRUD_guide.md`
- 실행 상태: `status.json`
