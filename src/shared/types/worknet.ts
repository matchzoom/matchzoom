import { z } from 'zod';

// --- 지식기술태도 항목 ---
const KtaItemSchema = z.object({
  knwg_tchn_attd: z.string(),
  knwg_tchn_attd_label: z.string(),
});

// --- 표준직무기술서 API 개별 NCS 능력단위 ---
export const NcsUnitSchema = z.object({
  /** NCS 능력단위명 (직무 분류) */
  job_sdvn: z.string(),
  /** NCS 능력단위 정의 */
  ablt_def: z.string(),
  /** NCS 소분류명 */
  job_scfn: z.string(),
  /** NCS 대분류명 */
  job_lcfn: z.string(),
  /** NCS 중분류명 */
  job_mcn: z.string(),
  /** 지식·기술·태도 목록 */
  knwg_tchn_attd: z.array(KtaItemSchema),
});

export type NcsUnit = z.infer<typeof NcsUnitSchema>;

// --- 직종별 NCS 데이터 (프롬프트 주입용) ---
export type JobNcsData = {
  /** 화이트리스트 직종명 */
  jobName: string;
  /** NCS 능력단위 목록 */
  units: NcsUnit[];
};
