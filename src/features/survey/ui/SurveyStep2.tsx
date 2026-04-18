import { Button } from '@/shared/ui/Button';
import { Checkbox, CheckboxGroup } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { Radio, RadioGroup } from '@/shared/ui/Radio';
import type { SurveyFormValues } from '../hooks/useSurveyForm';
import {
  DISABILITY_TYPE_OPTIONS,
  DISABILITY_LEVEL_OPTIONS,
  MOBILITY_OPTIONS,
  HAND_USAGE_OPTIONS,
  STAMINA_OPTIONS,
  COMMUNICATION_OPTIONS,
  INSTRUCTION_LEVEL_OPTIONS,
  HOPE_ACTIVITIES_OPTIONS,
} from '../utils/options';

type Props = {
  mode: 'create' | 'edit';
  values: SurveyFormValues;
  errors: Partial<Record<keyof SurveyFormValues, string>>;
  setField: <K extends keyof SurveyFormValues>(
    key: K,
    value: SurveyFormValues[K],
  ) => void;
  onDisabilityTypeChange: (value: string, checked: boolean) => void;
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
  onDisabilityTypeChange,
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
              onChange={(e) =>
                onDisabilityTypeChange(opt.value, e.target.checked)
              }
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
