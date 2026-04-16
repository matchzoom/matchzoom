# Architecture — 마주봄

## 1. 전체 디렉토리 구조

```
src/
├── app/                          ← Next.js App Router (라우팅 전용)
│   ├── layout.tsx
│   ├── page.tsx                  ← / (랜딩 or 대시보드)
│   ├── globals.css
│   ├── profile/
│   │   └── page.tsx              ← /profile
│   └── survey/
│       └── page.tsx              ← /survey
│
├── widgets/                      ← 독립 UI 블록 (여러 feature 조합)
│   ├── gnb/                      ← 글로벌 네비게이션 바
│   ├── footer/
│   ├── job-card-list/            ← 채용공고 목록 (무한스크롤 포함)
│   └── match-result/             ← 매칭 결과 섹션 (레이더 차트 + TOP3)
│
├── features/                     ← 사용자 시나리오 단위
│   ├── survey/                   ← 검사 폼 (3 step wizard)
│   │   ├── ui/
│   │   ├── hooks/
│   │   ├── utils/
│   │   │   └── schema.ts         ← 폼 Zod 스키마
│   │   └── types/
│   ├── job-filter/               ← 채용공고 필터
│   ├── bookmark/                 ← 공고 북마크
│   └── auth/                     ← 로그인/로그아웃
│
└── shared/                       ← 전 레이어 공유
    ├── ui/                       ← 재사용 UI 컴포넌트
    ├── api/                      ← raw fetch 함수
    │   └── client.ts             ← supabaseFetch() 기반 래퍼
    ├── hooks/                    ← TanStack Query 래퍼 훅
    ├── utils/                    ← 순수 함수, 포매터, 상수
    ├── libs/                     ← 서드파티 설정 (QueryClient 등)
    ├── types/                    ← Zod 스키마 + 추론 타입
    └── providers/                ← React Provider 컴포넌트
```

---

## 2. FSD 레이어 단방향 규칙

```
app  →  widgets  →  features  →  shared
```

- 아래 레이어는 위 레이어를 참조할 수 없음
- ESLint `boundaries/element-types` 규칙으로 자동 검증
- **위반 시 빌드 실패**

---

## 3. 4-Tier 내부 구조 (shared 기준, 각 feature도 동일)

| 폴더 | 책임 | 금지 |
|---|---|---|
| `ui/` | 렌더링만 (props 받아서 JSX 반환) | API 직접 호출, 데이터 fetch |
| `api/` | fetch 함수만 (HTTP 통신) | React, 훅, 비즈니스 로직 |
| `hooks/` | TanStack Query 래퍼 | bare fetch, 직접 API 호출 |
| `utils/` | 순수 함수, 포매터, 상수 | Zod 스키마, React 의존 |
| `types/` | Zod 스키마 + z.infer 타입 | 비즈니스 로직 |
| `libs/` | 서드파티 설정·래퍼 | 비즈니스 로직 |

---

## 4. Zod 스키마 위치 규칙

| 스키마 종류 | 위치 |
|---|---|
| API 응답 형태 (Profile, Job 등) | `shared/types/[name].ts` |
| 기능별 폼 검증 (Survey 스텝별) | `features/[name]/utils/schema.ts` |
| 범용 검증 (이메일, 전화번호 등) | `shared/utils/validators.ts` (순수 함수) |

---

## 5. Supabase REST 패턴

```
NEXT_PUBLIC_SUPABASE_URL/rest/v1/[table]
```

- 모든 fetch는 `shared/api/client.ts`의 `supabaseFetch()`를 통해서만
- 헤더: `apikey: ANON_KEY`, `Authorization: Bearer ANON_KEY`
- pgvector 쿼리: `/rest/v1/rpc/[function_name]`

---

## 6. 상태 토폴로지

| 상태 종류 | 도구 |
|---|---|
| 서버 상태 (profiles, jobs, matches) | TanStack Query |
| UI/전역 상태 (모달, 필터 등) | React Context |
| 폼 상태 (survey wizard) | useState (스텝 간 상위 컴포넌트에서 관리) |
| 단순 로컬 상태 | useState |

---

## 7. 데이터 흐름

```
Supabase REST
    ↓
shared/api/client.ts (supabaseFetch)
    ↓
shared/api/[resource].ts (typed fetch fn)
    ↓
shared/hooks/use[Resource].ts (useQuery/useMutation)
    ↓
widgets/ or features/ (데이터 수신)
    ↓
shared/ui/ (렌더링)
```

---

## 8. 라우팅 구조

| 경로 | 역할 | 인증 필요 |
|---|---|---|
| `/` | 랜딩 (비로그인) 또는 대시보드 (로그인+검사완료) | 선택 |
| `/profile` | 프로필 뷰 | 필수 |
| `/survey` | 검사 폼 (작성/편집) | 필수 |

---

## 9. 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
AI_API_KEY  (서버 전용)
```

---

## 10. Path Alias

```
@/*  →  ./src/*
```

예시:
- `@/shared/ui/Button`
- `@/features/survey/ui/SurveyForm`
- `@/widgets/gnb/GNB`
