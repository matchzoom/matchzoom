import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Input } from '@/shared/ui/Input';
import { Radio, RadioGroup } from '@/shared/ui/Radio';
import { Select } from '@/shared/ui/Select';
import { SIDO_LIST } from '../utils/regions';
import type { SurveyFormValues } from '../hooks/useSurveyForm';

const EDUCATION_OPTIONS = [
  { value: '특수학교 초등부', label: '특수학교 초등부' },
  { value: '특수학교 중등부', label: '특수학교 중등부' },
  { value: '특수학교 고등부 졸업', label: '특수학교 고등부 졸업' },
  { value: '일반학교 졸업', label: '일반학교 졸업' },
];

const SIDO_OPTIONS = SIDO_LIST.map((v) => ({ value: v, label: v }));

type Props = {
  values: SurveyFormValues;
  errors: Partial<Record<keyof SurveyFormValues, string>>;
  sigunguList: { primary: string[]; secondary: string[] };
  setField: <K extends keyof SurveyFormValues>(
    key: K,
    value: SurveyFormValues[K],
  ) => void;
  onPrimarySidoChange: (sido: string) => void;
  onSecondarySidoChange: (sido: string) => void;
  onNextStep: () => void;
};

export function SurveyStep1({
  values,
  errors,
  sigunguList,
  setField,
  onPrimarySidoChange,
  onSecondarySidoChange,
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
          자녀의 기본 정보를 입력해주세요
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* 이름 */}
        <Input
          label="자녀 이름"
          required
          value={values.name}
          onChange={(e) => setField('name', e.target.value)}
          error={errors.name}
          placeholder="이름을 입력해주세요"
          maxLength={20}
        />

        {/* 만 나이 */}
        <Input
          label="만 나이"
          required
          type="number"
          min={1}
          max={99}
          value={values.age}
          onChange={(e) => setField('age', e.target.value)}
          error={errors.age}
          placeholder="숫자만 입력해주세요"
        />

        {/* 성별 */}
        <RadioGroup label="성별" required error={errors.gender}>
          <Radio
            name="gender"
            value="남성"
            label="남성"
            checked={values.gender === '남성'}
            onChange={() => setField('gender', '남성')}
          />
          <Radio
            name="gender"
            value="여성"
            label="여성"
            checked={values.gender === '여성'}
            onChange={() => setField('gender', '여성')}
          />
        </RadioGroup>

        {/* 최종학력 */}
        <RadioGroup label="최종학력" required error={errors.education}>
          {EDUCATION_OPTIONS.map((opt) => (
            <Radio
              key={opt.value}
              name="education"
              value={opt.value}
              label={opt.label}
              checked={values.education === opt.value}
              onChange={() => setField('education', opt.value)}
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
                value={values.region_primary_sido}
                onChange={(e) => onPrimarySidoChange(e.target.value)}
                error={errors.region_primary_sido}
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
                value={values.region_primary_sigungu}
                onChange={(e) =>
                  setField('region_primary_sigungu', e.target.value)
                }
                error={errors.region_primary_sigungu}
                disabled={!values.region_primary_sido}
              />
            </div>
          </div>
        </fieldset>

        {/* 희망 지역 2순위 */}
        <fieldset className="flex flex-col gap-0 border-0 p-0">
          <legend className="mb-3 text-[0.875rem] font-semibold text-gray-900">
            희망 지역 2순위
            <span className="ml-1 text-[0.8125rem] font-normal text-gray-500">
              (선택)
            </span>
          </legend>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                aria-label="시·도 (2순위)"
                placeholder="시·도 선택"
                options={SIDO_OPTIONS}
                value={values.region_secondary_sido}
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
                }))}
                value={values.region_secondary_sigungu}
                onChange={(e) =>
                  setField('region_secondary_sigungu', e.target.value)
                }
                disabled={!values.region_secondary_sido}
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
            checked={values.barrier_free}
            onChange={(e) => setField('barrier_free', e.target.checked)}
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
