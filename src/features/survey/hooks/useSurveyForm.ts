'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SIDO_LIST } from '../utils/regions';
import {
  surveySchema,
  STEP1_FIELDS,
  type SurveyFormValues,
} from '../utils/schema';
import {
  DISABILITY_TYPE_VALUES,
  HOPE_ACTIVITIES_VALUES,
} from '../utils/options';
import { submitSurvey } from '../api/surveyApi';
import { JOB_POSTINGS_QUERY_KEY } from '@/features/dashboard/hooks/useJobPostings';
import { generateMatch } from '@/features/match/api/matchApi';
import { MATCH_RESULT_QUERY_KEY } from '@/features/match/hooks/useMatchResult';
import { getProfile } from '@/features/profile/api/profileApi';
import { PROFILE_QUERY_KEY } from '@/features/profile/hooks/useProfile';
import type { Profile } from '@/shared/types/profile';

export type { SurveyFormValues };

function extractOther(values: string[], knownSet: Set<string>): string {
  return values.find((v) => !knownSet.has(v)) ?? '';
}

function restoreOther(values: string[], knownSet: Set<string>): string[] {
  const hasCustom = values.some((v) => !knownSet.has(v));
  const known = values.filter((v) => knownSet.has(v));
  return hasCustom ? [...known, '기타'] : known;
}

function profileToFormValues(p: Profile): SurveyFormValues {
  return {
    name: p.name,
    gender: p.gender,
    education: p.education,
    region_primary: p.region_primary.split(' ')[0] ?? '',
    disability_type: restoreOther(p.disability_type, DISABILITY_TYPE_VALUES),
    disability_type_other: extractOther(
      p.disability_type,
      DISABILITY_TYPE_VALUES,
    ),
    disability_level: p.disability_level,
    mobility: p.mobility,
    hand_usage: p.hand_usage,
    stamina: p.stamina,
    communication: p.communication,
    instruction_level: p.instruction_level,
    hope_activities: restoreOther(p.hope_activities, HOPE_ACTIVITIES_VALUES),
    hope_activities_other: extractOther(
      p.hope_activities,
      HOPE_ACTIVITIES_VALUES,
    ),
  };
}

const INITIAL: SurveyFormValues = {
  name: '',
  gender: '',
  education: '',
  region_primary: '',
  disability_type: [],
  disability_type_other: '',
  disability_level: '',
  mobility: '',
  hand_usage: '',
  stamina: '',
  communication: '',
  instruction_level: '',
  hope_activities: [],
  hope_activities_other: '',
};

export function useSurveyForm(mode: 'create' | 'edit' = 'create') {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [isMatching, setIsMatching] = useState(false);
  const [isMatchError, setIsMatchError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: INITIAL,
  });

  const { data: existingProfile } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
    enabled: mode === 'edit',
  });

  useEffect(() => {
    if (mode === 'edit' && existingProfile) {
      reset(profileToFormValues(existingProfile));
    }
  }, [mode, existingProfile, reset]);

  const watchedPrimaryRegion = watch('region_primary');
  const watchedDisabilityType = watch('disability_type');
  const watchedHopeActivities = watch('hope_activities');

  function onPrimaryRegionChange(sido: string) {
    setValue('region_primary', sido, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onDisabilityTypeChange(value: string, checked: boolean) {
    const current = watch('disability_type');
    const next = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    setValue('disability_type', next, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (value === '기타' && !checked) {
      setValue('disability_type_other', '', { shouldDirty: true });
    }
  }

  function onHopeActivitiesChange(value: string, checked: boolean) {
    const current = watch('hope_activities');
    const next = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    setValue('hope_activities', next, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (value === '기타' && !checked) {
      setValue('hope_activities_other', '', { shouldDirty: true });
    }
  }

  async function onNextStep() {
    const valid = await trigger([...STEP1_FIELDS]);
    if (valid) setStep(2);
  }

  function onPrevStep() {
    setStep(1);
  }

  const onSubmit = handleSubmit(async (data) => {
    const disabilityTypes = data.disability_type.includes('기타')
      ? [
          ...data.disability_type.filter((t) => t !== '기타'),
          data.disability_type_other.trim(),
        ]
      : data.disability_type;

    const activities = data.hope_activities.includes('기타')
      ? [
          ...data.hope_activities.filter((a) => a !== '기타'),
          data.hope_activities_other.trim(),
        ]
      : data.hope_activities;

    await submitSurvey({
      name: data.name,
      gender: data.gender,
      education: data.education,
      region_primary: data.region_primary,
      disability_type: disabilityTypes,
      disability_level: data.disability_level,
      mobility: data.mobility,
      hand_usage: data.hand_usage,
      stamina: data.stamina,
      communication: data.communication,
      instruction_level: data.instruction_level,
      hope_activities: activities,
    });

    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    queryClient.removeQueries({ queryKey: JOB_POSTINGS_QUERY_KEY });
    localStorage.removeItem('matchzoom-job-sigungu-filter');
    localStorage.removeItem('matchzoom-job-fitlevel-filter');
    setIsMatching(true);

    try {
      await generateMatch();
      queryClient.invalidateQueries({ queryKey: MATCH_RESULT_QUERY_KEY });
      setIsComplete(true);
    } catch {
      setIsMatchError(true);
    } finally {
      setIsMatching(false);
    }
  });

  function onCompleteConfirm() {
    router.push('/profile');
  }

  function onMatchErrorClose() {
    setIsMatchError(false);
  }

  return {
    mode,
    step,
    register,
    errors,
    isSubmitting,
    isMatching,
    isMatchError,
    isComplete,
    isDirty: !isComplete && isDirty,
    watchedPrimaryRegion,
    watchedDisabilityType,
    watchedHopeActivities,
    onPrimaryRegionChange,
    onDisabilityTypeChange,
    onHopeActivitiesChange,
    onNextStep,
    onPrevStep,
    onSubmit,
    onCompleteConfirm,
    onMatchErrorClose,
    sidoList: SIDO_LIST,
  };
}
