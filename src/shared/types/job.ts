export type FitLevel = '잘 맞아요' | '도전해볼 수 있어요' | '힘들 수 있어요';
export type WorkType = '온라인' | '오프라인' | '온·오프라인';

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
  workType: WorkType;
  location: string;
  salary: string;
  deadline: string;
  views: number;
  fitLevel: FitLevel;
  matchPoints: string;
  bookmarked: boolean;
};

export type PersonalityAxis = {
  subject: string;
  value: number;
  fullMark: number;
};
