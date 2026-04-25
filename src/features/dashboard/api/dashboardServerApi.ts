import { supabaseFetch } from '@/shared/api/supabaseFetch';
import type { Profile } from '@/shared/types/profile';
import type { MatchResult } from '@/shared/types/match';

export async function getDashboardData(userId: string) {
  const [profileRows, matchRows] = await Promise.all([
    supabaseFetch<Profile[]>(`/rest/v1/profiles?user_id=eq.${userId}&select=*`),
    supabaseFetch<MatchResult[]>(
      `/rest/v1/match_results?user_id=eq.${userId}&select=*`,
    ),
  ]);
  return { profile: profileRows[0] ?? null, matchResult: matchRows[0] ?? null };
}
