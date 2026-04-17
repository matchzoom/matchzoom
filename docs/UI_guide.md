# 공공 서비스 웹 디자인 시스템 — 마주봄

> **모든 UI 컴포넌트 작업 시 이 문서를 반드시 따른다.**
> 아이콘 라이브러리: `lucide-react` (size: 16 / 20 / 24만 사용)
> 폰트: Pretendard (weight: 400 / 600 / 700만 사용)

---

## 디자인 정체성

신뢰 가능한 공공 정보를 정확하고 차분하게 전달하는 인터페이스를 만든다.
장식은 최소화하고, 정보 위계 · 가독성 · 접근성을 최우선으로 한다.
사용자가 "예쁘다"보다 "보기 편하다 / 찾기 쉽다"고 느껴야 한다.

---

## 1. 절대 금지 (AI 티 나는 디자인 차단)

### 인터랙션 금지
- `transform: scale(...)`, `translateY(...)` 로 호버 시 떠오르거나 커지는 효과
- 호버 시 `box-shadow` 가 새로 생기거나 강해지는 효과 (떠오르는 카드 X)
- `transition: all ...` (광범위 전환 금지)
- 200ms 이상의 긴 트랜지션
- 자동 재생 캐러셀의 부드러운 패럴랙스, 마우스 추적 그라데이션
- 입장 애니메이션(fade-in, slide-up)을 모든 섹션에 거는 것

### 컬러 금지
- 그라데이션 배경 (linear-gradient, radial-gradient)
- 보라 · 핑크 · 마젠타 · 청록 · 라임 · 네온 계열
- 메인 컬러 외 액센트 컬러 추가 (의미 색상 4종 외 금지)
- 글래스모피즘 (`backdrop-filter: blur`)
- 네온 글로우, 컬러풀 섀도우 (`box-shadow: 0 0 20px #MAINCOLOR` 같은 것)

### 형태 금지
- `border-radius` 8px 초과 (버튼 단독 예외: 최대 6px)
- 큰 그림자 (`shadow-lg`, `shadow-xl` 류)
- 둥둥 떠 있는 플로팅 카드 다중 레이어
- 이모지, 이미지(일러스트·사진·3D 포함)를 UI에 사용하는 것 전면 금지

---

## 2. 컬러 시스템

> 모든 색상은 CSS 변수로만 사용. 하드코딩(`#4166E7`, `#111827` 등) 금지.

### Primary (단 1색)
| 변수 | 값 | 용도 |
|---|---|---|
| `--primary` | `#4166E7` | CTA, 활성 상태, 링크, 포커스 링 |
| `--primary-hover` | `#3454D1` | hover 상태 |
| `--primary-pressed` | `#2A45B8` | active/pressed 상태 |
| `--primary-bg` | `#FAFDFF` | 페이지·섹션 배경 전용 |
| `--primary-tag` | `#EDF7FF` | 태그·선택 상태 배경 |
| `--primary-bg-strong` | `#DAECFC` | 호버된 옅은 배경 |
| `--primary-border` | `#DAECFC` | 강조 보더 |

### Neutral
| 변수 | 값 | 용도 |
|---|---|---|
| `--gray-900` | `#111827` | 기본 본문 텍스트 |
| `--gray-700` | `#374151` | 보조 본문 |
| `--gray-500` | `#6B7280` | 캡션 / 보조 정보 |
| `--gray-400` | `#9CA3AF` | placeholder / disabled 텍스트 |
| `--gray-300` | `#D1D5DB` | 강한 보더 |
| `--gray-200` | `#E5E7EB` | 기본 보더 |
| `--gray-100` | `#F3F4F6` | 영역 분리 배경 |
| `--gray-50` | `#F9FAFB` | 가장 옅은 배경 |
| `--white` | `#FFFFFF` | — |

