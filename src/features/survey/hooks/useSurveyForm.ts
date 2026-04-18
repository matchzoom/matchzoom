'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSigunguList } from '../utils/regions';
import { step1Schema, step2Schema } from '../utils/schema';
import { submitSurvey } from '../api/surveyApi';
import { getProfile } from '@/features/profile/api/profileApi';
import type { Profile } from '@/shared/types/profile';

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

function profileToFormValues(p: Profile): SurveyFormValues {
  const [primarySido = '', ...primaryRest] = p.region_primary.split(' ');
  const primarySigungu = primaryRest.join(' ');

  let secondarySido = '';
  let secondarySigungu = '';
  if (p.region_secondary) {
    const [sido = '', ...rest] = p.region_secondary.split(' ');
    secondarySido = sido;
    secondarySigungu = rest.join(' ');
  }

  return {
    name: p.name,
    gender: p.gender,
    education: p.education,
    region_primary_sido: primarySido,
    region_primary_sigungu: primarySigungu,
    region_secondary_sido: secondarySido,
    region_secondary_sigungu: secondarySigungu,
    barrier_free: p.is_barrier_free,
    disability_type: p.disability_type,
    disability_level: p.disability_level,
    mobility: p.mobility,
    hand_usage: p.hand_usage,
    stamina: p.stamina,
    communication: p.communication,
    instruction_level: p.instruction_level,
    hope_activities: p.hope_activities,
    hope_activities_other: '',
  };
}

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

export function useSurveyForm(mode: 'create' | 'edit' = 'create') {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<SurveyFormValues>(INITIAL);
  const [initialValues, setInitialValues] = useState<SurveyFormValues>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [initialized, setInitialized] = useState(mode === 'create');

  const { data: existingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: mode === 'edit',
  });

  useEffect(() => {
    if (mode === 'edit' && existingProfile && !initialized) {
      const editValues = profileToFormValues(existingProfile);
      setValues(editValues);
      setInitialValues(editValues);
      setInitialized(true);
    }
  }, [mode, existingProfile, initialized]);

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
    setErrors((prev) => ({ ...prev, region_primary_sido: undefined }));
  }

  function onSecondarySidoChange(sido: string) {
    setValues((prev) => ({
      ...prev,
      region_secondary_sido: sido,
      region_secondary_sigungu: '',
    }));
  }

  function onSecondaryReset() {
    setValues((prev) => ({
      ...prev,
      region_secondary_sido: '',
      region_secondary_sigungu: '',
    }));
    setErrors((prev) => ({
      ...prev,
      region_secondary_sido: undefined,
      region_secondary_sigungu: undefined,
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

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsComplete(true);
    } catch (err) {
      console.error('[검사 제출 오류]', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function onCompleteConfirm() {
    router.push('/profile');
  }

  const isDirty =
    !isComplete && JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    mode,
    step,
    values,
    errors,
    isSubmitting,
    isComplete,
    isDirty,
    setField,
    onPrimarySidoChange,
    onSecondarySidoChange,
    onSecondaryReset,
    onHopeActivitiesChange,
    onNextStep,
    onPrevStep,
    onSubmit,
    onCompleteConfirm,
    sigunguList: {
      primary: getSigunguList(values.region_primary_sido),
      secondary: getSigunguList(values.region_secondary_sido),
    },
  };
}
