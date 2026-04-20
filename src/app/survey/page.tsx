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
      register={form.register}
      errors={form.errors}
      isSubmitting={form.isSubmitting}
      isMatching={form.isMatching}
      isMatchError={form.isMatchError}
      isComplete={form.isComplete}
      isBlocking={isBlocking}
      sigunguList={form.sigunguList}
      watchedPrimarySido={form.watchedPrimarySido}
      watchedPrimarySigungu={form.watchedPrimarySigungu}
      watchedSecondarySido={form.watchedSecondarySido}
      watchedSecondarySigungu={form.watchedSecondarySigungu}
      watchedDisabilityType={form.watchedDisabilityType}
      watchedHopeActivities={form.watchedHopeActivities}
      onPrimarySidoChange={form.onPrimarySidoChange}
      onPrimarySigunguChange={form.onPrimarySigunguChange}
      onSecondarySidoChange={form.onSecondarySidoChange}
      onSecondarySigunguChange={form.onSecondarySigunguChange}
      onSecondaryReset={form.onSecondaryReset}
      onDisabilityTypeChange={form.onDisabilityTypeChange}
      onHopeActivitiesChange={form.onHopeActivitiesChange}
      onNextStep={form.onNextStep}
      onPrevStep={form.onPrevStep}
      onSubmit={form.onSubmit}
      onCompleteConfirm={form.onCompleteConfirm}
      onMatchErrorClose={form.onMatchErrorClose}
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
