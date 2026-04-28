export type FitLevel = '잘 맞아요' | '도전해볼 수 있어요' | '힘들 수 있어요';

export type MatchedJob = {
  id: number;
  name: string;
  matchRate: number;
  fitLevel: FitLevel;
};

export type JobPosting = {
  id: number;
  companyName: string;
  title: string;
  location: string;
  salary: string;
  deadline: string;
  empType: string;
  reqCareer: string;
  reqEduc: string;
  envConditions: string[];
  fitLevel?: FitLevel;
  detailUrl?: string;
  bookmarked: boolean;
};

export type PersonalityAxis = {
  subject: string;
  value: number;
  fullMark: number;
};

export type JobPostingsPage = {
  items: JobPosting[];
  nextCursor: number | null;
};

export type PaginatedJobPostings = {
  items: JobPosting[];
  total: number;
  offset: number;
  hasMore: boolean;
};

export type JobPostingsFilterOptions = {
  sigunguList: string[];
  fitLevels: FitLevel[];
};