### 의미 색상 (대비 4.5:1 충족)
| 변수 | 색상 | 배경 변수 | 배경 |
|---|---|---|---|
| `--success` | `#1E7E34` | `--success-bg` | `#E6F4EA` |
| `--warning` | `#B45309` | `--warning-bg` | `#FEF3C7` |
| `--error` | `#C81E1E` | `--error-bg` | `#FDECEC` |
| `--info` | `#1E5FB8` | `--info-bg` | `#E7F0FB` |

### 컬러 사용 규칙
- 페이지 배경 기본은 `#FFFFFF`. 영역 구분 시에만 `--gray-50`.
- 메인 컬러는 **CTA · 활성 상태 · 링크 · 포커스 링** 4가지 용도로만.
- 한 화면에 메인 컬러 면적은 5%를 넘지 않는다.
- 텍스트는 무채색 기본. 메인 컬러 텍스트는 링크/강조 외 금지.

---

## 3. 타이포그래피

### 폰트
```
Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif
```
- 숫자 정렬: `font-variant-numeric: tabular-nums` (표 · 금액 · 통계)

### 스케일
| 역할 | px | weight | line-height |
|---|---|---|---|
| display | 32 | 700 | 1.3 |
| h1 | 28 | 700 | 1.35 |
| h2 | 22 | 700 | 1.4 |
| h3 | 18 | 600 | 1.45 |
| h4 | 16 | 600 | 1.5 |
| body-lg | 16 | 400 | 1.6 |
| body | 15 | 400 | 1.6 (기본) |
| body-sm | 14 | 400 | 1.6 |
| caption | 13 | 400 | 1.5 |
| micro | 12 | 400 | 1.5 |

### 규칙
- `font-weight`는 400 / 600 / 700만 사용. **500 사용 금지.**
- 본문 줄간격 1.6 고정. 제목은 1.3~1.5.
- 한 페이지 최대 4단계 위계까지만.
- `letter-spacing` 변경 금지 (한글 가독성 저해).
- 단위: `rem` 강제. `px` 고정 금지.
- 최소 텍스트 크기: `0.75rem` (12px) 이하 금지.

---

## 4. 스페이싱 / 레이아웃

### 스페이싱 토큰 (4px 단위)
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80`

### 컨테이너
- 최대 너비: `1200px`
- 좌우 패딩: 데스크탑 `24px` / 태블릿 `20px` / 모바일 `16px`
- 페이지 좌우 여백에 이미지·일러스트·장식 요소 배치 금지
- 배경은 단색 또는 섹션별 배경색만. 배경 이미지·패턴·이모지 금지

### 그리드
- 12 컬럼, gutter `24px`
- 카드 그리드: 데스크탑 4열 / 태블릿 2열 / 모바일 1열
- 카드 간격: `16px` (조밀) 또는 `24px` (여유)

### 섹션 간격
- 섹션 vertical padding: `64px` (데스크탑) / `40px` (모바일)
- 섹션 내부 블록 간격: `32px`

### 모서리 (radius) — 이 외 금지
| 용도 | 값 |
|---|---|
| 태그, 뱃지, 입력칩 | `4px` |
| 버튼, 입력필드, 알림 | `6px` |
| 카드, 모달 | `8px` |

---

## 5. 컴포넌트

### 버튼
- 폰트: 15px / 600
- 트랜지션: `background-color 150ms ease, border-color 150ms ease, color 150ms ease` (그 외 금지)
- 사이즈: Large `h:48 / px:20` / Medium `h:40 / px:16` / Small `h:32 / px:12`
- radius: `6px`

| variant | 기본 | hover | active | disabled | focus |
|---|---|---|---|---|---|
| Primary | bg `--primary` / text white | bg `--primary-hover` | bg `--primary-pressed` | bg `--gray-200` / text `--gray-400` | outline 2px `--primary` offset 2px |
| Secondary | bg white / border `--primary` / text `--primary` | bg `--primary-bg` | — | border `--gray-200` / text `--gray-400` | — |
| Ghost | bg transparent / text `--gray-700` | bg `--gray-100` | — | — | — |
| Destructive | bg `--error` / text white | bg `#A81818` | — | — | — |

