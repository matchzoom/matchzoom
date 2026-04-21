import { bffFetch } from './bffFetch';

export const logout = (): Promise<void> =>
  bffFetch<void>('/auth/logout', { method: 'POST' });

export const testLogin = (): Promise<void> =>
  bffFetch<void>('/auth/test-login', { method: 'POST' });

export const testLogout = (): Promise<void> =>
  bffFetch<void>('/auth/test-logout', { method: 'POST' });
