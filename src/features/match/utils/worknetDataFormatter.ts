import type { JobNcsData } from '@/shared/types/worknet';

/**
 * 표준직무기술서 NCS 데이터를 OpenAI 프롬프트에 주입할 텍스트로 변환한다.
 * 직종당 3줄 이내로 압축하여 토큰 효율을 유지한다.
 */
export function formatWorknetDataForPrompt(data: JobNcsData[]): string {
  if (data.length === 0) return '';

  const lines = data.map((job) => {
    const parts: string[] = [`### ${job.jobName}`];

    const unitNames = job.units.map((u) => u.job_sdvn).join(', ');
    parts.push(`- NCS 능력단위: ${unitNames}`);

    // 모든 유닛의 지식기술태도 라벨을 수집하여 중복 제거
    const ktaLabels = [
      ...new Set(
        job.units
          .flatMap((u) => u.knwg_tchn_attd.map((k) => k.knwg_tchn_attd_label))
          .filter(Boolean),
      ),
    ];

    if (ktaLabels.length > 0) {
      const trimmed = ktaLabels.slice(0, 5).join(', ');
      parts.push(`- 지식·기술·태도: ${trimmed}`);
    }

    return parts.join('\n');
  });

  return [
    '## 표준직무기술서 참고 데이터 (공공데이터 기반)',
    '아래는 화이트리스트 직종의 NCS 기반 공식 직무 분석 데이터입니다.',
    'top3 선정 및 summary_text 작성 시 이 데이터를 근거로 활용하세요.',
    '',
    ...lines,
  ].join('\n');
}