### 컴포넌트 작성 기반 (shadcn/ui 패턴)

모든 `shared/ui` 컴포넌트는 아래 3가지 원칙을 따른다.

1. **cva (class-variance-authority)** — variant / size 분기
2. **cn 유틸** (`@/shared/utils/cn`) — clsx + tailwind-merge 병합
3. **비제어 (uncontrolled)** — `ref`를 일반 prop으로 받아 네이티브 요소에 전달

react-hook-form `register()`가 반환하는 `{ ref, name, onChange, onBlur }`를 스프레드하면
별도 래퍼 없이 즉시 연결된다.

```ts
// 사용 예
<Input {...register('email')} error={errors.email?.message} label="이메일" required />
<Checkbox {...register('agree')} error={errors.agree?.message} label="약관 동의" />
<Radio {...register('gender')} value="male" label="남성" />
```

---

### 입력 필드 (Input / Select / Textarea)
- 높이: Large `48px` / Medium `40px`
- border: `1px solid --gray-300`
- radius: `6px` / padding 좌우 `16px`
- font: 15px / 400 / color `--gray-900`
- placeholder: `--gray-400`
- focus: `border-color: --primary; outline: 2px solid --primary; outline-offset: 0`
- error: `border-color: --error`, 에러 메시지 `13px / --error`, `aria-live="polite"`
- disabled: bg `--gray-100` / text `--gray-400`
- 라벨: 필드 위 `14px / 600 / --gray-900`, margin-bottom `8px`
- 필수 표시: 라벨 옆 `*` 색상 `--error`, `aria-required="true"`

### 체크박스 (Checkbox)

- 컨트롤 크기: `18×18px` / radius: `4px` (`--radius-sm`)
- 비활성: border `1px solid --gray-300` / bg `--white`
- 활성(checked): bg `--primary` / border `--primary` / 체크마크 white
- 체크마크: CSS border 트릭 (rotate 45deg, border-right + border-bottom)
- focus-visible: outline `2px solid --primary` / offset `2px`
- disabled: bg `--gray-100` / border `--gray-300` / text `--gray-400`
- error: border `--error` / checked 시 bg `--error`
- 에러 메시지: `13px / --error`, `aria-live="polite"`
- 구현: 네이티브 `<input type="checkbox">` sr-only + 시각적 span — `group-has-[:checked]` 패턴
- 라벨: 체크박스 우측 `14px / 400 / --gray-900`, gap `8px`

### 라디오 (Radio / RadioGroup)

- 컨트롤 크기: `18×18px` / radius: `50%` (`rounded-full`)
- 비활성: border `1px solid --gray-300` / bg `--white`
- 활성(checked): border `--primary` / 내부 dot `8×8px bg --primary`
- focus-visible: outline `2px solid --primary` / offset `2px`
- disabled: bg `--gray-100` / border `--gray-300` / dot bg `--gray-400`
- 구현: 네이티브 `<input type="radio">` sr-only + 시각적 span — `group-has-[:checked]` 패턴
- 라벨: 라디오 우측 `14px / 400 / --gray-900`, gap `8px`
- RadioGroup: `<fieldset>` + `<legend>` 사용, 에러는 `aria-live="polite"`

### Pill 선택 버튼
- 높이: `40px` / 좌우 padding: `16px` / radius: `6px`
- 비활성: bg white / border `1px solid --gray-300` / text `--gray-700`
- 활성: bg `--primary` / border `--primary` / text white
- hover(비활성): bg `--primary-bg` / border `--primary-border`
- 트랜지션: `background-color 150ms ease, border-color 150ms ease, color 150ms ease`
- 복수 선택 시 활성 상태에 체크 아이콘(`16px`) 좌측 배치 가능
- 그룹 간격: `8px`

### 카드
- bg white / border `1px solid --gray-200` / radius `8px`
- padding: 기본 `24px` / 조밀형 `20px` / 컴팩트 `16px`
- 그림자 금지. 보더로만 분리.
- hover(클릭 가능한 경우만): `border-color: --primary-border` (배경·그림자·위치 변화 X)

