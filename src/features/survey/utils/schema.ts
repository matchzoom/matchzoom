import { z } from 'zod';

export const step1Schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  age: z
    .string()
    .min(1, '만 나이를 입력해주세요')
    .refine((v) => {
      const n = Number(v);
      return Number.isInteger(n) && n >= 1 && n <= 99;
    }, '1~99 사이의 나이를 입력해주세요'),
  gender: z.string().min(1, '성별을 선택해주세요'),
  education: z.string().min(1, '최종학력을 선택해주세요'),
  region_primary_sido: z.string().min(1, '시·도를 선택해주세요'),
  region_primary_sigungu: z.string().min(1, '구·군·시를 선택해주세요'),
  region_secondary_sido: z.string().optional(),
  region_secondary_sigungu: z.string().optional(),
  barrier_free: z.boolean(),
});

export const step2Schema = z
  .object({
    disability_type: z.string().min(1, '장애 유형을 선택해주세요'),
    disability_level: z.string().min(1, '장애 등급을 선택해주세요'),
    mobility: z.string().min(1, '이동 방법을 선택해주세요'),
    hand_usage: z.string().min(1, '손 사용 능력을 선택해주세요'),
    stamina: z.string().min(1, '체력을 선택해주세요'),
    communication: z.string().min(1, '말하기 능력을 선택해주세요'),
    instruction_level: z.string().min(1, '지시 이해 수준을 선택해주세요'),
    hope_activities: z
      .array(z.string())
      .min(1, '희망 활동을 1개 이상 선택해주세요'),
    hope_activities_other: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.hope_activities.includes('기타')) {
        return (data.hope_activities_other ?? '').trim().length > 0;
      }
      return true;
    },
    {
      message: '기타 내용을 입력해주세요',
      path: ['hope_activities_other'],
    },
  );

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
