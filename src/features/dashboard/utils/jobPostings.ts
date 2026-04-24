import { XMLParser } from 'fast-xml-parser';

import type { FitLevel, JobPosting } from '@/shared/types/job';

export type RawItem = {
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

export type ProfileRow = {
  mobility: string;
  hand_usage: string;
  stamina: string;
  communication: string;
  region_primary: string;
};

const LIMIT = 20;

const ENV_KEYS: (keyof RawItem)[] = [
  'envBothHands',
  'envEyesight',
  'envHandWork',
  'envLiftPower',
  'envLstnTalk',
  'envStndWalk',
];

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

const parser = new XMLParser({ ignoreAttributes: false });

function postingHash(item: RawItem): string {
  const key = `${item.busplaName}|${item.jobNm}|${item.termDate}|${item.empType}|${item.salary}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

export function parseJobItems(xml: string): RawItem[] {
  const parsed = parser.parse(xml);
  const raw: RawItem | RawItem[] = parsed?.response?.body?.items?.item ?? [];
  return Array.isArray(raw) ? raw : [raw];
}

export function dedupeItems(items: RawItem[]): RawItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.busplaName}|${item.jobNm}|${item.termDate}|${item.empType}|${item.salary}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function agencyCity(regagnName: string): string | null {
  const m = regagnName.match(/한국장애인고용공단\s([가-힣]{2})/);
  if (!m) return null;
  return REGION_ABBR[m[1]] ?? m[1];
}

function matchesProfileRegion(
  regagnName: string | undefined,
  profile: ProfileRow,
): boolean {
  if (!regagnName) return false;
  const city = agencyCity(regagnName);
  if (!city) return false;
  const primaryCity = profile.region_primary.split(' ')[0];
  return primaryCity.startsWith(city);
}

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

function toPosting(
  item: RawItem,
  profile: ProfileRow | undefined,
  score: number | undefined,
  bookmarkedUrls: Set<string>,
): JobPosting {
  const detailUrl = `https://www.work24.go.kr/wk/a/b/1700/themeEmpInfoSrchList.do?thmaHrplCd=F00036&resultCnt=10&searchMode=Y&currentPageNo=1&pageIndex=1&sortField=DATE&sortOrderBy=DESC&srcKeyword=${encodeURIComponent(item.busplaName ?? '')}#${postingHash(item)}`;
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

export function rankPostings(
  items: RawItem[],
  profile: ProfileRow | undefined,
  bookmarkedUrls: Set<string>,
): JobPosting[] {
  if (!profile) {
    return items
      .slice(0, LIMIT)
      .map((item) => toPosting(item, undefined, undefined, bookmarkedUrls));
  }

  return items
    .filter((item) => matchesProfileRegion(item.regagnName, profile))
    .map((item) => ({ item, score: computeScore(item, profile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map(({ item, score }) => toPosting(item, profile, score, bookmarkedUrls));
}