### 사이드바 레이아웃
- 너비: `220px` (데스크탑) / bg `--gray-50`
- 메뉴 항목: `15px / 400` / padding `12px 16px`
- 활성: `border-left: 3px solid --primary` / text `--primary` / weight 600 / bg `--primary-bg`
- 비활성: text `--gray-700` / hover bg `--gray-100`
- 구분선: `1px solid --gray-200`
- 하단 고정 항목(탈퇴 등): text `--gray-400` / `13px / 400`
- 모바일: 상단 탭으로 전환

### 레이더 차트 (Recharts)
- 채우기: `--primary` 30% 투명도
- 테두리(stroke): `--primary` / `1.5px`
- 축 레이블: `13px / 400 / --gray-500`
- 배경 격자: `1px solid --gray-200`
- 카드 내부 배치, 최대 너비 `320px`

### 적합도 뱃지 (3단계)
- 잘 맞아요: bg `--success-bg` / text `--success`
- 도전해볼 수 있어요: bg `--warning-bg` / text `--warning`
- 힘들 수 있어요: bg `--error-bg` / text `--error`
- height `24px` / padding `0 8px` / `12px / 600` / radius `4px`
- 아이콘(선택): 텍스트 좌측 `16px` 라인 아이콘

### 섹션 구분 제목
- `border-left: 3px solid --primary` 세로 바 + 제목 `16px / 600 / --gray-900` / padding-left `10px`
- 또는 회색 구분선(`1px solid --gray-200`) + 제목 텍스트 단독도 허용

### 링크
- color `--primary`
- 본문 내 링크: `text-decoration: underline; text-underline-offset: 2px`
- 메뉴·카드 내 링크: 평상시 underline 없음, hover 시 underline
- visited: 색상 변경 없음
- 외부 링크: 텍스트 옆 외부링크 아이콘 `12px`, `aria-label="새 창으로 열림"`

### 테이블
- 헤더: bg `--gray-100` / `14px / 600 / --gray-900` / padding `12px 16px`
- 셀: padding `12px 16px` / `14px / 400` / border-bottom `1px solid --gray-200`
- 행 hover(선택형만): bg `--gray-50`
- 줄무늬 금지

### 알림 / 배너 (Alert)
- padding `16px 20px` / radius `6px`
- border-left `4px solid` (의미 색상)
- bg: 의미 색상의 배경 변수
- 아이콘 `20px` 좌측, 텍스트 `14px / 400`
- 닫기 버튼: 우측 `20px` 아이콘 버튼

### 탭
- 텍스트 `15px / 600` / padding `12px 16px`
- 비활성: text `--gray-500` / border-bottom `2px transparent`
- 활성: text `--primary` / border-bottom `2px solid --primary`
- hover: text `--gray-900` (배경 변화 X)
- 키보드: 좌우 화살표 이동 / `role="tablist"`

### 토글 스위치
- 트랙: 너비 `44px` / 높이 `24px` / radius `12px`
- 비활성: bg `--gray-300`
- 활성: bg `--primary`
- 썸: bg white / 지름 `18px` / 트랜지션 `left 150ms ease`
- 레이블: 스위치 우측 `14px / 400 / --gray-900`
- `role="switch"` / `aria-checked`

### 모달 / 다이얼로그
- 오버레이: `rgba(17, 24, 39, 0.5)`
- 다이얼로그: bg white / radius `8px` / max-width `560px` / padding `24px`
- 그림자: `0 4px 16px rgba(0, 0, 0, 0.08)` (모달만 예외 허용)
- 열기/닫기 애니메이션: `opacity 100ms` 만 허용
- **포커스 트랩 필수**: 열릴 때 첫 인터랙티브 요소로 포커스 이동
- **ESC 닫기 필수**
- 닫힐 때 모달을 연 트리거 요소로 포커스 복귀
- 배경 `inert` 속성 적용
- `role="dialog"` / `aria-modal="true"` / `aria-labelledby`

