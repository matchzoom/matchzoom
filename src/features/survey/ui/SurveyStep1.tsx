import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { Radio, RadioGroup } from '@/shared/ui/Radio';
import { Select } from '@/shared/ui/Select';
import { SIDO_LIST } from '../utils/regions';
import type { SurveyFormValues } from '../utils/schema';

const EDUCATION_OPTIONS = [
  { value: '특수학교 초등부', label: '특수학교 초등부' },
  { value: '특수학교 중등부', label: '특수학교 중등부' },
  { value: '특수학교 고등부 졸업', label: '특수학교 고등부 졸업' },
  { value: '일반학교 졸업', label: '일반학교 졸업' },
];

const SIDO_OPTIONS = SIDO_LIST.map((v) => ({ value: v, label: v }));

type Props = {
  register: UseFormRegister<SurveyFormValues>;
  errors: FieldErrors<SurveyFormValues>;
  sigunguList: { primary: string[]; secondary: string[] };
  watchedPrimarySido: string;
  watchedPrimarySigungu: string;
  watchedSecondarySido: string;
  watchedSecondarySigungu: string;
  onPrimarySidoChange: (sido: string) => void;
  onPrimarySigunguChange: (sigungu: string) => void;
  onSecondarySidoChange: (sido: string) => void;
  onSecondarySigunguChange: (sigungu: string) => void;
  onSecondaryReset: () => void;
  onNextStep: () => void;
};

export function SurveyStep1({
  register,
  errors,
  sigunguList,
  watchedPrimarySido,
  watchedPrimarySigungu,
  watchedSecondarySido,
  watchedSecondarySigungu,
  onPrimarySidoChange,
  onPrimarySigunguChange,
  onSecondarySidoChange,
  onSecondarySigunguChange,
  onSecondaryReset,
  onNextStep,
}: Props) {
  return (
    <section aria-labelledby="step1-heading">
      <div className="mb-8 border-l-[3px] border-primary pl-3">
        <h2
          id="step1-heading"
          className="text-[1rem] font-semibold text-gray-900"
        >
          기본 정보
        </h2>
        <p className="mt-1 text-[0.875rem] text-gray-500">
          검사자의 기본 정보를 입력해주세요
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* 이름 */}
        <Input
          label="이름"
          required
          {...register('name')}
          error={errors.name?.message}
          placeholder="이름을 입력해주세요"
          maxLength={20}
        />

        {/* 성별 */}
        <RadioGroup label="성별" required error={errors.gender?.message}>
          <Radio {...register('gender')} value="남성" label="남성" />
          <Radio {...register('gender')} value="여성" label="여성" />
        </RadioGroup>

        {/* 최종학력 */}
        <RadioGroup label="최종학력" required error={errors.education?.message}>
          {EDUCATION_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              {...register('education')}
              value={opt.value}
              label={opt.label}
            />
          ))}
        </RadioGroup>

        {/* 희망 지역 1순위 */}
        <fieldset className="flex flex-col gap-0 border-0 p-0">
          <legend className="mb-3 text-[0.875rem] font-semibold text-gray-900">
            희망 지역 1순위
            <span aria-hidden="true" className="ml-0.5 text-error">
              *
            </span>
          </legend>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                aria-label="시·도 (1순위)"
                placeholder="시·도 선택"
                options={SIDO_OPTIONS}
                value={watchedPrimarySido}
                onChange={(e) => onPrimarySidoChange(e.target.value)}
                error={errors.region_primary_sido?.message}
              />
            </div>
            <div className="flex-1">
              <Select
                aria-label="구·군·시 (1순위)"
                placeholder="구·군·시 선택"
                options={sigunguList.primary.map((v) => ({
                  value: v,
                  label: v,
                }))}
                value={watchedPrimarySigungu}
                onChange={(e) => onPrimarySigunguChange(e.target.value)}
                error={errors.region_primary_sigungu?.message}
                disabled={!watchedPrimarySido}
              />
            </div>
          </div>
        </fieldset>

        {/* 희망 지역 2순위 */}
        <fieldset className="flex flex-col gap-0 border-0 p-0">
          <legend className="mb-3 flex items-center gap-2 text-[0.875rem] font-semibold text-gray-900">
            희망 지역 2순위
            <span className="text-[0.8125rem] font-normal text-gray-500">
              (선택)
            </span>
            {watchedSecondarySido && (
              <button
                type="button"
                onClick={onSecondaryReset}
                className="cursor-pointer text-[0.8125rem] font-normal text-gray-400 underline underline-offset-2 hover:text-gray-600"
              >
                초기화
              </button>
            )}
          </legend>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                aria-label="시·도 (2순위)"
                placeholder="시·도 선택"
                options={SIDO_OPTIONS}
                value={watchedSecondarySido}
                onChange={(e) => onSecondarySidoChange(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Select
                aria-label="구·군·시 (2순위)"
                placeholder="구·군·시 선택"
                options={sigunguList.secondary.map((v) => ({
                  value: v,
                  label: v,
                  disabled:
                    watchedSecondarySido === watchedPrimarySido &&
                    v === watchedPrimarySigungu,
                }))}
                value={watchedSecondarySigungu}
                onChange={(e) => onSecondarySigunguChange(e.target.value)}
                error={errors.region_secondary_sigungu?.message}
                disabled={!watchedSecondarySido}
              />
            </div>
          </div>
        </fieldset>

        {/* 베리어 프리 */}
        <div className="flex flex-col gap-2">
          <p className="text-[0.875rem] font-semibold text-gray-900">
            이동 경로
          </p>
          <Checkbox
            label="베리어 프리(무장애) 경로만 이용 가능해요"
            {...register('barrier_free')}
          />
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-10 flex justify-end">
        <Button variant="primary" size="lg" onClick={onNextStep}>
          다음
        </Button>
      </div>
    </section>
  );
}
