import { unstable_cache } from 'next/cache';

import {
  NcsUnitSchema,
  type JobNcsData,
  type NcsUnit,
} from '@/shared/types/worknet';

const API_URL =
  'https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo215L01.do';

/**
 * 화이트리스트 직종 → NCS 최적화 검색어 매핑.
 * API의 jobCont 파라미터는 NCS 분류 키워드에 매칭되므로,
 * 직종명 대신 NCS 능력단위와 일치하는 검색어를 사용한다.
 * 관련 NCS가 없는 직종은 제외(null).
 */
const JOB_SEARCH_MAP: Record<string, string> = {
  '사무 보조': '사무행정',
  '대형서점 도서정리': '도서관',
  '도서관 사서보조': '도서관',
  '정리 및 수납': '정리수납',
  환경정리: '청소',
  '세탁물 관리': '세탁',
  공공자전거세척: '자전거정비',
  '홀몸어르신 안부확인': '안부확인',
  급식지원: '급식조리',
  '병원 내 환자이송보조 및 안내': '환자이송',
  '부품 조립': '조립',
  '제품 검수 보조': '검수',
  '제과제빵 보조': '제빵',
  '농업·임업·어업관련 직무': '농업',
  '방역·소독활동': '방역',
  호텔객실관리: '호텔객실',
};

/** JOB_SEARCH_MAP에 등록된 직종명 목록 */
const JOB_NAMES = Object.keys(JOB_SEARCH_MAP);

/**
 * 표준직무기술서 API 단건 호출.
 * JOB_SEARCH_MAP의 NCS 검색어를 사용하여 매칭된 능력단위를 반환한다.
 */
async function fetchJobNcs(
  authKey: string,
  jobName: string,
): Promise<NcsUnit[]> {
  const searchTerm = JOB_SEARCH_MAP[jobName] ?? jobName;

  const params = new URLSearchParams({
    authKey,
    jobCont: searchTerm,
    limit: '3',
    returnType: 'JSON',
  });

  const res = await fetch(`${API_URL}?${params}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) return [];

  const json = await res.json();

  // 에러 응답 체크
  if (json.message_cd) return [];

  const result = json.result;
  if (!result || typeof result !== 'object') return [];

  // result 객체의 각 값이 NCS 능력단위
  return Object.values(result)
    .map((raw) => {
      const parsed = NcsUnitSchema.safeParse(raw);
      return parsed.success ? parsed.data : null;
    })
    .filter((u): u is NcsUnit => u !== null);
}

/**
 * 45개 직종 전체의 NCS 데이터를 일괄 조회.
 */
async function fetchAllJobNcsData(): Promise<JobNcsData[]> {
  const authKey = process.env.WORK24_API_KEY;
  if (!authKey) return [];

  const results: JobNcsData[] = [];

  for (const jobName of JOB_NAMES) {
    try {
      const units = await fetchJobNcs(authKey, jobName);
      if (units.length > 0) {
        results.push({ jobName, units });
      }
    } catch {
      continue;
    }
  }

  return results;
}

export const getCachedWorknetData = unstable_cache(
  fetchAllJobNcsData,
  ['work24-job-ncs'],
  { revalidate: 86400 },
);
