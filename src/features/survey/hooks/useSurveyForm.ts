'use client';

import { useState } from 'react';
import { getSigunguList } from '../utils/regions';
import { step1Schema, step2Schema } from '../utils/schema';
import { submitSurvey } from '../api/surveyApi';

export type SurveyFormValues = {
  name: string;
  gender: string;
  education: string;
  region_primary_sido: string;
  region_primary_sigungu: string;
  region_secondary_sido: string;
  region_secondary_sigungu: string;
  barrier_free: boolean;
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

type FormErrors = Partial<Record<keyof SurveyFormValues, string>>;

const INITIAL: SurveyFormValues = {
  name: '',
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

function parseZodErrors<T extends object>(
  issues: { path: PropertyKey[]; message: string }[],
): Partial<Record<keyof T, string>> {
  const result: Partial<Record<keyof T, string>> = {};
  for (const issue of issues) {
    const key = issue.path[0] as keyof T;
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}

export function useSurveyForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<SurveyFormValues>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof SurveyFormValues>(
    key: K,
    value: SurveyFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
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
    setErrors((prev) => ({ ...prev, hope_activities: undefined }));
  }

  function onNextStep() {
    const result = step1Schema.safeParse({
      name: values.name,
      gender: values.gender,
      education: values.education,
      region_primary_sido: values.region_primary_sido,
      region_primary_sigungu: values.region_primary_sigungu,
      region_secondary_sido: values.region_secondary_sido,
      region_secondary_sigungu: values.region_secondary_sigungu,
      barrier_free: values.barrier_free,
    });

    if (!result.success) {
      setErrors(parseZodErrors<SurveyFormValues>(result.error.issues));
      return;
    }

    setErrors({});
    setStep(2);
  }

  function onPrevStep() {
    setStep(1);
  }

  async function onSubmit() {
    const result = step2Schema.safeParse({
      disability_type: values.disability_type,
      disability_level: values.disability_level,
      mobility: values.mobility,
      hand_usage: values.hand_usage,
      stamina: values.stamina,
      communication: values.communication,
      instruction_level: values.instruction_level,
      hope_activities: values.hope_activities,
      hope_activities_other: values.hope_activities_other,
    });

    if (!result.success) {
      setErrors(parseZodErrors<SurveyFormValues>(result.error.issues));
      return;
    }

    setIsSubmitting(true);
    try {
      const activities = values.hope_activities.includes('기타')
        ? [
            ...values.hope_activities.filter((a) => a !== '기타'),
            values.hope_activities_other.trim(),
          ]
        : values.hope_activities;

      const regionSecondary =
        values.region_secondary_sido && values.region_secondary_sigungu
          ? `${values.region_secondary_sido} ${values.region_secondary_sigungu}`
          : undefined;

      await submitSurvey({
        name: values.name,
        gender: values.gender,
        education: values.education,
        region_primary: `${values.region_primary_sido} ${values.region_primary_sigungu}`,
        region_secondary: regionSecondary,
        is_barrier_free: values.barrier_free,
        disability_type: values.disability_type,
        disability_level: values.disability_level,
        mobility: values.mobility,
        hand_usage: values.hand_usage,
        stamina: values.stamina,
        communication: values.communication,
        instruction_level: values.instruction_level,
        hope_activities: activities,
      });
    } catch (err) {
      console.error('[검사 제출 오류]', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    step,
    values,
    errors,
    isSubmitting,
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
