const KEY = 'url-history';
const MAX = 3;

function getUrlHistory(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function pushUrlHistory(url: string) {
  const history = getUrlHistory();
  if (history[history.length - 1] === url) return;
  const next = [...history, url].slice(-MAX);
  sessionStorage.setItem(KEY, JSON.stringify(next));
}

export function getPreviousUrl(): string {
  const history = getUrlHistory();
  return history.length >= 2 ? (history[history.length - 2] ?? '/') : '/';
}
