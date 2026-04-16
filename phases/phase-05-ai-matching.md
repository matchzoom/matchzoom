# Phase 5 — AI 직종 매칭

## Goal
pgvector 유사도 기반 직종 매칭 + 채용공고 적합도 분석 연동.

## Prerequisites
- Phase 4 완료
- Supabase pgvector 확장 활성화
- AI API 키 확보

## Tasks

### Task 1: 벡터화 파이프라인
- [ ] 검사 폼 제출 시 입력값 → 벡터 변환 (AI API 호출)
- [ ] pgvector 저장 (`child_profiles.embedding`)
- [ ] 직종 유사도 쿼리 (`/rpc/match_jobs`)

### Task 2: AI 분석 결과
- [ ] 성향 요약 텍스트 생성
- [ ] 레이더 차트 5축 수치 생성
- [ ] 채용공고 매칭 포인트 요약 생성

### Task 3: 채용공고 적합도 분석
- [ ] 공고 텍스트 → 환경 추출 (AI API)
- [ ] 프로필 vs 공고 환경 적합도 점수 계산
- [ ] 적합도 라벨 결정 로직

### Task 4: 배치 작업 (외부 API 적재)
- [ ] 워크넷 직업정보 → DB 적재 스크립트
- [ ] 직무데이터사전 → DB 적재 스크립트

## Definition of Done
- [ ] 검사 제출 후 매칭 결과 정상 표시
- [ ] 레이더 차트 실제 데이터 반영
- [ ] 채용공고 적합도 라벨 정상 표시
- [ ] `pnpm type-check` 통과
