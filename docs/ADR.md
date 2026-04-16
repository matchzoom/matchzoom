# Architecture Decision Records — 마주봄

---

## ADR-001: Supabase JS 라이브러리 없이 raw fetch 사용

**Status:** Accepted  
**Date:** 2026-04-16

**Decision:**  
`@supabase/supabase-js` 대신 `fetch()`로 Supabase REST API 직접 호출.

**Reasons:**
- 번들 사이즈 절감
- Zod를 통한 명시적 응답 타입 강제
- pgvector `/rpc` 쿼리는 어차피 커스텀 SQL 필요
- 의존성 최소화, 업그레이드 리스크 제거

**Consequences:**
- `shared/api/client.ts`에서 직접 auth 헤더 관리
- 에러 정규화 로직 직접 작성 필요

---

## ADR-002: react-hook-form 사용 안 함

**Status:** Accepted  
**Date:** 2026-04-16

**Decision:**  
폼 상태는 `useState`, 검증은 Zod (제출 시점).

**Reasons:**
- 의존성 표면 최소화
- step 간 데이터 유지는 상위 컴포넌트 useState로 처리

**Consequences:**
- controlled input 직접 작성
- change handler 수동 구현

---

## ADR-003: TanStack Query로 모든 서버 상태 관리

**Status:** Accepted  
**Date:** 2026-04-16

**Decision:**  
`useEffect + fetch` 패턴 금지, 모든 비동기 데이터는 `useQuery`/`useMutation`.

**Reasons:**
- 캐싱, 중복 제거, 로딩/에러 상태 자동 처리
- 낙관적 업데이트 (북마크 토글)에 유리

**Consequences:**
- 모든 API 함수는 대응하는 훅 파일 필요

---

## ADR-004: App Router Server Component 기본

**Status:** Accepted  
**Date:** 2026-04-16

**Decision:**  
페이지는 Server Component 기본, 인터랙티브한 곳만 `'use client'`.

**Reasons:**
- 초기 렌더링 성능
- 번들 사이즈 절감

**Consequences:**
- 훅 사용 컴포넌트는 반드시 `'use client'` 명시

---

## ADR-005: TailwindCSS v4 @theme inline 패턴

**Status:** Accepted  
**Date:** 2026-04-16

**Decision:**  
디자인 토큰은 `globals.css` `@theme inline` 블록에 CSS 변수로 정의.  
`tailwind.config.ts` theme 수정 금지.

**Reasons:**
- TailwindCSS v4는 CSS-native 토큰 방식을 권장
- `tailwind.config.ts` theme 확장 방식은 v4에서 deprecated

**Consequences:**
- `--color-primary: #4166E7` → `text-primary`, `bg-primary` 자동 생성

---

## ADR-006: FSD (Feature-Sliced Design) 레이어 구조

**Status:** Accepted  
**Date:** 2026-04-16

**Decision:**  
`app / widgets / features / shared` 4레이어 FSD 채택. `entities` 레이어 생략.

**Reasons:**
- 이 프로젝트 규모에서 entities는 과도한 추상화
- API 응답 타입은 `shared/types/`가 대체
- 단방향 의존성으로 레이어 간 결합 방지

**Consequences:**
- ESLint `eslint-plugin-boundaries`로 단방향 자동 검증
- 도메인 모델이 복잡해지면 향후 entities 레이어 추가 검토

---

## ADR-007: Zod 스키마와 TypeScript 타입 co-location

**Status:** Accepted  
**Date:** 2026-04-16

**Decision:**  
API 응답 Zod 스키마와 `z.infer<>` TS 타입을 같은 파일에 위치.

```ts
// shared/types/profile.ts
export const ProfileSchema = z.object({ ... });
export type Profile = z.infer<typeof ProfileSchema>;
```

**Reasons:**
- 단일 진실 공급원 (타입 변경 시 스키마 자동 동기화)
- 타입과 스키마를 다른 파일에서 찾는 컨텍스트 스위칭 제거

**Consequences:**
- `shared/types/` 파일은 Zod import 필요
