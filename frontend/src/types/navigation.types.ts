// Định nghĩa các tham số truyền vào cho mỗi màn hình (nếu có)
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Diaries: undefined;
  Roadmap52Hz: undefined;
  Tests: undefined;
  Profile: undefined;
};

// Stack lồng trong Tab Profile hoặc stack chính của App
export type AppStackParamList = {
  MainTabs: undefined;
  PersonalInfo: undefined;
  Question: { testId: string };
  Result: { totalScore: number; category: string; testId: string };
};
