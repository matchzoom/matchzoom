export type ProfileTab = 'result' | 'scraps';

export const PROFILE_TAB_ITEMS: { id: ProfileTab; label: string }[] = [
  { id: 'result', label: '내 검사 결과' },
  { id: 'scraps', label: '스크랩한 공고' },
];
