import { z } from 'zod';
import { DISABILITY_TYPE_VALUES, HOPE_ACTIVITIES_VALUES } from './options';

export const surveySchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요'),
    gender: z.string().min(1, '성별을 선택해주세요'),
    education: z.string().min(1, '최종학력을 선택해주세요'),
    region_primary_sido: z.string().min(1, '시·도를 선택해주세요'),
    region_primary_sigungu: z.string().min(1, '구·군·시를 선택해주세요'),
    region_secondary_sido: z.string(),
    region_secondary_sigungu: z.string(),
    barrier_free: z.boolean(),
    disability_type: z
      .array(z.string())
      .min(1, '장애 유형을 1개 이상 선택해주세요'),
    disability_level: z.string().min(1, '장애 등급을 선택해주세요'),
    mobility: z.string().min(1, '이동 방법을 선택해주세요'),
    hand_usage: z.string().min(1, '손 사용 능력을 선택해주세요'),
    stamina: z.string().min(1, '체력을 선택해주세요'),
    communication: z.string().min(1, '말하기 능력을 선택해주세요'),
    instruction_level: z.string().min(1, '지시 이해 수준을 선택해주세요'),
    disability_type_other: z.string(),
    hope_activities: z
      .array(z.string())
      .min(1, '희망 활동을 1개 이상 선택해주세요'),
    hope_activities_other: z.string(),
  })
  .refine(
    (data) => !(data.region_secondary_sido && !data.region_secondary_sigungu),
    { message: '구·군·시를 선택해주세요', path: ['region_secondary_sigungu'] },
  )
  .refine(
    (data) => {
      if (data.disability_type.includes('기타')) {
        return (data.disability_type_other ?? '').trim().length > 0;
      }
      return true;
    },
    { message: '기타 내용을 입력해주세요', path: ['disability_type_other'] },
  )
  .refine(
    (data) => {
      if (data.disability_type.includes('기타')) {
        const val = (data.disability_type_other ?? '').trim();
        return !DISABILITY_TYPE_VALUES.has(val);
      }
      return true;
    },
    {
      message: '이미 선택 가능한 항목이에요. 다른 내용을 입력해주세요',
      path: ['disability_type_other'],
    },
  )
  .refine(
    (data) => {
      if (data.hope_activities.includes('기타')) {
        return (data.hope_activities_other ?? '').trim().length > 0;
      }
      return true;
    },
    { message: '기타 내용을 입력해주세요', path: ['hope_activities_other'] },
  )
  .refine(
    (data) => {
      if (data.hope_activities.includes('기타')) {
        const val = (data.hope_activities_other ?? '').trim();
        return !HOPE_ACTIVITIES_VALUES.has(val);
      }
      return true;
    },
    {
      message: '이미 선택 가능한 항목이에요. 다른 내용을 입력해주세요',
      path: ['hope_activities_other'],
    },
  );

export type SurveyFormValues = z.infer<typeof surveySchema>;

export const STEP1_FIELDS = [
  'name',
  'gender',
  'education',
  'region_primary_sido',
  'region_primary_sigungu',
  'region_secondary_sido',
  'region_secondary_sigungu',
  'barrier_free',
] as const;
