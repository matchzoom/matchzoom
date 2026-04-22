import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '@/app/api/bookmarks/route';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('@/shared/api/supabaseFetch', () => ({ supabaseFetch: vi.fn() }));
vi.mock('@/shared/utils/authCookies', () => ({ getAuthCookie: vi.fn() }));
vi.mock('@/shared/utils/session', () => ({ verifySession: vi.fn() }));

import { supabaseFetch } from '@/shared/api/supabaseFetch';
import { getAuthCookie } from '@/shared/utils/authCookies';
import { verifySession } from '@/shared/utils/session';

const mockSupabaseFetch = vi.mocked(supabaseFetch);
const mockGetAuthCookie = vi.mocked(getAuthCookie);
const mockVerifySession = vi.mocked(verifySession);

const mockAuth = (userId: string | null) => {
  if (userId) {
    mockGetAuthCookie.mockResolvedValue('token');
    mockVerifySession.mockResolvedValue({ userId });
  } else {
    mockGetAuthCookie.mockResolvedValue(undefined);
    mockVerifySession.mockResolvedValue(null);
  }
};

const mockBookmarkRow = {
  id: 1,
  posting_title: '사무보조원 채용',
  posting_url: 'https://example.com/job/1',
  company_name: '예시 회사',
  deadline: '2026-05-01',
  fit_level: '잘 맞아요',
  created_at: '2026-04-01T00:00:00.000Z',
};

describe('GET /api/bookmarks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('북마크 목록을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValue([mockBookmarkRow]);

    const req = new Request('http://localhost/api/bookmarks', {
      method: 'GET',
    });
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0]).toEqual({
      id: mockBookmarkRow.id,
      postingTitle: mockBookmarkRow.posting_title,
      postingUrl: mockBookmarkRow.posting_url,
      companyName: mockBookmarkRow.company_name,
      deadline: mockBookmarkRow.deadline,
      fitLevel: mockBookmarkRow.fit_level,
      createdAt: mockBookmarkRow.created_at,
    });
  });

  it('북마크 없으면 빈 배열을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValue([]);

    const req = new Request('http://localhost/api/bookmarks', {
      method: 'GET',
    });
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual([]);
  });

  it('쿠키 없으면 401을 반환한다', async () => {
    mockAuth(null);

    const req = new Request('http://localhost/api/bookmarks', {
      method: 'GET',
    });
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it('Supabase 오류 시 500을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockRejectedValue(new Error('DB 오류'));

    const req = new Request('http://localhost/api/bookmarks', {
      method: 'GET',
    });
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});

describe('POST /api/bookmarks', () => {
  beforeEach(() => vi.clearAllMocks());

  const makePostRequest = (body: object) =>
    new Request('http://localhost/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  const validBody = {
    postingTitle: '사무보조원 채용',
    postingUrl: 'https://example.com/job/1',
    companyName: '예시 회사',
    deadline: '2026-05-01',
    fitLevel: '잘 맞아요',
  };

  it('북마크를 추가한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValue([mockBookmarkRow]);

    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(204);

    expect(mockSupabaseFetch).toHaveBeenCalledWith('/rest/v1/bookmarks', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=ignore-duplicates,return=representation',
      },
      body: JSON.stringify({
        user_id: '1',
        posting_title: validBody.postingTitle,
        posting_url: validBody.postingUrl,
        company_name: validBody.companyName,
        deadline: validBody.deadline,
        fit_level: validBody.fitLevel,
      }),
    });
  });

  it('쿠키 없으면 401을 반환한다', async () => {
    mockAuth(null);

    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(401);
  });

  it('Supabase 오류 시 500을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockRejectedValue(new Error('DB 오류'));

    const res = await POST(makePostRequest(validBody));
    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/bookmarks', () => {
  beforeEach(() => vi.clearAllMocks());

  const makeDeleteRequest = (postingUrl?: string) => {
    const url = postingUrl
      ? `http://localhost/api/bookmarks?postingUrl=${encodeURIComponent(postingUrl)}`
      : 'http://localhost/api/bookmarks';
    return new Request(url, { method: 'DELETE' });
  };

  it('북마크를 삭제한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockResolvedValue(undefined);

    const res = await DELETE(makeDeleteRequest('https://example.com/job/1'));
    expect(res.status).toBe(204);

    expect(mockSupabaseFetch).toHaveBeenCalledWith(
      expect.stringContaining(
        `user_id=eq.1&posting_url=eq.${encodeURIComponent('https://example.com/job/1')}`,
      ),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('postingUrl 없으면 400을 반환한다', async () => {
    mockAuth('1');

    const res = await DELETE(makeDeleteRequest());
    expect(res.status).toBe(400);
  });

  it('쿠키 없으면 401을 반환한다', async () => {
    mockAuth(null);

    const res = await DELETE(makeDeleteRequest('https://example.com/job/1'));
    expect(res.status).toBe(401);
  });

  it('Supabase 오류 시 500을 반환한다', async () => {
    mockAuth('1');
    mockSupabaseFetch.mockRejectedValue(new Error('DB 오류'));

    const res = await DELETE(makeDeleteRequest('https://example.com/job/1'));
    expect(res.status).toBe(500);
  });
});
