import { Button } from '@/shared/ui/Button';
import { Checkbox, CheckboxGroup } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { Radio, RadioGroup } from '@/shared/ui/Radio';
import type { SurveyFormValues } from '../hooks/useSurveyForm';

const DISABILITY_TYPE_OPTIONS = [
  { value: '시각장애', label: '시각장애' },
  { value: '청각장애', label: '청각장애' },
  { value: '지체장애', label: '지체장애' },
  { value: '언어장애', label: '언어장애' },
  { value: '안면장애', label: '안면장애' },
  { value: '지적장애', label: '지적장애' },
  { value: '자폐성장애', label: '자폐성장애' },
  { value: '기타', label: '기타' },
];

const DISABILITY_LEVEL_OPTIONS = [
  { value: '장애의 정도가 심함', label: '장애의 정도가 심함' },
  { value: '장애의 정도가 심하지 않음', label: '장애의 정도가 심하지 않음' },
  { value: '모르겠어요', label: '모르겠어요' },
];

const MOBILITY_OPTIONS = [
  { value: '자유로움', label: '자유로움' },
  { value: '보조기구 사용', label: '보조기구 사용' },
  { value: '휠체어 사용', label: '휠체어 사용' },
];

const HAND_USAGE_OPTIONS = [
  { value: '세밀한 작업 가능', label: '세밀한 작업 가능' },
  { value: '큰 동작만 가능', label: '큰 동작만 가능' },
  { value: '어려움', label: '어려움' },
];

const STAMINA_OPTIONS = [
  { value: '4시간 이상 활동 가능', label: '4시간 이상' },
  { value: '2~4시간', label: '2~4시간' },
  { value: '2시간 미만', label: '2시간 미만' },
];

const COMMUNICATION_OPTIONS = [
  { value: '일상 대화 가능', label: '일상 대화 가능' },
  { value: '짧은 문장 가능', label: '짧은 문장 가능' },
  { value: '단어 수준', label: '단어 수준' },
  { value: '비언어적 소통', label: '비언어적 소통' },
];

const INSTRUCTION_LEVEL_OPTIONS = [
  { value: '복잡한 지시 이해', label: '복잡한 지시 이해' },
  { value: '2단계 지시 이해', label: '2단계 지시 이해' },
  { value: '단순 지시만 가능', label: '단순 지시만 가능' },
  { value: '시범 보여주면 가능', label: '시범 보여주면 가능' },
];

const HOPE_ACTIVITIES_OPTIONS = [
  { value: '같은 일 반복하기', label: '같은 일 반복하기' },
  { value: '손으로 만들기', label: '손으로 만들기' },
  { value: '물건 정리·분류', label: '물건 정리·분류' },
  { value: '몸 움직이기', label: '몸 움직이기' },
  { value: '컴퓨터·기기 다루기', label: '컴퓨터·기기 다루기' },
  { value: '동식물 돌보기', label: '동식물 돌보기' },
  { value: '청소·세탁 등 환경 관리', label: '청소·세탁 등 환경 관리' },
  { value: '기타', label: '기타' },
];

