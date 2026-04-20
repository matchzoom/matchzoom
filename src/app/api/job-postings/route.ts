import { XMLParser } from 'fast-xml-parser';

import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import type { FitLevel } from '@/shared/types/job';

type RawItem = {
  busplaName?: string;
  compAddr?: string;
  empType?: string;
  envBothHands?: string;
  envEyesight?: string;
  envHandWork?: string;
  envLiftPower?: string;
  envLstnTalk?: string;
  envStndWalk?: string;
  jobNm?: string;
  reqCareer?: string;
  reqEduc?: string;
  rno: number;
  salary?: string;
  salaryType?: string;
  termDate?: string;
};

type ProfileRow = {
  mobility: string;
  hand_usage: string;
  stamina: string;
  communication: string;
  region_primary: string;
  region_secondary: string | null;
};

const ENV_KEYS: (keyof RawItem)[] = [
  'envBothHands',
  'envEyesight',
  'envHandWork',
  'envLiftPower',
  'envLstnTalk',
  'envStndWalk',
];

const parser = new XMLParser({ ignoreAttributes: false });

function computeScore(item: RawItem, profile: ProfileRow): number {
  let score = 0;

  if (item.envStndWalk?.includes('어려움')) {
    score += profile.mobility !== '자유로움' ? 2 : 1;
  }
  if (item.envLstnTalk?.includes('어려움')) {
    score += profile.communication !== '일상 대화 가능' ? 2 : 1;
  }
  if (item.envHandWork && profile.hand_usage !== '손 사용 어려움') {
    score += 1;
  }
  if (
    item.envBothHands?.includes('양손') &&
    profile.hand_usage === '세밀한 작업 가능'
  ) {
    score += 1;
  }
  if (item.envLiftPower?.includes('이내')) {
    score += profile.stamina !== '4시간 이상 활동 가능' ? 2 : 1;
  }

  return score;
}

function toFitLevel(score: number): FitLevel {
  return score >= 3 ? '잘 맞아요' : '도전해볼 수 있어요';
}

export const GET = createAuthorizedRoute(async ({ userId }) => {
  const baseUrl = process.env.JOB_API_BASE_URL;
  const serviceKey = process.env.JOB_API_KEY;

  if (!baseUrl || !serviceKey) {
    throw new Error('JOB_API_BASE_URL 또는 JOB_API_KEY 환경변수가 없습니다.');
  }

  const [profileRows, jobXml] = await Promise.all([
    supabaseFetch<ProfileRow[]>(
      `/rest/v1/profiles?user_id=eq.${userId}&select=mobility,hand_usage,stamina,communication,region_primary,region_secondary`,
    ),
    fetch(
      `${baseUrl}?serviceKey=${encodeURIComponent(serviceKey)}&numOfRows=100&pageNo=1`,
      { next: { revalidate: 300 } },
    ).then((r) => r.text()),
  ]);

  const profile = profileRows[0];
  const parsed = parser.parse(jobXml);
  const raw: RawItem | RawItem[] = parsed?.response?.body?.items?.item ?? [];
  const allItems = Array.isArray(raw) ? raw : [raw];

  // 중복 제거
  const seen = new Set<string>();
  const unique = allItems.filter((item) => {
    const key = `${item.busplaName}|${item.jobNm}|${item.termDate}|${item.empType}|${item.salary}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 프로필 없으면 그대로 20개 반환
  if (!profile) {
    return unique
      .slice(0, 20)
      .map((item) => toPosting(item, undefined, undefined));
  }

  // 지역 키워드 추출 (구 단위 우선, 없으면 시/도)
  function extractKeywords(region: string): {
    district: string | null;
    city: string;
  } {
    const parts = region.split(' ');
    return { city: parts[0], district: parts[1] ?? null };
  }

  const primary = extractKeywords(profile.region_primary);
  const secondary = profile.region_secondary
    ? extractKeywords(profile.region_secondary)
    : null;

  const matchesRegion = (addr: string | undefined): boolean => {
    if (!addr) return false;
    const matchRegion = (r: { city: string; district: string | null }) =>
      r.district
        ? addr.includes(r.city) && addr.includes(r.district)
        : addr.includes(r.city);
    return matchRegion(primary) || (secondary ? matchRegion(secondary) : false);
  };

  const pool = unique.filter((item) => matchesRegion(item.compAddr));

  // 점수 내림차순 정렬 후 상위 20개
  const sorted = pool
    .map((item) => ({ item, score: computeScore(item, profile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return sorted.map(({ item, score }) => toPosting(item, profile, score));
});

function toPosting(
  item: RawItem,
  profile: ProfileRow | undefined,
  score: number | undefined,
) {
  return {
    id: item.rno,
    companyName: item.busplaName ?? '',
    title: item.jobNm ?? '',
    location: item.compAddr ?? '',
    salary: item.salary
      ? `${Number(item.salary.replace(/,/g, '')).toLocaleString('ko-KR')}원 (${item.salaryType})`
      : '협의',
    deadline: item.termDate?.split('~')[1] ?? '',
    empType: item.empType ?? '',
    reqCareer: item.reqCareer ?? '',
    reqEduc: item.reqEduc ?? '',
    envConditions: ENV_KEYS.map((k) => item[k] as string).filter(Boolean),
    fitLevel: profile && score !== undefined ? toFitLevel(score) : undefined,
    bookmarked: false,
  };
}
