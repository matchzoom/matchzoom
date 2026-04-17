import { z } from 'zod';

// 카카오 /oauth/token 응답
export const KakaoTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token_expires_in: z.number(),
});
export type KakaoToken = z.infer<typeof KakaoTokenSchema>;

// 카카오 /v2/user/me 응답
export const KakaoUserSchema = z.object({
  id: z.number(),
  kakao_account: z
    .object({
      profile: z.object({ nickname: z.string() }).optional(),
    })
    .optional(),
});
export type KakaoUser = z.infer<typeof KakaoUserSchema>;
