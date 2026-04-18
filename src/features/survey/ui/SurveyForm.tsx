import type { SurveyFormValues } from '../hooks/useSurveyForm';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { SurveyStep1 } from './SurveyStep1';
import { SurveyStep2 } from './SurveyStep2';

type Props = {
  mode: 'create' | 'edit';
  step: 1 | 2;
  values: SurveyFormValues;
  errors: Partial<Record<keyof SurveyFormValues, string>>;
  isSubmitting: boolean;
  isComplete: boolean;
  isBlocking: boolean;
  sigunguList: { primary: string[]; secondary: string[] };
  setField: <K extends keyof SurveyFormValues>(
    key: K,
    value: SurveyFormValues[K],
  ) => void;
  onPrimarySidoChange: (sido: string) => void;
  onSecondarySidoChange: (sido: string) => void;
  onSecondaryReset: () => void;
  onDisabilityTypeChange: (value: string, checked: boolean) => void;
  onHopeActivitiesChange: (v: string | string[]) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => void;
  onCompleteConfirm: () => void;
  onStay: () => void;
  onLeave: () => void;
};

export function SurveyForm({
  mode,
  step,
  values,
  errors,
  isSubmitting,
  isComplete,
  isBlocking,
  sigunguList,
  setField,
  onPrimarySidoChange,
  onSecondarySidoChange,
  onSecondaryReset,
  onDisabilityTypeChange,
  onHopeActivitiesChange,
  onNextStep,
  onPrevStep,
  onSubmit,
  onCompleteConfirm,
  onStay,
  onLeave,
}: Props) {
  const isEdit = mode === 'edit';

  return (
    <div className="mx-auto max-w-[640px] px-4 py-10 md:px-5 md:py-14 lg:px-6">
      {/* 페이지 타이틀 */}
      <h1 className="mb-2 text-[1.75rem] font-bold leading-[1.35] text-gray-900">
        {isEdit ? '검사 내용 수정' : '특성 검사'}
      </h1>
      <p className="mb-8 text-[0.9375rem] text-gray-500">
        특성을 알려주시면 AI가 맞는 직종과 채용공고를 찾아드려요
      </p>

      {/* 스텝 인디케이터 */}
      <div className="mb-10" aria-label={`총 2단계 중 ${step}단계`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.8125rem] font-semibold text-primary">
            Step {step} / 2
          </span>
          <span className="text-[0.8125rem] text-gray-500">
            {step === 1 ? '기본 정보' : '세부 정보'}
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
          onSecondaryReset={onSecondaryReset}
          onNextStep={onNextStep}
        />
      ) : (
        <SurveyStep2
          mode={mode}
          values={values}
          errors={errors}
          setField={setField}
          onDisabilityTypeChange={onDisabilityTypeChange}
          onHopeActivitiesChange={onHopeActivitiesChange}
          onPrevStep={onPrevStep}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {isComplete && (
        <ConfirmModal
          title={isEdit ? '수정 완료' : '검사 완료'}
          description={
            isEdit ? (
              <>
                프로필이 수정되었어요.
                <br />
                변경된 내용에 맞춰 AI 결과도 업데이트돼요.
              </>
            ) : (
              '검사가 완료되었습니다! 결과를 확인해보세요.'
            )
          }
          confirmLabel="결과 보기"
          cancelLabel="닫기"
          onConfirm={onCompleteConfirm}
          onClose={onCompleteConfirm}
        />
      )}

      {isBlocking && (
        <ConfirmModal
          title="페이지를 이동하시겠어요?"
          description={
            <>
              폼 작성을 그만하고 이동할까요?
              <br />
              작성 중인 내용은 저장되지 않아요.
            </>
          }
          confirmLabel="이동하기"
          cancelLabel="머무르기"
          onConfirm={onLeave}
          onClose={onStay}
        />
      )}
    </div>
  );
}