### Skeleton (로딩 상태)
- 스피너 금지. **스켈레톤만** 사용.
- bg `--gray-200` / radius는 대상 컴포넌트와 동일
- `aria-busy="true"` / `aria-label="로딩 중"`
- width / height props로 크기 조절
- 애니메이션: `opacity 1 → 0.5` pulse (prefers-reduced-motion 시 정적)

### 페이지네이션
- 숫자 버튼 `40×40` / radius `6px`
- 활성: bg `--primary` / text white
- 비활성: text `--gray-700` / hover bg `--gray-100`

### 태그 / 뱃지
- height `24px` / padding `0 8px` / `12px / 600` / radius `4px`
- 정보형: bg `--primary-tag` / text `--primary-pressed`
- 의미형: 의미 색상 배경 + 진한 텍스트

---

## 6. 인터랙션 규칙

### 허용
- `background-color` / `border-color` / `color` 단순 전환 (`150ms ease`)
- 모달·드롭다운 표시: `opacity 0→1` (`100ms`) 또는 즉시
- 아코디언 펼침: `height` 전환 `200ms ease`

### 금지
- `transform` 을 호버·활성 상태 표현에 사용
- `box-shadow` 를 호버 시 추가·변경
- 호버 시 글자 크기·굵기 변화
- 페이지 진입 시 모든 요소 순차 fade-in
- 마우스 위치 따라가는 그림자/그라데이션
- 패럴랙스 스크롤

### 커서 스타일

| 상태 | cursor 값 | 적용 대상 |
|---|---|---|
| 기본 인터랙티브 | `pointer` | 버튼, 링크, 탭, 카드(클릭 가능), Pill 선택, 토글, 페이지네이션 등 클릭·탭 가능한 모든 요소 |
| 비활성(disabled) | `not-allowed` | `disabled` 속성이 있거나 비활성 처리된 모든 인터랙티브 요소 |

- `cursor: default`(기본 화살표)는 인터랙티브 요소에 사용 금지
- `not-allowed`는 반드시 요소 자체에 직접 적용한다 (부모에 `pointer-events: none` 만 쓰면 커서가 바뀌지 않음)

### 상태 표현 원칙
모든 상태(hover, active, focus, disabled)는 **색상 변화로만** 구분한다. 모양·크기·위치는 변하지 않는다.

---

## 7. 접근성 (KWCAG 2.2 / WCAG 2.1 AA 이상)

### 필수
- 본문 텍스트 대비 4.5:1 이상 / 큰 텍스트(18px+)·UI 요소 3:1 이상
- 모든 인터랙티브 요소 키보드 접근 가능 (Tab / Enter / Space / 화살표)
- `:focus-visible` 명확한 outline: `2px solid --primary` / `outline-offset: 2px`
- `outline: none` 단독 사용 절대 금지
- 모든 이미지 `alt` 속성. 장식 이미지는 `alt=""`
- 폼 필드와 라벨 연결: `<label htmlFor>` 또는 `aria-labelledby`
- 에러 메시지 `aria-live="polite"` + 필드와 `aria-describedby` 연결
- 컬러만으로 정보 전달 금지 (아이콘·텍스트 병기)
- 페이지 최상단 "본문 바로가기" 스킵 링크 (포커스 시 노출)
- 글자 크기 200% 확대 시 가로 스크롤 없이 표시
- 시멘틱 마크업: `header / nav / main / section / article / aside / footer`
- 헤딩 위계 누락 없이 (`h1` → `h2` → `h3`)
- 한 페이지 `h1` 1개

### 화면 낭독기
- 아이콘 단독 버튼은 `aria-label` 필수
- 동적 콘텐츠 변경은 `aria-live` 영역
- 모달·드롭다운은 `role` + `aria-expanded` / `aria-modal` 명시
- `lang="ko"` 루트에 명시, 영문 혼용 시 인라인 `lang="en"`

