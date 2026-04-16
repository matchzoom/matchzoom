export type UserState = 'guest' | 'loggedIn' | 'surveyed';

export type UserProfile = {
  name: string;
  lastSurveyDate: string;
};
