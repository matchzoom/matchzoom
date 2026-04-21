export type UserState = 'guest' | 'loggedIn' | 'surveyed';

// Supabase users 테이블과 1:1 대응
export type User = {
  id: number;
  kakao_id: string;
  nickname: string;
  created_at: string;
};

// 클라이언트에 노출하는 유저 정보 (kakao_id 제외)
export type CurrentUser = Omit<User, 'kakao_id'> & { isTestUser?: boolean };
