type ApiError = {
  status: number;
  message: string;
};

export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const isApiError = (err: unknown): err is ApiError => {
  if (!isRecord(err)) return false;
  return typeof err.message === 'string' && typeof err.status === 'number';
};
