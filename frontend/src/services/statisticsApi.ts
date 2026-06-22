import axiosClient from '../api/axiosClient';

export interface TestHistoryStat {
  total_score: number;
  created_at: string;
}

export interface EmotionStat {
  name: string;
  count: string;
}

export const statisticsApi = {
  getTestHistory: (period: string): Promise<{ data: TestHistoryStat[] }> => {
    return axiosClient.get(`/statistics/tests/history`, {
      params: { period }
    });
  },
  getEmotionStats: (period: string): Promise<{ data: EmotionStat[]; total: number }> => {
    return axiosClient.get(`/statistics/diaries/emotions`, {
      params: { period }
    });
  }
};
