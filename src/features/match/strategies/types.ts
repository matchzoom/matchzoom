import type { Profile } from '@/shared/types/profile';

export type MatchStrategy = {
  /** 전략 작성자 이름 (한국어) */
  name: string;
  /** Profile 데이터를 받아서 OpenAI 메시지를 생성한다 */
  buildMessages: (profile: Profile) => { system: string; user: string };
};
