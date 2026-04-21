import type { FitLevel } from './job';

export type Bookmark = {
  id: number;
  postingTitle: string;
  postingUrl: string;
  companyName: string;
  deadline: string;
  fitLevel: FitLevel | '';
  createdAt: string;
};
