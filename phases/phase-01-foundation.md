# Phase 1 — Foundation

## Goal
FSD 디렉토리 골격 완성, 공통 타입·유틸 기반 세팅.

## Prerequisites
- Harness 파일 구축 완료 (CLAUDE.md, docs/, status.json)
- eslint-plugin-boundaries 설치 완료

## Tasks

### Task 1: shared/types 기반 세팅
- [ ] `shared/types/profile.ts` — ProfileSchema + Profile 타입
- [ ] `shared/types/job.ts` — JobSchema + Job 타입
- [ ] `shared/types/match.ts` — MatchResultSchema + MatchResult 타입
- [ ] `shared/types/index.ts` — re-export

### Task 2: shared/utils 기반 세팅
- [ ] `shared/utils/formatters.ts` — 날짜, 나이, 지역 포매터
- [ ] `shared/utils/constants.ts` — 장애 유형, 시도 목록 등 상수
- [ ] `shared/utils/index.ts` — re-export

### Task 3: shared/api client 기반
- [ ] `shared/api/client.ts` — supabaseFetch() 기본 래퍼

### Task 4: globals.css 토큰 추가
- [ ] `@theme inline`에 `--color-primary: #4166E7` 추가
- [ ] 기타 색상 토큰 추가

### Task 5: 라우트 스텁 확인
- [ ] `/profile`, `/survey` 스텁 페이지 존재 확인

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/shared/types/profile.ts` | Create |
| `src/shared/types/job.ts` | Create |
| `src/shared/types/match.ts` | Create |
| `src/shared/types/index.ts` | Create |
| `src/shared/utils/formatters.ts` | Create |
| `src/shared/utils/constants.ts` | Create |
| `src/shared/api/client.ts` | Create |
| `src/app/globals.css` | Modify |

## Definition of Done
- [ ] `pnpm type-check` 통과
- [ ] `pnpm lint` 통과
- [ ] `pnpm dev` 실행 시 에러 없음
- [ ] `@/shared/types/profile` import 정상 작동

## Notes
- Zod 스키마는 반드시 `shared/types/`에, 폼 검증 스키마는 `features/`에
- `shared/utils/`에는 Zod 스키마 넣지 않음
