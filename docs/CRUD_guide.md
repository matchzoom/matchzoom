# matchzoom CRUD 룰 가이드

## 1. 전체 데이터 흐름

```
Client Component (use client)
  ↓ bffFetch
Next.js BFF Route Handler (app/api/...)
  ↓ supabaseFetch
Supabase REST API
  ↓
PostgreSQL (users, profiles, bookmarks, match_results)
```

- 클라이언트는 **BFF만** 호출한다. Supabase를 직접 호출하지 않는다.
- BFF는 `userId` 쿠키로 사용자를 식별하고 `supabaseFetch`로 DB에 접근한다.
- 모든 Supabase 쿼리는 `user_id = eq.{userId}` 필터를 반드시 포함한다.

---

## 2. 파일 위치 규칙

```
src/
├── app/api/
│   └── [resource]/
│       └── route.ts              ← BFF Route Handler
│
└── features/[feature]/
    ├── api/
    │   └── [resource]Api.ts      ← bffFetch 호출 함수 모음
    ├── hooks/
    │   └── use[Resource].ts      ← TanStack Query 래퍼
    └── __tests__/
        ├── [resource]Api.test.ts ← feature API 단위 테스트
        └── [resource]Route.test.ts ← BFF Route Handler 테스트
```

---

## 3. BFF Route Handler 패턴

### 기본 형태

```ts
// app/api/profiles/route.ts
import { createAuthorizedRoute } from '@/shared/api/createAuthorizedRoute';
import { supabaseFetch } from '@/shared/api/supabaseFetch';
import type { Profile } from '@/shared/types/profile';

// GET — 조회
export const GET = createAuthorizedRoute(async ({ userId }) => {
  const rows = await supabaseFetch<Profile[]>(
    `/rest/v1/profiles?user_id=eq.${userId}&select=*`,
  );
  return rows[0] ?? null;
});

// PATCH — 수정 (body 타입 제네릭으로 명시)
export const PATCH = createAuthorizedRoute<UpdateProfileBody>(
  async ({ userId, body }) => {
    const rows = await supabaseFetch<Profile[]>(
      `/rest/v1/profiles?user_id=eq.${userId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { Prefer: 'return=representation' },
      },
    );
    return rows[0];
  },
);
```

### Supabase REST API 쿼리 패턴

| 작업      | 메서드 | 경로                                                            | 특이사항                                                    |
| --------- | ------ | --------------------------------------------------------------- | ----------------------------------------------------------- |
| 단건 조회 | GET    | `/rest/v1/table?user_id=eq.{id}&select=*`                       | 배열 반환 → `rows[0]` 사용                                  |
| 목록 조회 | GET    | `/rest/v1/table?user_id=eq.{id}&select=*&order=created_at.desc` |                                                             |
| 생성      | POST   | `/rest/v1/table`                                                | `Prefer: return=representation`                             |
| Upsert    | POST   | `/rest/v1/table`                                                | `Prefer: resolution=merge-duplicates,return=representation` |
| 수정      | PATCH  | `/rest/v1/table?id=eq.{id}&user_id=eq.{userId}`                 | `Prefer: return=representation`                             |
| 삭제      | DELETE | `/rest/v1/table?id=eq.{id}&user_id=eq.{userId}`                 | 응답 없음 → undefined 반환                                  |

> **중요**: PATCH / DELETE는 반드시 `user_id=eq.{userId}` 조건을 함께 건다.  
> id만으로 필터링하면 다른 유저의 데이터를 수정/삭제할 수 있다.

---

## 4. Feature API 레이어 패턴

```ts
// features/profile/api/profileApi.ts
import { bffFetch } from '@/shared/api/bffFetch';
import type { Profile, UpdateProfileBody } from '@/shared/types/profile';

export const getProfile = (): Promise<Profile> =>
  bffFetch<Profile>('/profiles', { method: 'GET' });

export const updateProfile = (body: UpdateProfileBody): Promise<Profile> =>
  bffFetch<Profile>('/profiles', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
```

규칙:

- 파일 1개 = 리소스 1개 (`profileApi.ts`, `bookmarkApi.ts`, ...)
- 함수명은 동사+명사: `getProfile`, `updateProfile`, `deleteBookmark`
- BFF 엔드포인트 경로는 `/api` 없이 작성 (`bffFetch`가 자동으로 붙임)

---

## 5. TanStack Query 훅 패턴

```ts
// features/profile/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/profileApi';

export const PROFILE_QUERY_KEY = ['profile'] as const;

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });
}

// features/profile/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../api/profileApi';
import { PROFILE_QUERY_KEY } from './useProfile';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}
```

---

## 6. 테스트 규칙

### 테스트 위치

```
features/profile/
└── __tests__/
    ├── profileApi.test.ts      ← feature API 함수 단위 테스트
    └── profile.route.test.ts  ← BFF Route Handler 테스트

shared/api/
└── __tests__/
    └── coreFetch.test.ts      ← 유틸 단위 테스트
