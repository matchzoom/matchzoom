'use client';

import { useState } from 'react';
import { getSigunguList } from '../utils/regions';

export type SurveyFormValues = {
  // Step 1
  name: string;
  age: string;
  gender: string;
  education: string;
  region_primary_sido: string;
  region_primary_sigungu: string;
  region_secondary_sido: string;
  region_secondary_sigungu: string;
  barrier_free: boolean;
  // Step 2
  disability_type: string;
  disability_level: string;
  mobility: string;
  hand_usage: string;
  stamina: string;
  communication: string;
  instruction_level: string;
  hope_activities: string[];
  hope_activities_other: string;
};

const INITIAL: SurveyFormValues = {
  name: '',
  age: '',
  gender: '',
  education: '',
  region_primary_sido: '',
  region_primary_sigungu: '',
  region_secondary_sido: '',
  region_secondary_sigungu: '',
  barrier_free: false,
  disability_type: '',
  disability_level: '',
  mobility: '',
  hand_usage: '',
  stamina: '',
  communication: '',
  instruction_level: '',
  hope_activities: [],
  hope_activities_other: '',
};

export function useSurveyForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<SurveyFormValues>(INITIAL);

  function setField<K extends keyof SurveyFormValues>(
    key: K,
    value: SurveyFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onPrimarySidoChange(sido: string) {
    setValues((prev) => ({
      ...prev,
      region_primary_sido: sido,
      region_primary_sigungu: '',
    }));
  }

  function onSecondarySidoChange(sido: string) {
    setValues((prev) => ({
      ...prev,
      region_secondary_sido: sido,
      region_secondary_sigungu: '',
    }));
  }

  function onHopeActivitiesChange(next: string | string[]) {
    const activities = Array.isArray(next) ? next : [next];
    setValues((prev) => ({
      ...prev,
      hope_activities: activities,
      hope_activities_other: activities.includes('기타')
        ? prev.hope_activities_other
        : '',
    }));
  }

  function onNextStep() {
    setStep(2);
  }

  function onPrevStep() {
    setStep(1);
  }

  function onSubmit() {
    // eslint-disable-next-line no-console
    console.log('제출완료');
  }

  return {
    step,
    values,
    errors: {} as Partial<Record<keyof SurveyFormValues, string>>,
    isSubmitting: false,
    setField,
    onPrimarySidoChange,
    onSecondarySidoChange,
    onHopeActivitiesChange,
    onNextStep,
    onPrevStep,
    onSubmit,
    sigunguList: {
      primary: getSigunguList(values.region_primary_sido),
      secondary: getSigunguList(values.region_secondary_sido),
    },
  };
}
