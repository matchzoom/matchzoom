import type { SurveyFormValues } from '../hooks/useSurveyForm';
import { SurveyStep1 } from './SurveyStep1';
import { SurveyStep2 } from './SurveyStep2';

type Props = {
  step: 1 | 2;
  values: SurveyFormValues;
  errors: Partial<Record<keyof SurveyFormValues, string>>;
  isSubmitting: boolean;
  sigunguList: { primary: string[]; secondary: string[] };
  setField: <K extends keyof SurveyFormValues>(
    key: K,
    value: SurveyFormValues[K],
  ) => void;
  onPrimarySidoChange: (sido: string) => void;
  onSecondarySidoChange: (sido: string) => void;
  onHopeActivitiesChange: (v: string | string[]) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => void;
};

export function SurveyForm({
  step,
  values,
  errors,
  isSubmitting,
  sigunguList,
  setField,
  onPrimarySidoChange,
  onSecondarySidoChange,
  onHopeActivitiesChange,
  onNextStep,
  onPrevStep,
  onSubmit,
}: Props) {
  return (
    <div className="mx-auto max-w-[640px] px-4 py-10 md:px-5 md:py-14 lg:px-6">
      {/* 페이지 타이틀 */}
      <h1 className="mb-2 text-[1.75rem] font-bold leading-[1.35] text-gray-900">
        자녀 특성 검사
      </h1>
      <p className="mb-8 text-[0.9375rem] text-gray-500">
        자녀의 특성을 입력하면 AI가 적합한 직종과 채용공고를 찾아드려요
      </p>

      {/* 스텝 인디케이터 */}
      <div className="mb-10" aria-label={`총 2단계 중 ${step}단계`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.8125rem] font-semibold text-primary">
            Step {step} / 2
          </span>
          <span className="text-[0.8125rem] text-gray-500">
            {step === 1 ? '기본 정보' : '자녀의 특성'}
          </span>
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded-sm bg-gray-200"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={2}
        >
          <div
            className="h-full bg-primary transition-[width] duration-200 ease-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {/* 폼 컨텐츠 */}
      {step === 1 ? (
        <SurveyStep1
          values={values}
          errors={errors}
          sigunguList={sigunguList}
          setField={setField}
          onPrimarySidoChange={onPrimarySidoChange}
          onSecondarySidoChange={onSecondarySidoChange}
          onNextStep={onNextStep}
        />
      ) : (
        <SurveyStep2
          values={values}
          errors={errors}
          setField={setField}
          onHopeActivitiesChange={onHopeActivitiesChange}
          onPrevStep={onPrevStep}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