```

### 테스트 필수 케이스 (3종 세트)

모든 BFF Route Handler와 feature API 함수는 아래 3가지 케이스를 반드시 작성한다:

| 케이스   | 내용                                  |
| -------- | ------------------------------------- |
| **성공** | 정상 응답 반환 확인                   |
| **401**  | 미인증(쿠키 없음) 시 처리 확인        |
| **에러** | Supabase / 네트워크 오류 시 처리 확인 |

### BFF Route Handler 테스트 패턴

```ts
// features/profile/__tests__/profile.route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH } from '@/app/api/profiles/route';

// next/headers의 cookies()를 mock
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

// supabaseFetch를 mock
vi.mock('@/shared/api/supabaseFetch', () => ({
  supabaseFetch: vi.fn(),
}));

import { cookies } from 'next/headers';
import { supabaseFetch } from '@/shared/api/supabaseFetch';

const mockCookies = vi.mocked(cookies);
const mockSupabaseFetch = vi.mocked(supabaseFetch);

// 쿠키 mock 헬퍼
const mockAuthCookies = (userId: string | null) => {
  mockCookies.mockResolvedValue({
    get: (key: string) =>
      key === 'userId' && userId ? { value: userId } : undefined,
  } as ReturnType<typeof cookies> extends Promise<infer T> ? T : never);
};

describe('GET /api/profiles', () => {
  beforeEach(() => vi.clearAllMocks());

  it('인증된 유저의 프로필을 반환한다', async () => {
    mockAuthCookies('1');
    mockSupabaseFetch.mockResolvedValue([
      { id: 1, user_id: 1, name: '홍길동' },
    ]);

    const request = new Request('http://localhost/api/profiles');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('홍길동');
  });

  it('쿠키 없으면 401을 반환한다', async () => {
    mockAuthCookies(null);

    const request = new Request('http://localhost/api/profiles');
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('Supabase 오류 시 500을 반환한다', async () => {
    mockAuthCookies('1');
    mockSupabaseFetch.mockRejectedValue(new Error('DB 오류'));

    const request = new Request('http://localhost/api/profiles');
    const response = await GET(request);

    expect(response.status).toBe(500);
  });
});
```

### Feature API 테스트 패턴

```ts
// features/profile/__tests__/profileApi.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfile, updateProfile } from '../api/profileApi';

vi.mock('@/shared/api/bffFetch', () => ({
  bffFetch: vi.fn(),
}));

import { bffFetch } from '@/shared/api/bffFetch';
const mockBffFetch = vi.mocked(bffFetch);

describe('profileApi', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getProfile', () => {
    it('GET /profiles를 호출한다', async () => {
      const mockProfile = { id: 1, name: '홍길동' };
      mockBffFetch.mockResolvedValue(mockProfile);

      const result = await getProfile();

      expect(mockBffFetch).toHaveBeenCalledWith('/profiles', { method: 'GET' });
      expect(result).toEqual(mockProfile);
    });

    it('bffFetch 오류를 그대로 throw한다', async () => {
      mockBffFetch.mockRejectedValue(new Error('네트워크 오류'));
      await expect(getProfile()).rejects.toThrow('네트워크 오류');
    });
  });

  describe('updateProfile', () => {
    it('PATCH /profiles를 올바른 body로 호출한다', async () => {
      const body = { name: '김철수' };
      mockBffFetch.mockResolvedValue({ id: 1, ...body });

      await updateProfile(body);

      expect(mockBffFetch).toHaveBeenCalledWith('/profiles', {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    });
  });
});
```

### 순수 유틸 테스트 패턴

```ts
// shared/api/__tests__/coreFetch.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { coreFetch } from '../coreFetch';

describe('coreFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('응답이 ok이면 JSON을 반환한다', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), { status: 200 }),
    );

    const result = await coreFetch<{ id: number }>(
      'https://api.example.com/test',
    );
    expect(result).toEqual({ id: 1 });
  });

  it('응답이 204이면 undefined를 반환한다', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));
    const result = await coreFetch('https://api.example.com/test');
    expect(result).toBeUndefined();
  });

  it('응답이 ok가 아니면 status를 담은 에러를 throw한다', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: '찾을 수 없음' }), {
        status: 404,
      }),
    );

    const error = await coreFetch('https://api.example.com/test').catch(
      (e) => e,
    );
    expect(error.status).toBe(404);
    expect(error.message).toBe('찾을 수 없음');
  });
});
```

### 테스트 금지 사항

- TanStack Query 훅(`useQuery`, `useMutation`) 내부 동작 직접 테스트 금지 → API 함수 레이어에서 테스트
- UI 렌더링 테스트 금지 (타입 체크 + 스토리북으로 대체)
- `vi.mock` 없이 실제 네트워크 요청 발생하는 테스트 금지

---

## 7. 테스트 실행 명령

```bash
pnpm test          # watch 모드
pnpm test:run      # CI용 단일 실행
pnpm test:coverage # 커버리지 포함
```
