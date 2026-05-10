import type { JobNcsData } from '@/shared/types/worknet';
import type { RadarChart, Top3Job } from '@/shared/types/match';
import { openAiFetch } from '@/shared/api/openAiFetch';

/**
 * top3 직종의 NCS 데이터를 기반으로 summary_text를 생성한다.
 * 메인 매칭 프롬프트와 분리하여, NCS 키워드가 100% 반영되도록 한다.
 */
export async function buildSummaryText(
  top3Jobs: Top3Job[],
  worknetData: JobNcsData[],
  radarChart: RadarChart,
): Promise<string> {
  // top3 직종에 해당하는 NCS 데이터 필터링
  const top3Names = top3Jobs.map((j) => j.job_name);
  const relevantNcs = worknetData.filter((d) => top3Names.includes(d.jobName));

  // NCS 데이터가 없으면 radar 기반 폴백
  if (relevantNcs.length === 0) {
    return buildRadarFallbackSummary(radarChart);
  }

  // NCS 키워드 추출
  const ncsContext = relevantNcs
    .map((job) => {
      const unitNames = job.units.map((u) => u.job_sdvn).join(', ');
      const ktaLabels = [
        ...new Set(
          job.units
            .flatMap((u) => u.knwg_tchn_attd.map((k) => k.knwg_tchn_attd_label))
            .filter(Boolean),
        ),
      ].slice(0, 5);
      const definitions = job.units.map((u) => u.ablt_def).filter(Boolean);

      return [
        `직종: ${job.jobName}`,
        `능력단위: ${unitNames}`,
        ktaLabels.length > 0 ? `지식기술태도: ${ktaLabels.join(', ')}` : '',
        definitions.length > 0 ? `정의: ${definitions[0]}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');

  // radar에서 가장 높은 2개 축
  const radarEntries = Object.entries(radarChart) as [string, number][];
  const topAxes = radarEntries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => AXIS_LABELS[key] ?? key);

  const raw = await openAiFetch([
    {
      role: 'system',
      content: `당신은 장애인 직업 적합도 결과를 따뜻하게 한 문장으로 표현하는 전문가입니다.

아래 NCS 직무 데이터의 **지식기술태도 키워드** 또는 **능력단위명**을 자연어로 변환하여 한 문장을 만드세요.

## 규칙
- 존댓말, 한 문장, 60자 이내
- 주어 없이 서술 ("저는", "~님은" 금지)
- NCS 키워드를 반드시 1개 이상 자연어로 녹일 것 (그대로 복사 금지)
- "추천드립니다", "매칭되었습니다", "분석했습니다" 금지
- 장애 언급 금지
- 직종명 직접 언급 금지
- "능숙/잘하/탁월/뛰어나" 금지 → "강점이 있어요/편안해요/안정적이에요" 사용
- 환경·감각·상황을 담아 따뜻하게
- JSON 형식: {"summary_text": "..."}

## NCS 키워드 → 자연어 변환 예시
- "세탁물 분류 능력" → "빨래를 종류별로 가려내는"
- "위생관리 지식" → "깨끗한 환경을 유지하는"
- "포장기법" → "꼼꼼하게 포장하는"
- "물품정리" → "물건을 가지런히 다루는"
- "반죽정형" → "재료를 계량하고 반죽을 빚는"
- "청소" → "깔끔하게 정돈하는"
- "조립" → "부품을 맞춰 끼우는"`,
    },
    {
      role: 'user',
      content: `## 이 사용자의 강점 축
${topAxes.join(', ')}

## top3 직종의 NCS 데이터 (이 키워드를 반드시 활용)
${ncsContext}

위 NCS 데이터에서 키워드를 뽑아 자연어로 변환하고, 강점 축과 결합하여 summary_text를 생성하세요.
JSON만 출력:`,
    },
  ]);

  try {
    const parsed = JSON.parse(raw);
    if (parsed.summary_text && typeof parsed.summary_text === 'string') {
      return parsed.summary_text;
    }
  } catch {
    // 파싱 실패 시 폴백
  }

  return buildRadarFallbackSummary(radarChart);
}

const AXIS_LABELS: Record<string, string> = {
  repetition: '반복 작업 적합도',
  interpersonal: '대인 업무 적합도',
  physical: '신체 활동 적합도',
  hand_detail: '정교한 손작업 적합도',
  env_sensitivity: '조용한 환경 선호도',
};

/** NCS 데이터가 없을 때 radar 기반 폴백 summary */
function buildRadarFallbackSummary(radarChart: RadarChart): string {
  const entries = Object.entries(radarChart) as [string, number][];
  const [top] = entries.sort((a, b) => b[1] - a[1]);

  const fallbackMap: Record<string, string> = {
    repetition: '정해진 순서를 차분하게 따라가는 꼼꼼함이 큰 강점이에요',
    interpersonal:
      '사람들과 짧게 인사하고 정리하는 일에서 밝은 에너지가 나와요',
    physical: '몸을 움직이며 활기차게 일할 때 가장 편안해요',
    hand_detail: '손으로 하나하나 맞춰가는 작업에 집중할 때 가장 안정적이에요',
    env_sensitivity: '조용하고 예측 가능한 환경에서 차분히 집중할 때 편안해요',
  };

  return (
    fallbackMap[top[0]] ?? '차분한 환경에서 꼼꼼히 집중할 때 가장 안정적이에요'
  );
}
