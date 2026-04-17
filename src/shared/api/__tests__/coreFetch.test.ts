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
      (e: unknown) => e,
    );
    expect((error as { status: number }).status).toBe(404);
    expect((error as Error).message).toBe('찾을 수 없음');
  });

  it('응답 body가 없는 에러는 기본 메시지를 사용한다', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 500 }));

    const error = await coreFetch('https://api.example.com/test').catch(
      (e: unknown) => e,
    );
    expect((error as { status: number }).status).toBe(500);
    expect((error as Error).message).toBe('API 요청 중 오류가 발생했습니다.');
  });
});
