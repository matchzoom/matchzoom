import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Radio, RadioGroup } from '@/shared/ui/Radio';
import { Select } from '@/shared/ui/Select';
import type { SurveyFormValues } from '../utils/schema';

const EDUCATION_OPTIONS = [
  { value: '특수학교 초등부', label: '특수학교 초등부' },
  { value: '특수학교 중등부', label: '특수학교 중등부' },
  { value: '특수학교 고등부 졸업', label: '특수학교 고등부 졸업' },
  { value: '일반학교 졸업', label: '일반학교 졸업' },
];

type Props = {
  register: UseFormRegister<SurveyFormValues>;
  errors: FieldErrors<SurveyFormValues>;
  sidoList: string[];
  watchedPrimaryRegion: string;
  onPrimaryRegionChange: (sido: string) => void;
  onNextStep: () => void;
};

export function SurveyStep1({
  register,
  errors,
  sidoList,
  watchedPrimaryRegion,
  onPrimaryRegionChange,
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

        {/* 희망 지역 */}
        <Select
          aria-label="희망 지역"
          label="희망 지역"
          required
          placeholder="시·도 선택"
          options={sidoList.map((v) => ({ value: v, label: v }))}
          value={watchedPrimaryRegion}
          onChange={(e) => onPrimaryRegionChange(e.target.value)}
          error={errors.region_primary?.message}
        />
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
