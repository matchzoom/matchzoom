import { Suspense } from 'react';
import { SurveyContent } from '@/features/survey/SurveyContent';

export default function SurveyPage() {
  return (
    <Suspense>
      <SurveyContent />
    </Suspense>
  );
}
