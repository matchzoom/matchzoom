# AI 매칭 프롬프트 가이드 — 팀 작업 안내

> 4명(우석, 유진, 아름, 지현)이 각자 AI 프롬프트를 작성하고 비교하는 작업 가이드.

---

## 1. 개요

검사 완료된 프로필 데이터를 OpenAI에 보내서 아래 결과를 생성한다:

| 항목 | 설명 |
|------|------|
| **레이더 차트 5축** | 반복 작업, 대인관계, 신체 활동, 세밀한 손작업, 환경 민감도 (각 0~100점) |
| **AI 성향 요약** | 한 줄 요약 (예: "반복적이고 조용한 환경에서 손작업에 집중할 때 가장 편안해요") |
| **매칭 직종 TOP 3** | 직종명 + 매칭률(%) + 적합도 라벨 |

---

## 2. 각자 수정할 파일

```
src/features/match/strategies/
├── wooseokStrategy.ts   ← 우석
├── yujinStrategy.ts     ← 유진
├── areumStrategy.ts     ← 아름
└── jihyunStrategy.ts    ← 지현
```

**본인 파일만 수정한다. 다른 파일 건드리지 않는다.**

---

## 3. 파일 구조 설명

각 파일은 동일한 구조:

```ts
import type { MatchStrategy } from './types';

export const {name}Strategy: MatchStrategy = {
  name: '한국어이름',
  buildMessages: (profile) => ({
    system: '여기에 시스템 프롬프트',
    user: '여기에 유저 프롬프트',
  }),
};
```

### `system` — 시스템 프롬프트
- AI의 역할과 응답 형식을 정의한다
- **반드시 JSON 형식 응답을 요구해야 한다** (아래 응답 형식 참고)

### `user` — 유저 프롬프트
- `profile` 객체의 데이터를 활용해서 분석 요청을 작성한다
- profile에 어떤 데이터가 있는지는 아래 "입력 데이터" 참고

---

## 4. 입력 데이터 — Profile 타입

`profile` 파라미터로 전달되는 데이터:

```ts
{
  name: '홍길동',              // 이름
  gender: '남성',              // 성별
  education: '특수학교 고등부 졸업', // 최종학력
  region_primary: '서울특별시 강남구', // 희망 지역 1순위
  region_secondary: '서울특별시 마포구' | null, // 희망 지역 2순위
  is_barrier_free: false,       // 베리어프리 필요 여부
  disability_type: ['지적장애'],  // 장애 유형 (복수 선택 가능)
  disability_level: '중등도',    // 장애 등급
  mobility: '자유로움',          // 이동 능력
  hand_usage: '세밀한 작업 가능',  // 손 사용
  stamina: '4시간 이상 활동 가능', // 체력
  communication: '일상 대화 가능', // 의사소통 (말하기)
  instruction_level: '2단계 지시 이해', // 지시 이해 수준
  hope_activities: ['같은 일 반복하기', '손으로 만들기'], // 희망 활동
}
```

---

## 5. 응답 형식 (반드시 이 형식으로 나오게 프롬프트 작성)

OpenAI가 정확히 이 JSON 구조로 응답해야 한다:

```json
{
  "radar_chart": {
    "repetition": 85,
    "interpersonal": 40,
    "physical": 60,
    "hand_detail": 90,
    "env_sensitivity": 70
  },
  "summary_text": "반복적이고 조용한 환경에서 손작업에 집중할 때 가장 편안해요",
  "top3_jobs": [
    { "rank": 1, "job_name": "데이터 입력 사무원", "match_pct": 92, "fit_level": "잘 맞아요" },
    { "rank": 2, "job_name": "조립·포장 작업원", "match_pct": 78, "fit_level": "잘 맞아요" },
    { "rank": 3, "job_name": "도서관 사서보조", "match_pct": 65, "fit_level": "도전해볼 수 있어요" }
  ]
}
```

### 필드 규칙

