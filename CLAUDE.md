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

| 영역            | 기술                             |
| --------------- | -------------------------------- |
| Framework       | Next.js 16 App Router            |
| Language        | TypeScript (strict)              |
| Styling         | TailwindCSS v4                   |
| Data Fetching   | TanStack Query v5                |
| Global State    | React Context / useState         |
| Validation      | Zod v4                           |
| Chart           | Recharts                         |
| DB              | Supabase (PostgreSQL + pgvector) |
| Deploy          | Vercel                           |
| Package Manager | pnpm                             |

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

- `react-hook-form` 사용 금지 — 폼 상태는 `useState`
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

## 8. Supabase Rules

<!-- TODO: 유저가 직접 작성 -->

- Base URL: `NEXT_PUBLIC_SUPABASE_URL`
- Auth: `apikey` + `Authorization: Bearer` 헤더
- 모든 fetch는 `shared/api/client.ts`의 `supabaseFetch()`를 통해서만

---

## 9. Component Rules

<!-- TODO: 유저가 직접 작성 -->

- Server Component 기본
- 인터랙티브한 경우에만 `'use client'` 추가

---

## 10. State Management

<!-- TODO: 유저가 직접 작성 -->

- 서버 상태: TanStack Query
- UI/전역 상태: React Context
- 폼 상태: useState

---

## 11. UI 작업 규칙

**UI 컴포넌트(`shared/ui/`, `features/*/ui/`, `widgets/`)를 만들 때 반드시:**

1. `docs/UI_guide.md` 전체를 읽고 시작한다
2. 작업 후 `docs/UI_guide.md` **12. 출력 전 자기 점검 체크리스트**를 전부 통과해야 한다
3. CSS 변수 토큰만 사용한다 — 색상 하드코딩 절대 금지
4. 아이콘은 `lucide-react`만 사용, 사이즈 16 / 20 / 24만 허용
5. `forwardRef` 사용 금지 — React 19 방식으로 `ref`를 일반 prop으로 받는다

---

## 관련 문서

- 기획: `docs/PRD.md`
- 아키텍처: `docs/architecture.md`
- 결정 기록: `docs/ADR.md`
- UI 가이드: `docs/UI_guide.md`
- 실행 상태: `status.json`
