import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import { Checkbox, CheckboxGroup } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { Radio, RadioGroup } from '@/shared/ui/Radio';
import type { SurveyFormValues } from '../utils/schema';
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
  register: UseFormRegister<SurveyFormValues>;
  errors: FieldErrors<SurveyFormValues>;
  watchedDisabilityType: string[];
  watchedHopeActivities: string[];
  onDisabilityTypeChange: (value: string, checked: boolean) => void;
  onHopeActivitiesChange: (value: string, checked: boolean) => void;
  onPrevStep: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function SurveyStep2({
  mode,
  register,
  errors,
  watchedDisabilityType,
  watchedHopeActivities,
  onDisabilityTypeChange,
  onHopeActivitiesChange,
  onPrevStep,
  onSubmit,
  isSubmitting,
}: Props) {
  const submitLabel = mode === 'edit' ? '수정 완료' : '검사 완료';

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
          error={errors.disability_type?.message as string | undefined}
        >
          {DISABILITY_TYPE_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              id={`disability_type-${opt.value}`}
              label={opt.label}
              checked={watchedDisabilityType.includes(opt.value)}
              onChange={(e) =>
                onDisabilityTypeChange(opt.value, e.target.checked)
              }
            />
          ))}
        </CheckboxGroup>

        {/* 장애 유형 — 기타 내용 */}
        {watchedDisabilityType.includes('기타') && (
          <Input
            label="기타 장애 유형"
            required
            {...register('disability_type_other')}
            error={errors.disability_type_other?.message}
            placeholder="장애 유형을 입력해주세요"
            maxLength={100}
          />
        )}

        {/* 장애 등급 */}
        <RadioGroup
          label="장애 정도"
          required
          error={errors.disability_level?.message}
          hint="정확히 모르셔도 괜찮아요. 추천 정확도를 높이기 위한 참고 정보예요."
        >
          {DISABILITY_LEVEL_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              {...register('disability_level')}
              value={opt.value}
              label={opt.label}
            />
          ))}
        </RadioGroup>

        {/* 이동 */}
        <RadioGroup label="이동" required error={errors.mobility?.message}>
          {MOBILITY_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              {...register('mobility')}
              value={opt.value}
              label={opt.label}
            />
          ))}
        </RadioGroup>

        {/* 손 사용 */}
        <RadioGroup label="손 사용" required error={errors.hand_usage?.message}>
          {HAND_USAGE_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              {...register('hand_usage')}
              value={opt.value}
              label={opt.label}
            />
          ))}
        </RadioGroup>

        {/* 체력 */}
        <RadioGroup
          label="체력 (일일 활동 가능 시간)"
          required
          error={errors.stamina?.message}
        >
          {STAMINA_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              {...register('stamina')}
              value={opt.value}
              label={opt.label}
            />
          ))}
        </RadioGroup>

        <hr className="border-gray-200" />

        {/* 의사소통 — 말하기 */}
        <RadioGroup
          label="의사소통 — 말하기"
          required
          error={errors.communication?.message}
        >
          {COMMUNICATION_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              {...register('communication')}
              value={opt.value}
              label={opt.label}
            />
          ))}
        </RadioGroup>

        {/* 의사소통 — 지시 이해 */}
        <RadioGroup
          label="의사소통 — 지시 이해"
          required
          error={errors.instruction_level?.message}
        >
          {INSTRUCTION_LEVEL_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              {...register('instruction_level')}
              value={opt.value}
              label={opt.label}
            />
          ))}
        </RadioGroup>

        <hr className="border-gray-200" />

        {/* 희망 활동 */}
        <CheckboxGroup
          label="희망 활동 유형"
          required
          error={errors.hope_activities?.message as string | undefined}
        >
          {HOPE_ACTIVITIES_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              id={`hope_activities-${opt.value}`}
              label={opt.label}
              checked={watchedHopeActivities.includes(opt.value)}
              onChange={(e) =>
                onHopeActivitiesChange(opt.value, e.target.checked)
              }
            />
          ))}
        </CheckboxGroup>

        {/* 기타 활동 내용 */}
        {watchedHopeActivities.includes('기타') && (
          <Input
            label="기타 희망 활동"
            required
            {...register('hope_activities_other')}
            error={errors.hope_activities_other?.message}
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