type Props = {
  mode: 'create' | 'edit';
  values: SurveyFormValues;
  errors: Partial<Record<keyof SurveyFormValues, string>>;
  setField: <K extends keyof SurveyFormValues>(
    key: K,
    value: SurveyFormValues[K],
  ) => void;
  onHopeActivitiesChange: (v: string | string[]) => void;
  onPrevStep: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function SurveyStep2({
  mode,
  values,
  errors,
  setField,
  onHopeActivitiesChange,
  onPrevStep,
  onSubmit,
  isSubmitting,
}: Props) {
  const submitLabel = mode === 'edit' ? '수정 완료' : '검사 완료';
  function handleActivityChange(value: string, checked: boolean) {
    const next = checked
      ? [...values.hope_activities, value]
      : values.hope_activities.filter((v) => v !== value);
    onHopeActivitiesChange(next);
  }

  return (
    <section aria-labelledby="step2-heading">
      <div className="mb-8 border-l-[3px] border-primary pl-3">
        <h2
          id="step2-heading"
          className="text-[1rem] font-semibold text-gray-900"
        >
          나의 특성
        </h2>
        <p className="mt-1 text-[0.875rem] text-gray-500">
          신체 조건과 희망 활동을 알려주세요
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* 장애 유형 */}
        <CheckboxGroup
          label="장애 유형"
          required
          error={errors.disability_type}
        >
          {DISABILITY_TYPE_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              id={`disability_type-${opt.value}`}
              label={opt.label}
              checked={values.disability_type.includes(opt.value)}
              onChange={(e) => {
                const next = e.target.checked
                  ? [...values.disability_type, opt.value]
                  : values.disability_type.filter((v) => v !== opt.value);
                setField('disability_type', next);
                if (opt.value === '기타' && !e.target.checked) {
                  setField('disability_type_other', '');
                }
              }}
            />
          ))}
        </CheckboxGroup>

        {/* 장애 유형 — 기타 내용 */}
        {values.disability_type.includes('기타') && (
          <Input
            label="기타 장애 유형"
            required
            value={values.disability_type_other}
            onChange={(e) => setField('disability_type_other', e.target.value)}
            error={errors.disability_type_other}
            placeholder="장애 유형을 입력해주세요"
            maxLength={100}
          />
        )}

        {/* 장애 등급 */}
        <RadioGroup
          label="장애 정도"
          required
          error={errors.disability_level}
          hint="정확히 모르셔도 괜찮아요. 추천 정확도를 높이기 위한 참고 정보예요."
        >
          {DISABILITY_LEVEL_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              name="disability_level"
              value={opt.value}
              label={opt.label}
              checked={values.disability_level === opt.value}
              onChange={() => setField('disability_level', opt.value)}
            />
          ))}
        </RadioGroup>

        {/* 이동 */}
        <RadioGroup label="이동" required error={errors.mobility}>
          {MOBILITY_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              name="mobility"
              value={opt.value}
              label={opt.label}
              checked={values.mobility === opt.value}
              onChange={() => setField('mobility', opt.value)}
            />
          ))}
        </RadioGroup>

        {/* 손 사용 */}
        <RadioGroup label="손 사용" required error={errors.hand_usage}>
          {HAND_USAGE_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              name="hand_usage"
              value={opt.value}
              label={opt.label}
              checked={values.hand_usage === opt.value}
              onChange={() => setField('hand_usage', opt.value)}
            />
          ))}
        </RadioGroup>

        {/* 체력 */}
        <RadioGroup
          label="체력 (일일 활동 가능 시간)"
          required
          error={errors.stamina}
        >
          {STAMINA_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              name="stamina"
              value={opt.value}
              label={opt.label}
              checked={values.stamina === opt.value}
              onChange={() => setField('stamina', opt.value)}
            />
          ))}
        </RadioGroup>

        <hr className="border-gray-200" />

        {/* 의사소통 — 말하기 */}
        <RadioGroup
          label="의사소통 — 말하기"
          required
          error={errors.communication}
        >
          {COMMUNICATION_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              name="communication"
              value={opt.value}
              label={opt.label}
              checked={values.communication === opt.value}
              onChange={() => setField('communication', opt.value)}
            />
          ))}
        </RadioGroup>

        {/* 의사소통 — 지시 이해 */}
        <RadioGroup
          label="의사소통 — 지시 이해"
          required
          error={errors.instruction_level}
        >
          {INSTRUCTION_LEVEL_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              name="instruction_level"
              value={opt.value}
              label={opt.label}
              checked={values.instruction_level === opt.value}
              onChange={() => setField('instruction_level', opt.value)}
            />
          ))}
        </RadioGroup>

        <hr className="border-gray-200" />

        {/* 희망 활동 */}
        <CheckboxGroup
          label="희망 활동 유형"
          required
          error={errors.hope_activities}
        >
          {HOPE_ACTIVITIES_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              id={`hope_activities-${opt.value}`}
              label={opt.label}
              checked={values.hope_activities.includes(opt.value)}
              onChange={(e) =>
                handleActivityChange(opt.value, e.target.checked)
              }
            />
          ))}
        </CheckboxGroup>

        {/* 기타 활동 내용 */}
        {values.hope_activities.includes('기타') && (
          <Input
            label="기타 희망 활동"
            required
            value={values.hope_activities_other}
            onChange={(e) => setField('hope_activities_other', e.target.value)}
            error={errors.hope_activities_other}
            placeholder="어떤 활동을 원하시나요?"
            maxLength={100}
          />
        )}
      </div>

      {/* 이전 / 검사 완료 */}
      <div className="mt-10 flex justify-between">
        <Button variant="secondary" size="lg" onClick={onPrevStep}>
          이전
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? '처리 중...' : submitLabel}
        </Button>
      </div>
    </section>
  );
}
