# Phase 3 — /survey 라우트

## Goal
3-step 검사 폼 구현 (작성 모드 + 편집 모드).

## Prerequisites
- Phase 2 완료 (profiles API 훅)

## Tasks

### Task 1: 폼 상태 관리 (useState)
- [ ] `features/survey/ui/SurveyForm.tsx` — 최상위 컴포넌트에서 useState로 step + formData 관리
  - currentStep (1~3)
  - formData (Step1Data & Step2Data & Step3Data)
  - mode ('create' | 'edit')

### Task 2: 폼 Zod 스키마
- [ ] `features/survey/utils/schema.ts`
  - Step1Schema, Step2Schema, Step3Schema
  - SurveyFormSchema (전체 합본)

### Task 3: UI 컴포넌트
- [ ] `features/survey/ui/SurveyStep1.tsx` — 기본 정보
- [ ] `features/survey/ui/SurveyStep2.tsx` — 신체 조건
- [ ] `features/survey/ui/SurveyStep3.tsx` — 희망 활동
- [ ] `features/survey/ui/StepIndicator.tsx` — 진행 표시
- [ ] `shared/ui/RegionSelect.tsx` — 2단 연동 지역 선택

### Task 4: 페이지 연결
- [ ] `src/app/survey/page.tsx` — SurveyFeature 마운트
- [ ] `?mode=edit` 쿼리 파라미터 처리
- [ ] 제출 → createProfile or updateProfile 호출
- [ ] 이탈 방지 (입력값 있을 때 confirm)

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/features/survey/ui/SurveyForm.tsx` | Create |
| `src/features/survey/utils/schema.ts` | Create |
| `src/features/survey/ui/SurveyStep1.tsx` | Create |
| `src/features/survey/ui/SurveyStep2.tsx` | Create |
| `src/features/survey/ui/SurveyStep3.tsx` | Create |
| `src/features/survey/ui/StepIndicator.tsx` | Create |
| `src/shared/ui/RegionSelect.tsx` | Create |
| `src/app/survey/page.tsx` | Modify |

## Definition of Done
- [ ] 3 step 네비게이션 정상 동작
- [ ] 필수 필드 미입력 시 에러 표시
- [ ] 작성 모드: 제출 → 대시보드 이동
- [ ] 편집 모드: 기존 데이터 pre-fill
- [ ] 이탈 방지 confirm 동작
- [ ] `pnpm type-check` 통과
