'use client';

import { SurveyForm } from '@/features/survey/ui/SurveyForm';
import { useSurveyForm } from '@/features/survey/hooks/useSurveyForm';

export default function SurveyPage() {
  const form = useSurveyForm();

  return (
    <SurveyForm
      step={form.step}
      values={form.values}
      errors={form.errors}
      isSubmitting={form.isSubmitting}
      sigunguList={form.sigunguList}
      setField={form.setField}
      onPrimarySidoChange={form.onPrimarySidoChange}
      onSecondarySidoChange={form.onSecondarySidoChange}
      onHopeActivitiesChange={form.onHopeActivitiesChange}
      onNextStep={form.onNextStep}
      onPrevStep={form.onPrevStep}
      onSubmit={form.onSubmit}
    />
  );
}