| 필드 | 타입 | 규칙 |
|------|------|------|
| `radar_chart.*` | 숫자 | 0~100 사이 정수 |
| `summary_text` | 문자열 | 1줄, 한국어, 존댓말 |
| `top3_jobs[].rank` | 숫자 | 1, 2, 3 |
| `top3_jobs[].job_name` | 문자열 | 실제 존재하는 직종명 |
| `top3_jobs[].match_pct` | 숫자 | 0~100 |
| `top3_jobs[].fit_level` | 문자열 | `잘 맞아요` / `도전해볼 수 있어요` / `힘들 수 있어요` 중 하나 |

**이 형식에서 벗어나면 서버에서 Zod 검증 실패로 에러가 난다.**

---

## 6. 프롬프트 작성 팁

### 시스템 프롬프트에 포함할 것
- "너는 장애인 직업 적합도 분석 전문가다" 등 역할 부여
- 반드시 위의 JSON 형식으로 응답하라는 지시
- 레이더 차트 5축 각각의 의미 설명
- fit_level 판정 기준 (예: 80% 이상 → "잘 맞아요")

### 유저 프롬프트에 포함할 것
- profile 데이터를 보기 좋게 정리해서 전달
- "이 사람에게 맞는 직종을 분석해줘" 식의 요청

### 예시 (참고용 — 그대로 복사하지 말 것)

```ts
buildMessages: (profile) => ({
  system: `너는 장애인 직업 적합도 분석 전문가야.
사용자의 프로필을 분석해서 JSON으로 응답해.
응답 형식: { radar_chart: {...}, summary_text: "...", top3_jobs: [...] }
...`,
  user: `다음 사용자의 프로필을 분석해줘:
이름: ${profile.name}
장애 유형: ${profile.disability_type.join(', ')}
...`,
})
```

---

## 7. 테스트 방법

### 7-1. 환경변수 확인

`.env.local`에 OpenAI API 키가 있는지 확인:

```bash
OPENAI_API_KEY=sk-...
```

### 7-2. 서버 실행

```bash
pnpm dev
```

### 7-3. API 직접 호출 (curl 또는 브라우저 콘솔)

로그인 상태에서 브라우저 콘솔에 입력:

```js
// 본인 이름의 전략으로 호출
const res = await fetch('/api/match', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ strategy: '본인영문이름' }),
});
const data = await res.json();
console.log(data);
```

strategy 값: `wooseok` | `yujin` | `areum` | `jihyun`

### 7-4. 확인 포인트

- [ ] 응답이 200으로 오는가?
- [ ] radar_chart 5축이 0~100 사이 숫자인가?
- [ ] summary_text가 자연스러운 한국어인가?
- [ ] top3_jobs가 3개이고 fit_level이 올바른가?
- [ ] 같은 프로필로 여러 번 호출해도 일관된 결과가 나오는가?
- [ ] 다른 프로필로 호출하면 다른 결과가 나오는가?

---

## 8. 평가 기준

4명의 결과를 비교할 때 아래 기준으로 평가한다:

| 기준 | 설명 |
|------|------|
| **정확도** | 프로필 특성이 레이더 차트와 직종에 합리적으로 반영되는가 |
| **일관성** | 같은 입력에 비슷한 결과가 나오는가 |
| **자연스러움** | summary_text가 자연스러운 한국어인가 |
| **직종 현실성** | 추천 직종이 실제로 존재하고 장애 특성에 맞는가 |
| **응답 안정성** | JSON 파싱 에러 없이 안정적으로 응답하는가 |

---

## 9. 작업 흐름 요약

```
1. 본인 전략 파일 열기 (src/features/match/strategies/{이름}Strategy.ts)
2. system, user 프롬프트 작성
3. pnpm dev로 서버 실행
4. 브라우저 콘솔에서 API 호출 테스트
5. 결과 확인 및 프롬프트 수정 반복
6. 완성되면 커밋
```

---

## 10. 절대 하지 말 것

- 다른 사람의 전략 파일 수정 금지
- `openAiFetch.ts`, `route.ts`, `types.ts` 등 공통 파일 수정 금지
- 응답 형식 변경 금지 (Zod 검증 실패함)
- API 키를 코드에 하드코딩 금지
