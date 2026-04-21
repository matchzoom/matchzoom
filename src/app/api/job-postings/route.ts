import { XMLParser } from 'fast-xml-parser';

import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import type { FitLevel } from '@/shared/types/job';

type RawItem = {
  busplaName?: string;
  compAddr?: string;
  empType?: string;
  regagnName?: string;
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

  const [profileRows, bookmarkRows, jobXml] = await Promise.all([
    supabaseFetch<ProfileRow[]>(
      `/rest/v1/profiles?user_id=eq.${userId}&select=mobility,hand_usage,stamina,communication,region_primary`,
    ),
    supabaseFetch<{ posting_url: string }[]>(
      `/rest/v1/bookmarks?user_id=eq.${userId}&select=posting_url`,
    ),
    fetch(
      `${baseUrl}?serviceKey=${encodeURIComponent(serviceKey)}&numOfRows=100&pageNo=1`,
      { next: { revalidate: 300 } },
    ).then((r) => r.text()),
  ]);

  const profile = profileRows[0];
  const bookmarkedUrls = new Set(bookmarkRows.map((r) => r.posting_url));
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
      .map((item) => toPosting(item, undefined, undefined, bookmarkedUrls));
  }

  const REGION_ABBR: Record<string, string> = {
    경기: '경기도',
    강원: '강원특별자치도',
    충북: '충청북도',
    충남: '충청남도',
    전북: '전북특별자치도',
    전남: '전라남도',
    경북: '경상북도',
    경남: '경상남도',
    제주: '제주특별자치도',
  };

  function agencyCity(regagnName: string): string | null {
    const m = regagnName.match(/한국장애인고용공단\s([가-힣]{2})/);
    if (!m) return null;
    const abbr = m[1];
    return REGION_ABBR[abbr] ?? abbr;
  }

  const primaryCity = profile.region_primary.split(' ')[0];

  const matchesRegion = (regagnName: string | undefined): boolean => {
    if (!regagnName) return false;
    const city = agencyCity(regagnName);
    if (!city) return false;
    return primaryCity.startsWith(city);
  };

  const pool = unique.filter((item) => matchesRegion(item.regagnName));

  // 점수 내림차순 정렬 후 상위 20개
  const sorted = pool
    .map((item) => ({ item, score: computeScore(item, profile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return sorted.map(({ item, score }) =>
    toPosting(item, profile, score, bookmarkedUrls),
  );
});

function toPosting(
  item: RawItem,
  profile: ProfileRow | undefined,
  score: number | undefined,
  bookmarkedUrls: Set<string>,
) {
  const detailUrl = `https://www.work24.go.kr/wk/a/b/1700/themeEmpInfoSrchList.do?thmaHrplCd=F00036&resultCnt=10&searchMode=Y&currentPageNo=1&pageIndex=1&sortField=DATE&sortOrderBy=DESC&srcKeyword=${encodeURIComponent(item.busplaName ?? '')}`;
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
    detailUrl,
    bookmarked: bookmarkedUrls.has(detailUrl),
  };
}
