import { describe, it, expect } from 'vitest';
import { formatWorknetDataForPrompt } from '../utils/worknetDataFormatter';
import type { JobNcsData } from '@/shared/types/worknet';

const mockData: JobNcsData[] = [
  {
    jobName: '사무 보조',
    units: [
      {
        job_sdvn: '접객서비스',
        ablt_def:
          '비즈니스 센터 업무란 고객이 비즈니스 업무를 수행하는데 도움을 제공하는 능력이다.',
        job_scfn: '숙박서비스',
        job_lcfn: '이용·숙박·여행·오락·스포츠',
        job_mcn: '관광·레저',
        knwg_tchn_attd: [
          {
            knwg_tchn_attd:
              'http://lod.work.go.kr/task/지식/고객_서비스_매뉴얼_지식',
            knwg_tchn_attd_label: '고객 서비스 매뉴얼 지식',
          },
          {
            knwg_tchn_attd:
              'http://lod.work.go.kr/task/기술/고객_서비스_매뉴얼_파악_능력',
            knwg_tchn_attd_label: '고객 서비스 매뉴얼 파악 능력',
          },
          {
            knwg_tchn_attd:
              'http://lod.work.go.kr/task/태도/고객의_요구를_경청하려는_의지',
            knwg_tchn_attd_label: '고객의 요구를 경청하려는 의지',
          },
        ],
      },
    ],
  },
  {
    jobName: '제과제빵 보조',
    units: [
      {
        job_sdvn: '제빵',
        ablt_def:
          '빵류제품 반죽정형이란 발효된 반죽을 크기로 나누어 모양을 만드는 능력이다.',
        job_scfn: '식품가공',
        job_lcfn: '식품가공',
        job_mcn: '식품가공',
        knwg_tchn_attd: [],
      },
    ],
  },
];

describe('formatWorknetDataForPrompt', () => {
  it('빈 배열이면 빈 문자열을 반환한다', () => {
    expect(formatWorknetDataForPrompt([])).toBe('');
  });

  it('NCS 데이터를 프롬프트 텍스트로 변환한다', () => {
    const result = formatWorknetDataForPrompt(mockData);

    expect(result).toContain('표준직무기술서 참고 데이터');
    expect(result).toContain('### 사무 보조');
    expect(result).toContain('접객서비스');
    expect(result).toContain('고객 서비스 매뉴얼 지식');
    expect(result).toContain('고객의 요구를 경청하려는 의지');
  });

  it('지식기술태도가 없는 직종은 해당 줄을 생략한다', () => {
    const result = formatWorknetDataForPrompt(mockData);
    const bakerySection = result.split('### 제과제빵 보조')[1];

    expect(bakerySection).not.toContain('지식·기술·태도');
  });

  it('중복된 지식기술태도 라벨을 제거한다', () => {
    const dataWithDupes: JobNcsData[] = [
      {
        jobName: '테스트',
        units: [
          {
            job_sdvn: '테스트직무',
            ablt_def: '테스트',
            job_scfn: '테스트',
            job_lcfn: '테스트',
            job_mcn: '테스트',
            knwg_tchn_attd: [
              { knwg_tchn_attd: 'url1', knwg_tchn_attd_label: '동일라벨' },
              { knwg_tchn_attd: 'url2', knwg_tchn_attd_label: '동일라벨' },
              { knwg_tchn_attd: 'url3', knwg_tchn_attd_label: '다른라벨' },
            ],
          },
        ],
      },
    ];

    const result = formatWorknetDataForPrompt(dataWithDupes);
    const matches = result.match(/동일라벨/g);
    expect(matches).toHaveLength(1);
  });
});
