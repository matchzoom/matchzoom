'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SurveyForm } from '@/features/survey/ui/SurveyForm';
import { useSurveyForm } from '@/features/survey/hooks/useSurveyForm';
import { usePreventNavigation } from '@/features/survey/hooks/usePreventNavigation';

function SurveyContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'edit' ? 'edit' : 'create';
  const form = useSurveyForm(mode);
  const { isBlocking, onStay, onLeave } = usePreventNavigation(form.isDirty);

  return (
    <SurveyForm
      mode={form.mode}
      step={form.step}
      values={form.values}
      errors={form.errors}
      isSubmitting={form.isSubmitting}
      isComplete={form.isComplete}
      isBlocking={isBlocking}
      sigunguList={form.sigunguList}
      setField={form.setField}
      onPrimarySidoChange={form.onPrimarySidoChange}
      onSecondarySidoChange={form.onSecondarySidoChange}
      onSecondaryReset={form.onSecondaryReset}
      onDisabilityTypeChange={form.onDisabilityTypeChange}
      onHopeActivitiesChange={form.onHopeActivitiesChange}
      onNextStep={form.onNextStep}
      onPrevStep={form.onPrevStep}
      onSubmit={form.onSubmit}
      onCompleteConfirm={form.onCompleteConfirm}
      onStay={onStay}
      onLeave={onLeave}
    />
  );
}

export default function SurveyPage() {
  return (
    <Suspense>
      <SurveyContent />
    </Suspense>
  );
}