### React 19 ref 패턴 (forwardRef 사용 금지)
```tsx
// React 19 — ref를 일반 prop으로 받음
function Input({ ref, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
}) {
  return <input ref={ref} {...props} />;
}
```

### 인지 접근성
- 자동 재생 미디어 금지, 또는 즉시 정지 가능
- 깜빡임·점멸 효과 금지 (1초 3회 이하)
- `prefers-reduced-motion` 미디어 쿼리 필수 (애니메이션 있는 컴포넌트)

---

## 8. 페이지 골격

### 헤더 (높이 72px 데스크탑 / 56px 모바일)
- bg white / border-bottom `1px solid --gray-200`
- 좌측: 로고 (높이 `28px`)
- 중앙: GNB (`15px / 600 / --gray-700`, hover `--primary`)
- 우측: 로그인 버튼 또는 프로필 아바타
- 모바일: 로고 + 햄버거 메뉴 (`24px` 아이콘)
- 스크롤 시 변형 금지

### 히어로 영역
- 배경: 단색 white 또는 `--gray-50`. 그라데이션 금지
- 이미지·일러스트·아이콘 배치 금지. 텍스트 + CTA 단독 구성

### 푸터 (bg `--gray-50`)
- padding `48px 24px`
- 서비스 로고, 문의처, 정책 링크
- 저작권 고지: `12px / 400 / --gray-500`

---

## 9. 아이콘 (lucide-react)

- 사이즈: `16 / 20 / 24`만 사용
- 스타일: 라인 아이콘 (stroke `1.5px`)
- 색상: `--gray-700` 기본 / `--primary` 강조 / `--gray-500` 보조
- 금지: 컬러풀, 3D, 그라데이션, 이모지

---

## 10. 글쓰기 / 마이크로카피

- 존댓말 기본 (~합니다 / ~하세요)
- 한 문장 40자 이내 권장
- 외래어·어려운 한자어 지양
- 행동 중심 버튼 라벨 ("신청하기", "확인", "취소")
- 모호한 라벨 금지 ("OK", "Submit", "Click here")
- 에러 메시지: 무엇이·왜·어떻게 해야 하는지 명시
- 숫자 단위 명시 (원·건·개월)

---

## 11. 반응형 분기점

| 분기 | 기준 |
|---|---|
| sm | ≥ 640px |
| md | ≥ 768px |
| lg | ≥ 1024px |
| xl | ≥ 1280px |

- Mobile-first 작성
- 터치 타겟 최소 `44×44px` (WCAG 2.5.5)

---

## 12. 출력 전 자기 점검 체크리스트

UI 컴포넌트 또는 페이지 작성 후 반드시 확인:

- [ ] 한 화면에 메인 컬러 면적이 5% 이하인가
- [ ] 호버 시 요소가 움직이거나 커지지 않는가
- [ ] 그라데이션·글래스·네온 섀도우가 없는가
- [ ] 이모지·이미지가 UI에 사용되지 않았는가
- [ ] 모든 텍스트 대비가 4.5:1 이상인가
- [ ] 키보드만으로 모든 기능 사용 가능한가
- [ ] `:focus-visible` outline이 모든 인터랙티브 요소에 있는가
- [ ] `font-weight`가 400 / 600 / 700 외 사용되지 않았는가
- [ ] `border-radius`가 4 / 6 / 8 외 사용되지 않았는가
- [ ] `h1`이 1개이고 헤딩 위계가 누락 없이 이어지는가
- [ ] 색상이 CSS 변수로만 사용됐는가 (하드코딩 없는가)
- [ ] 아이콘 단독 버튼에 `aria-label`이 있는가
- [ ] 모달에 포커스 트랩·ESC 닫기가 구현됐는가
- [ ] Skeleton 로딩 상태에 `aria-busy="true"`가 있는가
- [ ] `prefers-reduced-motion` 처리가 됐는가
- [ ] 클릭 가능한 모든 요소에 `cursor: pointer`가 적용됐는가
- [ ] disabled 요소에 `cursor: not-allowed`가 적용됐는가
