import { z } from 'zod';

// --- 레이더 차트 5축 ---
export const RadarChartSchema = z.object({
  repetition: z.number().min(0).max(100),
  interpersonal: z.number().min(0).max(100),
  physical: z.number().min(0).max(100),
  hand_detail: z.number().min(0).max(100),
  env_sensitivity: z.number().min(0).max(100),
});

export type RadarChart = z.infer<typeof RadarChartSchema>;

// --- TOP3 직종 ---
export const Top3JobSchema = z.object({
  rank: z.number().min(1).max(3),
  job_name: z.string().min(1),
  match_pct: z.number().min(0).max(100),
  fit_level: z.enum(['잘 맞아요', '도전해볼 수 있어요', '힘들 수 있어요']),
});

export type Top3Job = z.infer<typeof Top3JobSchema>;

// --- AI 응답 전체 ---
export const AiMatchResponseSchema = z.object({
  radar_chart: RadarChartSchema,
  summary_text: z.string().min(1),
  top3_jobs: z.array(Top3JobSchema).length(3),
});

export type AiMatchResponse = z.infer<typeof AiMatchResponseSchema>;

// --- DB match_results 행 ---
export type MatchResult = {
  id: number;
  user_id: number;
  radar_chart: RadarChart;
  summary_text: string;
  top3_jobs: Top3Job[];
  created_at: string;
  updated_at: string;
};
