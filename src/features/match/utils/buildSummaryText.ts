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
  // top3 직종에 해당하는 NCS 데이터 필터링 (공백·특수문자 무시 매칭)
  const normalize = (s: string) => s.replace(/[\s·-]/g, '');
  const top3Normalized = top3Jobs.map((j) => normalize(j.job_name));
  const relevantNcs = worknetData.filter((d) =>
    top3Normalized.some(
      (name) =>
        name === normalize(d.jobName) ||
        name.includes(normalize(d.jobName)) ||
        normalize(d.jobName).includes(name),
    ),
  );

  // top3 직종에 매칭되는 NCS가 없으면 직종 폴백 → radar 폴백 순으로 시도.
  // 무관한 NCS를 OpenAI에 넘기면 엉뚱한 키워드가 summary에 섞이므로 호출하지 않는다.
  if (relevantNcs.length === 0) {
    const jobFallback = findJobFallbackSummary(top3Jobs);
    return jobFallback ?? buildRadarFallbackSummary(radarChart);
  }

  const ncsToUse = relevantNcs;

  // NCS 키워드 추출
  const ncsContext = ncsToUse
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
- 존댓���, 반드시 한 문장(쉼표로 두 절 나열 금지), 40자 이내
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
    const cleaned = raw.replace(/^```json\s*|\s*```$/g, '').trim();
    const parsed = JSON.parse(cleaned);
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

/**
 * NCS API에서 의미 있는 매칭이 안 되는 화이트리스트 직종에 대한 사전 정의 한 문장.
 * NCS 검색 노이즈로 잘못된 키워드가 summary에 섞이는 것을 방지한다.
 * top3 rank 1부터 순서대로 폴백을 시도한다.
 */
const JOB_FALLBACK_SUMMARY: Record<string, string> = {
  안마사: '사람의 몸을 부드럽게 풀어주는 손길에 강점이 있어요',
  헬스키퍼: '정해진 마사지 절차를 차분히 수행할 때 안정적이에요',
  '점역·교정사': '글자를 꼼꼼히 살피고 정확하게 다루는 집중력이 있어요',
  '온라인 콘텐츠 모니터링':
    '화면을 차분히 살피며 패턴을 찾아내는 데 강점이 있어요',
  호텔객실관리: '공간을 가지런히 정돈하는 작업에서 안정적이에요',
  '방역·소독활동': '정해진 절차에 따라 깨끗하게 관리하는 일에 강점이 있어요',
  '업사이클링·리사이클링':
    '재료를 가려내고 새로운 형태로 다듬는 일에 강점이 있어요',
  은행서비스안내: '정해진 안내 흐름을 차분하게 전달하는 데 강점이 있어요',
  건강검진센터지원: '검진 절차를 침착하게 안내하는 일에서 안정적이에요',
  스포츠이용시설안내: '시설 이용 흐름을 친절하게 안내하는 데 강점이 있어요',
  재래시장관리: '시장 환경을 가지런히 정돈하는 일에서 안정적이에요',
  '장애인전문주차 구역계도 및 홍보':
    '정해진 안내를 꾸준히 전달하는 데 강점이 있어요',
  '무인정보단말기(키오스크)안내':
    '정해진 화면 흐름을 침착하게 안내하는 일이 잘 맞아요',
  '간식 포장 및 점검': '재료를 차곡차곡 담아 마무리하는 일에 강점이 있어요',
  교통약자승하차지원:
    '정해진 도움 절차를 침착하게 수행하는 일에서 안정적이에요',
  '장난감 세척': '물건을 깨끗하게 닦아내는 일에 차분한 집중력이 있어요',
  '다회용품 세척 및 관리': '깨끗하게 관리하는 일에서 안정적이에요',
  '이동보조기기 분해 세척 및 소독':
    '기구를 꼼꼼히 살피고 깨끗하게 관리하는 데 강점이 있어요',
  버스청결관리: '공간을 가지런히 정돈하는 일에서 안정적이에요',
  '우편물 분류': '물건을 종류별로 가려내는 꼼꼼함이 강점이에요',
  문서파기: '서류를 차분히 정리하고 마무리하는 일에 안정적이에요',
  기부물품관리: '물건을 종류별로 가려내고 정리하는 데 강점이 있어요',
  '대형마트 매장정리 및 상품관리':
    '물건을 가지런히 진열하고 정돈하는 일에 강점이 있어요',
};

function findJobFallbackSummary(top3Jobs: Top3Job[]): string | null {
  for (const job of top3Jobs) {
    const fallback = JOB_FALLBACK_SUMMARY[job.job_name];
    if (fallback) return fallback;
  }
  return null;
}

/** 직종 폴백도 없을 때의 최종 radar 기반 폴백 summary */
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
