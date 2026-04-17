import { bffFetch } from './bffFetch';

export const logout = (): Promise<void> =>
  bffFetch<void>('/auth/logout', { method: 'POST' });
