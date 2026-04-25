import { Suspense } from 'react';
import { SurveyContent } from '@/features/survey/ui/SurveyContent';

export default function SurveyPage() {
  return (
    <Suspense>
      <SurveyContent />
    </Suspense>
  );
}
