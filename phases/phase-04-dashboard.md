# Phase 4 — / 대시보드 + /profile 라우트

## Goal
검사 결과 대시보드, 채용공고 목록, 프로필 페이지 구현.

## Prerequisites
- Phase 3 완료

## Tasks

### Task 1: widgets 구현
- [ ] `widgets/gnb/` — GNB (로그인/비로그인 상태별)
- [ ] `widgets/footer/` — 푸터 (약관 모달 포함)
- [ ] `widgets/match-result/` — 레이더 차트 + TOP3 직종
- [ ] `widgets/job-card-list/` — 무한스크롤 카드 목록

### Task 2: shared/ui 컴포넌트
- [ ] `shared/ui/Button.tsx`
- [ ] `shared/ui/Badge.tsx` (적합도 라벨)
- [ ] `shared/ui/Card.tsx` (채용공고 카드)
- [ ] `shared/ui/Modal.tsx`
- [ ] `shared/ui/Toast.tsx`
- [ ] `shared/ui/Skeleton.tsx`
- [ ] `shared/ui/RadarChart.tsx` (Recharts 래퍼)

### Task 3: features 구현
- [ ] `features/job-filter/` — 적합도/근무형태/지역 필터
- [ ] `features/bookmark/` — 북마크 토글 (낙관적 업데이트 + undo 토스트)
- [ ] `features/auth/` — 로그인/로그아웃

### Task 4: 페이지 연결
- [ ] `src/app/page.tsx` — 랜딩(A) or 대시보드(B) 조건부 렌더링
- [ ] `src/app/profile/page.tsx` — 탭: 내 검사 결과 / 스크랩한 공고

## Definition of Done
- [ ] 비로그인 → 랜딩 화면
- [ ] 로그인+검사완료 → 대시보드
- [ ] 채용공고 무한스크롤 동작
- [ ] 북마크 토글 즉시 반영 + undo
- [ ] 프로필 탭 전환 정상 동작
- [ ] `pnpm type-check` 통과
