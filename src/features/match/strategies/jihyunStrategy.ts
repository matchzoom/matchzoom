import type { MatchStrategy } from './types';

export const jihyunStrategy: MatchStrategy = {
  name: '지현',
  buildMessages: (_profile) => ({
    system: '', // TODO: 시스템 프롬프트 작성
    user: '', // TODO: 유저 프롬프트 작성 (profile 데이터 활용)
  }),
};
