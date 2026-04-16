# Phase 2 — Supabase API 레이어

## Goal
raw fetch 기반 Supabase API 함수 구현 + 대응 TanStack Query 훅.

## Prerequisites
- Phase 1 완료
- Supabase 프로젝트 생성 및 환경 변수 설정
- DB 스키마 확정 (child_profiles, jobs, bookmarks 테이블)

## Tasks

### Task 1: API 함수
- [ ] `shared/api/client.ts` — supabaseFetch() 완성 (헤더, 에러 처리)
- [ ] `shared/api/profiles.ts` — getProfile, createProfile, updateProfile
- [ ] `shared/api/jobs.ts` — getJobs (필터 파라미터 포함), getJob
- [ ] `shared/api/bookmarks.ts` — getBookmarks, toggleBookmark
- [ ] `shared/api/matches.ts` — getMatchResult

### Task 2: TanStack Query 훅
- [ ] `shared/hooks/useProfile.ts`
- [ ] `shared/hooks/useJobs.ts` (무한스크롤: useInfiniteQuery)
- [ ] `shared/hooks/useBookmarks.ts` (낙관적 업데이트)
- [ ] `shared/hooks/useMatchResult.ts`

### Task 3: 환경 변수
- [ ] `.env.local` 생성 (gitignore 확인)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/shared/api/client.ts` | Modify (완성) |
| `src/shared/api/profiles.ts` | Create |
| `src/shared/api/jobs.ts` | Create |
| `src/shared/api/bookmarks.ts` | Create |
| `src/shared/api/matches.ts` | Create |
| `src/shared/hooks/useProfile.ts` | Create |
| `src/shared/hooks/useJobs.ts` | Create |
| `src/shared/hooks/useBookmarks.ts` | Create |
| `src/shared/hooks/useMatchResult.ts` | Create |
| `.env.local` | Create |

## Definition of Done
- [ ] 각 API 함수 TypeScript 타입 완전
- [ ] Zod 응답 검증 (`ProfileSchema.parse()`) 적용
- [ ] `pnpm type-check` 통과
