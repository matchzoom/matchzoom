'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SurveyForm } from './ui/SurveyForm';
import { useSurveyForm } from './hooks/useSurveyForm';
import { usePreventNavigation } from './hooks/usePreventNavigation';
import { getProfile } from '@/shared/api/profileApi';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';

export function SurveyContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'edit' ? 'edit' : 'create';

  const { data: existingProfile } = useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: getProfile,
    enabled: mode === 'edit',
  });

  const form = useSurveyForm(mode, existingProfile ?? undefined);
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
      sidoList={form.sidoList}
      watchedPrimaryRegion={form.watchedPrimaryRegion}
      watchedDisabilityType={form.watchedDisabilityType}
      watchedHopeActivities={form.watchedHopeActivities}
      onPrimaryRegionChange={form.onPrimaryRegionChange}
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
